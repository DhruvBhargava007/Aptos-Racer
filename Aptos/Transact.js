"use strict";
/**
 * This example shows how to use the Aptos client to create accounts, fund them, and transfer between them.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ts_sdk_1 = require("@aptos-labs/ts-sdk");
var APTOS_COIN = "0x1::aptos_coin::AptosCoin";
var COIN_STORE = "0x1::coin::CoinStore<".concat(APTOS_COIN, ">");
var HOST_INITIAL_BALANCE = 100000000;
var GUEST_INITIAL_BALANCE = 100;
var TRANSFER_AMOUNT = 100;
function example() {
    return __awaiter(this, void 0, void 0, function () {
        var config, aptos, host, guest, hostAccountBalance, hostBalance, guestAccountBalance, guestBalance, txn, committedTxn, executedTransaction, newHostAccountBalance, newHostBalance, newGuestAccountBalance, newGuestBalance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("This example will create two accounts (Host and Guest), fund them, and transfer between them.");
                    config = new ts_sdk_1.AptosConfig({ network: ts_sdk_1.Network.TESTNET });
                    aptos = new ts_sdk_1.Aptos(config);
                    host = ts_sdk_1.Account.generate();
                    guest = ts_sdk_1.Account.generate();
                    console.log("=== Addresses ===\n");
                    console.log("Host's address is: ".concat(host.accountAddress));
                    console.log("Guest's address is: ".concat(guest.accountAddress));
                    // Fund the accounts using a faucet
                    console.log("\n=== Funding accounts ===\n");
                    return [4 /*yield*/, aptos.fundAccount({
                            accountAddress: host.accountAddress,
                            amount: HOST_INITIAL_BALANCE,
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, aptos.fundAccount({
                            accountAddress: guest.accountAddress,
                            amount: GUEST_INITIAL_BALANCE,
                        })];
                case 2:
                    _a.sent();
                    console.log("Host and Guest's accounts have been funded!");
                    // Look up the newly funded account's balances
                    console.log("\n=== Balances ===\n");
                    return [4 /*yield*/, aptos.getAccountResource({
                            accountAddress: host.accountAddress,
                            resourceType: COIN_STORE,
                        })];
                case 3:
                    hostAccountBalance = _a.sent();
                    hostBalance = Number(hostAccountBalance.coin.value);
                    console.log("Host's balance is: ".concat(hostBalance));
                    return [4 /*yield*/, aptos.getAccountResource({
                            accountAddress: guest.accountAddress,
                            resourceType: COIN_STORE,
                        })];
                case 4:
                    guestAccountBalance = _a.sent();
                    guestBalance = Number(guestAccountBalance.coin.value);
                    console.log("Guest's balance is: ".concat(guestBalance));
                    return [4 /*yield*/, aptos.transaction.build.simple({
                            sender: host.accountAddress,
                            data: {
                                // All transactions on Aptos are implemented via smart contracts.
                                function: "0x1::aptos_account::transfer",
                                functionArguments: [guest.accountAddress, 100],
                            },
                        })];
                case 5:
                    txn = _a.sent();
                    console.log("\n=== GUEST WON !! Transfer transaction started ===\n");
                    return [4 /*yield*/, aptos.signAndSubmitTransaction({
                            signer: host,
                            transaction: txn,
                        })];
                case 6:
                    committedTxn = _a.sent();
                    return [4 /*yield*/, aptos.waitForTransaction({
                            transactionHash: committedTxn.hash,
                        })];
                case 7:
                    executedTransaction = _a.sent();
                    console.log("Transaction hash:", executedTransaction.hash);
                    console.log("\n=== Balances after transfer ===\n");
                    return [4 /*yield*/, aptos.getAccountResource({
                            accountAddress: host.accountAddress,
                            resourceType: COIN_STORE,
                        })];
                case 8:
                    newHostAccountBalance = _a.sent();
                    newHostBalance = Number(newHostAccountBalance.coin.value);
                    console.log("Host's balance is: ".concat(newHostBalance));
                    return [4 /*yield*/, aptos.getAccountResource({
                            accountAddress: guest.accountAddress,
                            resourceType: COIN_STORE,
                        })];
                case 9:
                    newGuestAccountBalance = _a.sent();
                    newGuestBalance = Number(newGuestAccountBalance.coin.value);
                    console.log("Guest's balance is: ".concat(newGuestBalance));
                    // Guest should have the transfer amount
                    if (newGuestBalance !== TRANSFER_AMOUNT + GUEST_INITIAL_BALANCE)
                        throw new Error("Guest's balance after transfer is incorrect");
                    // Host should have the remainder minus gas
                    if (newHostBalance >= HOST_INITIAL_BALANCE - TRANSFER_AMOUNT)
                        throw new Error("Host's balance after transfer is incorrect");
                    return [2 /*return*/];
            }
        });
    });
}
example();
