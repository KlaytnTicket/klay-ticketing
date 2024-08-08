import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EventDetail(){
  const router = useRouter();
	const {id} = router.query;
	const [event, setEvent] = useState(null);

	useEffect(()=>{
		if(id){
			async function fetchEvent(){
				try {
					const res = await axios.get(`/api/events/${id}`);
					setEvent(res.data);
				} catch (error) {
					console.log('이벤트 패치 에러: ', error);
				}
			}
			fetchEvent();
		}
	}, [id]);

	if(!event){
		return (
			<div className="min-h-screen flex justify-center mt-20">
				Loading...</div>
		);
	}

	return(
		<div>
			<Head>
				<title>{event.EVENT_NAME}</title>
			</Head>

      {/* 로고 */}
			<header>  
        <div className="container mx-auto flex justify-center
        mt-32">
          <Link href="/mainpage">로고</Link>
        </div>        
      </header>

			<main className="min-h-screen flex justify-center mt-20">
        <div>
          <h1 className="font-bold text-2xl">{event.EVENT_NAME}</h1>
          <p>장소: {event.EVENT_SITE}</p>
          <p>시작 시간: {new Date(event.EVENT_START).toLocaleString()}</p>
          <p>종료 시간: {new Date(event.EVENT_END).toLocaleString()}</p>
          <p>종류: {event.EVENT_TAG}</p>
          <p>인당 구매 제한: {event.EVENT_LIMIT}개</p>
          <p>상태: {event.EVENT_STATUS ? "종료" : "진행 중"}</p>
        </div>
      </main>
		</div>
	);
}