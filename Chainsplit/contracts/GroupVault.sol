// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IFactory {
    function registerMember(address member, address vault) external;
}

contract GroupVault {

    uint256 private _reentrancyStatus;
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    modifier nonReentrant() {
        require(_reentrancyStatus != _ENTERED, "ReentrancyGuard: reentrant call");
        _reentrancyStatus = _ENTERED;
        _;
        _reentrancyStatus = _NOT_ENTERED;
    }

    struct Member {
        address wallet;
        string  displayName;
        uint256 deposited;
        uint256 totalShare;
        bool    isActive;
    }

    struct Expense {
        uint256 id;
        string  name;
        uint256 amount;
        address paidBy;
        uint8   category;
        uint256 timestamp;
        bool    isEqual;
        address[] splitAmong;
        uint256[] shares;
        bool    isDeleted;
    }

    struct Settlement {
        address from;
        address to;
        uint256 amount;
        uint256 timestamp;
        bool    executed;
    }

    string  public groupName;
    string  public groupEmoji;
    address public admin;
    bool    public isSettled;
    uint256 public createdAt;

    uint256 public constant PROTOCOL_FEE_BPS = 100;
    address public constant FEE_COLLECTOR = 0x7D828173126408B4Fbdd3CEf614698d452BE5a3e;

    mapping(address => Member) public members;
    address[]                  public memberList;
    Expense[]                  public expenses;
    uint256                    public expenseCount;
    Settlement[]               public settlements;
    uint256                    public vaultBalance;

    event MemberAdded(address indexed wallet, string displayName);
    event FundsDeposited(address indexed wallet, uint256 amount);
    event ExpenseAdded(uint256 indexed expenseId, string name, uint256 amount, address paidBy);
    event ExpenseDeleted(uint256 indexed expenseId);
    event SettlementExecuted(address indexed from, address indexed to, uint256 amount);
    event GroupSettled(uint256 timestamp);
    event FundsWithdrawn(address indexed wallet, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier onlyMember() {
        require(members[msg.sender].isActive, "Not a member");
        _;
    }

    modifier notSettled() {
        require(!isSettled, "Group already settled");
        _;
    }

    constructor(
        string memory _groupName,
        string memory _groupEmoji,
        address       _admin,
        string memory _adminName,
        address       _factory
    ) {
        _reentrancyStatus = _NOT_ENTERED;
        groupName  = _groupName;
        groupEmoji = _groupEmoji;
        admin      = _admin;
        factory    = _factory;
        createdAt  = block.timestamp;
        _addMember(_admin, _adminName);
    }

    function addMember(address _wallet, string memory _name) external onlyAdmin notSettled {
        require(!members[_wallet].isActive, "Already a member");
        require(_wallet != address(0), "Invalid address");
        _addMember(_wallet, _name);
        IFactory(factory).registerMember(_wallet, address(this));
    }

    address public factory;

    function _addMember(address _wallet, string memory _name) internal {
        members[_wallet] = Member({ wallet: _wallet, displayName: _name, deposited: 0, totalShare: 0, isActive: true });
        memberList.push(_wallet);
        emit MemberAdded(_wallet, _name);
    }

    function getMembers() external view returns (address[] memory) {
        return memberList;
    }

    function deposit() external payable onlyMember notSettled nonReentrant {
        require(msg.value > 0, "Must deposit > 0");
        members[msg.sender].deposited += msg.value;
        vaultBalance += msg.value;
        emit FundsDeposited(msg.sender, msg.value);
    }

    function addExpenseEqual(
        string   memory _name,
        uint256         _amount,
        address         _paidBy,
        uint8           _category,
        address[] memory _splitAmong
    ) external onlyMember notSettled {
        require(_amount > 0, "Amount must be > 0");
        require(members[_paidBy].isActive, "Payer not a member");
        require(_splitAmong.length >= 2, "Need at least 2 members to split");

        uint256 sharePerPerson = _amount / _splitAmong.length;
        uint256[] memory shares = new uint256[](_splitAmong.length);

        for (uint256 i = 0; i < _splitAmong.length; i++) {
            require(members[_splitAmong[i]].isActive, "Split member not in group");
            shares[i] = sharePerPerson;
            members[_splitAmong[i]].totalShare += sharePerPerson;
        }

        _storeExpense(_name, _amount, _paidBy, _category, true, _splitAmong, shares);
    }

    function addExpenseCustom(
        string   memory _name,
        uint256         _amount,
        address         _paidBy,
        uint8           _category,
        address[] memory _splitAmong,
        uint256[] memory _shares
    ) external onlyMember notSettled {
        require(_amount > 0, "Amount must be > 0");
        require(members[_paidBy].isActive, "Payer not a member");
        require(_splitAmong.length == _shares.length, "Arrays length mismatch");
        require(_splitAmong.length >= 2, "Need at least 2 members");

        uint256 totalShares = 0;
        for (uint256 i = 0; i < _shares.length; i++) {
            require(members[_splitAmong[i]].isActive, "Split member not in group");
            totalShares += _shares[i];
            members[_splitAmong[i]].totalShare += _shares[i];
        }
        require(totalShares == _amount, "Shares must equal total amount");

        _storeExpense(_name, _amount, _paidBy, _category, false, _splitAmong, _shares);
    }

    function _storeExpense(
        string   memory _name,
        uint256         _amount,
        address         _paidBy,
        uint8           _category,
        bool            _isEqual,
        address[] memory _splitAmong,
        uint256[] memory _shares
    ) internal {
        expenses.push(Expense({
            id: expenseCount, name: _name, amount: _amount, paidBy: _paidBy,
            category: _category, timestamp: block.timestamp, isEqual: _isEqual,
            splitAmong: _splitAmong, shares: _shares, isDeleted: false
        }));
        emit ExpenseAdded(expenseCount, _name, _amount, _paidBy);
        expenseCount++;
    }

    function deleteExpense(uint256 _expenseId) external onlyAdmin notSettled {
        require(_expenseId < expenseCount, "Expense not found");
        Expense storage exp = expenses[_expenseId];
        require(!exp.isDeleted, "Already deleted");
        for (uint256 i = 0; i < exp.splitAmong.length; i++) {
            members[exp.splitAmong[i]].totalShare -= exp.shares[i];
        }
        exp.isDeleted = true;
        emit ExpenseDeleted(_expenseId);
    }

    function getExpenses() external view returns (Expense[] memory) {
        return expenses;
    }

    function getMemberNetBalance(address _member) external view returns (int256 netBalance) {
        require(members[_member].isActive, "Not a member");
        int256 totalPaid = 0;
        for (uint256 i = 0; i < expenses.length; i++) {
            if (!expenses[i].isDeleted && expenses[i].paidBy == _member)
                totalPaid += int256(expenses[i].amount);
        }
        netBalance = totalPaid - int256(members[_member].totalShare);
    }

    function calculateSettlements()
        external view
        returns (address[] memory froms, address[] memory tos, uint256[] memory amounts)
    {
        uint256 count = memberList.length;
        int256[] memory bal = new int256[](count);

        for (uint256 i = 0; i < count; i++) {
            address m = memberList[i];
            int256 totalPaid = 0;
            for (uint256 j = 0; j < expenses.length; j++) {
                if (!expenses[j].isDeleted && expenses[j].paidBy == m)
                    totalPaid += int256(expenses[j].amount);
            }
            bal[i] = totalPaid - int256(members[m].totalShare);
        }

        address[] memory _froms   = new address[](count);
        address[] memory _tos     = new address[](count);
        uint256[] memory _amounts = new uint256[](count);
        uint256 settlementCount   = 0;

        for (uint256 iter = 0; iter < count * count; iter++) {
            int256 maxCredit = 0; int256 maxDebt = 0;
            uint256 creditorIdx = 0; uint256 debtorIdx = 0;
            for (uint256 i = 0; i < count; i++) {
                if (bal[i] > maxCredit) { maxCredit = bal[i]; creditorIdx = i; }
                if (bal[i] < maxDebt)   { maxDebt   = bal[i]; debtorIdx   = i; }
            }
            if (maxCredit == 0 || maxDebt == 0) break;
            uint256 settleAmount = maxCredit < -maxDebt ? uint256(maxCredit) : uint256(-maxDebt);
            _froms[settlementCount]   = memberList[debtorIdx];
            _tos[settlementCount]     = memberList[creditorIdx];
            _amounts[settlementCount] = settleAmount;
            settlementCount++;
            bal[creditorIdx] -= int256(settleAmount);
            bal[debtorIdx]   += int256(settleAmount);
        }

        froms = new address[](settlementCount);
        tos   = new address[](settlementCount);
        amounts = new uint256[](settlementCount);
        for (uint256 i = 0; i < settlementCount; i++) {
            froms[i] = _froms[i]; tos[i] = _tos[i]; amounts[i] = _amounts[i];
        }
    }

    function settleDebt(address _to) external payable onlyMember notSettled nonReentrant {
        require(msg.value > 0, "Must send CRO to settle");
        require(members[_to].isActive, "Recipient not a member");
        require(_to != msg.sender, "Cannot settle with yourself");

        uint256 fee    = (msg.value * PROTOCOL_FEE_BPS) / 10000;
        uint256 payout = msg.value - fee;

        (bool success, ) = payable(_to).call{value: payout}("");
        require(success, "Transfer to creditor failed");

        (bool feeSuccess, ) = payable(FEE_COLLECTOR).call{value: fee}("");
        require(feeSuccess, "Fee transfer failed");

        settlements.push(Settlement({ from: msg.sender, to: _to, amount: msg.value, timestamp: block.timestamp, executed: true }));
        emit SettlementExecuted(msg.sender, _to, msg.value);
    }

    function markGroupSettled() external onlyAdmin notSettled {
        isSettled = true;
        emit GroupSettled(block.timestamp);
    }

    function withdrawRemaining() external onlyAdmin nonReentrant {
        require(isSettled, "Group must be settled first");
        uint256 balance = address(this).balance;
        require(balance > 0, "Nothing to withdraw");
        vaultBalance = 0;
        (bool success, ) = payable(admin).call{value: balance}("");
        require(success, "Withdrawal failed");
        emit FundsWithdrawn(admin, balance);
    }

    function getGroupInfo() external view returns (
        string memory name, string memory emoji, address groupAdmin,
        uint256 memberCount, uint256 totalExpenses, bool settled, uint256 balance
    ) {
        return (groupName, groupEmoji, admin, memberList.length, expenseCount, isSettled, address(this).balance);
    }

    function getSettlements() external view returns (Settlement[] memory) {
        return settlements;
    }

    receive() external payable {
        vaultBalance += msg.value;
    }
}
