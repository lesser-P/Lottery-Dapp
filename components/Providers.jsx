'use client'
import { Provider } from 'react-redux'
import { store } from '../store'

//layout是服务器渲染的组件，Provider是需要客户端渲染的组件，所以要进行一层包装
export function Providers({ children }) {
  return <Provider store={store}>{children}</Provider>
}
