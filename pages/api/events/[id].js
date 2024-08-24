import { executeTransaction } from '@lib/postgres';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const [EventResult, TicketResult] = await executeTransaction([[`SELECT * FROM "EVENT" WHERE "ID" = ${id}`], [`SELECT * FROM "TICKET" WHERE "EVENT_ID" = ${id}`]]);

    if (EventResult.length === 0) {
      return res.status(404).json({ error: '이벤트 없다.' });
    }
    return res.status(200).json({
      event: EventResult[0],
      tickets: TicketResult,
    });
  } catch (error) {
    // console.error(error);
    return res.status(500).json({ error: '데이터 패치 실패' });
  }
}
