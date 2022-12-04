/**
 * fork from:
 * @link https://github.com/eth-infinitism/account-abstraction/blob/develop/test/UserOp.ts
 */


const { arrayify, defaultAbiCoder, keccak256 } = require('ethers/lib/utils')
const { toRpcSig } = require('ethereumjs-util')
const { Web3 } = require('web3');

function encode(typevalues, forSignature) {
    const types = typevalues.map(typevalue => typevalue.type === 'bytes' && forSignature ? 'bytes32' : typevalue.type)
    const values = typevalues.map((typevalue) => typevalue.type === 'bytes' && forSignature ? keccak256(typevalue.val) : typevalue.val)
    return defaultAbiCoder.encode(types, values)
}

function packUserOp(op, forSignature = true) {
    if (forSignature) {
        // lighter signature scheme (must match UserOperation#pack): do encode a zero-length signature, but strip afterwards the appended zero-length value
        const userOpType = {
            components: [
                { type: 'address', name: 'sender' },
                { type: 'uint256', name: 'nonce' },
                { type: 'bytes', name: 'initCode' },
                { type: 'bytes', name: 'callData' },
                { type: 'uint256', name: 'callGasLimit' },
                { type: 'uint256', name: 'verificationGasLimit' },
                { type: 'uint256', name: 'preVerificationGas' },
                { type: 'uint256', name: 'maxFeePerGas' },
                { type: 'uint256', name: 'maxPriorityFeePerGas' },
                { type: 'bytes', name: 'paymasterAndData' },
                { type: 'bytes', name: 'signature' }
            ],
            name: 'userOp',
            type: 'tuple'
        }
        let encoded = defaultAbiCoder.encode([userOpType], [{ ...op, signature: '0x' }])
        // remove leading word (total length) and trailing word (zero-length signature)
        encoded = '0x' + encoded.slice(66, encoded.length - 64)
        return encoded
    }

    const typevalues = [
        { type: 'address', val: op.sender },
        { type: 'uint256', val: op.nonce },
        { type: 'bytes', val: op.initCode },
        { type: 'bytes', val: op.callData },
        { type: 'uint256', val: op.callGasLimit },
        { type: 'uint256', val: op.verificationGasLimit },
        { type: 'uint256', val: op.preVerificationGas },
        { type: 'uint256', val: op.maxFeePerGas },
        { type: 'uint256', val: op.maxPriorityFeePerGas },
        { type: 'bytes', val: op.paymasterAndData },
    ]
    if (!forSignature) {
        // for the purpose of calculating gas cost, also hash signature
        typevalues.push({ type: 'bytes', val: op.signature })
    }
    return encode(typevalues, forSignature)
}


function getRequestId(op, entryPointAddress, chainId) {
    const userOpHash = keccak256(packUserOp(op, true))
    console.log(userOpHash, entryPointAddress, chainId)
    const enc = defaultAbiCoder.encode(
        ['bytes32', 'address', 'uint256'],
        [userOpHash, entryPointAddress, chainId])
    return keccak256(enc)
}


async function _signUserOp(op, entryPointAddress, chainId, owner) {
    await ethers.getSigners();
    const message = getRequestId(op, entryPointAddress, chainId)
    const msg1 = Buffer.concat([
        Buffer.from('\x19Ethereum Signed Message:\n32', 'ascii'),
        Buffer.from(arrayify(message))
    ])
    const sig = await owner.signMessage(msg1);
    return sig;
}

/**
 * sign a user operation with the given private key
 * @param op 
 * @param entryPointAddress 
 * @param chainId 
 * @param privateKey 
 * @returns signature
 */
async function signUserOp(op, entryPointAddress, chainId, owner) {
    const sign = await _signUserOp(op, entryPointAddress, chainId, owner);
    const enc = defaultAbiCoder.encode(['uint8', 'tuple(address,bytes)[]'], [0, [[
        owner.address,
        sign
    ]]]);
    return enc;
}

module.exports = {
    signUserOp,
    getRequestId,
    packUserOp
}

