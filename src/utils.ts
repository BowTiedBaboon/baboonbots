import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { UniswapRouter__factory, UniswapPair__factory, UniswapFactory__factory } from '../typechain-types/'
import { Provider } from '@ethersproject/abstract-provider';

// Calls getAmountsOut() on a Uniswap Router contract
// @todo: change ti0support a path of address array
export const getUniswapRouterAmountsOut = async (contractAddress: string, amountIn: number, inToken: any, outToken: any, provider: Provider) => {
  const amountInBigNumber = parseUnits(amountIn.toString(), inToken.decimals)
  const UniswapRouter = UniswapRouter__factory.connect(contractAddress, provider)
  const amountsOut = await UniswapRouter.getAmountsOut(amountInBigNumber, [inToken.address, outToken.address])

  console.log(
    fixedBigNumber(amountsOut[0], inToken.decimals, 5), inToken.symbol, '→',
    fixedBigNumber(amountsOut[1], outToken.decimals, 5), outToken.symbol
  )

  return amountsOut[1]
}

// Gets the reserves of an LP contract
export const getUniswapPoolReserves = async (provider: Provider, contractAddress: string)
: Promise<[[string, BigNumber], [string, BigNumber], number]> => {
  const UniswapPair = UniswapPair__factory.connect(contractAddress, provider)
  
  // Return token addresses so we can validate they were passed in the correct order
  const token0 = await UniswapPair.token0()
  const token1 = await UniswapPair.token1()
  const response = await UniswapPair.getReserves()

  return [
    [token0, response._reserve0],
    [token1, response._reserve1],
    response._blockTimestampLast
  ]
}

// Looks up the LP contract and returns the reserves
export const getUniswapPoolReservesFromTokens = async (factoryAddress: string, token0: any, token1: any, provider: Provider)
: Promise<[[string, BigNumber], [string, BigNumber], number]> => {
  const liquidityPoolAddress = await getUniswapPairAddressFromFactory(provider, factoryAddress, token0.address, token1.address)
  const reserves = await getUniswapPoolReserves(provider, liquidityPoolAddress)

  // Valid that token0 and token1 are correct
  if (token0.address != reserves[0][0]) throw 'token0 is incorrect'
  if (token1.address != reserves[1][0]) throw 'token1 is incorrect'

  // Debug output
  // console.log('---------- getUniswapPoolReservesFromTokens() ---------')
  // console.log('LP Address:', liquidityPoolAddress)
  // console.log(token0.symbol, 'Reserves:', fixedBigNumber(reserves[0][1], token0.decimals, 5))
  // console.log(token1.symbol, 'Reserves:', fixedBigNumber(reserves[1][1], token0.decimals, 5))
  // console.log('-------------------------------------------------------')

  return reserves
}

// Looks up the LP contract address from a given pair of tokens
export const getUniswapPairAddressFromFactory = async (provider: Provider, factoryAddress: string, token0: string, token1: string): Promise<string> => {
  const UniswapFactory = UniswapFactory__factory.connect(factoryAddress, provider)
  return await UniswapFactory.getPair(token0, token1) 
}

// Use pool reserves to get tokens out from tokens in
// Decimals will be entered automatically
// @todo: Add documentation for arguments
export const getTokensOutFromTokensIn = async (factoryAddress: string, token0: any, token0In: number, token1: any, token1In: number, feePercent: number, provider: Provider ): Promise<{bnTokensOut: BigNumber, floatTokensOut: number}> => {
  // Validate arguments
  if (token0In == 0 && token1In == 0) throw 'One token must have an amount in value'
  if (token0In != 0 && token1In != 0) throw 'Only one token can have an amount in value'

  // Convert arguments to BigNumbers
  const token0InBigNumber = parseUnits(token0In.toString(), token0.decimals)
  const token1InBigNumber = parseUnits(token1In.toString(), token1.decimals)

  // Get the pool reserves
  const reserves = await getUniswapPoolReservesFromTokens(factoryAddress, token0, token1, provider)
  const token0Reserves = reserves[0][1]
  const token1Reserves = reserves[1][1]

  // Use the proper input token
  let tokensOut = parseUnits('0')
  let tokensOutFixed = ''
  if (token0In > 0) {
    tokensOut = calculateConstantProduct(token0InBigNumber, token0Reserves, token1Reserves, feePercent)
    console.log(token0In.toString(), token0.symbol, '→', fixedBigNumber(tokensOut, token1.decimals, 5), token1.symbol)
  }
  if (token1In > 0) {
    tokensOut = calculateConstantProduct(token1InBigNumber, token1Reserves, token0Reserves, feePercent)
    console.log(token1In.toString(), token1.symbol, '→', fixedBigNumber(tokensOut, token0.decimals, 5), token0.symbol)
  }

  return { bnTokensOut: tokensOut, floatTokensOut: parseFloat(fixedBigNumber(tokensOut, token0.decimals, 5)) }
}

// Constant product function
export const calculateConstantProduct = (tokenInAmount: BigNumber, tokenInReserves: BigNumber, tokenOutReserves: BigNumber, feePercent: number): BigNumber => {
  // Multiply fee percent for calculation below; works to 0.001% precision
  const percentPrecision = 100000
  feePercent *= 1000
  
  // Do maths
  const one = tokenOutReserves.mul(tokenInAmount.div(percentPrecision).mul(percentPrecision - feePercent))
  const two = tokenInReserves.add(tokenInAmount.div(percentPrecision).mul(percentPrecision - feePercent))
  return one.div(two)
}

// Convert a BigNumber to a float with set number of decimal places
export const fixedBigNumber = (input: BigNumber, decimals: number, fixed: number) => {
  return parseFloat(formatUnits(input, decimals)).toFixed(fixed)
}