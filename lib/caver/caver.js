import Caver from 'caver-js';

export const config = {
  rpcURL: 'https://public-en-baobab.klaytn.net/',
};

export const caver = new Caver(config.rpcURL);

export default caver;
