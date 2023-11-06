'use client'

import { useState, useEffect } from 'react'
import { monitorWalletConnection } from '../services/blockchain'
function MonitorWallet() {
  const [close, setClose] = useState(false)
  useEffect(() => {
    setClose(true)
    monitorWalletConnection()
  }, [])
  return <></>
}
export default MonitorWallet
