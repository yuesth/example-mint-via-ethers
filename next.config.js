/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {
		ALCHEMY_TESTNET: process.env.ALCHEMY_TESTNET,
		PINATA_KEY: process.env.PINATA_KEY,
		PINATA_SECRET: process.env.PINATA_SECRET,
		GANACHE_PRIVATE_KEY: process.env.GANACHE_PRIVATE_KEY,
		METAMASK_PRIVATE_KEY: process.env.METAMASK_PRIVATE_KEY,
	},
}

module.exports = nextConfig
