  function log(message) {
    $('#log').append($('<p>').text(message));
    $('#log').scrollTop($('#log').prop('scrollHeight'));
  }

  function error(message) {
    $('#log').append($('<p>').addClass('dark-red').text(message));
    $('#log').scrollTop($('#log').prop('scrollHeight'));
  }

  function waitForReceipt(hash, cb) {
    web3.eth.getTransactionReceipt(hash, function (err, receipt) {
      if (err) {
        error(err);
      }

      if (receipt !== null) {
        // Transaction went through
        if (cb) {
          cb(receipt);
        }
      } else {
        // Try again in 1 second
        window.setTimeout(function () {
          waitForReceipt(hash, cb);
        }, 1000);
      }
    });
  }

  var address = "0xe55e7780b5e3f86e3596992a27b7b78f9bae9679";
  var abi = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "_message",
        "type": "string"
      }
    ],
    "name": "changeMessage",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "payable": true,
    "stateMutability": "payable",
    "type": "fallback"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "time",
        "type": "uint256"
      }
    ],
    "name": "ChangeMessageEvent",
    "type": "event"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getMessage",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "ownerToMessage",
    "outputs": [
      {
        "name": "body",
        "type": "string"
      },
      {
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
  ];


  $(function () {
    var messageApp;

    $('#get-message').click(function (e) {
      e.preventDefault();

      log("Finding your message...");

      messageApp.getMessage.call(function (err, result) {
        if (err) {
          return error(err);
        } else {
          log("Found your message!");
        }

        $('#message').text(result.toString());
      });
    });

    $('#change-message').click(function (e) {
      e.preventDefault();

      if(web3.eth.defaultAccount === undefined) {
        return error("No accounts found. If you're using MetaMask, " +
                     "please unlock it first and reload the page.");
      }

      log("Changing your message...");

      var messageBody = document.getElementById("input-message").value;

      messageApp.changeMessage.sendTransaction(messageBody, function (err, hash) {
        if (err) {
          return error(err);
        }

        waitForReceipt(hash, function () {
          log("Transaction succeeded! " +
              "You should be able to view your message soon.");
        });
      });
    });

    if (typeof(web3) === "undefined") {
      error("Unable to find web3. " +
            "Please run MetaMask (or something else that injects web3).");
    } else {
      log("Found injected web3.");
      web3 = new Web3(web3.currentProvider);
      if (web3.version.network != 3) {
        error("Wrong network detected. Please switch to the Ropsten test network.");
      } else {
        log("Connected to the Ropsten test network.");
        messageApp = web3.eth.contract(abi).at(address);
        $('#get-message').click();
      }
    }
  });