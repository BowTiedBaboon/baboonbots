/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "UniswapFactory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.UniswapFactory__factory>;
    getContractFactory(
      name: "UniswapPair",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.UniswapPair__factory>;
    getContractFactory(
      name: "UniswapRouter",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.UniswapRouter__factory>;

    getContractAt(
      name: "UniswapFactory",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.UniswapFactory>;
    getContractAt(
      name: "UniswapPair",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.UniswapPair>;
    getContractAt(
      name: "UniswapRouter",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.UniswapRouter>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}
