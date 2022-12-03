// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;


contract AccessGrants {
    mapping(bytes4 => bool) public allowAllGrant;
    mapping(bytes4 => mapping(address => mapping(bytes4 => bool))) public roleGrantMap;

}