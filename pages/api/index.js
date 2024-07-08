async function GET(req, res) {
  res.status(200).json({ message: 'api', version: 'v1' });
}

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
  case 'GET':
    await GET(req, res);
    break;
  default:
    res.status(501).json({
      ok: false,
      message: 'Not Support Method',
    });
  }
}
