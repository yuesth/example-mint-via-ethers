import '@/styles/globals.css'
import InitProvider from '@/utils/initProvider'

export default function App({ Component, pageProps }) {
  return(
    <>
    <InitProvider>
      <Component {...pageProps} />
    </InitProvider>
    </>
  )
}
