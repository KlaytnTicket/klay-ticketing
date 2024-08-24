import { executeQuery } from '@lib/postgres';

export default async function events(req, res) {
  try {
    const result = await executeQuery('SELECT * FROM "EVENT"');

    return res.status(200).json(result);
  } catch (error) {
    // console.error(error);
    return res.status(500).json({ error: '데이터 패치 실패' });
  }
}
