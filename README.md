## Deploying with hardhat-deploy (Optimism)

1. Create a `.env` file:

```
PRIVATE_KEY=0x...
OPTIMISM_RPC_URL=https://mainnet.optimism.io
OPTIMISM_SEPOLIA_RPC_URL=https://sepolia.optimism.io
OPTIMISM_ETHERSCAN_API_KEY=your-key
OPTIMISM_SEPOLIA_ETHERSCAN_API_KEY=your-key
```

2. Deploy:

```
npm run deploy:op-sepolia
# or
npm run deploy:op
```

3. Verify (optional):

```
npm run verify:op-sepolia
# or
npm run verify:op
```
# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```
