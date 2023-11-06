import Head from 'next/head'
import Image from 'next/image'
import Jackpots from '../components/Jackpots'
import Header from '../components/Header'
import { generateLotteries } from '../services/fakeData'
import { Provider } from 'react-redux'
import { store } from '@/store'

export default function Home() {
  return (
    <>
      <div>
        <Header />
        <Jackpots jackpots={generateLotteries(10)} />
      </div>
    </>
  )
}
