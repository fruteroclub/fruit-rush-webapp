import { ethers } from "ethers";

export function createValidatorsAndBatcher(numValidators: number) {
  const validators = [];
  for (let i = 0; i < numValidators; i++) {
    const validator = ethers.Wallet.createRandom();
    console.log(`address Validator ${i + 1}:`, validator.address);
    console.log(`mnemonic Validator ${i + 1}:`, validator.mnemonic.phrase);
    console.log(`privateKey Validator ${i + 1}:`, validator.privateKey);
    validators.push({
      address: validator.address,
      mnemonic: validator.mnemonic.phrase,
      privateKey: validator.privateKey,
    });
  }

  const batcherAddress = ethers.Wallet.createRandom();
  console.log("address Batcher:", batcherAddress.address);
  console.log("mnemonic Batcher:", batcherAddress.mnemonic.phrase);
  console.log("privateKey Batcher:", batcherAddress.privateKey);

  return {
    validators,
    batcher: {
      address: batcherAddress.address,
      mnemonic: batcherAddress.mnemonic.phrase,
      privateKey: batcherAddress.privateKey,
    },
  };
}
