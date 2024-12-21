const userScore = document.getElementById('score');
const highScore = document.getElementById('highScore');

// Snake canvas
const canvas = document.getElementById("gameCanvas");
canvas.style.backgroundColor = "rgb(240, 155, 155)";
canvas.style.position = 'relative';
canvas.style.borderRadius = 7 + 'px';
const context = canvas.getContext("2d");

// Power Spawner
const powerCanvas = document.createElement('canvas');
powerCanvas.style.position = 'absolute';
powerCanvas.style.top = canvas.offsetTop + 'px';
powerCanvas.style.left = canvas.offsetLeft + 'px';
powerCanvas.height = 300;
powerCanvas.width = 300;
powerCanvas.style.backgroundColor = "rgba(0,0,0,0)";
document.body.appendChild(powerCanvas);
const powerContext = powerCanvas.getContext("2d");

// Game Over Screen
const gameOverCanvas = document.createElement('canvas');
gameOverCanvas.style.position = 'absolute';
gameOverCanvas.style.top = canvas.offsetTop + 'px';
gameOverCanvas.style.left = canvas.offsetLeft + 'px';
gameOverCanvas.height = 300;
gameOverCanvas.width = 300;
gameOverCanvas.style.backgroundColor = "rgba(0,0,0,0)";
document.body.appendChild(gameOverCanvas);
const goCtx = gameOverCanvas.getContext("2d");

// snake object
let rect = [{x: 150, y: 150},
    {x: 140, y: 150},
    {x: 130, y: 150},
    {x: 120, y: 150},
    {x: 110, y: 150}
];

// variable to store user's score
let score = 0;

// initial power's position
let power = [{
    pos: { x: 20 , y: 90 },
    isEaten: false
}];

// object to keep track of movements
let moveDir = {
    up: false,
    down: false,
    right: false,
    left: false
}

// direction x and direction y
let dx = 10;
let dy = 10;

// interval Id of the setInterval() that is used to move the snake
let intervalID;
// interval Id of setInterval() that spawns power
let powerInterval;

const resetDirY = ()=>{
    moveDir.down = false;
    moveDir.up = false;
}

const resetDirX = ()=>{
    moveDir.right = false;
    moveDir.left = false;
}

function drawGameOver() {
    // Clear the canvas
    goCtx.clearRect( 0, 0, gameOverCanvas.width , gameOverCanvas.height );

    // Set text properties
    goCtx.fillStyle = 'rgb(189, 40, 65)'; // Text color
    goCtx.font = 'bold 30px Arial'; // Font size and family
    goCtx.textAlign = 'center'; // Center the text
    goCtx.textBaseline = 'middle'; // Middle alignment

    // Draw the text in the center of the canvas
    goCtx.fillText('Game Over', canvas.width / 2, canvas.height / 2);

    goCtx.font = 'bold 18px Arial'; // Update Font size
    goCtx.fillText('Press Enter to reset', canvas.width / 2, ( canvas.height / 2 ) + 20 );
}

function gameOver() {
    drawGameOver();
    // clear all intervals stopping the snake's movement
    clearInterval(intervalID);
    clearInterval(powerInterval);

     // Set all direction to be true, so that snake stops
    moveDir.down = true;
    moveDir.up = true;
    moveDir.right = true;
    moveDir.left = true;

    const handleKeyDown = (e) => {
        // on clicking spacebar
        if (e.code === 'Enter') {
            reset();
            document.removeEventListener('keydown', handleKeyDown);
        }
    };

    document.addEventListener('keydown', handleKeyDown);
}

function snakeCollision(){
    clearInterval(intervalID);
    gameOver();
}

function findSnakeCollision() {
    const head = rect[0]; //Keep first index as head
    
    for (let i = 1; i < rect.length; i++) {
        const segment = rect[i];

        if (
            head.x < segment.x + 10 &&
            head.x + 10 > segment.x &&
            head.y < segment.y + 10 &&
            head.y + 10 > segment.y
        ) {
            snakeCollision();
            break; // Exit loop on collision
        }
    }
}

