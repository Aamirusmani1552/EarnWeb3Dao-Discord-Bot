// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

error Faucet_WalletInTimeLock(
    address sender,
    uint256 timeLock,
    uint256 currentTime
);
error Faucet_NoBalanceInFaucet();
error Faucet_NotEnoughBalanceInUserWallet(address sender, uint256 value);
error Faucet_SomethingWentWrong();
error Faucet_InsufficientAllowance();

contract Faucet {
    address owner;
    mapping(address => uint256) private s_timeLocksCelo;
    uint256 private constant CELO_PER_WITHDRAW = 0.1 ether;
    uint256 private constant TIME_LOCK_PERIOD = 1 days;

    event Deposit(address indexed sender, uint256 indexed value);
    event Withdraw(address indexed receiver, uint256 indexed value);

    constructor() {
        owner = msg.sender;
    }

    function deposit() public payable {
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(address user) public {
        if (
            !(s_timeLocksCelo[user] == 0) &&
            s_timeLocksCelo[user] > block.timestamp
        ) {
            revert Faucet_WalletInTimeLock(
                user,
                s_timeLocksCelo[user],
                block.timestamp
            );
        }

        if (address(this).balance == 0) {
            revert Faucet_NoBalanceInFaucet();
        }

        s_timeLocksCelo[user] = block.timestamp + TIME_LOCK_PERIOD;
        payable(user).transfer(CELO_PER_WITHDRAW);
        emit Withdraw(user, CELO_PER_WITHDRAW);
    }


    // recieve function
    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    // getters

    function getWalletTimeLockCheck(address user)
        public
        view
        returns (uint256)
    {
        return s_timeLocksCelo[user];
    }

    function getFaucetCeloBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
