import Head from 'next/head'
import Image from 'next/image'
import Jackpots from '../components/Jackpots'
import Header from '../components/Header'
import { generateLotteries } from '../services/fakeData'
import { Providers } from '@/components/Providers'
import { getLotteries } from '@/services/blockchain'
import { da, faker } from '@faker-js/faker'
import { dataLength } from 'ethers'

export default async function Home() {
  const data = await getLotteries()
  return (
    <>
      <div>
        <Header />
        <Jackpots jackpots={data} />
      </div>
    </>
  )
}
