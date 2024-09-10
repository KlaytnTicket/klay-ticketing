import { hasToken } from '@lib/caver/caver';

async function POST(req, res) {
  const { cA, address } = req.body;

  if (!cA || !address) {
    return res.status(400).json({ error: '주소 넣어라.' });
  }

  try {
    const result = await hasToken(cA, address);

    if (result) {
      return res.status(200).json({ hasToken: true });
    }
    return res.status(200).json({ hasToken: false });
  } catch (error) {
    return res.status(500).json({ error: '토큰 확인 중 오류 발생' });
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
