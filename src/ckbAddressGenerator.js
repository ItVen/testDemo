// ckbAddressGenerator.js
import {   AddressPrefix, scriptToAddress, blake160,addressToScript } from '@nervosnetwork/ckb-sdk-utils';

export function generateCkbAddress(codeHash, args) {  
    const lockScript = {
        codeHash: codeHash,
        hashType: 'type',  
        args: args
  }; 
   
  const address = scriptToAddress(lockScript, AddressPrefix.Mainnet); 
  return address;
}
 

export function getArgsByPubkey(pubkey) {
  const args = '0x' + blake160('0x' + pubkey.replace('0x', ''), 'hex');
  return args;
}

export function addressArgs(address) {
  const data = addressToScript(address)
  return data.args;
}