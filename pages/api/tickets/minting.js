import { mint, publicWalletAddress, setKeyring } from '@lib/caver/caver';
import { executeQuery } from '@lib/postgres';

const privateKey = process.env.KLAYTN_KEYRING_PRIVATE;

async function POST(req, res) {
  const { cA, userWallet, ticketID } = req.body;

  const keyringSet = setKeyring(publicWalletAddress, privateKey);
  if (!keyringSet) {
    return res.status(500).json({ error: '키링 셋 실패' });
  }

  try {
    const tokenId = await mint(cA, userWallet);

    // token ID 배당
    const updateTokenQuery = `
      UPDATE "TICKET"
      SET "TOKEN_ID" = ${tokenId}
      WHERE "ID" = '${ticketID}'
    `;
    await executeQuery(updateTokenQuery);

    res.status(200).json({ message: 'Minting 성공' });
  } catch (error) {
    res.status(500).json({ error: '민팅 실패' });
  }
}

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
  case 'POST':
    return POST(req, res);
  default:
    return res.status(405).json({
      message: 'Not Support Method',
    });
  }
}
