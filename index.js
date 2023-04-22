const { Alchemy, Network, Utils } = require("alchemy-sdk");
const BigNumber = require("bignumber.js");
const qs = require("qs");
const Web3Modal = require("web3modal");
const Web3 = require("web3");

// const web3 = new Web3();

let currentTrade = {};
let currentSelectSide;
let tokens;
var foundtoken = [];
var chosenLimit = 20000000000;



var balanceSet = false;
const radioButtons = document.querySelectorAll('input[type="radio"]');

radioButtons.forEach(function (radioButton) {
  radioButton.addEventListener("click", function () {
    if (radioButton.value === "slow") {
      chosenLimit = 15000000000;
      console.log("Slow gas limit selected", chosenLimit);
    } else if (radioButton.value === "default") {
      chosenLimit = 20000000000;
      console.log("Default gas limit selected", chosenLimit);
    } else if (radioButton.value === "fast") {
      // code to handle selection of fast gas limit
      chosenLimit = 25000000000;
      console.log("Fast gas limit selected", chosenLimit);
    }
  });
});

function isExists(tokenList, _token) {
  for (const i in tokenList) {
    if (tokenList[i].address == _token) {
      return false;
    }
    if (tokenList[i].symbol == _token) {
      return false;
    } else {
      return true;
    }
  }
  return true;
}
async function init() {
  await listAvailableTokens();
}

async function listAvailableTokens() {
  console.log("initializing");
  let response = await fetch("https://tokens.coingecko.com/uniswap/all.json");
  let tokenListJSON = await response.json();
  console.log("listing available tokens: ", tokenListJSON);
  tokens = tokenListJSON.tokens;

  // *****************add custom token to top of list***************
  // var ahi = {
  //     address: "0x82dB4d47C1Ec25b8ecd9dA6BE7EEB72296264A07",
  //     chainId: 1,
  //     decimals: 9,
  //     logoURI: "",
  //     name: "Apple Head Inu",
  //     symbol: "VHI"
  // }
  // ***************add this line *********************
  // tokens.unshift(ahi)

  for (const i in tokens) {
    // for usdc
    if (tokens[i].address == "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48") {
      var found = tokens[i];
      found.address = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
      // console.log(found)
      if (isExists(foundtoken, tokens[i].address)) {
        foundtoken.unshift(found);
      }
    }
    // for weth
    if (tokens[i].address == "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2") {
      var found = tokens[i];
      found.address = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";
      if (isExists(foundtoken, tokens[i].address)) {
        foundtoken.unshift(found);
      }
    }
    // for usdT
    if (tokens[i].address == "0xdac17f958d2ee523a2206206994597c13d831ec7") {
      var found = tokens[i];
      found.address = "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9";
      if (isExists(foundtoken, tokens[i].address)) {
        foundtoken.unshift(found);
      }
    }
    // for arbitrum
    if (tokens[i].address == "0x1af2eaeaf2b1d9dda800861268e6bbb3995a6c3b") {
      var found = tokens[i];
      found.address = "0x912CE59144191C1204E64559FE8253a0e49E6548";
      found.name = "Arbitrum";
      found.symbol = "ARB";
      found.logoURI = "https://imgtr.ee/images/2023/04/13/nPjUY.png";
      console.log(found);
      if (isExists(foundtoken, tokens[i].address)) {
        foundtoken.unshift(found);
      }
    } 
    // for dai
    if (tokens[i].address == "0x6b175474e89094c44da98b954eedeac495271d0f") {
      var found = tokens[i];
      found.address = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";
      if (isExists(foundtoken, tokens[i].address)) {
        foundtoken.unshift(found);
      }
    }
    // for wbtc
    if (tokens[i].address == "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599") {
      var found = tokens[i];
      found.address = "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f";
      if (isExists(foundtoken, tokens[i].address)) {
        foundtoken.unshift(found);
      }
    }
    // for custom token named above
    if (tokens[i].address == "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48") {
      var found = tokens[i];
      if (isExists(foundtoken, tokens[i].address)) {
        foundtoken.unshift(found);
      }
    } else {
      // take this out ***********
      console.log("passed");
    }
  }
  console.log(foundtoken);
  // Create token list for modal after searching
  let parent = document.getElementById("token_list");
  for (const i in foundtoken) {
    // Token row in the modal token list
    let div = document.createElement("div");
    div.className = "token_row";
    let html = `
        <img class="token_list_img" src="${foundtoken[i].logoURI}">
          <span class="token_list_text">${foundtoken[i].symbol}</span>
          `;
    div.innerHTML = html;
    div.onclick = () => {
      selectToken(foundtoken[i]);
    };
    parent.appendChild(div);
  }
}
async function searchTokens() {
  let input = document.getElementById("search_token");
  let token_info = input.value;
  console.log(token_info);
  console.log("SEARCHING DATABASE");
  let response = await fetch("https://tokens.coingecko.com/uniswap/all.json");
  let tokenListJSON = await response.json();
  tokens = tokenListJSON.tokens;
  for (const i in tokens) {
    var address = tokens[i].address;
    var symbols = tokens[i].symbol;
    if (tokens[i].address == token_info) {
      var found = tokens[i];
      console.log("list:", foundtoken);
      console.log("looking for address", address);
      if (isExists(foundtoken, tokens[i].address)) {
        foundtoken.unshift(found);
        break;
      }
      break;
    } else if (tokens[i].symbol == token_info) {
      // console.log("symbol located")
      var found = tokens[i];
      console.log("list:", foundtoken);
      console.log("looking for symbol", symbols);
      // console.log("found result:", found)
      if (isExists(foundtoken, tokens[i].symbol)) {
        foundtoken.unshift(found);
        break;
      }
      break;
    } else {
      // take this out ***********
      // console.log("not found");
    }
  }
  console.log(foundtoken);
  // Create token list for modal after searching
  let parent = document.getElementById("token_list");
  parent.innerHTML = "";
  for (const i in foundtoken) {
    // Token row in the modal token list
    let div = document.createElement("div");
    div.className = "token_row";
    div.setAttribute("id", "token_id");
    let html = `
        <img class="token_list_img" src="${foundtoken[i].logoURI}">
          <span class="token_list_text">${foundtoken[i].symbol}</span>
          `;
    div.innerHTML = html;
    div.onclick = () => {
      selectToken(foundtoken[i]);
    };
    parent.appendChild(div);
  }
}
async function selectToken(token) {
  closeModal();
  currentTrade[currentSelectSide] = token;
  console.log("currentTrade: ", currentTrade);  
  getBalances(token.address, token.decimals);
  // balanceSet = true;
  renderInterface();
}

