import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';

export default function InputDropZone({ s, a, c, o }) {
  const [h, s_h] = useState(false);

  return (
    <figure
      className={clsx('relative inline-block min-h-10 min-w-10 cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-gray-400', c)}
      onMouseEnter={() => s_h(true)}
      onMouseLeave={() => s_h(false)}
    >
      {s && <Image className="absolute z-0" fill alt={a} src={s} sizes="(max-width: 768px) 100vw, 33vw" priority />}
      {h && <div className="absolute h-full w-full bg-gray-300 opacity-50" />}
      {(!s || h) && (
        <div className="absolute flex h-full w-full items-center justify-center">
          <span className="text-xl">파일 드롭</span>
        </div>
      )}
      <div className="absolute flex h-full w-full items-center justify-center">
        <span className="text-xl">파일 드롭</span>
      </div>
      <input id="dropzone" className="absolute left-0 top-0 h-full w-full cursor-pointer bg-slate-100 opacity-0" accept=".jpeg, .jpg, .png, .gif .webp" type="file" onChange={o} />
    </figure>
  );
}
