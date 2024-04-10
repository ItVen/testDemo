import { BIP32Factory } from "bip32";
import * as ecc from "tiny-secp256k1";
import { ECPairFactory } from "ecpair";
import * as bitcoin from "bitcoinjs-lib";
import { mnemonicToSeedSync, generateMnemonic } from "bip39";
import fs from "fs";

const network = bitcoin.networks.testnet; 
const bip32 = BIP32Factory(ecc); 
const mnemonic = generateMnemonic();
const seed = mnemonicToSeedSync(mnemonic); 
const root = bip32.fromSeed(seed, network);
const addresses = [];
for (let i = 0; i < 10000; i++) {
  const path = `m/44'/0'/0'/0/${i}`;
  const child = root.derivePath(path);
  const { address } = bitcoin.payments.p2pkh({ pubkey: child.publicKey, network });
  const privateKey = child.toWIF();
  console.log({ address, privateKey });
  addresses.push({ address, index: i });
}

const csvHeader = "Address,index\n";
const csvContent = addresses.map(info => `${info.address},${info.index}`).join("\n");
const csvData = csvHeader + csvContent;

// 将CSV内容写入文件
fs.writeFileSync("address_private_keys.csv", csvData);

console.log({ mnemonic, seed: seed.toString("hex") });

console.log("完成地址生成和记录。");