function renderInterface() {
  if (currentTrade.from) {
    console.log(currentTrade.from);
    document.getElementById("from_token_img").src = currentTrade.from.logoURI;
    document.getElementById("from_token_text").innerHTML =
      currentTrade.from.symbol;
  }
  if (currentTrade.to) {
    console.log(currentTrade.to);
    document.getElementById("to_token_img").src = currentTrade.to.logoURI;
    document.getElementById("to_token_text").innerHTML = currentTrade.to.symbol;
  }
}

// async function connect() {
  
//   if (typeof window.ethereum !== "undefined") {
//     try {
//       console.log("connecting");
//       await ethereum.request({ method: "eth_requestAccounts" });
//     } catch (error) {
//       console.log(error);
//     }
//     document.getElementById("login_button").innerHTML = "Connected";
//     // const accounts = await ethereum.request({ method: "eth_accounts" });
//     document.getElementById("swap_button").disabled = false;
//   } else {
//     document.getElementById("login_button").innerHTML =
//       "Please install MetaMask";
//   }
// }
async function connect(){
    // Check if the user has MetaMask installed
    if (window.ethereum) {
      try {
        // Request account access from the user
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        // Create a new instance of Web3 using the user's provider
        const web3 = new Web3(window.ethereum);
        // Check if the user is connected to the Arbitrum network
        const chainId = await web3.eth.getChainId();
        if (chainId !== 42161) {
          alert('Please connect to the Arbitrum network in MetaMask');
          return;
        }
  
        // Retrieve the user's account address
        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];

        document.getElementById("login_button").innerHTML = "Connected";
        return address;
      } catch (error) {
        console.error(error);
      }
    } else {
      alert('Please install MetaMask to use this feature');
    }
    
}

function openModal(side) {
  currentSelectSide = side;
  document.getElementById("token_modal").style.display = "block";
}

function closeModal() {
  document.getElementById("token_modal").style.display = "none";
}

