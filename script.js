let canvas = document.getElementById("gameCanvas");
let context = canvas.getContext("2d");
canvas.style.backgroundColor = "rgb(240, 155, 155)";

let snake = [{x: 150, y: 150},
    {x: 140, y: 150},
    {x: 130, y: 150},
    {x: 120, y: 150},
    {x: 110, y: 150}
];

let dx = 10;
let dy = 10;

function drawSnakePart(snakePart) {
    context.fillStyle = 'rgb(241, 94, 94)';
    context.strokeStyle = 'rgb(146, 37, 37)';
    context.fillRect(snakePart.x, snakePart.y, 10, 10);
    context.strokeRect(snakePart.x , snakePart.y , 10, 10);
}


function drawSnake() {
    snake.forEach(drawSnakePart);
}

function moveSnake(){


    const head = { x: snake[0].x + dx , y: snake[0].y};
    snake.unshift(head);
    snake.pop();
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
}



function gameLoop(){
    drawSnake();
    moveSnake();
}
gameLoop();