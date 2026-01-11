const game = document.getElementById("game");
const player = document.getElementById("player");
const coinsDisplay = document.getElementById("coins");
const message = document.getElementById("message");

// Player properties
let px = 10, py = 350;
let vx = 0, vy = 0;
let speed = 5, jumpPower = -15;
let onGround = false;

// Movement flags
let left = false, right = false, jump = false;

// Coin tracking
let coinsCollected = 0;

// Platforms
const platformsData = [
    {x:50,y:300,w:100},{x:200,y:250,w:100,type:"moving"},
    {x:350,y:200,w:100},{x:500,y:150,w:80,type:"disappear"},
    {x:50,y:100,w:120},{x:200,y:50,w:100},{x:350,y:120,w:90},{x:500,y:80,w:70}
];

let platforms = [];
let coins = [];
let checkpoints = [];
let lastCheckpoint = {x:px, y:py};

// Create platforms, coins, and checkpoints
platformsData.forEach((p,i)=>{
    let el = document.createElement("div");
    el.className = "platform";
    if(p.type) el.classList.add(p.type);
    el.style.left = p.x+"px";
    el.style.top = p.y+"px";
    el.style.width = p.w+"px";
    game.appendChild(el);
    platforms.push({...p, el, dir:1});

    // Coins every 2nd platform
    if((i+1)%2===0){
        let coin = document.createElement("div");
        coin.className="coin";
        coin.style.left=(p.x+p.w/2-7)+"px";
        coin.style.top=(p.y-25)+"px";
        game.appendChild(coin);
        coins.push({el:coin, x:p.x+p.w/2-7, y:p.y-25});
    }

    // Checkpoints every 3rd platform
    if((i+1)%3===0){
        let cp = document.createElement("div");
        cp.className="checkpoint";
        cp.style.left=(p.x+p.w/2-15)+"px";
        cp.style.top=(p.y-35)+"px";
        game.appendChild(cp);
        checkpoints.push({x:p.x+p.w/2-15, y:p.y-35});
    }
});

// Keyboard
document.addEventListener("keydown", e=>{
    if(e.key==="ArrowLeft") left=true;
    if(e.key==="ArrowRight") right=true;
    if(e.key==="ArrowUp") jump=true;
});
document.addEventListener("keyup", e=>{
    if(e.key==="ArrowLeft") left=false;
    if(e.key==="ArrowRight") right=false;
    if(e.key==="ArrowUp") jump=false;
});

// Mobile
document.getElementById("leftBtn").addEventListener("pointerdown",()=>left=true);
document.getElementById("leftBtn").addEventListener("pointerup",()=>left=false);
document.getElementById("rightBtn").addEventListener("pointerdown",()=>right=true);
document.getElementById("rightBtn").addEventListener("pointerup",()=>right=false);
document.getElementById("jumpBtn").addEventListener("pointerdown",()=>jump=true);
document.getElementById("jumpBtn").addEventListener("pointerup",()=>jump=false);

// Show message
function showMessage(text){
    message.innerText=text;
    message.style.display="block";
    setTimeout(()=>message.style.display="none",1500);
}

// Game loop
function update(){
    // Horizontal
    vx = 0;
    if(left) vx=-speed;
    if(right) vx=speed;

    // Gravity
    vy+=0.8;

    // Move
    px+=vx;
    py+=vy;

    // Platform collisions
    onGround=false;
    platforms.forEach(p=>{
        // Moving platforms
        if(p.type==="moving"){
            p.x+=p.dir*2;
            if(p.x<0 || p.x+p.w>600) p.dir*=-1;
            p.el.style.left=p.x+"px";
        }

        // Disappear platforms
        if(p.type==="disappear"){
            if(Math.random()<0.01) p.el.style.visibility=(p.el.style.visibility==="hidden"?"visible":"hidden");
        }

        const playerBottom = py+30;
        if(px+30>p.x && px<p.x+p.w && playerBottom>=p.y && playerBottom<=p.y+5 && vy>=0){
            py=p.y-30;
            vy=0;
            onGround=true;
        }

        p.el.style.top=p.y+"px";
        p.el.style.left=p.x+"px";
    });

    // Jump
    if(jump && onGround){
        vy=jumpPower;
        onGround=false;
    }

    // Coins
    coins.forEach(c=>{
        if(c.el.style.display!=="none"){
            if(px+30>c.x && px<c.x+15 && py+30>c.y && py<c.y+15){
                c.el.style.display="none";
                coinsCollected++;
                coinsDisplay.innerText="Coins: "+coinsCollected;
            }
        }
    });

    // Checkpoints
    checkpoints.forEach(cp=>{
        if(px+30>cp.x && px<cp.x+30 && py+30>cp.y && py<cp.y+30){
            lastCheckpoint={x:cp.x, y:cp.y};
            showMessage("Checkpoint!");
        }
    });

    // Fall reset
    if(py>400){
        px=lastCheckpoint.x;
        py=lastCheckpoint.y;
        vx=0; vy=0;
    }

    // Apply position
    player.style.left=px+"px";
    player.style.top=py+"px";

    requestAnimationFrame(update);
}

update();
