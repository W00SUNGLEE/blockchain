const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const Web3 = require("web3");
const ethTx = require("ethereumjs-tx");

const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
// const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

const address = "0x9029A38fbd09fE84cfF59C48762A903e7Cd2e49d";
const priv_key = Buffer.from(
  "08c169e1072a32830a7ae6982ee6b1632f92f16ede0076573a0ec291f9fcbb72",
  "hex"
);

var ABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name_",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol_",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "mint_",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/deploy", (req, res) => {
  res.sendFile(__dirname + "/deploy.html");
});

app.post("/deploy", (req, res) => {
  var name_ = req.body.tn;
  var symbol_ = req.body.ts;
  var mint_ = req.body.supply;

  var erc20Contract = new web3.eth.Contract([
    {
      inputs: [
        { internalType: "string", name: "name_", type: "string" },
        { internalType: "string", name: "symbol_", type: "string" },
        { internalType: "uint256", name: "mint_", type: "uint256" },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        { indexed: true, internalType: "address", name: "to", type: "address" },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "address", name: "spender", type: "address" },
      ],
      name: "allowance",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "approve",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "account", type: "address" }],
      name: "balanceOf",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "decimals",
      outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "subtractedValue", type: "uint256" },
      ],
      name: "decreaseAllowance",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "addedValue", type: "uint256" },
      ],
      name: "increaseAllowance",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "transfer",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "from", type: "address" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "transferFrom",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
  ]);
  var erc20 = erc20Contract.deploy({
    data: "0x60806040523480156200001157600080fd5b506040516200184738038062001847833981810160405281019062000037919062000335565b82600390805190602001906200004f929190620001fc565b50816004908051906020019062000068929190620001fc565b506200007b33826200008460201b60201c565b50505062000641565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415620000f7576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620000ee9062000410565b60405180910390fd5b6200010b60008383620001f260201b60201c565b80600260008282546200011f9190620004c7565b92505081905550806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508173ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051620001d2919062000432565b60405180910390a3620001ee60008383620001f760201b60201c565b5050565b505050565b505050565b8280546200020a9062000564565b90600052602060002090601f0160209004810192826200022e57600085556200027a565b82601f106200024957805160ff19168380011785556200027a565b828001600101855582156200027a579182015b82811115620002795782518255916020019190600101906200025c565b5b5090506200028991906200028d565b5090565b5b80821115620002a85760008160009055506001016200028e565b5090565b6000620002c3620002bd8462000483565b6200044f565b905082815260208101848484011115620002dc57600080fd5b620002e98482856200052e565b509392505050565b600082601f8301126200030357600080fd5b815162000315848260208601620002ac565b91505092915050565b6000815190506200032f8162000627565b92915050565b6000806000606084860312156200034b57600080fd5b600084015167ffffffffffffffff8111156200036657600080fd5b6200037486828701620002f1565b935050602084015167ffffffffffffffff8111156200039257600080fd5b620003a086828701620002f1565b9250506040620003b3868287016200031e565b9150509250925092565b6000620003cc601f83620004b6565b91507f45524332303a206d696e7420746f20746865207a65726f2061646472657373006000830152602082019050919050565b6200040a8162000524565b82525050565b600060208201905081810360008301526200042b81620003bd565b9050919050565b6000602082019050620004496000830184620003ff565b92915050565b6000604051905081810181811067ffffffffffffffff82111715620004795762000478620005f8565b5b8060405250919050565b600067ffffffffffffffff821115620004a157620004a0620005f8565b5b601f19601f8301169050602081019050919050565b600082825260208201905092915050565b6000620004d48262000524565b9150620004e18362000524565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156200051957620005186200059a565b5b828201905092915050565b6000819050919050565b60005b838110156200054e57808201518184015260208101905062000531565b838111156200055e576000848401525b50505050565b600060028204905060018216806200057d57607f821691505b60208210811415620005945762000593620005c9565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620006328162000524565b81146200063e57600080fd5b50565b6111f680620006516000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c80633950935111610071578063395093511461016857806370a082311461019857806395d89b41146101c8578063a457c2d7146101e6578063a9059cbb14610216578063dd62ed3e14610246576100a9565b806306fdde03146100ae578063095ea7b3146100cc57806318160ddd146100fc57806323b872dd1461011a578063313ce5671461014a575b600080fd5b6100b6610276565b6040516100c39190610ebf565b60405180910390f35b6100e660048036038101906100e19190610b5e565b610308565b6040516100f39190610ea4565b60405180910390f35b61010461032b565b6040516101119190610fc1565b60405180910390f35b610134600480360381019061012f9190610b0f565b610335565b6040516101419190610ea4565b60405180910390f35b610152610364565b60405161015f9190610fdc565b60405180910390f35b610182600480360381019061017d9190610b5e565b61036d565b60405161018f9190610ea4565b60405180910390f35b6101b260048036038101906101ad9190610aaa565b6103a4565b6040516101bf9190610fc1565b60405180910390f35b6101d06103ec565b6040516101dd9190610ebf565b60405180910390f35b61020060048036038101906101fb9190610b5e565b61047e565b60405161020d9190610ea4565b60405180910390f35b610230600480360381019061022b9190610b5e565b6104f5565b60405161023d9190610ea4565b60405180910390f35b610260600480360381019061025b9190610ad3565b610518565b60405161026d9190610fc1565b60405180910390f35b606060038054610285906110f1565b80601f01602080910402602001604051908101604052809291908181526020018280546102b1906110f1565b80156102fe5780601f106102d3576101008083540402835291602001916102fe565b820191906000526020600020905b8154815290600101906020018083116102e157829003601f168201915b5050505050905090565b60008061031361059f565b90506103208185856105a7565b600191505092915050565b6000600254905090565b60008061034061059f565b905061034d858285610772565b6103588585856107fe565b60019150509392505050565b60006001905090565b60008061037861059f565b905061039981858561038a8589610518565b6103949190611013565b6105a7565b600191505092915050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6060600480546103fb906110f1565b80601f0160208091040260200160405190810160405280929190818152602001828054610427906110f1565b80156104745780601f1061044957610100808354040283529160200191610474565b820191906000526020600020905b81548152906001019060200180831161045757829003601f168201915b5050505050905090565b60008061048961059f565b905060006104978286610518565b9050838110156104dc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104d390610fa1565b60405180910390fd5b6104e982868684036105a7565b60019250505092915050565b60008061050061059f565b905061050d8185856107fe565b600191505092915050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b600033905090565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610617576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161060e90610f81565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610687576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161067e90610f01565b60405180910390fd5b80600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925836040516107659190610fc1565b60405180910390a3505050565b600061077e8484610518565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81146107f857818110156107ea576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107e190610f21565b60405180910390fd5b6107f784848484036105a7565b5b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16141561086e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161086590610f61565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614156108de576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108d590610ee1565b60405180910390fd5b6108e9838383610a76565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490508181101561096f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161096690610f41565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610a5d9190610fc1565b60405180910390a3610a70848484610a7b565b50505050565b505050565b505050565b600081359050610a8f81611192565b92915050565b600081359050610aa4816111a9565b92915050565b600060208284031215610abc57600080fd5b6000610aca84828501610a80565b91505092915050565b60008060408385031215610ae657600080fd5b6000610af485828601610a80565b9250506020610b0585828601610a80565b9150509250929050565b600080600060608486031215610b2457600080fd5b6000610b3286828701610a80565b9350506020610b4386828701610a80565b9250506040610b5486828701610a95565b9150509250925092565b60008060408385031215610b7157600080fd5b6000610b7f85828601610a80565b9250506020610b9085828601610a95565b9150509250929050565b610ba38161107b565b82525050565b6000610bb482610ff7565b610bbe8185611002565b9350610bce8185602086016110be565b610bd781611181565b840191505092915050565b6000610bef602383611002565b91507f45524332303a207472616e7366657220746f20746865207a65726f206164647260008301527f65737300000000000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000610c55602283611002565b91507f45524332303a20617070726f766520746f20746865207a65726f20616464726560008301527f73730000000000000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000610cbb601d83611002565b91507f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006000830152602082019050919050565b6000610cfb602683611002565b91507f45524332303a207472616e7366657220616d6f756e742065786365656473206260008301527f616c616e636500000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000610d61602583611002565b91507f45524332303a207472616e736665722066726f6d20746865207a65726f20616460008301527f64726573730000000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000610dc7602483611002565b91507f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460008301527f72657373000000000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000610e2d602583611002565b91507f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760008301527f207a65726f0000000000000000000000000000000000000000000000000000006020830152604082019050919050565b610e8f816110a7565b82525050565b610e9e816110b1565b82525050565b6000602082019050610eb96000830184610b9a565b92915050565b60006020820190508181036000830152610ed98184610ba9565b905092915050565b60006020820190508181036000830152610efa81610be2565b9050919050565b60006020820190508181036000830152610f1a81610c48565b9050919050565b60006020820190508181036000830152610f3a81610cae565b9050919050565b60006020820190508181036000830152610f5a81610cee565b9050919050565b60006020820190508181036000830152610f7a81610d54565b9050919050565b60006020820190508181036000830152610f9a81610dba565b9050919050565b60006020820190508181036000830152610fba81610e20565b9050919050565b6000602082019050610fd66000830184610e86565b92915050565b6000602082019050610ff16000830184610e95565b92915050565b600081519050919050565b600082825260208201905092915050565b600061101e826110a7565b9150611029836110a7565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0382111561105e5761105d611123565b5b828201905092915050565b600061107482611087565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b60005b838110156110dc5780820151818401526020810190506110c1565b838111156110eb576000848401525b50505050565b6000600282049050600182168061110957607f821691505b6020821081141561111d5761111c611152565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000601f19601f8301169050919050565b61119b81611069565b81146111a657600080fd5b50565b6111b2816110a7565b81146111bd57600080fd5b5056fea26469706673582212209a134ddfc0f55f32223fd751c654dbb43fcd031c75afed8cca4a145dba918b0264736f6c63430008000033",
    arguments: [name_, symbol_, mint_],
  });

  var set_string_byte_code = erc20.encodeABI();

  web3.eth.getTransactionCount(address, "pending", (err, nonce) => {
    var Raw_Tx = {
      nonce: web3.utils.toHex(nonce),
      gasPrice: web3.utils.toHex(1000),
      gasLimit: web3.utils.toHex(3000000),
      data: set_string_byte_code,
      from: address,
    };

    var Signature = new Buffer.from(priv_key, "hex");

    var Make_Tx = new ethTx(Raw_Tx);
    Make_Tx.sign(Signature);
    var Serialized_Tx = Make_Tx.serialize();
    var Raw_Tx_Hex = "0x" + Serialized_Tx.toString("hex");

    web3.eth.sendSignedTransaction(Raw_Tx_Hex).on("receipt", (receipt) => {
      console.log("receipt: ", receipt);
    });
  });
});

