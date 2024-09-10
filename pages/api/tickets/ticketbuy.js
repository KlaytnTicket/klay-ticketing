import { executeQuery } from '@lib/postgres';

async function POST(req, res) {
  const { userID, totalPrice, ticketID } = req.body;

  if (!userID || !totalPrice || !ticketID) {
    return res.status(400).json({ message: '필요 정보 누락' });
  }

  try {
    // 유저의 포인트 업데이트
    const updateUserPointQuery = `
      UPDATE "USER"
      SET "USER_POINT" = "USER_POINT" - ${totalPrice}
      WHERE "USER_ID" = '${userID}'
    `;

    await executeQuery(updateUserPointQuery);

    // 티켓 정보 업데이트
    const updateTicketQuery = `
      UPDATE "TICKET"
      SET "USER_ID" = '${userID}', "IS_USED" = TRUE
      WHERE "ID" = '${ticketID}'
    `;

    await executeQuery(updateTicketQuery);

    return res.status(200).json({ message: '결제 성공적 완료' });
  } catch (error) {
    return res.status(500).json({ message: '서버 에러' });
  }
}

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
  case 'POST':
    return POST(req, res);
  default:
    return res.status(405).json({
      message: '지원하지 않는 메서드이다.',
    });
  }
}
