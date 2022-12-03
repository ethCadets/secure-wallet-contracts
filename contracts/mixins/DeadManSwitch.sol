// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

contract DeadManSwitch {
    event LastOwnerTxBlock(uint256 blockNumber);
    event SwitchAccountChanged(address account);
    event SwitchTriggerBlockDiffChanged(uint256 diff);

    uint256 public lastOwnerTxBlock;
    uint256 public switchTriggerBlockDiff;
    bool public switchActivated;
    address public switchAccount;

    // jfkldsjflksdjfl

    // modifier _onlyOwnerOrRecoveryAccount() {
    //     require(
    //         msg.sender == owner ||
    //             msg.sender == address(this) ||
    //             msg.sender == recoveryAccount,
    //         "only owner"
    //     );
    //     _;
    // }

    // fhdsjkfhdskj

    modifier _switchActivated() {
        require(switchActivated);
        _;
    }

    modifier _switchNotActivated() {
        require(!switchActivated);
        _;
    }

    modifier _canSwitchActivate() {
        require(!switchActivated);
        require(
            (block.number - lastOwnerTxBlock) >= switchTriggerBlockDiff,
            "cannot activate switch"
        );
        _;
    }

    function _activateSwitch() internal _canSwitchActivate {
        switchActivated = true;
    }

    function _setSwitchAccount(address account) internal {
        switchAccount = account;
        emit SwitchAccountChanged(account);
    }

    function _setSwitchTriggerBlockDiff(uint256 diff) internal {
        switchTriggerBlockDiff = diff;
        emit SwitchTriggerBlockDiffChanged(diff);
    }

    function _setSwitch(address account, uint256 diff) internal {
        _setSwitchAccount(account);
        _setSwitchTriggerBlockDiff(diff);
    }

    function _setLastOwnerTxBlock() internal {
        lastOwnerTxBlock = block.number;
        emit LastOwnerTxBlock(lastOwnerTxBlock);
    }
}
