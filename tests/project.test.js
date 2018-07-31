const path = require('path');
const Web3 = require('web3');
const assert = require('assert');
const ganache = require('ganache-cli');
const BigNumber = require('bignumber.js');

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
    projectList = await new web3.eth.Contract(JSON.parse(ProjectList.interface))
      .deploy({data: ProjectList.bytecode})
      .send({from: accounts[0], gas: '5000000' });
    
    //1.3 Call the projectList.creatProject function.
    await projectList.methods.createProject('Ethereum DApp Tutorial', 100, 10000, 1000000).send({
      from: accounts[0],
      gas: '1000000'
    });

    //1.4 Get Project instant address just created now.
    const [address] = await projectList.methods.getProjects().call();
    console.log('[address]: ', address)
    //1.5 Creat usable Project contract object.
    project = await new web3.eth.Contract(JSON.parse(Project.interface), address);
  })

  it('should deploy ProjectList and Project', async () => {
    console.log('projectList.options: ', projectList.options.address)
    console.log('project.options: ', project.options.address)
    assert.ok(projectList.options.address);
    assert.ok(project.options.address);
  })

  it('should save correct project properties', async () => {
    const owner = await project.methods.owner().call();
    const description = await project.methods.description().call();
    const maxInvest = await project.methods.maxInvest().call();
    const minInvest = await project.methods.minInvest().call();
    const goal = await project.methods.goal().call();

    assert.equal(owner, accounts[0]);
    assert.equal(description, 'Ethereum DApp Tutorial');
    assert.equal(minInvest, 100);
    assert.equal(maxInvest, 10000);
    assert.equal(goal, 1000000);
  })

  it('should allow investor to contribute', async () => {
    const investor = accounts[1];
    await project.methods.contribute().send({
      from: investor,
      value: '200'
    })
    const amount = await project.methods.investors(investor).call();
    assert.ok(amount === '200');
  })

  it('should request minInvest', async () => {
    try {
      const investor = accounts[1];
      await project.methods.contribute().send({
        from: investor,
        value: '10'
      })
      assert.ok(false);
    } catch (error) {
      assert.ok(error);
    }
  })

  it('should request maxInvest', async () => {
    try {
      const investor = accounts[1];
      await project.methods.contribute().send({
        from: investor,
        value: '100000'
      })
      assert.ok(false)
    } catch (error) {
      assert.ok(error)
    }
  })

  it('allows investor to approve payments', async () => {
    //项目方，投资方，收款方
    const owner = accounts[0];
    const investor = accounts[1];
    const receiver = accounts[2];

    //收款前的余额
    const oldBalance = new BigNumber(await web3.eth.getBalance(receiver));

    //投资项目
    await project.methods.contribute().send({
      from: investor,
      value: '5000'
    })

    //项目支出请求
    await project.methods.createPayment('Rent Office', '2000', receiver).send({
      from: owner,
      gsa: '1000000'
    })

    //投票
    await project.methods.approvePayment(0).send({
      from: investor,
      gsa: '1000000'
    })

    //资金划转
    await project.methods.doPayment(0).send({
      from: owner,
      gsa: '1000000'
    })

    const payment = await project.methods.payment(0).call();
    assert.equal(payment.completed, true);
    assert.equal(payment.voterCount, 1);

    const newBalance = new BigNumber(await web3.eth.getBalance(receiver));
    const balanceDiff = newBalance.minus(oldBalance);
    console.log(newBalance, oldBalance, balanceDiff);

    assert.equal(balanceDiff, '2000')
  })
})
