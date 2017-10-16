const definition = require('./build/ATT.def.json')
const definitionMini = require('./build/Factory.def.json')
const config = require('./config.json')
const Web3 = require('web3');

const {endpoint, account, cost} = config;

async function run() {
  const abi = definition.attAbiJson;
  const contractAddress = definition.address;

  const web3 = new Web3(new Web3.providers.HttpProvider(endpoint));
  web3.personal.unlockAccount(account.address, account.password);

  const attContract = web3.eth.contract(abi);
  const att = attContract.at(contractAddress);

  // web3.eth.getAccounts((err, acc) => {
  //   if(err)console.log(err)
  //   else {
  //     console.log("getAccounts: ", acc[0])
  //   }
  // })

  //得到调用某方法的gas: web3.eth.generateTokens.estimateGas()
  console.log(await att.generateTokens('0x3ae88fe370c39384fc16da2c9e768cf5d2495b48', 100, {from: '0x3ae88fe370c39384fc16da2c9e768cf5d2495b48', gas: 95655}))
  console.log("att.totalSupply: " + att.totalSupply());

}

run()