import { Client } from "pg";

export default async function (req, res) {
	const {id} = req.query;

	const client = new Client({
		host: process.env.DB_HOST,
		database: process.env.DB_NAME,
		port: process.env.DB_PORT,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
	});
	

	try {
		await client.connect();
		const result = await client.query(
			'SELECT * FROM "TICKETING_EVENT" WHERE "EVENT_PK" = $1',
			[id]
		);
		await client.end();

		if(result.rows.length === 0){
			res.status(404).json({ error: '이벤트 없다.' });
		} else{
			res.status(200).json(result.rows[0]);
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: '데이터 패치 실패' });
	}
	
}