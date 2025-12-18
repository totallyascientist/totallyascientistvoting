window.addEventListener('scroll', () => {
  document.querySelectorAll('.fly').forEach((img, i) => {
    img.style.transform = `translateY(${-window.scrollY * (0.4 + i*0.2)}px)`;
  });
});