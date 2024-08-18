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
