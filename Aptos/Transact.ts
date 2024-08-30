/**
 * This example shows how to use the Aptos client to create accounts, fund them, and transfer between them.
 */
 
import { Account, Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
 
const APTOS_COIN = "0x1::aptos_coin::AptosCoin";
const COIN_STORE = `0x1::coin::CoinStore<${APTOS_COIN}>`;
const HOST_INITIAL_BALANCE = 100_000_000;
const GUEST_INITIAL_BALANCE = 100;
const TRANSFER_AMOUNT = 100;
 
async function example() {
  console.log(
    "This example will create two accounts (Host and Guest), fund them, and transfer between them.",
  );
 
  // Setup the client
  const config = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(config);
 
  // Generate two account credentials
  // Each account has a private key, a public key, and an address
  const host = Account.generate();
  const guest = Account.generate();
 
  console.log("=== Addresses ===\n");
  console.log(`Host's address is: ${host.accountAddress}`);
  console.log(`Guest's address is: ${guest.accountAddress}`);
 
  // Fund the accounts using a faucet
  console.log("\n=== Funding accounts ===\n");
 
  await aptos.fundAccount({
    accountAddress: host.accountAddress,
    amount: HOST_INITIAL_BALANCE,
  });
 
  await aptos.fundAccount({
    accountAddress: guest.accountAddress,
    amount: GUEST_INITIAL_BALANCE,
  });
  console.log("Host and Guest's accounts have been funded!");
 
  // Look up the newly funded account's balances
  console.log("\n=== Balances ===\n");
  const hostAccountBalance = await aptos.getAccountResource({
    accountAddress: host.accountAddress,
    resourceType: COIN_STORE,
  });
  const hostBalance = Number(hostAccountBalance.coin.value);
  console.log(`Host's balance is: ${hostBalance}`);
 
  const guestAccountBalance = await aptos.getAccountResource({
    accountAddress: guest.accountAddress,
    resourceType: COIN_STORE,
  });
  const guestBalance = Number(guestAccountBalance.coin.value);
  console.log(`Guest's balance is: ${guestBalance}`);
 
  // Send a transaction from Host's account to Guest's account
  const txn = await aptos.transaction.build.simple({
    sender: host.accountAddress,
    data: {
      // All transactions on Aptos are implemented via smart contracts.
      function: "0x1::aptos_account::transfer",
      functionArguments: [guest.accountAddress, 100],
    },
  });
 
  console.log("\n=== GUEST WON !! Transfer transaction started ===\n");
  // Both signs and submits
  const committedTxn = await aptos.signAndSubmitTransaction({
    signer: host,
    transaction: txn,
  });
  // Waits for Aptos to verify and execute the transaction
  const executedTransaction = await aptos.waitForTransaction({
    transactionHash: committedTxn.hash,
  });
  console.log("Transaction hash:", executedTransaction.hash);
 
  console.log("\n=== Balances after transfer ===\n");
  const newHostAccountBalance = await aptos.getAccountResource({
    accountAddress: host.accountAddress,
    resourceType: COIN_STORE,
  });
  const newHostBalance = Number(newHostAccountBalance.coin.value);
  console.log(`Host's balance is: ${newHostBalance}`);
 
  const newGuestAccountBalance = await aptos.getAccountResource({
    accountAddress: guest.accountAddress,
    resourceType: COIN_STORE,
  });
  const newGuestBalance = Number(newGuestAccountBalance.coin.value);
  console.log(`Guest's balance is: ${newGuestBalance}`);
 
  // Guest should have the transfer amount
  if (newGuestBalance !== TRANSFER_AMOUNT + GUEST_INITIAL_BALANCE)
    throw new Error("Guest's balance after transfer is incorrect");
 
  // Host should have the remainder minus gas
  if (newHostBalance >= HOST_INITIAL_BALANCE - TRANSFER_AMOUNT)
    throw new Error("Host's balance after transfer is incorrect");
}
 
example();
