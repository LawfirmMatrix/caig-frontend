export const measureScrollbarWidth = (): number => {
  const scrollDiv = document.createElement('div');
  scrollDiv.style.overflow = 'scroll';
  document.body.appendChild(scrollDiv);
  const width = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);
  return width || 0;
}
