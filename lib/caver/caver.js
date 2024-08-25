import Caver from 'caver-js';

import contractABI from './contract-abi';

export const publicWalletAddress = process.env.KLAYTN_KEYRING_ADDRESS;
const privateKey = process.env.KLAYTN_KEYRING_PRIVATE;

const config = {
  rpcURL: process.env.CAVER_RPC_URL || 'https://public-en-baobab.klaytn.net/',
};

const caver = new Caver(config.rpcURL);

export default caver;

export function setKeyring(w = publicWalletAddress, k = privateKey) {
  if (!w || !k) {
    return false;
  }
  try {
    const keyring = caver.wallet.getKeyring(w);
    if (keyring) {
      caver.wallet.updateKeyring(keyring);
    } else {
      caver.wallet.newKeyring(w, k);
    }
    return true;
  } catch (error) {
    return false;
  }
}

export async function mint(ca, a) {
  const c = caver.contract.create(contractABI, ca);
  const g = await c.methods.mint(a).estimateGas({ from: publicWalletAddress });
  await c.send({ from: publicWalletAddress, gas: g }, 'mint', a);
  const r = await c.call({ from: publicWalletAddress }, 'totalSupply');
  return Number(r - 1);
}
