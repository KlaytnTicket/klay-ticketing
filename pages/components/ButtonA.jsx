'use client';
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

export default function ButtonA(props) {
  const { styleClass, onClick, disabled, label, URL, width, height, fontColor, bgColor } = props;

  let cssStyle = 'text-sm fontA h-10 px-2 rounded-md border ';

  const dynamicStyle = {
    width: width ? `${width}px` : '4rem',
    height: height ? `${height}px` : '2.5rem',
    color: fontColor ? `#${fontColor}` : 'white',
    backgroundColor: bgColor ? `#${bgColor}` : '#5272F2',
  };

  return (
    <Link href={`/${URL}`}>
      <button style={styleClass ? {} : dynamicStyle} className={styleClass ? styleClass : cssStyle} onClick={onClick} disabled={disabled}>
        {label}
      </button>
    </Link>
  );
}

ButtonA.propTypes = {
  URL: PropTypes.string,
  onClick: PropTypes.func,
  label: PropTypes.string,
  styleClass: PropTypes.string,
  disabled: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
  fontColor: PropTypes.string,
  bgColor: PropTypes.string,
};
