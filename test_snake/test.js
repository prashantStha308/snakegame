const canvas = document.getElementById("gameCanvas");
canvas.style.backgroundColor = "rgb(240, 155, 155)";
const context = canvas.getContext("2d");

let rect = [ { x: 150 , y : 150 } ];

let dx = 10;
let dy = 10;

function drawNewRect( newRect ){
    context.fillStyle = 'rgb(241, 94, 94)';
    context.strokeStyle = 'rgb(146, 37, 37)';
    context.fillRect( newRect.x , newRect.y , 10 , 10 );
    context.strokeRect( newRect.x , newRect.y , 10 , 10 );
}

function drawRect(){

    rect.forEach(drawNewRect);

}

function moveRectRight(){
    let newRect = { x: rect[0].x + dx , y: rect[0].y };

    if( newRect.x >= 300 ){
        newRect.x = 0;
    }
    else if( newRect.x < 0 ){
        newRect.x = 300;
    }

    rect.unshift(newRect);
    rect.pop();

    console.log(newRect.x)

    context.clearRect(0, 0, canvas.width, canvas.height);
    drawRect();
}

function moveRectUp(){
    let newRect = { x: rect[0].x , y: rect[0].y - dy };

    if( newRect.y == 300 ){
        newRect.y = 0;
    }
    else if( newRect.y == 0 ){
        newRect.y = 300;
    }

    rect.unshift(newRect);
    rect.pop();

    context.clearRect(0, 0, canvas.width, canvas.height);
    drawRect();
}


function gameLoop(){
    drawRect();
}

gameLoop();


let functionCalled = {
    up: false,
    side: false,
};




document.addEventListener('keydown', function(event){


    if( event.key === 'w' || event.key === 's' && !functionCalled.up ){
        setInterval( moveRectUp , 100 );
        functionCalled.up = true;
    }else if( event.key === 'a' || event.key === 'd' && !functionCalled.side.side ){
        setInterval( moveRectRight , 100 );
        functionCalled.side = true;
    }

});
