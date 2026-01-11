const game = document.getElementById("game");
const player = document.getElementById("player");
const coinsDisplay = document.getElementById("coins");
const message = document.getElementById("message");

// Player properties
let px=10, py=350, vx=0, vy=0;
let speed=5, jumpPower=-15, onGround=false;

// Controls
let left=false, right=false, jumpFlag=false;

// Coins
let coinsCollected=0;

// Platforms
const platformsData = [
    {x:50,y:300,w:100,type:'static'},
    {x:200,y:250,w:100,type:'moving'},
    {x:350,y:200,w:100,type:'disappear'},
    {x:500,y:150,w:80,type:'static'},
    {x:50,y:100,w:120,type:'static'}
];

let platforms = [];
platformsData.forEach((p,i)=>{
    const el = document.createElement("div");
    el.className="platform "+p.type;
    el.style.left=p.x+"px";
    el.style.top=p.y+"px";
    el.style.width=p.w+"px";
    game.appendChild(el);
    platforms.push({...p, el, dir:1});
});

// Coins & checkpoints
let coins = [], checkpoints = [];
platforms.forEach((p,i)=>{
    if((i+1)%2===0){
        const coin = document.createElement("div");
        coin.className="coin";
        coin.style.left=(p.x+p.w/2-7)+"px";
        coin.style.top=(p.y-25)+"px";
        game.appendChild(coin);
        coins.push({el:coin,x:p.x+p.w/2-7,y:p.y-25});
    }
    if((i+1)%3===0){
        const cp = document.createElement("div");
        cp.className="checkpoint";
        cp.style.left=(p.x+p.w/2-15)+"px";
        cp.style.top=(p.y-35)+"px";
        game.appendChild(cp);
        checkpoints.push({x:p.x+p.w/2-15,y:p.y-35});
    }
});

// Mobile & keyboard controls
document.addEventListener("keydown", e=>{
    if(e.key==="ArrowLeft") left=true;
    if(e.key==="ArrowRight") right=true;
    if(e.key==="ArrowUp") jumpFlag=true;
});
document.addEventListener("keyup", e=>{
    if(e.key==="ArrowLeft") left=false;
    if(e.key==="ArrowRight") right=false;
    if(e.key==="ArrowUp") jumpFlag=false;
});
['leftBtn','rightBtn','jumpBtn'].forEach(id=>{
    const btn=document.getElementById(id);
    btn.addEventListener('touchstart',e=>{e.preventDefault(); if(id==='leftBtn') left=true; if(id==='rightBtn') right=true; if(id==='jumpBtn') jumpFlag=true;},{passive:false});
    btn.addEventListener('touchend',e=>{e.preventDefault(); if(id==='leftBtn') left=false; if(id==='rightBtn') right=false; if(id==='jumpBtn') jumpFlag=false;},{passive:false});
});

// Message
function showMessage(text){
    message.innerText=text;
    message.style.display="block";
    setTimeout(()=>message.style.display="none",1500);
}

// Checkpoint
let lastCheckpoint={x:px,y:py};

// Game loop
function update(){
    // Horizontal
    vx=0; if(left) vx=-speed; if(right) vx=speed;

    // Gravity
    vy+=0.8;
    px+=vx; py+=vy;

    // Platforms
    onGround=false;
    platforms.forEach(p=>{
        // Moving
        if(p.type==='moving'){
            p.x+=p.dir*2; if(p.x<0||p.x+p.w>600)p.dir*=-1;
            p.el.style.left=p.x+"px";
        }
        // Disappear
        if(p.type==='disappear'){
            if(Math.random()<0.01)p.el.style.visibility=(p.el.style.visibility==="hidden"?"visible":"hidden");
        }
        const playerBottom = py+30;
        if(px+30>p.x && px<p.x+p.w && playerBottom>=p.y && playerBottom<=p.y+10 && vy>=0){
            py=p.y-30; vy=0; onGround=true;
        }
        p.el.style.top=p.y+"px";
    });

    // Jump
    if(jumpFlag && onGround){ vy=jumpPower; onGround=false; }

    // Coins
    coins.forEach(c=>{
        if(c.el.style.display!=="none" && px+30>c.x && px<c.x+15 && py+30>c.y && py<c.y+15){
            c.el.style.display="none"; coinsCollected++;
            coinsDisplay.innerText="Coins: "+coinsCollected;
        }
    });

    // Checkpoints
    checkpoints.forEach(cp=>{
        if(px+30>cp.x && px<cp.x+30 && py+30>cp.y && py<cp.y+30){
            lastCheckpoint={x:cp.x,y:cp.y}; showMessage("Checkpoint!");
        }
    });

    // Fall reset
    if(py>400){ px=lastCheckpoint.x; py=lastCheckpoint.y; vx=0; vy=0; }

    // Update player
    player.style.left=px+"px"; player.style.top=py+"px";

    requestAnimationFrame(update);
}

update();
