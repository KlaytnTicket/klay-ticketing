import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar, Autoplay } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

//constants 안의 파일
import { slideData } from '../constants/SLIDE_DATA.js';
import Link from 'node_modules/next/link.js';
import Image from 'node_modules/next/image.js';

export default function SwiperTest() {
  SwiperCore.use([Navigation, Scrollbar, Autoplay]);
  return (
    <div className="swiper-container">
      <Swiper
        loop={true} // 슬라이드 루프
        spaceBetween={50} // 슬라이스 사이 간격
        slidesPerView={1} // 보여질 슬라이스 수
        navigation={true} // 이전, 다음 버튼 보이는거
        autoplay={{
          delay: 5000,
          disableOnInteraction: false, // 사용자 상호작용시 슬라이더 일시 정지 비활성
        }}
      >
        {slideData.map((slide) => (
          <SwiperSlide key={slide.id}>
            <Link href={slide.url} className="py-4">
              <div className="relative flex justify-center p-11">
                <Image className="w-[500px] cursor-pointer" src={slide.img} alt="" />
                <h1 className="absolute bottom-0">{slide.text}</h1>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
