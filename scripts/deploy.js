const path = require('path');
const Web3 = require('web3');
const fs = require('fs-extra');
const HDWalletProvider = require('truffle-hdwallet-provider');

//Get bytecode
// const contractPath = path.resolve(__dirname, '../compiled/car.json');
const contractPath = path.resolve(__dirname, '../compiled/ProjectList.json');
const { interface, bytecode } = require(contractPath);

//Set provider
const provider = new HDWalletProvider(
  'infant ...',
  'https://rinkeby.infura.io/BumjLQmtWeg67tPpvaZf'
)

//Init Web3 instance
const web3 = new Web3(provider);

(async () => {
  //Get the account in hdwallet
  const accounts = await web3.eth.getAccounts();
  console.log('合约部署账户：', accounts[0]);

  //Creat and deploy Contract instance
  console.time('合约部署耗时：');
  const result = await new web3.eth.Contract(JSON.parse(interface))
                  .deploy({ data: bytecode })
                  .send({from: accounts[0], gas: '5000000'});
  console.timeEnd('合约部署耗时：');

  const contractAddress = result.options.address;
  console.log('合约部署成功：', contractAddress);
  console.log('合约部署地址：', `https://rinkeby.etherscan.io/address/${contractAddress}`);

  //Write the contract address to systemfile.
  const addressFile = path.resolve(__dirname, '../address.json');
  fs.writeFileSync(addressFile, JSON.stringify(contractAddress));
  console.log('地址写入成功：', addressFile);
  
  process.exit();
})();
