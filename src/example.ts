import { ethers } from 'hardhat'
import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { tokens, routers, factories } from './addresses/avalanche'
import { getUniswapRouterAmountsOut, getUniswapPoolReservesFromTokens, getTokensOutFromTokensIn } from './utils'
import 'dotenv/config'


async function main () {
  const jsonWallet = JSON.stringify(require('../.private/wallet.json'))
  const wallet = (await ethers.Wallet.fromEncryptedJson(jsonWallet, process.env.WALLET_PASSWORD)).connect(ethers.provider)
  
  await getTokensOutFromTokensIn(factories.sushiSwap, tokens.MIM, 100, tokens.WAVAX, 0, 0.3, wallet.provider)
  await getUniswapRouterAmountsOut(routers.sushiSwap, 100, tokens.MIM, tokens.WAVAX, wallet.provider)

  // await getTokensOutFromTokensIn(factories.sushiSwap, tokens.MIM, 0, tokens.WAVAX, 1, 0.3, wallet.provider)
  // await getUniswapRouterAmountsOut(routers.sushiSwap, 1, tokens.WAVAX, tokens.MIM, wallet.provider)

  // Get amounts out
  // await getUniswapRouterAmountsOut(wallet.provider, routers.sushiSwap, parseUnits('1', 18), tokens.WAVAX, tokens.USDCe)
  // await getUniswapRouterAmountsOut(wallet.provider, routers.traderJoe, parseUnits('1', 18), tokens.WAVAX, tokens.USDCe)

  // Get pool address
  // await getUniswapPairReservesFromTokens(factories.sushiSwap, tokens.MIM, tokens.WAVAX, wallet.provider)
  // await getUniswapPairReservesFromTokens(factories.traderJoe, tokens.USDCe, tokens.USDTe, wallet.provider)
  // await getUniswapPairReservesFromTokens(factories.traderJoe, tokens.WETHe, tokens.USDTe, wallet.provider)
  // await getUniswapPairReservesFromTokens(factories.sushiSwap, tokens.wMEMO, tokens.MIM, wallet.provider)
}

main()
  .then(() => console.log('DONE'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })