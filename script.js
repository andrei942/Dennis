const game = document.getElementById("game");
const player = document.getElementById("player");

let playerPos = {x: 10, y: 350};
let velocity = {x: 0, y: 0};
let gravity = 0.8;
let jumpPower = -15;
let onGround = false;

// Movement flags
let isLeft = false;
let isRight = false;
let isJump = false;

// ---------- Platforms ----------
const platformsData = [
    {x:50, y:300, w:100},
    {x:200, y:250, w:100},
    {x:350, y:200, w:100},
    {x:500, y:150, w:80},
    {x:50, y:100, w:120}
];

let platforms = [];

platformsData.forEach(p=>{
    let el = document.createElement("div");
    el.classList.add("platform");
    el.style.left = p.x + "px";
    el.style.top = p.y + "px";
    el.style.width = p.w + "px";
    game.appendChild(el);
    platforms.push({el, ...p});
});

// ---------- Keyboard controls ----------
document.addEventListener("keydown", e=>{
    if(e.key==="ArrowLeft") isLeft=true;
    if(e.key==="ArrowRight") isRight=true;
    if(e.key==="ArrowUp") isJump=true;
});
document.addEventListener("keyup", e=>{
    if(e.key==="ArrowLeft") isLeft=false;
    if(e.key==="ArrowRight") isRight=false;
    if(e.key==="ArrowUp") isJump=false;
});

// ---------- Mobile buttons ----------
document.getElementById("leftBtn").addEventListener("touchstart", ()=>isLeft=true);
document.getElementById("leftBtn").addEventListener("touchend", ()=>isLeft=false);

document.getElementById("rightBtn").addEventListener("touchstart", ()=>isRight=true);
document.getElementById("rightBtn").addEventListener("touchend", ()=>isRight=false);

document.getElementById("jumpBtn").addEventListener("touchstart", ()=>isJump=true);
document.getElementById("jumpBtn").addEventListener("touchend", ()=>isJump=false);

// ---------- Game loop ----------
function update(){
    // Horizontal movement
    velocity.x = 0;
    if(isLeft) velocity.x = -5;
    if(isRight) velocity.x = 5;

    // Jump if on ground
    if(isJump && onGround){
        velocity.y = jumpPower;
        onGround = false;
    }

    // Gravity
    velocity.y += gravity;
    playerPos.x += velocity.x;
    playerPos.y += velocity.y;

    // Platform collisions
    onGround = false;
    platforms.forEach(p=>{
        if(playerPos.x + 30 > p.x &&
           playerPos.x < p.x + p.w &&
           playerPos.y + 30 > p.y &&
           playerPos.y + 30 < p.y + 20 &&
           velocity.y >= 0){
            playerPos.y = p.y - 30;
            velocity.y = 0;
            onGround = true;
        }
    });

    // Fall reset
    if(playerPos.y > 400){
        playerPos.x = 10;
        playerPos.y = 350;
        velocity = {x:0, y:0};
    }

    // Apply position
    player.style.left = playerPos.x + "px";
    player.style.top = playerPos.y + "px";

    requestAnimationFrame(update);
}

update();
