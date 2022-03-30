import { ethers } from 'hardhat'
import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { avalancheTokens as tokens, avalancheRouters as routers, avalancheFactories as factories } from './addresses'
import { getUniswapRouterAmountsOut, getUniswapPairAndReserves } from './utils'
import 'dotenv/config'


async function main () {
  const jsonWallet = JSON.stringify(require('../.private/wallet.json'))
  const wallet = (await ethers.Wallet.fromEncryptedJson(jsonWallet, process.env.WALLET_PASSWORD)).connect(ethers.provider)
  
  // Get amounts out
  await getUniswapRouterAmountsOut(wallet.provider, routers.sushiSwap, parseUnits('1', 18), tokens.WAVAX, tokens.USDCe)
  await getUniswapRouterAmountsOut(wallet.provider, routers.traderJoe, parseUnits('1', 18), tokens.WAVAX, tokens.USDCe)

  // Get pool address
  await getUniswapPairAndReserves(wallet.provider, factories.sushiSwap, tokens.MIM, tokens.WAVAX)
  await getUniswapPairAndReserves(wallet.provider, factories.traderJoe, tokens.USDCe, tokens.USDTe)
  await getUniswapPairAndReserves(wallet.provider, factories.traderJoe, tokens.WETHe, tokens.USDTe)
  await getUniswapPairAndReserves(wallet.provider, factories.sushiSwap, tokens.wMEMO, tokens.MIM)
}

main()
  .then(() => console.log('DONE'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })