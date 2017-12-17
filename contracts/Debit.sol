pragma solidity ^0.4.4;

contract Debit {
    address _owner;
    
    struct DebitContract {
        int256 credit;
        bool initialized;
    }

    mapping (address => DebitContract) public _debitContracts;

    function Debit() public {
        _owner = msg.sender;
    }

    function getOwner() public constant returns (address) {
        return _owner;
    }

    function openContract(address whoAddress) public {
        require(msg.sender == _owner);

        DebitContract storage debitContract = _debitContracts[whoAddress];
        require(!debitContract.initialized);

        debitContract.initialized = true;
        debitContract.credit = 0;
    }

    function chargeUp() public payable {
        DebitContract storage debitContract = _debitContracts[msg.sender];
        require(debitContract.initialized);

        debitContract.credit += int256(msg.value);
    }

    function getCredits() public constant returns (int256 credits) {
        require(_debitContracts[msg.sender].initialized);
        return _debitContracts[msg.sender].credit;
    }
    
    function getCreditsFor(address whoAddress) public constant returns (int256 credits) {
        require(msg.sender == _owner);
        
        DebitContract storage debitContract = _debitContracts[whoAddress];

        require(debitContract.initialized);
        return debitContract.credit;
    }

    function execute(address whoAddress, uint32 cost) public {
        require(msg.sender == _owner);
        DebitContract storage debitContract = _debitContracts[whoAddress];
        require(debitContract.credit >= cost);
            
        debitContract.credit -= int256(cost);
    }
}