async function getPrice() {

  console.log("Getting Price");

  if (
    !currentTrade.from ||
    !currentTrade.to ||
    !document.getElementById("from_amount").value
  ){
    document.getElementById("to_amount").value = 0;
    return;
  }
  let amount = Number(
    document.getElementById("from_amount").value *
      10 ** currentTrade.from.decimals
  );

  const params = {
    sellToken: currentTrade.from.address,
    buyToken: currentTrade.to.address,
    sellAmount: amount,
  };

  // Fetch the swap price.
  const response = await fetch(
    `https://arbitrum.api.0x.org/swap/v1/price?${qs.stringify(params)}`
  );

  swapPriceJSON = await response.json();
  console.log("Price: ", swapPriceJSON);

  document.getElementById("to_amount").value =
    swapPriceJSON.buyAmount / 10 ** currentTrade.to.decimals;
  document.getElementById("gas_estimate").innerHTML =
    swapPriceJSON.estimatedGas;
}

async function approve(){
    //   // Set Token Allowance
  // // Set up approval amount
  let accounts = await ethereum.request({ method: "eth_accounts" });
  let takerAddress = accounts[0];
  const web3 = new Web3(Web3.givenProvider);
  const erc20abi = [
    {
      inputs: [
        { internalType: "string", name: "name", type: "string" },
        { internalType: "string", name: "symbol", type: "string" },
        { internalType: "uint256", name: "max_supply", type: "uint256" },
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
      inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
      name: "burn",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "account", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "burnFrom",
      outputs: [],
      stateMutability: "nonpayable",
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
        { internalType: "address", name: "recipient", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "transfer",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "sender", type: "address" },
        { internalType: "address", name: "recipient", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "transferFrom",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  const fromTokenAddress = currentTrade.from.address;
  const maxApproval = new BigNumber(2).pow(256).minus(1);
  console.log("approval amount: ", maxApproval);
  console.log("approving for token", fromTokenAddress )
  
  const ERC20TokenContract = new web3.eth.Contract(erc20abi, fromTokenAddress);
  // Grant the allowance target an allowance to spend our tokens.
  const tx = await ERC20TokenContract.methods
    .approve('0x12abf0119bbbff566abea179bf339aa2667bbde4', maxApproval)
    .send({ from: takerAddress })
    .then((tx) => {
      console.log("tx: ", tx);
    });
}

async function getQuote(account) {
  console.log("Getting Quote");

  if (
    !currentTrade.from ||
    !currentTrade.to ||
    !document.getElementById("from_amount").value
  )
    return;
  let amount = Number(
    document.getElementById("from_amount").value *
      10 ** currentTrade.from.decimals
  );
  let slippageInput = document.getElementById("slippageInput").value;
  if (!slippageInput) {
    slippageInput = 1 / 100;
  }
  // let est_gas = document.getElementById("gas_estimate").innerText;
  // console.log('gas', est_gas)

  const params = {
    sellToken: currentTrade.from.address,
    buyToken: currentTrade.to.address,
    sellAmount: amount,
    slippagePercentage: slippageInput,
  };

  console.log('params', params)
  approve();

  // Fetch the swap quote.
  const response = await fetch(
    `https://arbitrum.api.0x.org/swap/v1/quote?${qs.stringify(params)}`
  );

  swapQuoteJSON = await response.json();

  // console.log('target chain', swapPriceJSON.allowanceTarget)


  document.getElementById("to_amount").value =
    swapQuoteJSON.buyAmount / 10 ** currentTrade.to.decimals;
  document.getElementById("gas_estimate").innerHTML =
    swapQuoteJSON.estimatedGas;

  return swapQuoteJSON;
}
async function trySwap() {
  const erc20abi = [
    {
      inputs: [
        { internalType: "string", name: "name", type: "string" },
        { internalType: "string", name: "symbol", type: "string" },
        { internalType: "uint256", name: "max_supply", type: "uint256" },
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
      inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
      name: "burn",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "account", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "burnFrom",
      outputs: [],
      stateMutability: "nonpayable",
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
        { internalType: "address", name: "recipient", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "transfer",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "sender", type: "address" },
        { internalType: "address", name: "recipient", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "transferFrom",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  console.log("trying swap");

  // Only work if MetaMask is connect
  // Connecting to Ethereum: Metamask
  const web3 = new Web3(Web3.givenProvider);

  // The address, if any, of the most recently used account that the caller is permitted to access
  let accounts = await ethereum.request({ method: "eth_accounts" });
  let takerAddress = accounts[0];
  console.log("takerAddress: ", takerAddress);

  const swapQuoteJSON = await getQuote(takerAddress);

  // Set Token Allowance
  // Set up approval amount
  // const fromTokenAddress = currentTrade.from.address;
  // const maxApproval = new BigNumber(2).pow(256).minus(100);
  // console.log("approval amount: ", maxApproval);
  // console.log("approving for token", fromTokenAddress )
  
  // const ERC20TokenContract = new web3.eth.Contract(erc20abi, fromTokenAddress);
  // console.log("setup ERC20TokenContract: ", ERC20TokenContract);

  // // Grant the allowance target an allowance to spend our tokens.
  // const tx = await ERC20TokenContract.methods
  //   .approve(swapQuoteJSON.allowanceTarget, maxApproval)
  //   .send({ from: takerAddress })
  //   .then((tx) => {
  //     console.log("tx: ", tx);
  //   });



  // Perform the swap
  swapQuoteJSON.from = takerAddress;
  console.log("uploading quote", swapQuoteJSON);
  const receipt = await web3.eth.sendTransaction(swapQuoteJSON);
  console.log("receipt: ", receipt);
  alert("Transaction has been submitted succesfully");
}
function hexToDecimal(input) {
  if (typeof input !== 'string') {
    throw new TypeError('Input must be a string');
  }

  // Remove the "0x" prefix from the input string
  const hex = input.replace(/^0x/, '');

  // Parse the hexadecimal string as a number
  const decimal = parseInt(hex, 16);


  return decimal;
}

async function getBalances(token, dec) {
  //get active user
  let accounts = await ethereum.request({ method: "eth_accounts" });
  let userAddress = accounts[0];

  // Replace with your Alchemy api key:
  const apiKey = "mbS0o8Z7IcwnZxPFTgmONAUSxz6E-aws";

  const settings = {
    apiKey: apiKey, // Replace with your Alchemy API Key.
    network: Network.ARB_MAINNET, // Replace with your network.
  };
  const alchemy = new Alchemy(settings);

  // Print token balances of USDC in Vitalik's address
  let balances = alchemy.core
    .getTokenBalances(userAddress, [token])
    .then(console.log());
  let balanceOfToken = (await balances).tokenBalances[0];
  // console.log("this is balance", balanceOfToken);
  // console.log(hexToDecimal(balanceOfToken.tokenBalance))
  var decimal = hexToDecimal(balanceOfToken.tokenBalance)
  var decimal_alt = decimal / (10 ** dec)
  console.log(decimal_alt)
  var dec_alt = Math.round(decimal_alt * 100000) / 100000;
  if (!balanceSet){
    document.getElementById("tokenBal").innerHTML = decimal_alt ;
    balanceSet = true;
  }
}

function exchangeValues(){
  console.log('exchanging');
  var hold = currentTrade['from'];
  currentTrade["from"] = currentTrade["to"];
  currentTrade["to"] = hold;
  // console.log("exchanged values", currentTrade);
  renderInterface();
  var fromToken = currentTrade["from"]
  console.log(fromToken.address)
    setTimeout(() => {

  }, 1200)
  getBalances(fromToken.address, fromToken.decimals);
  getBalances();
  
}


const selectElement = document.getElementById("from_amount");
selectElement.addEventListener("input", refreshPrice);
function refreshPrice(event){
  var something = event.target.value;
  setTimeout(() => {

  }, 1200)
  getPrice();
}






// START APPLICATION AND GET TOKEN LIST
init();


document.getElementById("xchangeBtn").onclick = exchangeValues;
document.getElementById("login_button").onclick = connect;
document.getElementById("from_token_select").onclick = () => {
  openModal("from");
};
document.getElementById("to_token_select").onclick = () => {
  openModal("to");
};
document.getElementById("modal_close").onclick = closeModal;
document.getElementById("from_amount").onblur = getPrice;
document.getElementById("swap_button").onclick = trySwap;
document.getElementById("search_btn").onclick = searchTokens;
// document.getElementById("approve-stake").onclick = stake;
