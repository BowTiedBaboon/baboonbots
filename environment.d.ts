declare global {
  namespace NodeJS {
    interface ProcessEnv {
      WALLET_PASSWORD: string;
      MORALIS_API_KEY: string;
    }
  }
}
export {};