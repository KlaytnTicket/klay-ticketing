'use client';
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Image from 'node_modules/next/image';

export default function ImageButtonA(props) {
  const { styleClass, onClick, disabled, URL, width, height, img } = props;

  let cssStyle = 'text-sm fontA h-10 px-2 rounded-md border ';

  const dynamicStyle = {
    width: width ? `${width}px` : '20rem',
    height: height ? `${height}px` : '8rem',
  };

  return (
    <>
      {disabled ? (
        <div style={styleClass ? {} : dynamicStyle} className={styleClass ? styleClass : cssStyle}>
          <Image src={img} alt="image" />
        </div>
      ) : (
        <Link href={`/${URL}`}>
          <Image src={img} style={styleClass ? {} : dynamicStyle} className={styleClass ? styleClass : cssStyle} onClick={onClick} />
        </Link>
      )}
    </>
  );
}

ImageButtonA.propTypes = {
  URL: PropTypes.string,
  onClick: PropTypes.func,
  label: PropTypes.string,
  styleClass: PropTypes.string,
  disabled: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
  img: PropTypes.string.isRequired,
};
