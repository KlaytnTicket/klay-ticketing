import caver from '@lib/caver/caver';
import { contractABI } from '@lib/caver/contract-abi';

async function GET(req, res) {
  const walletAddress = '0x0b50627Fad0073aD9BFc2d6966AeC6a17258f5fa';
  const privateKey = '0x7e3e740061fd18a8a5a42646f31506829b23d2e80816dafb9fbcf4954168c811';
  const contractAddress = '0xC39F4027692922ac0D5226e71799570019aBB52c';

  const keyring = caver.wallet.getKeyring(walletAddress);

  if (keyring) {
    caver.wallet.updateKeyring(keyring);
  } else {
    caver.wallet.newKeyring(walletAddress, privateKey);
  }

  const contract = caver.contract.create(contractABI, contractAddress);
  console.log(contract);
  // await contract.call('setBaseURI', 'http://localhost:3000');

  // const receipt = await contract.send({ from: walletAddress, gas: 1500000 }, 'setBaseURI', '');
  // const receipt = await contract.send({ foncontractAddress, gas: 1500000 }, 'mint', walletAddress);
  // const receipt = await contract.send({ from: walletAddress, gas: 28000 }, 'balanceOf', walletAddress);
  // const receipt = await contract.call('baseURI');
  // const receipt = await contract.send({ from: walletAddress, gas: 1500000 }, 'baseURI');
  res.status(200).json({ message: 'api', version: 'v1' });
}

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
  case 'GET':
    await GET(req, res);
    break;
  default:
    res.status(405).json({
      ok: false,
      message: 'Not Support Method',
    });
  }
}
