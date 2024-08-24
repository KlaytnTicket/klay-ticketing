import Caver from 'caver-js';

export const publicWalletAddress = process.env.KLAYTN_KEYRING_ADDRESS;
const privateKey = process.env.KLAYTN_KEYRING_PRIVATE;

const config = {
  rpcURL: process.env.CAVER_RPC_URL || 'https://public-en-baobab.klaytn.net/',
};

const caver = new Caver(config.rpcURL);

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

export default caver;
