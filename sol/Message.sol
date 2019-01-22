pragma solidity ^0.5.2;

contract Message {
    event ChangeMessageEvent(uint time);
    
    address owner;
    mapping (address => userMessage) public ownerToMessage;
    
    struct userMessage {
        // anything else need to be saved?
        string body;
        uint timestamp;
    }

    constructor() public {
        owner = msg.sender;
        // 
    }

    // function which either creates a new message or changes the current message at the user's current address
    function changeMessage(string memory _message) public {
        userMessage memory newMessage = userMessage(_message, block.timestamp);
        
        ownerToMessage[msg.sender] = newMessage;
        
        emit ChangeMessageEvent(newMessage.timestamp); // emit change of message w/ timestamp
    }


    // function which returns the stored message at the user's current address
    function getMessage() public view returns (string memory) {
        userMessage memory obtainedMessage = ownerToMessage[msg.sender];
        
        require(obtainedMessage.timestamp > 0); // ensure a message exists at the spot
        
        return obtainedMessage.body;
    }
    
    // withdraw function for owner (if any eth is sent to the contract)
    function withdraw() public {
        require(msg.sender == owner);
        msg.sender.transfer(address(this).balance);
    }
    
    function () external payable {
        // 
    }

}

