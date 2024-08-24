import { executeQuery } from '@lib/postgres';

async function GET(req, res) {
  const { contract: ca, tokenId } = req.query;
  const ti = Number(tokenId);
  if (!ca || !ti) {
    return res.status(400).json({ message: 'wrong parameters.' });
  }
  try {
    const r = await executeQuery(`SELECT * FROM "EVENT" WHERE "CONTRACT_ADDRESS"='${ca}'`);
    if (typeof r === 'string') {
      throw Error(r);
    }
    if (r.length === 0) {
      return res.status(404).json({ message: 'not found.' });
    }
    return res.status(200).json({ name: r[0].NFT_NAME, description: r[0].NFT_DESCRIPTION, image: r[0].TICKET_IMAGE });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
  case 'GET':
    return GET(req, res);
  default:
    return res.status(405).json({
      message: 'Not Support Method',
    });
  }
}
