import { executeQuery } from '@lib/postgres';
import { supabaseStorageUpsert } from '@lib/supabase-client';
import { dataURLtoFile } from '@lib/utils';

async function GET(req, res) {
  const r = executeQuery('SELECT * FROM "EVENT"');
  res.status(200).json({ r });
}

async function POST(req, res) {
  const { i, n, s, t, e_st, e_en, t_st, t_en, t_li, im } = req.body;
  const f = dataURLtoFile(im, i);

  try {
    const r = await supabaseStorageUpsert(f, String(i));
    if (!r) {
      res.status(400).json({ message: 'upload error' });
    }
    await executeQuery(
      'UPDATE "EVENT"',
      `SET NAME=${n}, SITE=${s}, TAG=${t}, EVENT_START=${e_st}, EVENT_END=${e_en}, TICKETING_START=${t_st}, TICKETING_END=${t_en}, TICKETING_LIMIT=${t_li}`,
      `WHERE ID = ${i}`,
    );
    res.status(200).json({ message: 'post' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function PUT(req, res) {
  res.status(200).json({ message: 'put' });
}

async function PATCH(req, res) {
  res.status(200).json({ message: 'patch' });
}

async function DELETE(req, res) {
  res.status(200).json({ message: 'delete' });
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
  case 'PUT':
    await PUT(req, res);
    break;
  case 'PATCH':
    await PATCH(req, res);
    break;
  case 'DELETE':
    await DELETE(req, res);
    break;
  default:
    res.status(405).json({
      ok: false,
      message: 'Not Support Method',
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '6mb', // 4mb - base64
    },
  },
};
