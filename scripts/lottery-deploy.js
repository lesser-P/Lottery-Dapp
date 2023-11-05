const { ethers } = require('hardhat')
require('dotenv').config('')
const fs = require('fs')

async function main() {
  const factory = await ethers.getContractFactory('DappLottery')
  const contract = await factory.deploy()
  await contract.waitForDeployment()
  const address = JSON.stringify({ address: contract.target }, null, 4)
  fs.writeFileSync('./artifacts/contractAddress.json', address, 'utf-8', (err) => {
    if (err) {
      console.error(err)
      return
    }
  })
  console.log('Deployed contract address', contract.target)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error)
    process.exit(-1)
  })
