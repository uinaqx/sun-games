const cvs=document.getElementById('game');
const ctx=cvs.getContext('2d');
const box=20;
let snake,dir,food,game;
function init(){
  snake=[{x:9*box,y:9*box}];
  dir='';
  food={x:Math.floor(Math.random()*20)*box,y:Math.floor(Math.random()*20)*box};
  clearInterval(game);
  game=setInterval(draw,150);
}
document.addEventListener('keydown',e=>{
  if(e.key==='ArrowLeft'&&dir!=='RIGHT')dir='LEFT';
  if(e.key==='ArrowUp'&&dir!=='DOWN')dir='UP';
  if(e.key==='ArrowRight'&&dir!=='LEFT')dir='RIGHT';
  if(e.key==='ArrowDown'&&dir!=='UP')dir='DOWN';
});
function draw(){
  ctx.clearRect(0,0,cvs.width,cvs.height);
  for(let i=0;i<snake.length;i++){
    ctx.fillStyle=i===0?'#FFFFFF':'#00FFFF';
    ctx.fillRect(snake[i].x,snake[i].y,box,box);
  }
  ctx.fillStyle='#00c3ff';
  ctx.fillRect(food.x,food.y,box,box);
  let headX=snake[0].x,headY=snake[0].y;
  if(dir==='LEFT')headX-=box;
  if(dir==='UP')headY-=box;
  if(dir==='RIGHT')headX+=box;
  if(dir==='DOWN')headY+=box;
  if(headX===food.x&&headY===food.y){
    food={x:Math.floor(Math.random()*20)*box,y:Math.floor(Math.random()*20)*box};
    let total=parseInt(localStorage.getItem('snakeTotal')||0)+1;
    localStorage.setItem('snakeTotal',total);
    try{if(window.opener&&window.opener.updateTotal)window.opener.updateTotal(total);}catch(e){}
  }else{snake.pop();}
  const newHead={x:headX,y:headY};
  if(headX<0||headY<0||headX>=cvs.width||headY>=cvs.height||collision(newHead,snake)){
    clearInterval(game);
    alert('游戏结束！按 OK 重新开始');
    init();return;
  }
  snake.unshift(newHead);
}
function collision(head,array){
  for(let i=0;i<array.length;i++)if(head.x===array[i].x&&head.y===array[i].y)return true;
  return false;
}
init();