function drawNewPower(newPower){
    
    powerContext.fillStyle = 'rgb(189, 40, 65)';
    powerContext.strokeStyle = 'rgb(189, 40, 65)';
    powerContext.fillRect( newPower.pos.x , newPower.pos.y , 10 , 10 );
    powerContext.strokeRect( newPower.pos.x , newPower.pos.y , 10 , 10 );
}

const powerPositionFlag = []; //Array to store if power has spawned on top of snake

// Generate spawn points for power randomly
const generateRandomSpawnVertices = ()=>( Math.random() * (300 - 30) );

function checkPowerVertices( posX , posY ){
    powerPositionFlag.length = 0;

    rect.forEach( item => {
        if( item.x === posX && item.y === posY ){
            powerPositionFlag.push({ posX: false , posY: false });
        }else if( item.x === posX ){
            powerPositionFlag.push({ posX: false , posY: true });
        }else  if( item.y === posY ){
            powerPositionFlag.push({ posX: true , posY: false });
        }else{
            powerPositionFlag.push({ posX: true , posY: true });
        }   
    } )
}

function drawPower(){
    powerContext.clearRect(0, 0, powerCanvas.width, powerCanvas.height);
    // if power is not yet eaten, return
    if( !power[0].isEaten ){
        drawNewPower(power[0]);
        return
    }

    let posX = generateRandomSpawnVertices() + 10;
    let posY = generateRandomSpawnVertices() + 10;

    // Generate random spawn points and validate them
    while (true){
        checkPowerVertices(posX, posY);

        // Check flags; break the loop if position is valid
        const isValid = powerPositionFlag.every(flag => flag.posX && flag.posY);
        if (isValid) break;

        posX = generateRandomSpawnVertices() + 10;
        posY = generateRandomSpawnVertices() + 10;
    } 

    const newPower = {
        pos: { x: posX, y: posY },
        isEaten: false
    };
    // replace with newPower
    power[0] = newPower
    // Draw the new power's position
    drawNewPower(newPower)
}

function drawNewSnake( newRect ){
    context.fillStyle = 'rgb(241, 94, 94)';
    context.strokeStyle = 'rgb(146, 37, 37)';
    context.fillRect( newRect.x , newRect.y , 10 , 10 );
    context.strokeRect( newRect.x , newRect.y , 10 , 10 );
}

function drawRect(){
    rect.forEach(drawNewSnake);
    findSnakeCollision();
}

function moveRectRight(){

    let newRect = { x: rect[0].x + dx , y: rect[0].y };

    if( newRect.x > 300 ){
        newRect.x = 0;
    }
    else if( newRect.x < 0 ){
        newRect.x = 300;
    }

    rect.unshift(newRect);
    rect.pop();

    context.clearRect(0, 0, canvas.width, canvas.height);
    drawRect();
}

function moveRectLeft(){

    let newRect = { x: rect[0].x - dx , y: rect[0].y };

    if( newRect.x < 0 ){
        newRect.x = 300;
    }else if( newRect.x > 300 ){
        newRect.x = 0;
    }

    rect.unshift(newRect);
    rect.pop();

    context.clearRect(0 , 0 , canvas.width, canvas.height);
    drawRect();
}

function moveRectDown(){

    let newRect = { x: rect[0].x , y: rect[0].y + dy };

    if( newRect.y > 300 ){
        newRect.y = 0;
    }
    else if( newRect.y < 0 ){
        newRect.y = 300;
    }

    rect.unshift(newRect);
    rect.pop();

    context.clearRect(0, 0, canvas.width, canvas.height);
    drawRect();

}

function moveRectUp(){

    let newRect = { x: rect[0].x , y: rect[0].y - dy };

    if( newRect.y > 300 ){
        newRect.y = 0;
    }
    else if( newRect.y < 0 ){
        newRect.y = 300;
    }

    rect.unshift(newRect);
    rect.pop();

    context.clearRect(0, 0, canvas.width, canvas.height);
    drawRect();
}

const updateSize  = ()=>{
    let newRect = { x: rect[rect.length - 1].x + dx , y: rect[rect.length-1].y + dy };
    rect.push(newRect);

    context.clearRect(0, 0, canvas.width, canvas.height);
    drawRect();
}

