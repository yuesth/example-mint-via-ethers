import { ethers, AlchemyProvider } from 'ethers'
import { createContext, useContext, useEffect, useState } from 'react'
import { lipsumAbi } from './contract-abi'

const InitContext = createContext(null)

const InitProvider = ({ children }) => {
	const [provider, setProvider] = useState(null)
	const [signer, setSigner] = useState(null)
	const [account, setAccount] = useState(null)
	const [wallet, setWallet] = useState(null)
	const [contract, setContract] = useState()

	const connectEthereum = async (type = 'metamask') => {
		let provider
		let signer = null
		let wallet = null
		let contract = null

		if (typeof window !== 'undefined') {
			if (window.ethereum === null) {
				provider = new AlchemyProvider('goerli', process.env.ALCHEMY_TESTNET)
			} else {
				if (type === 'metamask') {
					provider = new ethers.BrowserProvider(window.ethereum)
					const acc = await provider.send('eth_requestAccounts', [])
					signer = await provider.getSigner(acc[0])
					wallet = new ethers.Wallet(process.env.METAMASK_PRIVATE_KEY, provider)
					contract = new ethers.Contract(
						//example contract for mint on top of goerli network
						'0x014BEA8233D47b958946eD470608f88ec968a5B3',
						lipsumAbi,
						signer
					)
					setAccount(wallet.address)
					setSigner(signer)
					setContract(contract)
					setWallet(wallet)
				} else {
					provider = new ethers.JsonRpcProvider('http://localhost:7545')
					wallet = new ethers.Wallet(process.env.GANACHE_PRIVATE_KEY, provider)
					contract = new ethers.Contract(
						//example contract for mint on top of ganache local network
						'0x245ceBe3B50071d5d615b0a6A509358c73E5Bf43',
						lipsumAbi,
						provider
					)
					setSigner(wallet)
					setWallet(wallet)
					setAccount(wallet.address)
					setContract(contract)
				}
			}
		}
		setProvider(provider)
	}

	const checkConnection = async () => {
		window.ethereum.request({ method: 'eth_accounts' }).then((accounts) => {
			if (accounts.length > 0) {
				setAccount(accounts[0])
				connectEthereum('metamask')
			}
		})
	}

	//should called only when using metamask as provider
	useEffect(() => {
		if (typeof window !== 'undefined') {
			window.ethereum.on('accountsChanged', (accounts) => {
				setAccount(accounts[0])
			})
		}
	})

	//if you want to instead using JSON RPC provider, this useEffect should be commented
	useEffect(() => {
		if (typeof window !== 'undefined') {
			checkConnection()
		}
	}, [])

	return (
		<InitContext.Provider
			value={{
				provider,
				signer,
				account,
				connectEthereum,
				contract,
				wallet,
			}}
		>
			{children}
		</InitContext.Provider>
	)
}

export default InitProvider

export const useInit = () => {
	const context = useContext(InitContext)
	return context
}
