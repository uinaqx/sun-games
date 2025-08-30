const cvs = document.getElementById('game');
const ctx = cvs.getContext('2d');
const W = cvs.width;
const H = cvs.height;

const GRAVITY = 0.6;
let player, obstacles, score, passed, game, frame;

function init() {
  player = { x: 80, y: H - 40, w: 30, h: 30, vy: 0, onGround: true };
  obstacles = [];
  score = 0;
  passed = new Set(); // 记录已跳过障碍的 id
  frame = 0;
  clearInterval(game);
  game = setInterval(loop, 20);
}

function loop() {
  update();
  draw();
}

function update() {
  // 玩家跳跃 & 重力
  player.y += player.vy;
  if (player.y >= H - player.h) {
    player.y = H - player.h;
    player.vy = 0;
    player.onGround = true;
  } else {
    player.vy += GRAVITY;
  }

  // 生成障碍物
  if (frame % 100 === 0) {
    const size = 20 + Math.random() * 20;
    obstacles.push({
      id: frame,
      x: W,
      y: H - size,
      w: size,
      h: size
    });
  }

  // 移动障碍物
  obstacles.forEach(o => o.x -= 4);

  // 跳过得分的判定
  obstacles.forEach(o => {
    if (!passed.has(o.id) && o.x + o.w < player.x) {
      passed.add(o.id);
      score++;
      // 累加到全局总得分
      let total = parseInt(localStorage.getItem('snakeTotal') || 0) + 1;
      localStorage.setItem('snakeTotal', total);
      try {
        if (window.opener && window.opener.updateTotal) {
          window.opener.updateTotal(total);
        }
      } catch (e) {}
    }
  });

  // 移除屏幕外的障碍
  obstacles = obstacles.filter(o => o.x + o.w > 0);

  // 碰撞检测
  obstacles.forEach(o => {
    if (rectCollide(player, o)) {
      alert('游戏结束！得分：' + score);
      init();
    }
  });

  frame++;
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  // 玩家
  ctx.fillStyle = '#0f0';
  ctx.fillRect(player.x, player.y, player.w, player.h);
  // 障碍物
  ctx.fillStyle = '#f00';
  obstacles.forEach(o => ctx.fillRect(o.x, o.y, o.w, o.h));
}

function rectCollide(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

// 键盘控制
document.addEventListener('keydown', e => {
  if ((e.code === 'Space' || e.code === 'ArrowUp') && player.onGround) {
    player.vy = -12;
    player.onGround = false;
    e.preventDefault();
  }
});

init();