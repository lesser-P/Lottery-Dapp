import { store } from '../store'
import { ethers } from 'ethers'
import { globalActions } from '../store/global_reducer'
import address from '../artifacts/contractAddress.json'
import abi from '../artifacts/contracts/DappLottery.sol/DappLottery.json'

const { setWallet } = globalActions
const contractAddress = address.address
const contractAbi = abi.abi
let tx, ethereum
