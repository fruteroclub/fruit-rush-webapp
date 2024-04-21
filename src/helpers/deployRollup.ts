/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BigNumber, ethers } from "ethers";
import { abi } from "./abi";
import dotenv from "dotenv";
import { createValidatorsAndBatcher } from "./createWallet";
// import { dockerComposeUp } from "./dockerSetup";
import { type ConnectedWallet } from "@privy-io/react-auth";
import { createRollupPrepareTransactionReceipt } from "@arbitrum/orbit-sdk";

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
    const deployParams = {
      config: [
        BigNumber.from(150),
        BigNumber.from(0),
        ethers.constants.AddressZero,
        ethers.utils.parseEther("1"),
        "0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17",
        walletCreator,
        ethers.constants.AddressZero,
        BigNumber.from(chainId),
        {
          homesteadBlock: 0,
          daoForkBlock: null,
          daoForkSupport: true,
          eip150Block: 0,
          eip150Hash:
            "0x0000000000000000000000000000000000000000000000000000000000000000",
          eip155Block: 0,
          eip158Block: 0,
          byzantiumBlock: 0,
          constantinopleBlock: 0,
          petersburgBlock: 0,
          istanbulBlock: 0,
          muirGlacierBlock: 0,
          berlinBlock: 0,
          londonBlock: 0,
          clique: { period: 0, epoch: 0 },
          arbitrum: {
            EnableArbOS: true,
            AllowDebugPrecompiles: false,
            DataAvailabilityCommittee: false,
            InitialArbOSVersion: 11,
            GenesisBlockNum: 0,
            MaxCodeSize: 24576,
            MaxInitCodeSize: 49152,
            InitialChainOwner: walletCreator,
          },
          chainId: chainId,
        },
        0,
        {
          delayBlocks: BigNumber.from("5760"),
          futureBlocks: BigNumber.from("48"),
          delaySeconds: BigNumber.from("86400"),
          futureSeconds: BigNumber.from("3600"),
        },
      ],
      batchPoster: batcher.address,
      validators: validators.map((v) => v.address),
      maxDataSize: 104857,
      nativeToken: tokenAddressToBeNativeToken,
      deployFactoriesToL2: true,
      maxFeePerGasForRetryables: 100000000,
    };

    const transactionResponse =
      await rollUpContractCreator.createRollup(deployParams);
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
      const resData = response.json();
      console.log("generate json resData", resData);
      console.log("transactionResponse >>>>>>>", transactionResponse);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      // const transactionReceipt = await transactionResponse.wait(1);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      // const data = createRollupPrepareTransactionReceipt(transactionReceipt);
      // console.log(data);
      return transactionResponse;
      // dockerComposeUp();
    }
  } catch (error) {
    console.error("Error interacting with contract:", error);
  }
}

// interactWithContract(1, tokenAddressToBeNativeToken, chainId, chainName);
