const path = require('path');
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

//Get bytecode
const contractPath = path.resolve(__dirname, '../compiled/car.json');
const {interface, bytecode} = require(contractPath);

//Set provider
const web3 = new Web3(ganache.provider());

let accounts;
let contract;
const initialBrand = "AUDI";

describe('contract', () => {
  //每次跑单测时需要部署全新的合约实例，起到隔离的作用
  beforeEach(async() => {
    accounts = await web3.eth.getAccounts();
    console.log('The account of contract deployed --->', accounts[0]);

    contract = await new web3.eth.Contract(JSON.parse(interface))
                  .deploy({data: bytecode, arguments: [initialBrand]})
                  .send({from: accounts[0], gas: '1000000'});
    console.log('Deploy contract successed --->', contract.options.address);
  })

  //Unit tests
  it('Deploy a contract', () => {
    assert.ok(contract.options.address);
  })

  it('Has initial brand', async () => {
    const brand = await contract.methods.brand().call();
    assert.equal(brand, initialBrand);
  })

  it('Can change the brand', async() => {
    const newBrand = 'BMW';
    await contract.methods.setBrand(newBrand).send({from: accounts[0]});
    const brand = await contract.methods.brand().call();
    assert.equal(brand, newBrand);
  })
})