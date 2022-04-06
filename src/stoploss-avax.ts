import { ethers } from 'hardhat'
import { tokens, routers, factories } from './addresses/avalanche'
import { getUniswapRouterAmountsOut, getUniswapPoolReservesFromTokens, getTokensOutFromTokensIn, getUniswapPairAddressFromFactory, fixedBigNumber } from './utils'
import { ERC20Token__factory, UniswapPair__factory, UniswapRouter__factory } from '../typechain-types/'
import 'dotenv/config'
import { formatEther, formatUnits, parseEther, parseUnits } from 'ethers/lib/utils'


async function main () {
  // Connect wallet
  const jsonWallet = JSON.stringify(require('../.private/wallet.json'))
  const wallet = (await ethers.Wallet.fromEncryptedJson(jsonWallet, process.env.WALLET_PASSWORD)).connect(ethers.provider)
  
  // Print some stats
  console.log('Address:', wallet.address)
  console.log('AVAX Balance:', formatUnits(await wallet.getBalance(), 18))

  // Connect to contracts
  const traderJoeRouter = UniswapRouter__factory.connect(routers.traderJoe, wallet)
  const wavaxContract = ERC20Token__factory.connect(tokens.WAVAX.address, wallet)
  const wethContract = ERC20Token__factory.connect(tokens.WETHe.address, wallet)

  // Set allowances
  // await wavaxContract.approve(routers.traderJoe, parseUnits('99999999', 18))
  const wavaxAllowance = await wavaxContract.allowance(wallet.address, routers.traderJoe)
  console.log('WAVAX allowance:', formatUnits(wavaxAllowance, 18))
  
  // Get WAVAX balance
  let wavaxBalance = await wavaxContract.balanceOf(wallet.address)
  console.log('WAVAX Balance:', formatUnits(wavaxBalance, 18))

  // Calculate cost
  const cost = parseUnits('0.00273617', 18) // this will be an aggregate total from all transactions in MongoDB
  const stopLoss = cost.div(100).mul(80) // 80% value
  console.log('Cost', formatEther(cost), 'StopLoss', formatEther(stopLoss))
  let value
  let bnValue = parseUnits('0', 18)
  let sold = false
  


  setInterval(async () => {
    if (sold === true) return
    
    // Get and print the current exchange rate
    value = await getTokensOutFromTokensIn(factories.traderJoe, tokens.WETHe, 0, tokens.WAVAX, parseFloat(formatEther(wavaxBalance)), 0.3, wallet.provider)

    if (!value.bnTokensOut.eq(bnValue)) {
      bnValue = value.bnTokensOut
      console.log(`${Date.now()}: ${fixedBigNumber(wavaxBalance, 18, 2)} WAVAX → ${fixedBigNumber(value.bnTokensOut, 18, 10)} WETH`)
    }

    // process.stdout.clearLine(0)
    // process.stdout.cursorTo(0)
    // process.stdout.write()


    if (value.bnTokensOut.lt(stopLoss)) {
      console.log('sell sell sell')
      const deadline = Date.now() + (30 * 1000)
      let tx = await traderJoeRouter.swapExactTokensForTokens(
        wavaxBalance, stopLoss.div(100).mul(90), [tokens.WAVAX.address, tokens.WETHe.address], wallet.address, deadline
      )
      console.log('LIQUIDATED')
      sold = true
    }
  }, 30 * 1000)

}

main()
  .then(() => console.log('DONE'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })