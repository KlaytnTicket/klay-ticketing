import { Client } from "pg";

export default async function (req, res){  
	const client = new Client({
		host: process.env.DB_HOST,
		database: process.env.DB_NAME,
		port: process.env.DB_PORT,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
	});
	

	try {
		await client.connect();
		const result = await client.query('SELECT * FROM "TICKETING_EVENT"');		
		await client.end();
		
		res.status(200).json(result.rows);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: '데이터 패치 실패' });		
	}
}