const path = require('path');
const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');

//Get bytecode
const contractPath = path.resolve(__dirname, '../compiled/car.json');
const { interface, bytecode } = require(contractPath);

//Set provider
const provider = new HDWalletProvider(
  'infant absorb gossip tornado winner safe surge economy patch vendor wasp turkey',
  'https://rinkeby.infura.io/BumjLQmtWeg67tPpvaZf'
)

//Init Web3 instance
const web3 = new Web3(provider);

(async () => {
  //Get the account in hdwallet
  const accounts = await web3.eth.getAccounts();
  console.log('The account of contract need to deploy', accounts[0]);

  //Creat and deploy Contract instance
  const result = await new web3.eth.Contract(JSON.parse(interface))
                  .deploy({ data: bytecode, arguments: ['BMW']})
                  .send({from: accounts[0], gas: '1000000'});
  console.log('The result of deploy', result);
})();
