// 点击按钮随机换背景色
document.getElementById('magicBtn').addEventListener('click', () => {
  const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
  document.body.style.background = randomColor;
});