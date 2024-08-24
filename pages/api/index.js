async function GET(req, res) {
  return res.status(200).json({ message: 'api', version: 'v1' });
}

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
  case 'GET':
    return GET(req, res);
  default:
    return res.status(501).json({
      message: 'Not Support Method',
    });
  }
}
