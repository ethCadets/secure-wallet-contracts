const { Create2Factory }  = require('../utils/Create2Factory')
const { ethers }  = require('hardhat')

const deployEntryPoint = async function (hre) {
  const provider = ethers.provider
  const from = await provider.getSigner().getAddress()
  await new Create2Factory(ethers.provider).deployFactory()

//   const ret = await hre.deployments.deploy(
//     'EntryPoint', {
//       from,
//       args: [],
//       gasLimit: 6e6,
//       deterministicDeployment: true
//     })
//   console.log('==entrypoint addr=', ret.address)
//   const entryPointAddress = ret.address

  const w = await hre.deployments.deploy(
    'SecureWallet', {
      from,
      args: [entryPointAddress, from],
      gasLimit: 2e6,
      deterministicDeployment: true
    })

  console.log('== wallet=', w.address)
}

module.exports = {
    deployEntryPoint
}