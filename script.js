const game = document.getElementById("game");
const player = document.getElementById("player");

// Player
let px = 10, py = 350;
let vx = 0, vy = 0;
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

// Mobile
document.getElementById("leftBtn").addEventListener("touchstart",()=>left=true);
document.getElementById("leftBtn").addEventListener("touchend",()=>left=false);
document.getElementById("rightBtn").addEventListener("touchstart",()=>right=true);
document.getElementById("rightBtn").addEventListener("touchend",()=>right=false);
document.getElementById("jumpBtn").addEventListener("touchstart",()=>jump=true);
document.getElementById("jumpBtn").addEventListener("touchend",()=>jump=false);

// Game loop
function update() {
    // Horizontal movement
    vx = 0;
    if(left) vx = -speed;
    if(right) vx = speed;

    // Gravity
    vy += 0.8;

    // Apply movement
    px += vx;
    py += vy;

    // Platform collision (with 5px tolerance)
    onGround = false;
    platforms.forEach(p=>{
        const playerBottom = py + 30;
        const platformTop = p.y;
        const platformBottom = p.y + 20;

        if(px + 30 > p.x && px < p.x + p.w &&
           playerBottom >= platformTop && playerBottom <= platformTop + 5 &&
           vy >= 0){
            py = platformTop - 30;
            vy = 0;
            onGround = true;
        }
    });

    // Jump
    if(jump && onGround){
        vy = jumpPower;
        onGround = false;
    }

    // Reset if fall
    if(py > 400){
        px = 10; py = 350;
        vx = 0; vy = 0;
    }

    // Apply position
    player.style.left = px + "px";
    player.style.top = py + "px";

    requestAnimationFrame(update);
}

update();
