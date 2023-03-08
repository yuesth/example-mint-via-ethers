import { Inter } from '@next/font/google'
import { useState } from 'react'
import { useInit } from '@/utils/initProvider'
import { pinFileToIPFS } from '@/utils/uploadIpfs'
import { ethers } from 'ethers'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
	const [media, setMedia] = useState(null)
	const [mediaFile, setMediaFile] = useState(null)
	const [minting, setMinting] = useState(false)

	const { connectEthereum, account, contract, wallet, signer } = useInit()

	const onUpload = async (e) => {
		const res = URL.createObjectURL(e.target.files[0])
		setMedia([res])
		setMediaFile(e.target.files[0])
	}

	return (
		<div className="w-screen h-screen bg-black flex flex-col justify-center items-center">
			{media ? (
				<img
					src={media}
					className="object-cover mx-auto w-96 aspect-square mb-10"
					alt=""
				/>
			) : (
				<div className="w-96 aspect-square bg-gray-400 rounded-xl mb-10"></div>
			)}
			<label
				htmlFor="upload"
				className="rounded-full w-40 h-10 bg-white relative mb-10 text-black flex items-center justify-center cursor-pointer"
			>
				<p>Upload</p>
				<input
					type="file"
					className="opacity-0 inset-0 absolute"
					onChange={(e) => onUpload(e)}
				/>
			</label>
			{account ? (
				<p className="text-white mb-10">Connected as {account}</p>
			) : (
				<button
					className="max-w-sm p-2 rounded-full bg-white text-black mb-10"
					onClick={async () => {
						connectEthereum('metamask')
					}}
				>
					Connect wallet
				</button>
			)}
			<button
				className="max-w-sm p-2 rounded-full bg-white text-black px-10 mb-10"
				onClick={async () => {
					setMinting(true)
					let resHash
					if (mediaFile) {
						try {
							const formData = new FormData()
							formData.append('file', mediaFile)
							resHash = await pinFileToIPFS(formData)
						} catch (error) {
							console.log(error)
							setMinting(false)
						}
					}
					try {
						console.log(wallet, signer, contract)
						const isActive = await contract.publicSaleActive()
						console.log('is public sale active? ', isActive)

						const mint = await contract.mint('1', {
							gasLimit: 200000,
							value: ethers.parseEther('0.08'),
						})

						const tokenURI = await contract.tokenURI('1')
						console.log({ mint, tokenUri: tokenURI })
					} catch (error) {
						console.log('error when minting', error)
						setMinting(false)
					}
				}}
			>
				{minting ? `Loading...` : `MINT`}
			</button>
		</div>
	)
}
