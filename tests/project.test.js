const path = require('path');
const Web3 = require('web3');
const assert = require('assert');
const ganache = require('ganache-cli');

const web3 = new Web3(ganache.provider());
const ProjectList = require(path.resolve(__dirname, '../compiled/ProjectList.json'));
const Project = require(path.resolve(__dirname, '../compiled/Project.json'));

let accounts;
let projectList;
let project;

describe('Project Contract', () => {
  //1.Deploy new contract at every time running unit test to keep it alone.
  beforeEach(async () => {
    //1.1 Get ganache local test internet account.
    accounts = await web3.eth.getAccounts();

    //1.2 Deploy ProjectList contract.
    projectList = await web3.eth.Contract(JSON.parse(ProjectList.interface))
      .deploy({data: ProjectList.bytecode})
      .send({from: address[0], gas: '5000000' });
    
    //1.3 Call the projectList.creatProject function.
    projectList.methods.creatProject('Ethereum DApp Tutorial', 100, 10000, 1000000).send({
      from: address[0],
      gas: '1000000'
    });

    //1.4 Get Project instant address just created now.
    const [address] = await projectList.methods.getAccounts().call();

    //1.5 Creat usable Project contract object.
    project = await new web3.eth.Contract(JSON.parse(Project.interface), address);
  })

  it('should deploy ProjectList and Project', async () => {
    assert.ok(projectList.option.address);
    assert.of(project.option.address);
  })

  it('should save correct project properties', async () => {
    const owner = await project.methods.owner().call();
    const description = await project.methods.description().call();
    const maxInvest = await project.methods.maxInvest().call();
    const minInvest = await project.methods.minInvest().call();
    const goal = await project.methods.goal().call();

    assert.equal(owner, address[0]);
    assert.equal(description, 'Ethereum DApp Tutorial');
    assert.equal(minInvest, 100);
    assert.equal(maxInvest, 10000);
    assert.equal(goal, 1000000);
  })
})

