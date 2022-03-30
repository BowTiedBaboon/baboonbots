import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import 'dotenv/config'

export default {
  solidity: '0.8.0',
  networks: {
    avaxMain: {
      url: `https://speedy-nodes-nyc.moralis.io/${process.env.MORALIS_API_KEY}/avalanche/mainnet`,
      gasPrice: 225000000000,
      chainId: 43114,
      accounts: []
    }
  },
  typechain: {
    // externalArtifacts: ['externalArtifacts/*.json']
  }
}
