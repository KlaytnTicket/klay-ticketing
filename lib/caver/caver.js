import Caver from 'caver-js';

export const config = {
  rpcURL: process.env.CAVER_RPC_URL || 'https://public-en-baobab.klaytn.net/',
};

const caver = new Caver(config.rpcURL);

export default caver;
