const WINNING_SCORE = 5;
const CATCHER_WIDTH = 72;
const FALLING_OBJECT_SIZE = 82;
const CATCHER_BOTTOM_MARGIN = 3;

let catcher, fallingObject;
let catcherStartY;
let score = 0;
let gameStatus = "playing";
let backgroundImg, catcherImg, fallingObjectImg;
let sparkles = [];

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
    catcherStartY = height - CATCHER_BOTTOM_MARGIN - catcherHeight / 2;

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

    // No physics collider: the source art has transparent padding, so a
    // deliberately tight visible-character hitbox is checked below.
    fallingObject = new Sprite(100, 0, fallingObjectImg.width, fallingObjectImg.height, "n");
    fallingObject.img = fallingObjectImg;
    fallingObject.scale = fallingObjectScale;
    fallingObject.color = color(0, 128, 128);
    fallingObject.vel.y = 2;
    fallingObject.rotationLock = true;
}

function draw() {
    background(224);
    drawBackground();
    drawTint();
    updateSparkles();

    if (gameStatus === "won") {
        youWin();
        return;
    }

    if (gameStatus === "lost") {
        youLose();
        return;
    }

    drawHud();

    if (fallingObject.y >= height) {
        score -= 1;

        if (score < 0) {
            score = 0;
            endGame("lost");
            return;
        }

        resetFallingObject();
    }

    if (kb.pressing("left") || kb.pressing("a")) {
        catcher.vel.x = -4.5;
    } else if (kb.pressing("right") || kb.pressing("d")) {
        catcher.vel.x = 4.5;
    } else {
        catcher.vel.x = 0;
    }

    const catcherHalfWidth = CATCHER_WIDTH / 2;

    if (catcher.x < catcherHalfWidth) {
        catcher.x = catcherHalfWidth;
    } else if (catcher.x > width - catcherHalfWidth) {
        catcher.x = width - catcherHalfWidth;
    }

    if (isRealCatch()) {
        score += 1;
        makeSparkles(fallingObject.x, fallingObject.y);

        if (score >= WINNING_SCORE) {
            endGame("won");
            return;
        }

        resetFallingObject();
    }

}

function isRealCatch() {
    // The visible part of Jinu occupies about 40% of the source image's
    // width and 90% of its height.
    const objectHalfWidth = FALLING_OBJECT_SIZE * 0.19;
    const objectHalfHeight = FALLING_OBJECT_SIZE * 0.44;
    const catcherHeight = catcherImg.height * catcher.scale;
    const catcherHalfWidth = CATCHER_WIDTH * 0.42;
    const catcherTop = catcher.y - catcherHeight / 2;
    const objectBottom = fallingObject.y + objectHalfHeight;

    return (
        objectBottom >= catcherTop + 8 &&
        fallingObject.y - objectHalfHeight < catcher.y + catcherHeight / 2 &&
        fallingObject.x + objectHalfWidth >= catcher.x - catcherHalfWidth &&
        fallingObject.x - objectHalfWidth <= catcher.x + catcherHalfWidth
    );
}

function drawTint() {
    noStroke();
    fill(18, 5, 46, 55);
    rect(0, 0, width, height);
    fill(30, 8, 67, 170);
    rect(0, 0, width, 64);
}

function drawHud() {
    textAlign(LEFT, CENTER);
    noStroke();
    fill(255, 245);
    textStyle(BOLD);
    textSize(18);
    text("SCORE  " + score + " / " + WINNING_SCORE, 16, 24);

    fill(127, 247, 255);
    textStyle(NORMAL);
    textSize(11);
    text("←  →  or  A  D  to move", 16, 47);
}

function makeSparkles(x, y) {
    for (let i = 0; i < 14; i += 1) {
        sparkles.push({
            x,
            y,
            vx: random(-3, 3),
            vy: random(-4, -1),
            life: 30,
            size: random(3, 8)
        });
    }
}

function updateSparkles() {
    noStroke();
    for (let i = sparkles.length - 1; i >= 0; i -= 1) {
        const sparkle = sparkles[i];
        sparkle.x += sparkle.vx;
        sparkle.y += sparkle.vy;
        sparkle.vy += 0.16;
        sparkle.life -= 1;
        fill(127, 247, 255, sparkle.life * 8);
        circle(sparkle.x, sparkle.y, sparkle.size);
        if (sparkle.life <= 0) sparkles.splice(i, 1);
    }
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
    fill(20, 5, 48, 210);
    rect(28, 120, width - 56, 160, 22);
    textAlign(CENTER, CENTER);
    fill(127, 247, 255);
    textStyle(BOLD);
    textSize(30);
    text(message, width / 2, height / 2 - 20);
    fill(255);
    textStyle(NORMAL);
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
    fallingObject.y = -FALLING_OBJECT_SIZE / 2;
    fallingObject.x = random(30, width - 30);
    fallingObject.vel.y = random(2.1, 3.6);
    fallingObject.direction = "down";
}
