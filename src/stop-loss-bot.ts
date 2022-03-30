import { ethers } from 'hardhat'
import { tokens, routers, factories } from './addresses/ethereum'
import { getUniswapRouterAmountsOut, getTokensOutFromTokensIn } from './utils'
import 'dotenv/config'


async function main () {
  const jsonWallet = JSON.stringify(require('../.private/wallet.json'))
  const wallet = (await ethers.Wallet.fromEncryptedJson(jsonWallet, process.env.WALLET_PASSWORD)).connect(ethers.provider)

  const sellPrice = 3410.1
  setInterval(async () => {
    // Get the current exchange rate
    const { floatTokensOut } = await getTokensOutFromTokensIn(factories.sushiSwap, tokens.USDC, 0, tokens.WETH, 1, 0.3, wallet.provider)
    if (floatTokensOut <= sellPrice) {
      console.log('ETH/USD price of %s is less than trigger of %s → SELL', floatTokensOut, sellPrice)
    }
  }, 3000)

}

main()
  .then(() => console.log('DONE'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })