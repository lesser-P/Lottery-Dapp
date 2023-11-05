// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract DappLottery is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _totalLottrties; //彩票编号

    struct LotteryStruct {
        uint256 id;
        string title;
        string description;
        string image;
        uint256 prize; //奖金
        uint256 ticketPrice;
        uint256 participants;
        uint256 winners; //赢家数量
        bool drawn; //是否提取
        address owner;
        uint256 createdAt;
        uint256 expirseAt; //过期时间
    }

    struct ParticipantStruct {
        address account;
        string lotteryNumber;
        bool paid;
    }

    struct lotteryResultStruct {
        uint256 id;
        bool completed;
        bool paidout;
        uint256 timestamp;
        uint256 sharePerWinner; //分享给获奖者
        ParticipantStruct[] winners;
    }

    mapping(uint256 => LotteryStruct) lotteries;
    mapping(uint256 => ParticipantStruct[]) lotteryParticipants;
    mapping(uint256 => string[]) lotteryLuckyNumbers;
    mapping(uint256 => mapping(uint256 => bool)) LuckyNumberUsed;
    mapping(uint256 => lotteryResultStruct) lotteryResult;

    uint256 public servicePercent;
    uint256 public serviceBalance;

    constructor(uint256 _servicePercent) {
        servicePercent = _servicePercent;
    }

    function createLottery(
        string memory title,
        string memory description,
        string memory image,
        uint256 prize,
        uint256 ticketPrice,
        uint256 expirseAt
    ) public {
        require(bytes(title).length > 0, "title cannot be empty");
        require(bytes(description).length > 0, "description cannot be empty");
        require(bytes(image).length > 0, "image cannot be empty");
        require(prize > 0 ether, "prize cannot be zero");
        require(ticketPrice > 0 ether, "ticketPrice cannot be zero");
        require(
            expirseAt > currentTime(),
            "expireAt cannot be less than future"
        );
        _totalLottrties.increment();
        LotteryStruct memory lottery;
        lottery.id = _totalLottrties.current();
        lottery.title = title;
        lottery.description = description;
        lottery.image = image;
        lottery.prize = prize;
        lottery.ticketPrice = ticketPrice;
        lottery.owner = msg.sender;
        lottery.createdAt = currentTime();
        lottery.expirseAt = expirseAt;

        lotteries[lottery.id] = lottery;
    }

    function currentTime() internal view returns (uint256) {
        uint256 newNum = (block.timestamp * 1000) + 1000;
        return newNum;
    }

    function importLuckyNumbers(
        uint256 id,
        string[] memory luckyNumbers
    ) public {
        require(lotteries[id].owner == msg.sender, "Unauthorized entity");
        require(lotteryLuckyNumbers[id].length < 1, "Already Generated");
        require(luckyNumbers.length > 0, "Lucky Numbers cannot be zero");
        lotteryLuckyNumbers[id] = luckyNumbers;
    }

    // 一个彩票内有多个幸运号码 可以把彩票看成一个系列 luckyNumberId就是号码ID
    function buyTicket(uint256 id, uint256 luckyNumberId) public payable {
        require(
            !LuckyNumberUsed[id][luckyNumberId],
            "lucky number already used"
        );
        require(
            msg.value >= lotteries[id].ticketPrice,
            "insufficient ethers to buy ticket"
        );
        lotteries[id].participants++;
        //添加彩票 参加者的信息
        lotteryParticipants[id].push(
            ParticipantStruct(
                msg.sender,
                lotteryLuckyNumbers[id][luckyNumberId],
                false
            )
        );
        LuckyNumberUsed[id][luckyNumberId] = true;
        serviceBalance += msg.value;
    }

    function randomlySelectWinners(uint256 id, uint256 numOfWinners) public {
        //调用者是 指定 彩票的拥有者 或者是 合约\的拥有者
        require(
            lotteries[id].owner == msg.sender || msg.sender == owner(),
            "Unauthorized entity"
        );
        require(
            !lotteryResult[id].completed,
            "Lottery have already been completed"
        );
        require(
            numOfWinners <= lotteryParticipants[id].length,
            "Number of Winners exceeds number of participants"
        );
        ParticipantStruct[] memory winners = new ParticipantStruct[](
            numOfWinners
        );
        ParticipantStruct[] memory participants = lotteryParticipants[id];

        uint256[] memory indices = new uint256[](participants.length);
        for (uint256 i = 0; i < participants.length; i++) {
            indices[i] = i;
        }

        // 打乱之前排好的索引，涉及到block.timestamp这里其实是做一个伪随机数
        for (uint256 i = participants.length - 1; i >= 1; i--) {
            uint256 j = uint256(keccak256(abi.encodePacked(currentTime(), i))) %
                (i + 1);
            uint256 temp = indices[j];
            indices[j] = indices[i];
            indices[i] = temp;
        }

        // select the winners using the first numOfWinners indices
        for (uint i = 0; i < numOfWinners; i++) {
            winners[i] = participants[indices[i]];
            lotteryResult[id].winners.push(winners[i]);
        }

        lotteryResult[id].completed = true;
        lotteryResult[id].timestamp = currentTime();
        lotteries[id].winners = lotteryResult[id].winners.length;
        lotteries[id].drawn = true;
    }

    function payLotteryWinners(uint256 id) internal {
        ParticipantStruct[] memory winners = lotteryResult[id].winners;
        uint256 totalShares = lotteries[id].ticketPrice *
            lotteryParticipants[id].length;
        uint256 platformShare = (totalShares * servicePercent) / 100;
        uint256 netShare = totalShares - platformShare;
        uint256 sharePerWinner = netShare / winners.length;

        for (uint i = 0; i < winners.length; i++) {
            payTo(winners[i].account, sharePerWinner);
        }
        payTo(owner(), platformShare);

        serviceBalance -= totalShares;
        lotteryResult[id].id = id;
        lotteryResult[id].paidout = true;
        lotteryResult[id].sharePerWinner = sharePerWinner;
    }

    function payTo(address to, uint256 amount) internal {
        (bool success, ) = payable(to).call{value: amount}("");
        require(success);
    }

    function getLotteries()
        public
        view
        returns (LotteryStruct[] memory Lotteries)
    {
        Lotteries = new LotteryStruct[](_totalLottrties.current());

        for (uint i = 0; i < _totalLottrties.current(); i++) {
            Lotteries[i] = lotteries[i];
        }
    }

    function getLottery(uint256 id) public view returns (LotteryStruct memory) {
        return lotteries[id];
    }

    function getLotteryParticipants(
        uint256 id
    ) public view returns (ParticipantStruct[] memory) {
        return lotteryParticipants[id];
    }

    function getLotteryLuckyNumbers(
        uint256 id
    ) public view returns (string[] memory) {
        return lotteryLuckyNumbers[id];
    }

    function getLotteryResult(
        uint256 id
    ) public view returns (lotteryResultStruct memory) {
        return lotteryResult[id];
    }
}
