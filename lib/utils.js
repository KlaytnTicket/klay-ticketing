export function dateToString1(date) {
  const originDate = new Date(date);
  const years = originDate.getFullYear();
  const months = `0${originDate.getMonth() + 1}`.slice(-2);
  const days = `0${originDate.getDate()}`.slice(-2);
  const hours = `0${originDate.getHours()}`.slice(-2);
  const minutes = `0${originDate.getMinutes()}`.slice(-2);
  const seconds = `0${originDate.getSeconds()}`.slice(-2);
  return `${years}년 ${months}월 ${days}일 ${hours}:${minutes}:${seconds}`;
}

export function dateToString2(date) {
  const originDate = new Date(date);
  const years = originDate.getFullYear();
  const months = `0${originDate.getMonth() + 1}`.slice(-2);
  const days = `0${originDate.getDate()}`.slice(-2);
  const hours = `0${originDate.getHours()}`.slice(-2);
  const minutes = `0${originDate.getMinutes()}`.slice(-2);
  return `${years}년 ${months}월 ${days}일, ${hours}시 ${minutes}분`;
}

export function dateToString3(date) {
  const newDate = new Date(date);
  const dateString = `${newDate.getFullYear()}.${newDate.getMonth() + 1}.${newDate.getDate()}.`;
  const timeString = `${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}:${String(newDate.getSeconds()).padStart(2, '0')}`;
  return `${dateString} ${timeString}`;
}

export function localeDateToKR(date) {
  const castingDate = new Date(date);
  castingDate.setTime(date.getTime() + 9 * 60 * 60 * 1000);
  return castingDate;
}

export function numberWithComma(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function fileToDataUrl(file, dispatch) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    dispatch(reader.result);
  };
}

export function dataURLtoFile(dataUrl, fileName) {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/);
  const bstr = atob(arr[arr.length - 1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, { type: mime ? mime[1] : '' });
}

export function isDataURL(dataUrl) {
  if (typeof dataUrl !== 'string') {
    return false;
  }
  const arr = dataUrl.split(',');
  const encode = arr[0].split(';');
  if (encode[1] !== 'base64') {
    return false;
  }
  return true;
}
