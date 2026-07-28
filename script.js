const WINNING_SCORE = 5;
const CATCHER_WIDTH = 43;
const FALLING_OBJECT_SIZE = 40;

let catcher, fallingObject;
let catcherStartY;
let score = 0;
let gameStatus = "playing";
let backgroundImg, catcherImg, fallingObjectImg;

/* PRELOADS FILES */
function preload () {
    backgroundImg = loadImage("assets/Kpop-Demon-Hunters.png");
    catcherImg = loadImage("assets/RumiKPOP-removebg-preview.png");
    fallingObjectImg = loadImage("assets/image-removebg-preview.png");
}

function setup() {
    const canvas = createCanvas(400, 400);
    const gameContainer = document.getElementById("game");

    const catcherScale = CATCHER_WIDTH / catcherImg.width;
    const catcherHeight = catcherImg.height * catcherScale;
    const fallingObjectScale =
        FALLING_OBJECT_SIZE / fallingObjectImg.width;
    catcherStartY = height - catcherHeight / 2;

    if (gameContainer) {
        canvas.parent(gameContainer);
    }

    catcher = new Sprite(
        200,
        catcherStartY,
        catcherImg.width,
        catcherImg.height,
        "k"
    );
    catcher.img = catcherImg;
    catcher.scale = catcherScale;
    catcher.color = color(95, 158, 160);

    fallingObject = new Sprite(100, 0, fallingObjectImg.width);
    fallingObject.img = fallingObjectImg;
    fallingObject.scale = fallingObjectScale;
    fallingObject.color = color(0, 128, 128);
    fallingObject.vel.y = 2;
    fallingObject.rotationLock = true;
}

function draw() {
    background(224);
    drawBackground();

    if (gameStatus === "won") {
        youWin();
        return;
    }

    if (gameStatus === "lost") {
        youLose();
        return;
    }

    textAlign(LEFT, TOP);
    fill(0);
    textSize(12);
    text(
        "Hey! Help Rumi catch \nJinu! Use the left and \nright arrow keys.",
        width - 120,
        20,
        110
    );

    if (fallingObject.y >= height) {
        score -= 1;

        if (score < 0) {
            score = 0;
            endGame("lost");
            return;
        }

        resetFallingObject();
    }

    if (kb.pressing("left")) {
        catcher.vel.x = -3;
    } else if (kb.pressing("right")) {
        catcher.vel.x = 3;
    } else {
        catcher.vel.x = 0;
    }

    const catcherHalfWidth = CATCHER_WIDTH / 2;

    if (catcher.x < catcherHalfWidth) {
        catcher.x = catcherHalfWidth;
    } else if (catcher.x > width - catcherHalfWidth) {
        catcher.x = width - catcherHalfWidth;
    }

    if (fallingObject.collides(catcher)) {
        score += 1;

        if (score >= WINNING_SCORE) {
            endGame("won");
            return;
        }

        resetFallingObject();
    }

    fill(0, 128, 128);
    textSize(20);
    text("Score = " + score, 10, 30);
}

function drawBackground() {
    imageMode(CORNER);

    const scale = max(
        width / backgroundImg.width,
        height / backgroundImg.height
    );
    const backgroundWidth = backgroundImg.width * scale;
    const backgroundHeight = backgroundImg.height * scale;
    const backgroundX = (width - backgroundWidth) / 2;
    const backgroundY = (height - backgroundHeight) / 2;

    image(
        backgroundImg,
        backgroundX,
        backgroundY,
        backgroundWidth,
        backgroundHeight
    );
}

function endGame(result) {
    gameStatus = result;
    catcher.vel.x = 0;
    fallingObject.vel.y = 0;

    catcher.x = 2000;
    catcher.y = 2000;
    fallingObject.x = 2000;
    fallingObject.y = 2000;
}

function youWin() {
    drawEndScreen("Bravo! You Win", "Click to play again");

    if (mouseIsPressed) {
        restart();
    }
}

function youLose() {
    drawEndScreen("Oh No! You Lose", "Click to try again");

    if (mouseIsPressed) {
        restart();
    }
}

function drawEndScreen(message, instruction) {
    textAlign(CENTER, CENTER);
    fill(0, 128, 128);
    textSize(30);
    text(message, width / 2, height / 2 - 20);
    textSize(16);
    text(instruction, width / 2, height / 2 + 28);
}

function restart() {
    score = 0;
    gameStatus = "playing";

    catcher.x = 200;
    catcher.y = catcherStartY;
    catcher.visible = true;

    fallingObject.visible = true;
    resetFallingObject();
}

function resetFallingObject() {
    fallingObject.y = 0;
    fallingObject.x = random(width);
    fallingObject.vel.y = random(1, 5);
    fallingObject.direction = "down";
}
