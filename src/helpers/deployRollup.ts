/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BigNumber, ethers } from "ethers";
import { abi } from "./abi";
import dotenv from "dotenv";
import { createValidatorsAndBatcher } from "./createWallet";
// import { dockerComposeUp } from "./dockerSetup";
import { type ConnectedWallet } from "@privy-io/react-auth";
import { maxDataSize } from "./config";

dotenv.config();

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

type interactWithContractParams = {
  numValidators?: number;
  tokenAddressToBeNativeToken?: `0x${string}`;
  chainId: number;
  chainName: string;
  wallet: ConnectedWallet;
};

export async function deployRollup({
  wallet,
  numValidators = 1,
  tokenAddressToBeNativeToken = "0x0000000000000000000000000000000000000000",
  chainId,
  chainName,
}: interactWithContractParams) {
  if (!window.ethereum) {
    console.error(
      "No ethereum object available, connect wallet or check provider",
    );
    return;
  }

  try {
    const { validators, batcher } = createValidatorsAndBatcher(numValidators);
    // const batcherPrivateKey = batcher.privateKey;
    // const validatorPrivateKey = validators[0]?.privateKey;
    // const signer = provider.getSigner();

    const provider = await wallet.getEthersProvider();
    const signer = provider.getSigner();
    const contractAddress = "0x06E341073b2749e0Bb9912461351f716DeCDa9b0";
    const rollUpContractCreator = new ethers.Contract(
      contractAddress,
      abi,
      signer,
    );
    const walletCreator = await signer.getAddress();
    // const deployParams = {
    //   rollupConfig: {
    //     confirmPeriodBlocks: BigNumber.from(150),
    //     extraChallengeTimeBlocks: BigNumber.from(0),
    //     stakeToken: ethers.constants.AddressZero,
    //     baseStake: ethers.utils.parseEther("1"),
    //     wasmModuleRoot:
    //       "0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17",
    //     owner: walletCreator,
    //     loserStakeEscrow: ethers.constants.AddressZero,
    //     chainId: BigNumber.from(chainId),
    //     chainConfig: {
    //       chainId: chainId,
    //       homesteadBlock: 0,
    //       daoForkBlock: null,
    //       daoForkSupport: true,
    //       eip150Block: 0,
    //       eip150Hash:
    //         "0x0000000000000000000000000000000000000000000000000000000000000000",
    //       eip155Block: 0,
    //       eip158Block: 0,
    //       byzantiumBlock: 0,
    //       constantinopleBlock: 0,
    //       petersburgBlock: 0,
    //       istanbulBlock: 0,
    //       muirGlacierBlock: 0,
    //       berlinBlock: 0,
    //       londonBlock: 0,
    //       clique: { period: 0, epoch: 0 },
    //       arbitrum: {
    //         EnableArbOS: true,
    //         AllowDebugPrecompiles: false,
    //         DataAvailabilityCommittee: false,
    //         InitialArbOSVersion: 11,
    //         InitialChainOwner: walletCreator,
    //         GenesisBlockNum: 0,
    //       },
    //     },
    //     genesisBlockNum: 0,
    //     sequencerInboxMaxTimeVariation: {
    //       delayBlocks: BigNumber.from("5760"),
    //       futureBlocks: BigNumber.from("48"),
    //       delaySeconds: BigNumber.from("86400"),
    //       futureSeconds: BigNumber.from("3600"),
    //     },
    //   },
    //   // rollupConfig: [
    //   //   BigNumber.from(150),
    //   //   BigNumber.from(0),
    //   //   ethers.constants.AddressZero,
    //   //   ethers.utils.parseEther("1"),

    //   //   "0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17",
    //   //   walletCreator,
    //   //   ethers.constants.AddressZero,
    //   //   BigNumber.from(chainId),
    //   //   {
    //   //     chainId: chainId,
    //   //     homesteadBlock: 0,
    //   //     daoForkBlock: null,
    //   //     daoForkSupport: true,
    //   //     eip150Block: 0,
    //   //     eip150Hash:
    //   //       "0x0000000000000000000000000000000000000000000000000000000000000000",
    //   //     eip155Block: 0,
    //   //     eip158Block: 0,
    //   //     byzantiumBlock: 0,
    //   //     constantinopleBlock: 0,
    //   //     petersburgBlock: 0,
    //   //     istanbulBlock: 0,
    //   //     muirGlacierBlock: 0,
    //   //     berlinBlock: 0,
    //   //     londonBlock: 0,
    //   //     clique: { period: 0, epoch: 0 },
    //   //     arbitrum: {
    //   //       EnableArbOS: true,
    //   //       AllowDebugPrecompiles: false,
    //   //       DataAvailabilityCommittee: false,
    //   //       InitialArbOSVersion: 11,
    //   //       InitialChainOwner: walletCreator,
    //   //       GenesisBlockNum: 0,
    //   //     },
    //   //   },
    //   //   0,
    //   //   {
    //   //     delayBlocks: BigNumber.from("5760"),
    //   //     futureBlocks: BigNumber.from("48"),
    //   //     delaySeconds: BigNumber.from("86400"),
    //   //     futureSeconds: BigNumber.from("3600"),
    //   //   },
    //   // ],
    //   batchPoster: batcher.address,
    //   validators: validators.map((v) => v.address),
    //   maxDataSize: 104857,
    //   nativeToken: tokenAddressToBeNativeToken,
    //   deployFactoriesToL2: true,
    //   maxFeePerGasForRetryables: 1000000000,
    // };

    // const deployParams = {
    //   config: config.rollupConfig,
    //   batchPoster: config.batchPoster,
    //   validators: config.validators,
    //   maxDataSize: 104857,
    //   nativeToken: tokenAddressToBeNativeToken,
    //   deployFactoriesToL2: true,
    //   maxFeePerGasForRetryables: 1000000000,
    // };

    // const deployParams = getConfigParams(
    //   walletCreator,
    //   chainId,
    //   validators,
    //   batcher.address,
    // );

    const config = {
      rollupConfig: {
        confirmPeriodBlocks: ethers.BigNumber.from("45818"),
        extraChallengeTimeBlocks: ethers.BigNumber.from("200"),
        stakeToken: ethers.constants.AddressZero,
        baseStake: ethers.utils.parseEther("1"),
        wasmModuleRoot:
          "0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21",
        owner: walletCreator,
        loserStakeEscrow: ethers.constants.AddressZero,
        chainId: ethers.BigNumber.from(chainId),
        chainConfig: `{"chainId":${chainId},"homesteadBlock":0,"daoForkBlock":null,"daoForkSupport":true,"eip150Block":0,"eip150Hash":"0x0000000000000000000000000000000000000000000000000000000000000000","eip155Block":0,"eip158Block":0,"byzantiumBlock":0,"constantinopleBlock":0,"petersburgBlock":0,"istanbulBlock":0,"muirGlacierBlock":0,"berlinBlock":0,"londonBlock":0,"clique":{"period":0,"epoch":0},"arbitrum":{"EnableArbOS":true,"AllowDebugPrecompiles":false,"DataAvailabilityCommittee":false,"InitialArbOSVersion":10,"InitialChainOwner":${walletCreator},"GenesisBlockNum":0}}`,
        genesisBlockNum: ethers.BigNumber.from("0"),
        sequencerInboxMaxTimeVariation: {
          delayBlocks: ethers.BigNumber.from("5760"),
          futureBlocks: ethers.BigNumber.from("12"),
          delaySeconds: ethers.BigNumber.from("86400"),
          futureSeconds: ethers.BigNumber.from("3600"),
        },
      },
      validators: validators.map((v) => v.address),
      batchPoster: batcher.address,
    };

    const deployParams = {
      config: config.rollupConfig,
      batchPoster: config.batchPoster,
      validators: config.validators,
      maxDataSize: 104857,
      nativeToken: tokenAddressToBeNativeToken,
      deployFactoriesToL2: true,
      maxFeePerGasForRetryables: 1000000000,
    };

    const transactionResponse = await rollUpContractCreator.createRollup(
      deployParams,
      { value: ethers.utils.parseEther("0.13") },
    );
    console.log("Transaction successful:", transactionResponse);

    // Si la transacción de createRollup es exitosa, llama a la función dockerComposeUp
    if (transactionResponse) {
      const response = await fetch(`${baseUrl}/api/generate-json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batcher,
          chainId,
          chainName,
          validators,
        }),
      });
      const resData = await response.json();
      console.log("generate json resData", resData);
      console.log("transactionResponse >>>>>>>", transactionResponse);
      return transactionResponse;
      // dockerComposeUp();
    }
  } catch (error) {
    console.error("Error interacting with contract:", error);
  }
}

// interactWithContract(1, tokenAddressToBeNativeToken, chainId, chainName);