app.get("/send", (req, res) => {
  res.sendFile(__dirname + "/send.html");
});

app.post("/send", (req, res) => {
  var contract_address = "0x899451D11F88Ada9d363535e61090Be6029C1DCe";
  var contract = new web3.eth.Contract(ABI, contract_address);

  var set_contract = contract.methods.transfer(
    req.body.address,
    req.body.value
  );

  var set_contract_byte = set_contract.encodeABI();

  web3.eth.getTransactionCount(address, "pending", (err, nonce) => {
    var Raw_Tx = {
      nonce: web3.utils.toHex(nonce),
      gasPrice: web3.utils.toHex(1000),
      gasLimit: web3.utils.toHex(3000000),
      data: set_contract_byte,
      from: address,
      to: contract_address,
    };
    var Signature = new Buffer.from(priv_key, "hex");

    var Make_Tx = new ethTx(Raw_Tx);
    Make_Tx.sign(Signature);
    var Serialized_Tx = Make_Tx.serialize();
    var Raw_Tx_Hex = "0x" + Serialized_Tx.toString("hex");

    web3.eth.sendSignedTransaction(Raw_Tx_Hex).on("receipt", (receipt) => {
      console.log("receipt: ", receipt);
    });
  });
});

app.get("/balance", (req, res) => {
  res.sendFile(__dirname + "/balance.html");
});

app.post("/balance", (req, res) => {
  var contract_address = "0x899451D11F88Ada9d363535e61090Be6029C1DCe";
  var contract = new web3.eth.Contract(ABI, contract_address);

  contract.methods
    .balanceOf(req.body.address)
    .call()
    .then((data) => {
      var decimal = Math.pow(10, 1);
      var new_data = data / decimal;
      res.send("balance= " + new_data);
    });
});

var server = app.listen(5000, () => {
  console.log("server is working now");
});
