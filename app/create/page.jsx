'use client'

import { useState } from 'react'
import SubHeader from '../../components/SubHeader'

export default function Page() {
  //form data
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [prize, setPrize] = useState('')
  const [ticketPrice, setTicketPrice] = useState('')
  const [expiresAt, setExpiresAt] = useState('')

  const handleSubmit = async (e) => {
    //e.preventetDefault()
    if (!title || !description || !imageUrl || !prize || !ticketPrice || !expiresAt) return
    const params = {
      title,
      description,
      imageUrl,
      prize,
      ticketPrice,
      expiresAt: new Date(expiresAt).getTime(),
    }

    console.log(params)
    onReset()
    router.push('/')
  }
  const onReset = () => {
    setTitle('')
    setDescription('')
    setImageUrl('')
    setPrize('')
    setTicketPrice('')
    setExpiresAt('')
  }
  return (
    <>
      <div>
        <SubHeader></SubHeader>
        <div className={'flex flex-col justify-center items-center mt-20'}>
          <div className={'flex flex-col items-center justify-center my-5'}>
            <h1 className={'text-2xl font-bold text-slate-800 py-5'}>Create Jackpots</h1>
            <p className={'text-center text-sm text-slate-600'}>
              We bring a persolan and effective every project we work on
              <br />
              which is why our client love they keep coming back
            </p>
          </div>
          <form className={'w-full max-w-md'}>
            <div className={'mb-4'}>
              <input
                type='text'
                className={
                  ' appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none '
                }
                id='title'
                placeholder='Title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className={'mb-4'}>
              <input
                type='url'
                className={
                  ' appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none '
                }
                id='imageUrl'
                placeholder='Image URL'
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
              />
            </div>
            <div className={'mb-4'}>
              <input
                type='number'
                className={
                  ' appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none '
                }
                id='prize'
                placeholder='Prize'
                value={prize}
                step={0.01}
                min={0.01}
                onChange={(e) => setPrize(e.target.value)}
                required
              />
            </div>
            <div className={'mb-6'}>
              <input
                type='number'
                className={
                  ' appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none '
                }
                id='ticketPrice'
                placeholder='TicketPrice'
                value={ticketPrice}
                onChange={(e) => setTicketPrice(e.target.value)}
                step={0.01}
                min={0.01}
                required
              />
            </div>
            <div className={'mb-6'}>
              <input
                type='datetime-local'
                className={
                  ' appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none '
                }
                id='expiresAt'
                placeholder='ExpiredAt'
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                required
              />
            </div>
            <div className={'mb-4'}>
              <textarea
                className={
                  ' appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none '
                }
                id='description'
                placeholder='Description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className={'flex justify-center'}>
              <button
                className={
                  'w-full bg-[#0c2856] hover:bg-[#qa396c] text-white font-bold py-2 px-4 rounded focus:outline-none'
                }
                onClick={handleSubmit}
              >
                Submit Jackpot
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
