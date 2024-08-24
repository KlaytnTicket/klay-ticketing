async function GET(req, res) {
  try {
    return res.status(200).json({ message: 'caver' });
  } catch (error) {
    return res.status(500).json({ o: false, message: error.message });
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
