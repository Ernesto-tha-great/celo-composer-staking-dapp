// SPDX-License-Identifier: GPL-3.0-only

pragma solidity ^0.8.14;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Context.sol";

import "./Piron.sol";

contract StakePIR is Pausable, Ownable, ReentrancyGuard {
  IERC20 pirToken;

  // 30 Days (30 * 24 * 60 * 60)
  uint256 public planDuration = 2592000;

  // 180 Days (180 * 24 * 60 * 60)
  uint256 _planExpired = 15552000;

  uint8 public interestRate = 32;
  uint256 public planExpired;
  uint8 public totalStakers;

  struct StakeInfo {
    uint256 startTS;
    uint256 endTS;
    uint256 amount;
    uint256 claimed;
  }

  event Staked(address indexed from, uint256 amount);
  event Claimed(address indexed from, uint256 amount);

  mapping(address => StakeInfo) public stakeInfos;
  mapping(address => bool) public addressStaked;

  constructor(address _tokenAddress) {
    require(
      address(_tokenAddress) != address(0),
      "Token Address cannot be address 0"
    );
    pirToken = IERC20(_tokenAddress);
    planExpired = block.timestamp + _planExpired;
    totalStakers = 0;
  }

  function transferToken(address to, uint256 amount) external onlyOwner {
    require(pirToken.transfer(to, amount), "Token transfer failed!");
  }

  function claimReward() external returns (bool) {
    require(addressStaked[_msgSender()] == true, "You are not participated");
    require(
      stakeInfos[_msgSender()].endTS < block.timestamp,
      "Stake Time is not over yet"
    );
    require(stakeInfos[_msgSender()].claimed == 0, "Already claimed");

    uint256 stakeAmount = stakeInfos[_msgSender()].amount;
    uint256 totalTokens = stakeAmount + ((stakeAmount * interestRate) / 100); //adds interest
    stakeInfos[_msgSender()].claimed == totalTokens; // update the stakeinfo
    pirToken.transfer(_msgSender(), totalTokens);

    emit Claimed(_msgSender(), totalTokens);

    return true;
  }

  function getTokenExpiry() external view returns (uint256) {
    require(addressStaked[_msgSender()] == true, "You are not participated");
    return stakeInfos[_msgSender()].endTS;
  }

  function stakeToken(uint256 stakeAmount) external payable whenNotPaused {
    require(stakeAmount > 0, "Stake amount should be correct");
    require(block.timestamp < planExpired, "Plan Expired");
    require(addressStaked[msg.sender] == false, "You already participated");
    require(
      pirToken.balanceOf(msg.sender) >= stakeAmount,
      "Insufficient Balance"
    );

    pirToken.transferFrom(msg.sender, address(this), stakeAmount);
    totalStakers++;
    addressStaked[msg.sender] = true;

    stakeInfos[msg.sender] = StakeInfo({
      startTS: block.timestamp,
      endTS: block.timestamp + planDuration,
      amount: stakeAmount,
      claimed: 0
    });

    emit Staked(msg.sender, stakeAmount);
  }

  function pause() external onlyOwner {
    _pause();
  }

  function unpause() external onlyOwner {
    _unpause();
  }
}
