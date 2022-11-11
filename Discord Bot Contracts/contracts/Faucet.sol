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
    mapping(address => uint256) private s_timeLocksEth;
    mapping(address => uint256) private s_timeLocksLink;
    address private constant LINK_ADDRESS =
        0x326C977E6efc84E512bB9C30f76E30c160eD06FB;
    uint256 private constant ETH_PER_WITHDRAW = 0.1 ether;
    uint256 private constant LINK_PER_WITHDRAW = 10 * 10**18;
    uint256 private constant TIME_LOCK_PERIOD = 1 days;

    event Deposit(address indexed sender, uint256 indexed value);
    event Withdraw(address indexed receiver, uint256 indexed value);
    event DepositLink(address indexed sender, uint256 indexed amount);
    event WithdrawLink(address indexed receiver, uint256 indexed value);

    constructor() {
        owner = msg.sender;
    }

    function deposit() public payable {
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(address user) public {
        if (
            !(s_timeLocksEth[user] == 0) &&
            s_timeLocksEth[user] > block.timestamp
        ) {
            revert Faucet_WalletInTimeLock(
                user,
                s_timeLocksEth[user],
                block.timestamp
            );
        }

        if (address(this).balance == 0) {
            revert Faucet_NoBalanceInFaucet();
        }

        s_timeLocksEth[user] = block.timestamp + TIME_LOCK_PERIOD;
        payable(user).transfer(ETH_PER_WITHDRAW);
        emit Withdraw(user, ETH_PER_WITHDRAW);
    }

    // deposit and withdraw link token
    function depositLink(address sender, uint256 amount) public {
        uint256 userBalance = IERC20(LINK_ADDRESS).balanceOf(sender);
        if (userBalance < amount) {
            revert Faucet_NotEnoughBalanceInUserWallet(sender, amount);
        }

        uint256 allowance = IERC20(LINK_ADDRESS).allowance(
            sender,
            address(this)
        );
        if (allowance > amount) {
            revert Faucet_InsufficientAllowance();
        }

        IERC20(LINK_ADDRESS).transferFrom(sender, address(this), amount);
        emit DepositLink(sender, amount);
    }

    function withdrawLink(address user) public {
        if (
            !(s_timeLocksLink[user] == 0) &&
            s_timeLocksLink[user] > block.timestamp
        ) {
            revert Faucet_WalletInTimeLock(
                user,
                s_timeLocksLink[user],
                block.timestamp
            );
        }

        uint256 balance = IERC20(LINK_ADDRESS).balanceOf(address(this));
        if (balance < LINK_PER_WITHDRAW) {
            revert Faucet_NoBalanceInFaucet();
        }

        s_timeLocksLink[user] = block.timestamp + TIME_LOCK_PERIOD;
        bool result = IERC20(LINK_ADDRESS).transfer(user, LINK_PER_WITHDRAW);
        if (!result) {
            revert Faucet_SomethingWentWrong();
        }

        emit WithdrawLink(user, LINK_PER_WITHDRAW);
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
        return s_timeLocksEth[user];
    }

    function getFaucetEthBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getFaucetLinkTokenBalance() public view returns (uint256) {
        return IERC20(LINK_ADDRESS).balanceOf(address(this));
    }
}
