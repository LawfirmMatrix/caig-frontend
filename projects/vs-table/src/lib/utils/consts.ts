export const formatAccounting = (value: string | null) => {
  if (value && value.charAt(0) === '-') {
    return `(${value.substr(1)})`;
  }
  return value;
}

export const measureScrollbarWidth = (): number => {
  const scrollDiv = document.createElement('div');
  scrollDiv.style.overflow = 'scroll';
  document.body.appendChild(scrollDiv);
  const width = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);
  return width || 0;
}
