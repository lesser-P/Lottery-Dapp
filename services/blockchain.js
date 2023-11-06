import { store } from '../store'
import { ethers } from 'ethers'
import { globalActions } from '../store/global_reducer'
import address from '../artifacts/contractAddress.json'
import abi from '../artifacts/contracts/DappLottery.sol/DappLottery.json'
import { format } from 'path'

const { setWallet } = globalActions
const contractAddress = address.address
const contractAbi = abi.abi
let tx, ethereum

if (typeof window !== 'undefined') {
  ethereum = window.ethereum
}

const toWei = (num) => ethers.parseEther(String(num))
const fromWei = (num) => ethers.formatEther(num)

const csrEthereumContract = async () => {
  const provider = new ethers.BrowserProvider(ethereum)
  const singer = provider.getSigner()
  const contract = new ethers.Contract(contractAddress, contractAbi, singer)
  return contract
}

const ssrEtherrumContract = async () => {
  const provider = new ethers.JsonRpcProvider('http://localhost:8545')
  const wallet = new ethers.Wallet(
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    provider
  )
  const singer = provider.getSigner(wallet.address)
  const contract = new ethers.Contract(contractAddress, contractAbi, wallet)
  return contract
}

const buyTicket = async (id, luckyNumberId, ticketPrice) => {
  try {
    if (!ethereum) return reportError('Please install Metamask')

    const connectedAccount = store.getState().globalStates.wallet
    const contract = await csrEthereumContract()
    tx = await contract.buyTicket(id, luckyNumberId, {
      from: connectedAccount,
      value: toWei(ticketPrice),
    })
    await tx.wait()
    const purchaseNumbers = await getPurchasedNumbers(id)
    const lotteryParticipants = await getParticipants(id)
    const lottery = await getLottery(id)
    store.dispatch(setPurchasedNumbers(purchaseNumbers))
    store.dispatch(setParticipants(lotteryParticipants))
    store.dispatch(setJackpot(lottery))
  } catch (error) {
    reportError(error)
  }
}
const getParticipants = async (id) => {
  const participants = await (await getEtheriumContract()).functions.getLotteryParticipants(id)
  return structuredParticipants(participants[0])
}
const createJackpot = async ({ title, description, imageUrl, prize, ticketPrice, expiresAt }) => {
  try {
    console.log('awqwe')
    if (!ethereum) return reportError('Please install Metamask')
    const wallet = store.getState().globalStates.wallet
    console.log(wallet)
    const contract = await csrEthereumContract()
    tx = await contract.createLottery(
      title,
      description,
      imageUrl,
      toWei(prize),
      toWei(ticketPrice),
      expiresAt,
      {
        from: wallet,
      }
    )
    tx.wait()
    console.log(tx)
  } catch (error) {
    reportError(error)
  }
}

const getLotteries = async () => {
  const contract = await ssrEtherrumContract()
  const lotteries = await contract.getLotteries()
  //   return structureLotteries(lotteries)
  return lotteries
}
const getLottery = async (lotteryId) => {
  const contract = await ssrEtherrumContract()
  const lottery = await contract.getLottery(lotteryId)
  return lottery
}

const connectWallet = async () => {
  try {
    if (!ethereum) return reportError('Please install Metamask')
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    store.dispatch(setWallet(accounts[0])) //触发修改
  } catch (error) {
    reportError(error)
  }
}

const reportError = (error) => {
  console.log(error)
}

const truncate = (text, startChars, endChars, maxLength) => {
  if (text.length > maxLength) {
    let start = text.substring(0, startChars)
    let end = text.substring(text.length - endChars, text.length)
    while (start.length + end.length < maxLength) {
      start = start + '.'
    }
    return start + end
  }
  return text
}
const exportLuckyNumbers = async (id, luckyNumbers) => {
  try {
    if (!ethereum) return reportError('Please install Metamask')
    const wallet = store.getState().globalStates.wallet
    const contract = await csrEthereumContract()

    tx = await contract.importLuckyNumbers(id, luckyNumbers, { from: wallet })
    tx.wait()
  } catch (error) {
    reportError(error)
  }
}

const structureLotteries = (lotteries) => {
  lotteries.map((lottery) => ({
    id: Number(lottery.id),
    title: lottery.title,
    description: lottery.description,
    owner: lottery.owner.toLowerCase(),
    prize: fromWei(lottery.prize),
    ticketPrice: fromWei(lottery.ticketPrice),
    image: lottery.image,
    createdAt: formatDate(Number(lottery.createdAt + '000')),
    drawsAt: formatDate(Number(lottery.expirestAt)),
    expiresAt: formatDate(Number(lottery.expiresAt)),
    participants: Number(lottery.participants),
    drawn: lottery.drawn,
  }))
}

const getPurchasedNumbers = async (id) => {
  const participants = await (await getEtheriumContract()).functions.getLotteryParticipants(id)
  return structuredNumbers(participants[0])
}

const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  const daysOfWeek = ['Sun', 'Mon', 'The', 'Wed', 'Thu', 'Fri', 'Sat']
  const monthsOfYear = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const dayOfWeek = daysOfWeek[date.getDay()]
  const monthOfYear = monthsOfYear[date.getMonth()]
  const dayOfMonth = date.getDate()
  const year = date.getFullYear()
  return `${dayOfWeek} ${monthOfYear} ${dayOfMonth},${year}`
}

const monitorWalletConnection = async () => {
  try {
    if (!ethereum) return reportError('Please install Metamask')
    const accounts = await ethereum.request('eth_accounts')

    //修改链就刷新
    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload()
    })
    window.ethereum.on('accountChanged', async () => {
      store.dispatch(setWallet(accounts[0]))
      await monitorWalletConnection()
    })

    if (accounts.length) {
      store.dispatch(setWallet(accounts[0]))
    } else {
      store.dispatch(setWallet(''))
      reportError('Please connect wallet,no accounts found')
    }
  } catch (error) {
    reportError(error)
  }
}

export {
  connectWallet,
  exportLuckyNumbers,
  truncate,
  monitorWalletConnection,
  getLotteries,
  getLottery,
  createJackpot,
  buyTicket,
}
