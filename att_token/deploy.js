const fs = require('fs')
const solc = require('solc')
const Web3 = require('web3')

const config = require('./config.json')
const definitionFile = './build/ATT.def.json'
const definitionFactoryFile = './build/Factory.def.json'

const sources = {
  'ERC20Token.sol': fs.readFileSync('./contracts/ERC20Token.sol', 'utf8'),
  'MiniMeToken.sol': fs.readFileSync('./contracts/MiniMeToken.sol', 'utf8'),
  'ATT.sol': fs.readFileSync('./contracts/ATT.sol', 'utf8')
}

const {
  contracts
} = solc.compile({ sources }, 1)

attContract = contracts['ATT.sol:ATT']
// miniContract = contracts['MiniMeToken.sol:MiniMeTokenFactory']

const attBin = attContract.bytecode
const attAbi = attContract.interface

// const miniBin = miniContract.bytecode
// const miniAbi = miniContract.interface


// console.log(attBin)
// console.log(miniAbi)

const {
  endpoint,
  account,
  cost
} = config

const provider = new Web3
  .providers
  .HttpProvider(endpoint)
const web3 = new Web3(provider)

const options = {
  data: '0x' + attBin,
  from: account.address,
  gas: cost.gas || 4700000,
}

// const optionsMini= {
//   data: '0x' + miniBin,
//   from: account.address,
//   gas: cost.gas || 4700000,
// }


web3
  .personal
  .unlockAccount(account.address, account.password)

const attAbiJson = JSON.parse(attAbi)
// const miniAbiJson = JSON.parse(miniAbi)

const contract = web3
  .eth
  .contract(attAbiJson)
  .new(options, (err, res) => {
    const address = res.address
    if (address) {
      const definition = {
        address,
        attAbiJson,
        attBin,
      }
      fs.writeFileSync(definitionFile, JSON.stringify(definition))
      console.log(`Deploy contract [ATT] done!`)
      console.log(`Contract bstraction saved to './build/ATT.def.json'`)
    }
  })

  // const contractMini = web3
  // .eth
  // .contract(miniAbiJson)
  // .new(optionsMini, (err, res) => {
  //   const address = res.address
  //   if (address) {
  //     const definition = {
  //       address,
  //       miniAbiJson,
  //       miniBin,
  //     }
  //     fs.writeFileSync(definitionFactoryFile, JSON.stringify(definition))
  //     console.log(`Deploy contract [factory] done!`)
  //     console.log(`Contract bstraction saved to './build/Factory.def.json'`)
  //   }
  // })