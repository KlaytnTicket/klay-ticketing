import caver from '@lib/caver/caver';
import { contractABI } from '@lib/caver/contract-abi';

async function GET(req, res) {
  res.status(200).json({ message: 'caver' });
}

export async function POST(req, res) {
  const formData = req.body;
  const { walletAddress, privateKey, contractAddress } = formData;
  const uri = 'https://www.naver.com';

  if (walletAddress === '' || privateKey === '' || contractAddress === '') {
    res.status(500).json({ message: "can't found address." });
  }

  try {
    const keyring = caver.wallet.getKeyring(walletAddress);

    if (keyring) {
      caver.wallet.updateKeyring(keyring);
    } else {
      caver.wallet.newKeyring(walletAddress, privateKey);
    }

    const contract = caver.contract.create(contractABI, contractAddress);

    const receipt = await contract.send({ from: walletAddress, gas: 1500000 }, 'safeMint', walletAddress, uri);

    res.status(200).json({ ok: true, message: 'Klaytn 배포 완료', keyring, receipt });
  } catch (error) {
    res.status(400).json({ ok: false, message: 'Klaytn 배포 실패' });
  }
}

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
  case 'GET':
    await GET(req, res);
    break;
  case 'POST':
    await POST(req, res);
    break;
  default:
    res.status(501).json({
      ok: false,
      message: 'Not Support Method',
    });
  }
}
