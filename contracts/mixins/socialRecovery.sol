// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;


contract SocialRecovery {
    address public recoveryAccount;

    event RecoveryAccountChanged(address account);

    function _setRecoveryAccount(address account) internal {
        recoveryAccount = account;
        emit RecoveryAccountChanged(account);
    }
}