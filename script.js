const game = document.getElementById("game");
const player = document.getElementById("player");
const coinDisplay = document.getElementById("coins");

let playerPos = {x:10, y:350};
let velocity = {x:0, y:0};
let gravity = 0.8;
let jumpPower = -15;
let onGround = false;
let checkpoints = [];
let lastCheckpoint = {x:10, y:350};
let coinsCollected = 0;

// ---------- STAGE ELEMENTS ----------
const platformsData = [
    {x:50, y:300, w:100}, {x:200, y:250, w:100, type:'moving'}, {x:350, y:200, w:100},
    {x:500, y:150, w:80, type:'disappear'}, {x:50, y:100, w:120}, {x:200, y:50, w:100},
    {x:350, y:120, w:90}, {x:500, y:80, w:70}, {x:100, y:220, w:80}, {x:250, y:300, w:100},
    {x:400, y:260, w:90}, {x:50, y:180, w:120}, {x:200, y:130, w:100}, {x:350, y:80, w:90}, {x:500, y:40, w:70},
    {x:100, y:200, w:80}, {x:250, y:150, w:100}, {x:400, y:100, w:90}, {x:550, y:50, w:50}, {x:300, y:300, w:100},
    {x:150, y:250, w:80}, {x:50, y:50, w:70}, {x:250, y:100, w:100}, {x:400, y:60, w:60}, {x:500, y:20, w:50}
];

let platforms = [];
platformsData.forEach((s,i)=>{
    let p = document.createElement("div");
    p.classList.add("platform");
    if(s.type) p.classList.add(s.type);
    p.style.left = s.x + "px";
    p.style.top = s.y + "px";
    p.style.width = s.w + "px";
    game.appendChild(p);
    platforms.push({el:p, x:s.x, y:s.y, w:s.w, type:s.type || null, dir:1});
    
    // Checkpoints every 5 platforms
    if ((i+1)%5===0){
        let cp = document.createElement("div");
        cp.classList.add("checkpoint");
        cp.style.left = (s.x+s.w/2-15) + "px";
        cp.style.top = (s.y-35) + "px";
        game.appendChild(cp);
        checkpoints.push({x: s.x+s.w/2-15, y:s.y-35});
    }

    // Add coins on every 2nd platform
    if ((i+1)%2===0){
        let coin = document.createElement("div");
        coin.classList.add("coin");
        coin.style.left = (s.x+s.w/2-7) + "px";
        coin.style.top = (s.y-25) + "px";
        game.appendChild(coin);
        s.coinEl = coin;
    }
});

// ---------- CONTROLS ----------
let isLeft=false, isRight=false, isJump=false;

document.addEventListener("keydown", e=>{
    if(e.key==="ArrowLeft") isLeft=true;
    if(e.key==="ArrowRight") isRight=true;
    if(e.key==="ArrowUp" && onGround) isJump=true;
});
document.addEventListener("keyup", e=>{
    if(e.key==="ArrowLeft") isLeft=false;
    if(e.key==="ArrowRight") isRight=false;
    if(e.key==="ArrowUp") isJump=false;
});

// Mobile buttons
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const jumpBtn = document.getElementById("jumpBtn");

leftBtn.addEventListener("touchstart", ()=>isLeft=true);
leftBtn.addEventListener("touchend", ()=>isLeft=false);

rightBtn.addEventListener("touchstart", ()=>isRight=true);
rightBtn.addEventListener("touchend", ()=>isRight=false);

jumpBtn.addEventListener("touchstart", ()=>{
    if(onGround) isJump=true;
});
jumpBtn.addEventListener("touchend", ()=>isJump=false);

// ---------- GAME LOOP ----------
function update(){
    // Horizontal movement
    velocity.x=0;
    if(isLeft) velocity.x=-5;
    if(isRight) velocity.x=5;
    if(isJump){ velocity.y=jumpPower; onGround=false; }

    // Gravity
    velocity.y += gravity;
    playerPos.x += velocity.x;
    playerPos.y += velocity.y;

    // Platform collisions
    onGround=false;
    platforms.forEach(p=>{
        if(playerPos.x+30 > p.x && playerPos.x < p.x+p.w &&
           playerPos.y+30 > p.y && playerPos.y+30 < p.y+20 &&
           velocity.y>=0){
            playerPos.y = p.y-30;
            velocity.y=0;
            onGround=true;
        }

        // Moving platforms
        if(p.type==='moving'){
            p.x += p.dir*2;
            if(p.x<0 || p.x+p.w>600) p.dir*=-1;
            p.el.style.left = p.x + "px";
        }

        // Disappearing platforms
        if(p.type==='disappear'){
            if(Math.random()<0.01) p.el.style.visibility = (p.el.style.visibility==='hidden' ? 'visible':'hidden');
        }

        p.el.style.left = p.x + "px";
    });

    // Checkpoints
    checkpoints.forEach(cp=>{
        if(playerPos.x+30 > cp.x && playerPos.x < cp.x+30 &&
           playerPos.y+30 > cp.y && playerPos.y < cp.y+30){
            lastCheckpoint = {x:cp.x, y:cp.y};
        }
    });

    // Coins
    platforms.forEach(p=>{
        if(p.coinEl && p.coinEl.style.display!=="none"){
            if(playerPos.x+30 > p.x+p.w/2-7 && playerPos.x < p.x+p.w/2+8 &&
               playerPos.y+30 > p.y-25 && playerPos.y < p.y-10){
                p.coinEl.style.display="none";
                coinsCollected++;
                coinDisplay.innerText = "Coins Collected: " + coinsCollected;
            }
        }
    });

    // Reset if fall
    if(playerPos.y > 400){
        playerPos = {x:lastCheckpoint.x, y:lastCheckpoint.y};
        velocity = {x:0, y:0};
    }

    // Apply position
    player.style.left = playerPos.x + "px";
    player.style.top = playerPos.y + "px";

    requestAnimationFrame(update);
}

update();
