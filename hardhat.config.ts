import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import 'dotenv/config'

export default {
  solidity: '0.8.0',
  networks: {
    ethMain: {
      url: `https://speedy-nodes-nyc.moralis.io/${process.env.MORALIS_API_KEY}/eth/mainnet`,
      chainId: 1,
      accounts: []
    },
    polygonMain: {
      url: `https://speedy-nodes-nyc.moralis.io/${process.env.MORALIS_API_KEY}/polygon/mainnet`,
      chainId: 137,
      accounts: []
    },
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
