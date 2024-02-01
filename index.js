// caixa do jogo
let board;
let boardWidth = 1250;
let boardHeight = 500;
let context;

// dino
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;
let dinoFrames = []; 
let currentFrame = 0;
let frameCount = 0; 
const frameChangeInterval = 5;

let dino = {
    x : dinoX,
    y : dinoY,
    width : dinoWidth,
    height : dinoHeight
}

// cactus
let cactusArray = [];

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX = boardWidth;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

// fiisca
let velocityX = -8;
let velocityY = 0;
let gravity = .4;

let gameOver = false;
let score = 0;
let firstDeath = true; 

let gameStarted = false;

// Carregar jogo

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d");

    loadDinoFrames(); //

    cactus1Img = new Image();
    cactus1Img.src = "./imagens/cactus1.png";

    cactus2Img = new Image();
    cactus2Img.src = "./imagens/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "./imagens/cactus3.png";
}

function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        document.getElementById("startButton").style.display = "none"; // Ocultar botão "Iniciar"
        requestAnimationFrame(update);
        setInterval(placeCactus, 1000);
        document.addEventListener("keydown", moveDino);
    }
}

function loadDinoFrames() {
    for (let i = 1; i <= 2; i++) {
        let frame = new Image();
        frame.src = `./imagens/dino-run${i}.png`;
        dinoFrames.push(frame);
    }
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        if (!firstDeath) {
            document.getElementById("gameOverScreen").style.display = "block";
        }
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // dino
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY); 
    
    // animação de correr
    context.drawImage(dinoFrames[currentFrame], dino.x, dino.y, dino.width, dino.height);
    
    // atualizar frame counter
    frameCount++;
    if (frameCount >= frameChangeInterval) {
        frameCount = 0;
        currentFrame = (currentFrame + 1) % dinoFrames.length;
    }

    // cactus
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (detectCollision(dino, cactus)) {
            gameOver = true;
            context.drawImage(dinoFrames[0], dino.x, dino.y, dino.width, dino.height); 
            if (firstDeath) {
                firstDeath = false;
            }
        }
    }

    // score
    context.fillStyle="black";
    context.font="20px courier";
    score++;
    context.fillText("Pontos: " + score, 5, 20);
}

function moveDino(e) {
    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
        velocityY = -10;
    }
    else if (e.code == "ArrowDown" && dino.y == dinoY) {
    }

}

function placeCactus() {
    if (gameOver) {
        return;
    }

    let cactus = {
        img : null,
        x : cactusX,
        y : cactusY,
        width : null,
        height: cactusHeight
    }

    let placeCactusChance = Math.random();

    if (placeCactusChance > .90) { //10% de chance para cactus3
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .70) { //30% de chance para cactus2
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .50) { //50% de chance para cactus1
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }

    if (cactusArray.length > 5) {
        cactusArray.shift(); 
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&  
        a.x + a.width > b.x &&   
        a.y < b.y + b.height &&  
        a.y + a.height > b.y;    
}

function resetGame() {
    document.getElementById("gameOverScreen").style.display = "none";
    gameOver = false;
    score = 0;
    currentFrame = 0; 
    dino.y = dinoY;
    cactusArray = [];
    firstDeath = true;
}