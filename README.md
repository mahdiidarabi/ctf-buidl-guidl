## Challenge 2

you only need to have a contract to call the target contract

you can find it at contracts/CtfChallenge2.sol 

after deployment and verification on network call 

indirectCall(target_address)

the target address is challenge2_contract_address


## Challenge 3

the challenge contract checks if the caller has code in their storage and fails if have code. 

So we need to call the challenge contract in constructor (before storing the code in contract account storage)

you can find solution at contracts/CtfChallenge3.sol 

you need to deploy contract with challenge3_contract_address argument


## Challenge 4



## Challenge 5

in target contract you should claim point (at least 10), but claimPoints function checks if you have any point and prevent from several calls. but has a drawback in claimPoints function it calls msg.sender and if msg.sender has a receive function and in the receive function call claimPoints again it can bypass the requirement of claimPoints and got enough points. 

you can find the described solution at contracts/CtfChallenge5.sol

after deployment of solution contract you need to call startClaim function and then mintFlag function from challenge5_contract


## Challenge 6

in challenge 6 you should bypass 3 requirements, twos are about checking a code and a name, and I think easiest way is to use the challenge6_contract logic in our solution contract. 

the solution contract is at contracts/CtfChallenge6.sol

after deployment of solution contract call its startMint function, you may got an error since the last requirement of challenge_6 is about remained gas. 
send a transaction and if failed check its log and find out how much gas you should set for the transaction


## Challenge 7

challenge 7 is about delegation in EVM. 

claim ownership of the challenge 7 contract by calling claimOwnership on it. the target contract does not have this function, but has a fallback function and the logic contract has claimOwnership. you can use Write as proxy in 
https://optimistic.etherscan.io/address/0xC962D4f4E772415475AA46Eed06cb1F2D4010c0A#writeProxyContract
and then call mintFlag function of challenge7_contract


## Challenge 8


## Challenge 9

I think the easiest way to bypass the complex requirement of this challenge is to recreate it by myself. but there is only one problem the variables that the challenge contract is using are private and can not accessed from another contract. so first we need to extract and after finding the value of that private variables the solution is at contracts/CtfChallenge6.sol

## Challenge 10

## Challenge 11

## Challenge 12



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
