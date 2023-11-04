'use client'

import SubHeader from '@/components/SubHeader'
import JackPotTable from '@/components/JackPotTable'
import { useRouter, useParams } from 'next/navigation'
import { generateLottery, getPurchasedNumbers } from '@/services/fakeData'
import Generator from '@/components/Generator'

function Page() {
  const { jackpotId } = useParams()
  const lottery = generateLottery(jackpotId)
  const purchasedNumbers = getPurchasedNumbers(5)
  const lotteryNumbers = getPurchasedNumbers(5)
  return (
    <>
      <div className={'min-h-screen bg-slate-100'}>
        <SubHeader />
        <JackPotTable
          jackpot={lottery}
          luckyNumbers={lotteryNumbers}
          participants={purchasedNumbers}
        />
        <Generator />
      </div>
    </>
  )
}
export default Page
