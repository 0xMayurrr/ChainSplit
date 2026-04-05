// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./GroupVault.sol";

/**
 * @title ChainSplitFactory
 * @notice Deploys and tracks GroupVault instances
 */
contract ChainSplitFactory {

    struct GroupInfo {
        address vault;
        string  name;
        string  emoji;
        address admin;
        uint256 createdAt;
    }

    GroupInfo[] public groups;
    mapping(address => address[]) public userGroups;
    mapping(address => bool)      public isVault;

    event GroupCreated(address indexed vault, address indexed admin, string name);

    function createGroup(
        string memory _name,
        string memory _emoji,
        string memory _adminName
    ) external returns (address vault) {
        GroupVault newVault = new GroupVault(_name, _emoji, msg.sender, _adminName, address(this));
        vault = address(newVault);

        groups.push(GroupInfo({
            vault:     vault,
            name:      _name,
            emoji:     _emoji,
            admin:     msg.sender,
            createdAt: block.timestamp
        }));

        userGroups[msg.sender].push(vault);
        isVault[vault] = true;

        emit GroupCreated(vault, msg.sender, _name);
    }

    function registerMember(address _member, address _vault) external {
        require(isVault[msg.sender], "Only vaults can register members");
        userGroups[_member].push(_vault);
    }

    function getGroups() external view returns (GroupInfo[] memory) {
        return groups;
    }

    function getUserGroups(address _user) external view returns (address[] memory) {
        return userGroups[_user];
    }

    function groupCount() external view returns (uint256) {
        return groups.length;
    }
}
