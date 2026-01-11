const game = document.getElementById("game");
const player = document.getElementById("player");

// Player position & velocity
let playerX = 10, playerY = 350;
let velX = 0, velY = 0;
let speed = 5, jumpPower = -15;
let onGround = false;

// Movement flags
let left = false, right = false, jump = false;

// Platforms
const platformsData = [
    {x:50,y:300,w:100},
    {x:200,y:250,w:100},
    {x:350,y:200,w:100},
    {x:500,y:150,w:80},
    {x:50,y:100,w:120}
];

let platforms = [];
platformsData.forEach(p=>{
    let el = document.createElement("div");
    el.className = "platform";
    el.style.left = p.x + "px";
    el.style.top = p.y + "px";
    el.style.width = p.w + "px";
    game.appendChild(el);
    platforms.push({...p, el});
});

// Keyboard
document.addEventListener("keydown", e=>{
    if(e.key==="ArrowLeft") left = true;
    if(e.key==="ArrowRight") right = true;
    if(e.key==="ArrowUp") jump = true;
});
document.addEventListener("keyup", e=>{
    if(e.key==="ArrowLeft") left = false;
    if(e.key==="ArrowRight") right = false;
    if(e.key==="ArrowUp") jump = false;
});

// Mobile buttons
document.getElementById("leftBtn").addEventListener("touchstart",()=>left=true);
document.getElementById("leftBtn").addEventListener("touchend",()=>left=false);
document.getElementById("rightBtn").addEventListener("touchstart",()=>right=true);
document.getElementById("rightBtn").addEventListener("touchend",()=>right=false);
document.getElementById("jumpBtn").addEventListener("touchstart",()=>jump=true);
document.getElementById("jumpBtn").addEventListener("touchend",()=>jump=false);

// Game loop
function update(){
    // Horizontal
    velX = 0;
    if(left) velX = -speed;
    if(right) velX = speed;

    // Gravity
    velY += 0.8;

    // Move
    playerX += velX;
    playerY += velY;

    // Collision detection with tolerance
    onGround = false;
    platforms.forEach(p=>{
        const playerBottom = playerY + 30;
        const platformTop = p.y;
        const platformBottom = p.y + 20;

        // Check if player is on top of platform (with 5px tolerance)
        if(playerX + 30 > p.x && playerX < p.x + p.w &&
           playerBottom >= platformTop && playerBottom <= platformTop + 5 &&
           velY >= 0){
            playerY = platformTop - 30;
            velY = 0;
            onGround = true;
        }
    });

    // Jump if on ground
    if(jump && onGround){
        velY = jumpPower;
        onGround = false;
    }

    // Fall reset
    if(playerY > 400){
        playerX = 10;
        playerY = 350;
        velX = 0;
        velY = 0;
    }

    // Apply position
    player.style.left = playerX + "px";
    player.style.top = playerY + "px";

    requestAnimationFrame(update);
}

update();
