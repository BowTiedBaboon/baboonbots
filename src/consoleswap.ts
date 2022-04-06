import { ethers } from 'hardhat'
import { tokens, routers, factories } from './addresses/ethereum'
import { getUniswapRouterAmountsOut, getUniswapPoolReservesFromTokens, getTokensOutFromTokensIn, getUniswapPairAddressFromFactory } from './utils'
import { ERC20Token__factory, UniswapPair__factory, UniswapRouter__factory } from '../typechain-types/'
import 'dotenv/config'
import { formatEther, formatUnits, parseEther, parseUnits } from 'ethers/lib/utils'


async function main () {
  // Connect wallet
  // const jsonWallet = JSON.stringify(require('../.private/wallet.json'))
  // const wallet = (await ethers.Wallet.fromEncryptedJson(jsonWallet, process.env.WALLET_PASSWORD)).connect(ethers.provider)
  const wallet = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', ethers.provider)
  
  // Print some stats
  console.log('Address:', wallet.address)
  console.log('ETH Balance:', formatUnits(await wallet.getBalance(), 18))

  // Connect to contracts
  const sushiSwapRouter = UniswapRouter__factory.connect(routers.sushiSwap, wallet)
  const usdcContract = ERC20Token__factory.connect(tokens.USDC.address, wallet)
  const wethContract = ERC20Token__factory.connect(tokens.WETH.address, wallet)
  const jpegContract = ERC20Token__factory.connect(tokens.JPEG.address, wallet)

  // Set allowances
  await usdcContract.approve(routers.sushiSwap, parseUnits('99999999', 6))
  await jpegContract.approve(routers.sushiSwap, parseUnits('99999999', 18))
  await wethContract.approve(routers.sushiSwap, parseUnits('99999999', 18))

  // // Convert ETH to WETH
  // await wethContract.deposit({ value: parseUnits('1', 18)})

  // // Swap ETH for JPEG
  // const deadline = Date.now() + (30 * 1000)
  // let tx = await sushiSwapRouter.swapExactETHForTokens(
  //   parseUnits('500000', 18), [tokens.WETH.address, tokens.JPEG.address], wallet.address, deadline,
  //   { value: parseUnits('1', 18)}
  // )

  // Calculate cost
  

  
  // Output ending balances
  // Get new ETH balance
  let ethBalance = await wallet.getBalance()
  console.log('ETH Balance:', formatUnits(ethBalance, 18))

  // Get WETH balance
  let wethBalance = await wethContract.balanceOf(wallet.address)
  console.log('WETH Balance:', formatUnits(wethBalance, 18))

  // // Get USDC balance
  // let usdcBalance = await usdcContract.balanceOf(wallet.address)
  // console.log('USDC Balance:', formatUnits(usdcBalance, 6))

  // Get JPEG balance
  let jpegBalance = await jpegContract.balanceOf(wallet.address)
  console.log('JPEG Balance:', formatUnits(jpegBalance, 18))

  // Calculate cost
  const cost = parseUnits('1', 18)
  const stopLoss = cost.div(1000).mul(995) // 80% value
  console.log('Cost', formatEther(cost), 'StopLoss', formatEther(stopLoss))
  const value = await getTokensOutFromTokensIn(factories.sushiSwap, tokens.WETH, 0, tokens.JPEG, parseFloat(formatUnits(jpegBalance, 18)), 0.3, wallet.provider)
  

  // Execute stop loss
  if (value.bnTokensOut.lt(stopLoss)) {
    console.log('sell sell sell')
    const deadline = Date.now() + (30 * 1000)
    let tx = await sushiSwapRouter.swapExactTokensForTokens(
      jpegBalance, stopLoss.div(100).mul(99), [tokens.JPEG.address, tokens.WETH.address], wallet.address, deadline
    )
  }

    // Get WETH balance
    wethBalance = await wethContract.balanceOf(wallet.address)
    console.log('WETH Balance:', formatUnits(wethBalance, 18))

    // Get JPEG balance
    jpegBalance = await jpegContract.balanceOf(wallet.address)
    console.log('JPEG Balance:', formatUnits(jpegBalance, 18))

 
  
  // // Swap USDC for WETH
  // const deadline = Date.now() + (30 * 1000)
  // let tx = await sushiSwapRouter.swapExactTokensForTokens(
  //   parseUnits('4000', 6), parseUnits('1', 18), [tokens.USDC.address, tokens.WETH.address], wallet.address, deadline
  // )

  // // Swap WETH for JPEG
  // const deadline = Date.now() + (30 * 1000)
  // let tx = await sushiSwapRouter.swapExactTokensForTokens(
  //   parseUnits('1', 18), parseUnits('5000', 18), [tokens.WETH.address, tokens.JPEG.address], wallet.address, deadline
  // )

  // // Swap JPEG for WETH
  // const deadline = Date.now() + (30 * 1000)
  // let tx = await sushiSwapRouter.swapExactTokensForTokens(
  //   parseUnits('552549', 18), parseUnits('0.9', 18), [tokens.JPEG.address, tokens.WETH.address], wallet.address, deadline
  // )

  // // Get new balance
  // console.log('ETH Balance:', formatUnits(await wallet.getBalance(), 18))

  // // // Check that contract exists on blockchain
  // // console.log(tokens.WETH.address)
  // // console.log(await wallet.provider.getCode(tokens.WETH.address))

  // // Get WETH balance
  // let wethBalance = await wethContract.balanceOf(wallet.address)
  // console.log('WETH Balance:', formatUnits(wethBalance, 18))

  // // Get USDC balance
  // let usdcBalance = await usdcContract.balanceOf(wallet.address)
  // console.log('USDC Balance:', formatUnits(usdcBalance, 6))

  // // Get JPEG balance
  // let jpegBalance = await jpegContract.balanceOf(wallet.address)
  // console.log('JPEG Balance:', formatUnits(jpegBalance, 18))


  /*

  // Get pair address
  const pairAddress = await getUniswapPairAddressFromFactory(wallet.provider, factories.traderJoe, tokenIn.address, tokenOut.address)
  console.log(pairAddress)

  // Get exchange rate
  await getTokensOutFromTokensIn(factories.traderJoe, tokens.WETHe, 0.002, tokens.WAVAX, 0, 0.3, wallet.provider)

  // Perform swap
  const pairContract = UniswapPair__factory.connect(pairAddress, wallet)
  //const tx = pairContract.swap()

  /*

  // Connect to the WETH contract and get our balance
  const WETH = ERC20Token__factory.connect(tokens.WETH.address, wallet)
  const wethBalance = await WETH.balanceOf(wallet.address)
  console.log('WETH balance:', formatUnits(wethBalance, 18))

  // Check our WETH allowance
  const wethAllowance = await WETH.allowance(wallet.address, routers.sushiSwap)
  console.log('WETH allowance:', formatUnits(wethAllowance, 18))

  // const tx = await WETH.transfer(ledgerAddress, parseUnits('0.001', 18), {'from': wallet.address})

  // Set allowance
  const tx = await WETH.approve(routers.sushiSwap, parseUnits('10', 18), {'from': wallet.address, maxPriorityFeePerGas: 1600000000, maxFeePerGas: 1600000244})
  console.log(tx)

  // Get the transaction 
  // console.log(await provider.getTransaction(tx.hash))
  */
}

main()
  .then(() => console.log('DONE'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })