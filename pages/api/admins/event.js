import byteCode from '@lib/caver/bytecode';
import caver, { publicWalletAddress, setKeyring } from '@lib/caver/caver';
import contractABI from '@lib/caver/contract-abi';
import { executeQuery, executeTransaction } from '@lib/postgres';
import { supabaseStorageDelete, supabaseStorageUpsert } from '@lib/supabase-client';
import { dataURLtoFile, isDataURL } from '@lib/utils';
import { sha256 } from 'js-sha256';

async function GET(req, res) {
  try {
    const e = await executeQuery('SELECT * FROM "EVENT" ORDER BY "NAME"');
    if (typeof e === 'string') {
      throw Error(e);
    }
    const r = await Promise.all(
      e.map(async (rr) => {
        const q = await executeQuery(`SELECT COUNT(*) FROM "TICKET" WHERE "EVENT_ID"=${rr.ID}`);
        if (typeof q === 'string') {
          throw Error(q);
        }
        const c = q[0].count;
        return Object.assign(rr, { HAS_TICKET: c });
      }),
    );
    return res.status(200).json({ r });
  } catch (error) {
    return res.status(500).json({ o: false, message: error.message });
  }
}

async function POST(req, res) {
  const { n, nn, ns, nd, s, t, e_st, e_en, t_st, t_en, t_li, im } = req.body;
  if (!n || !nn || !ns || !nd || !s || !t || !e_st || !e_en || !t_st || !t_en || !t_li || im === undefined) {
    return res.status(200).json({ o: false, message: '잘못된 폼 제출' });
  }
  try {
    if (!setKeyring()) {
      throw Error('fail to update keyring');
    }
    if (!isDataURL(im)) {
      throw Error('잘못된 형식의 데이터입니다.');
    }
    const c = caver.contract.create(contractABI);
    const d = await c.deploy({ from: publicWalletAddress, gas: 20000000 }, byteCode, nn, ns);
    const ca = d.options.address;
    if (!ca || ca === '') {
      return res.status(500).json({ message: 'fail to deploy contract' });
    }
    const nc = caver.contract.create(contractABI, ca);
    const g = await nc.methods.setBaseURI(`https://klay-ticketing.netlify.app/api/klaytn/${ca}/`).estimateGas({ from: publicWalletAddress });
    await nc.send({ from: publicWalletAddress, gas: g }, 'setBaseURI', `https://klay-ticketing.netlify.app/api/klaytn/${ca}/`);
    const f = dataURLtoFile(im, 'image');
    const h = sha256(`image/${n}${new Date().toISOString()}`);
    const cr = await supabaseStorageUpsert(f, String(h));
    if (!cr) {
      throw Error('upload error');
    }
    const r = await executeQuery(
      'INSERT INTO "EVENT"',
      '("NAME","SITE","TAG","EVENT_START","EVENT_END","TICKETING_START","TICKETING_END",',
      '"TICKET_IMAGE","TICKETING_LIMIT","CONTRACT_ADDRESS","NFT_NAME","NFT_SYMBOL", "NFT_DESCRIPTION")',
      `VALUES('${n}','${s}','${t}','${e_st}','${e_en}','${t_st}','${t_en}','${cr.publicUrl}','${t_li}', '${ca}', '${nn}','${ns}','${nd}')`,
    );
    if (typeof r === 'string') {
      throw Error(r);
    }
    return res.status(200).json({ o: true, message: '이벤트를 등록하였습니다.' });
  } catch (error) {
    return res.status(500).json({ o: false, message: error.message });
  }
}

async function PUT(req, res) {
  const { i, nd, n, s, t, e_st, e_en, t_st, t_en, t_li, im } = req.body;
  if (!n || !nd || !s || !t || !e_st || !e_en || !t_st || !t_en || !t_li || im === undefined) {
    return res.status(200).json({ o: false, message: '잘못된 폼 제출' });
  }
  try {
    if (isDataURL(im)) {
      const f = dataURLtoFile(im, 'image');
      const h = sha256(`image/${n}${new Date().toISOString()}`);
      const inm = await executeQuery(`SELECT "TICKET_IMAGE" FROM "EVENT" WHERE "ID"=${i}`);
      const sinm = String(inm[0].TICKET_IMAGE);
      const de = await supabaseStorageDelete(sinm.substring(sinm.length - 64));
      if (!de) {
        throw Error('delete error');
      }
      const cr = await supabaseStorageUpsert(f, String(h));
      if (!cr) {
        throw Error('upload error');
      }
      const r = await executeQuery(
        `UPDATE "EVENT" SET "NAME"='${n}',"SITE"='${s}',"TAG"='${t}',"EVENT_START"='${e_st}',"EVENT_END"='${e_en}',`,
        `"TICKETING_START"='${t_st}',"TICKETING_END"='${t_en}',"TICKET_IMAGE"='${cr.publicUrl}',"TICKETING_LIMIT"=${t_li},"NFT_DESCRIPTION"='${nd}' `,
        `WHERE "ID"=${i}`,
      );
      if (typeof r === 'string') {
        throw Error(r);
      }
    } else {
      const r = await executeQuery(
        `UPDATE "EVENT" SET "NAME"='${n}',"SITE"='${s}',"TAG"='${t}',"EVENT_START"='${e_st}',"EVENT_END"='${e_en}',`,
        `"TICKETING_START"='${t_st}',"TICKETING_END"='${t_en}',"TICKETING_LIMIT"=${t_li},"NFT_DESCRIPTION"='${nd}' `,
        `WHERE "ID"=${i}`,
      );
      if (typeof r === 'string') {
        throw Error(r);
      }
    }
    return res.status(200).json({ o: true, message: '이벤트를 수정하였습니다.' });
  } catch (error) {
    return res.status(500).json({ o: false, message: error.message });
  }
}

async function PATCH(req, res) {
  const { i, o } = req.body;
  try {
    const r = await executeQuery(`UPDATE "EVENT" SET "TICKETING_IS_OPEN"=${o} WHERE "ID"=${i}`);
    if (typeof r === 'string') {
      throw Error(r);
    }
    return res.status(200).json({ o: true, message: `이벤트 티켓팅을 ${o ? '시작' : '정지'}하였습니다.` });
  } catch (error) {
    return res.status(500).json({ o: false, message: error.message });
  }
}

async function DELETE(req, res) {
  const { i, fd } = req.body;
  try {
    if (!setKeyring()) {
      throw Error('fail to update keyring');
    }
    const q = await executeQuery(`SELECT "TICKET_IMAGE", "CONTRACT_ADDRESS" FROM "EVENT" WHERE "ID"=${i}`);
    const sinm = String(q[0].TICKET_IMAGE);
    const ca = q[0].CONTRACT_ADDRESS;
    const de = await supabaseStorageDelete(sinm.substring(sinm.length - 64));
    if (!de) {
      throw Error('delete error');
    }
    if (fd === true) {
      const r = await executeTransaction([[`DELETE FROM "TICKET" WHERE "EVENT_ID"=${i}`], [`DELETE FROM "EVENT" WHERE "ID"=${i}`]]);
      if (typeof r === 'string') {
        throw Error(r);
      }
    } else {
      const p = await executeQuery(`SELECT COUNT(*) FROM "EVENT" AS e JOIN "TICKET" AS t ON e."ID" = t."EVENT_ID" WHERE e."ID"=${i}`);
      if (typeof p === 'string') {
        throw Error(p);
      }
      const it = Number(p[0].count);
      if (it > 0) {
        return res.status(200).json({ o: false, message: '해당 이벤트에서 이미 발행된 티켓이 있습니다. 삭제하려면 [이벤트 강제 삭제]를 동의해야 합니다.' });
      }
      const r = await executeTransaction([[`DELETE FROM "TICKET" WHERE "EVENT_ID"=${i}`], [`DELETE FROM "EVENT" WHERE "ID"=${i}`]]);
      if (typeof r === 'string') {
        throw Error(r);
      }
    }
    const c = caver.contract.create(contractABI, ca);
    const gas = await c.methods.pause().estimateGas({ from: publicWalletAddress });
    await c.send({ from: publicWalletAddress, gas }, 'pause');
    return res.status(200).json({ o: true, message: '이벤트를 삭제하였습니다.' });
  } catch (error) {
    return res.status(500).json({ o: false, message: error.message });
  }
}

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
  case 'GET':
    return GET(req, res);
  case 'POST':
    return POST(req, res);
  case 'PUT':
    return PUT(req, res);
  case 'PATCH':
    return PATCH(req, res);
  case 'DELETE':
    return DELETE(req, res);
  default:
    return res.status(405).json({
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
