import axios from 'axios'

export const pinFileToIPFS = async (JSONBody) => {
	const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`

	return axios
		.post(url, JSONBody, {
			headers: {
				pinata_api_key: process.env.PINATA_KEY,
				pinata_secret_api_key: process.env.PINATA_SECRET,
				'Content-Type': 'multipart/form-data',
			},
		})
		.then(function (response) {
			return {
				success: true,
				pinataUrl: response.data.IpfsHash,
			}
		})
		.catch(function (error) {
			console.log(error)
			return {
				success: false,
				message: error.message,
			}
		})
}
