import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { UniswapRouter__factory, UniswapPair__factory, UniswapFactory__factory } from '../typechain-types/'
import { Provider } from '@ethersproject/abstract-provider';

// -------------------------------------
export const getUniswapRouterAmountsOut = async (provider: Provider, contractAddress: string, amountIn: BigNumber, inToken: any, outToken: any) => {
  const UniswapRouter = UniswapRouter__factory.connect(contractAddress, provider)
  const amountsOut = await UniswapRouter.getAmountsOut(amountIn, [inToken.address, outToken.address])

  console.log(
    formatUnits(amountsOut[0], inToken.decimals), inToken.symbol, '→',
    formatUnits(amountsOut[1], outToken.decimals), outToken.symbol
  )

  return amountsOut[1]
}

// -------------------------------------
export const getUniswapPairReserves = async (provider: Provider, contractAddress: string): Promise<Array<BigNumber>> => {
  const UniswapPair = UniswapPair__factory.connect(contractAddress, provider)
  const token0 = await UniswapPair.token0()
  const token1 = await UniswapPair.token1()
  const reserves = await UniswapPair.getReserves()
  return [reserves[0], reserves[1]]
}

export const getUniswapPairAndReserves = async (provider: Provider, factoryAddress: string, token0: any, token1: any) => {
  const pairAddress = await getUniswapPairAddressFromFactory(provider, factoryAddress, token0.address, token1.address)
  console.log('-----------------------')
  console.log("Pair Address:", pairAddress)

  const reserves = await getUniswapPairReserves(provider, pairAddress)
  console.log(token0.symbol, 'Reserves:', formatUnits(reserves[0], token0.decimals))
  console.log(token1.symbol, 'Reserves:', formatUnits(reserves[1], token1.decimals))
}

export const getUniswapPairAddressFromFactory = async (provider: Provider, factoryAddress: string, token0: string, token1: string): Promise<string> => {
  const UniswapFactory = UniswapFactory__factory.connect(factoryAddress, provider)
  return await UniswapFactory.getPair(token0, token1) 
}