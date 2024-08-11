'use client';
import React from 'react';

import Image from 'node_modules/next/image';
import footer from '../../image/footer.png';

export default function Footer() {
  return (
    <div className="flex w-full justify-center pt-36">
      <Image src={footer} alt="푸터란" className="w-[70vw]" />
    </div>
  );
}