const updateScore = () =>{
    score++;
    userScore.textContent = score;

    const savedHighScore = localStorage.getItem('highScore');
    const savedHighScoreValue = savedHighScore !== null ? parseInt(savedHighScore,10) : 0

    if( score > savedHighScoreValue ){
        localStorage.setItem('highScore',score);
        highScore.textContent = score;
    }else{
        highScore.textContent = savedHighScoreValue;
    }

}

function collision(){
    power[0].isEaten = true;
    updateScore();
    updateSize();
}

const createPower = ()=>{
    powerInterval = setInterval( ()=>{
        drawPower();
        // The first object is the head of the snake
        head = rect[0];
        if (
            head.x < power[0].pos.x + 10 &&
            head.x + 10 > power[0].pos.x &&
            head.y < power[0].pos.y + 10 &&
            head.y + 10 > power[0].pos.y
        ){
            collision();
        }
    }, 50 );
}

function gameLoop(){
    createPower();
    drawRect();
}

gameLoop();

let clickCount = 0;
let makeMoveLeftPossible = false;

document.addEventListener('keydown', function(event){

    if( clickCount === 1 ){
        makeMoveLeftPossible = true;
    }

    // Up
    if( event.key === 'w' || event.key === 'W' || event.key === 'ArrowUp'){
        clickCount++;
        if( moveDir.down ){
            return
        }
        // if the rect is moving, stop it
        if( intervalID ){
            clearInterval(intervalID)
        }

        // set the moveDir.up to true, to indicate the current direction
        moveDir.up = true;
        // reset the X axis's direction
        resetDirX();

        // start an interval to move the rect up
        intervalID = setInterval( moveRectUp , 50 );

    }
    // Right
    else if( event.key === 'd' || event.key === 'D' || event.key === 'ArrowRight' ){
        clickCount++;

        if( moveDir.left ){
            return
        }
        // if the rect is moving, stop it
        if( intervalID ){
            clearInterval(intervalID)
        }

        // set the moveDir.right to true, to indicate the current direction
        moveDir.right = true;
        // reset the Y axis's direction
        resetDirY();

        // start an interval to move the rect side
        intervalID = setInterval( moveRectRight , 50 );

    }
    // Left
    else if( event.key === 'a' || event.key === 'A' || event.key === 'ArrowLeft'){

        if( moveDir.right ){
            return
        }
        if( !makeMoveLeftPossible ){
            return
        }
        // if the rect is moving, stop it
        if( intervalID ){
            clearInterval(intervalID)
        }

        // set the moveDir.left to true, to indicate the current direction
        moveDir.left = true;
        // reset the Y axis's direction
        resetDirY();

        // start an interval to move the rect side
        intervalID = setInterval( moveRectLeft , 50 );

    }
    // Down
    else if( event.key === 's' || event.key === 'S' || event.key === 'ArrowDown'){
        clickCount++;

        if( moveDir.up ){
            return
        }
        // if the rect is moving, stop it
        if( intervalID ){
            clearInterval(intervalID)
        }

        // set the moveDir.right to true, to indicate the current direction
        moveDir.down = true
        // reset the X axis's direction
        resetDirX();

        // start an interval to move the rect side
        intervalID = setInterval( moveRectDown , 50 );

    }

});

const stop = ()=>{
    clearInterval(intervalID)
};

function reset(){

    goCtx.clearRect( 0, 0, gameOverCanvas.width , gameOverCanvas.height );
    powerContext.clearRect(0, 0, powerCanvas.width, powerCanvas.height);
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Reset the snake
    rect = [{x: 150, y: 150},
        {x: 140, y: 150},
        {x: 130, y: 150},
        {x: 120, y: 150},
        {x: 110, y: 150}
    ];

    // reset the power spawn
    power = [{
        pos: { x: 20 , y: 90 },
        isEaten: false
    }];
    // reset all directions
    resetDirX();
    resetDirY();

    if(intervalID) clearInterval(intervalID);
    
    if(powerInterval) clearInterval(powerInterval);

    makeMoveLeftPossible = false;
    clickCount = 0;
    score = 0;
    
    userScore.textContent = score;

    gameLoop();
}

document.addEventListener('DOMContentLoaded',()=>{
    const highScoreValue = localStorage.getItem('highScore');
    highScore.textContent =  highScoreValue !== null ? highScoreValue : 0;
})