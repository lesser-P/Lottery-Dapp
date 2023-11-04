'use client'

import { useState } from 'react'
import SubHeader from '@/components/SubHeader'
import ResultTable from '@/components/ResultTable'
import { useRouter, useParams } from 'next/navigation'
import {
  generateLottery,
  generateLotteryParticipants,
  getPurchasedNumbers,
} from '@/services/fakeData'

function Result() {
  const { resultId } = useParams()
  const lottery = generateLottery(resultId)
  const participantList = generateLotteryParticipants(6)
  const lotteryResult = []
  return (
    <>
      <div className={'min-h-screen bg-slate-100'}>
        <SubHeader />
        <ResultTable jackpot={lottery} participants={participantList} result={lotteryResult} />
      </div>
    </>
  )
}
export default Result
