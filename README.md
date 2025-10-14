This repository contains the solutions for  BuidlGuidl CTF challenge (https://ctf.buidlguidl.com/).

The challenge tests users' skills in Solidity focusing on security. 

In the following lines I'll describe each challenge and the solution, you can also found the solution codes in this repo.


## Challenge 1

The first challenge only wants users to call a function. you need to have a wallet to interact with the network (in this case Optimism), and easily can connet your wallet to the optimism scan and call the function (ax). you can also use other ways to call the fucntion like remix ide, etc. 




## Challenge 2

the requirement of this challenge is msg.sender != tx.origin. 

In Solidity msg.sender is the account calling a function and tx.origin is the account (externally owned account) that initiated the transaction (or function call). 

If a user send a transaction (like a function call) with their wallet. the msg.sender and tx.origin are same. but if a user call a function from contract_1 and in that function, there was a call to another contract (like contract_2), in contract_2, msg.sender would be contract_1, and tx.origin would be the user. 
(ax)

So you only need to have a contract to call the target contract. A simple contract is created for this purpose can be found at contracts/CtfChallenge2.sol file. 

After deployment and verification of the solution contract for challenge 2, call 

indirectCall(target_address) functoin and pass challenge2_contract_address as argument. 


## Challenge 3

To pass this challenge you need to have a contract to call the challenge contract like challenge 2, but with a difference, the contract that calls the cahllenge contract should not have any code in their storage during the call.  
But how it's possible?!

Before explaining the solution you need to know that in EVM based networks, there are 2 types of accounts, externally owned and internally owned. 
externally owned accounts are wallets and internally owned accounts are contracts.

every account has a storage on the network containing nonce, ether balance, code, etc. 
For externally owned accounts there is no code, but for internally owned ones there's some code (so the length of the code is not 0).

(ax)

To pass the requirement of this challenge we need to have a contract (for indirect call), and with no code in its storage, its impossble unless during the creation of the contract.

So we need to call the challenge contract in constructor (before storing the code in contract account storage).

you can find the solution at contracts/CtfChallenge3.sol 

you need to deploy contract with challenge3_contract_address as argument to pass this challenge.


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
