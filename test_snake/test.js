const canvas = document.getElementById("gameCanvas");
canvas.style.backgroundColor = "rgb(240, 155, 155)";
canvas.style.position = 'relative';
const context = canvas.getContext("2d");

const powerCanvas = document.createElement('canvas');
powerCanvas.style.position = 'absolute';
powerCanvas.style.top = canvas.offsetTop + 'px';
powerCanvas.style.left = canvas.offsetLeft + 'px';
powerCanvas.height = 300;
powerCanvas.width = 300;
powerCanvas.style.backgroundColor = "rgba(0,0,0,0)";

document.body.appendChild(powerCanvas)

const powerContext = powerCanvas.getContext("2d");

let rect = [ { x: 150 , y : 150 },
        {x:150 , y: 160 },
        { x:150 , y: 170 },
        { x:150 , y: 180 }
    ];

const power = [{
    pos: { x: 20 , y: 90 },
    isEated: false
}];

let moveDir = {
    up: false,
    down: false,
    right: false,
    left: false
}

let dx = 10;
let dy = 10;

const resetDirY = ()=>{
    moveDir.down = false;
    moveDir.up = false;
}

const resetDirX = ()=>{
    moveDir.right = false;
    moveDir.left = false;
}


function collision(){
    console.log('collision detected')
    power[0].isEated = true;
}

function drawNewPower(newPower){
    console.log('Drawing new Power')
    
    powerContext.fillStyle = 'rgb(189, 40, 65)';
    powerContext.strokeStyle = 'rgb(189, 40, 65)';
    powerContext.fillRect( newPower.pos.x , newPower.pos.y , 10 , 10 );
    powerContext.strokeRect( newPower.pos.x , newPower.pos.y , 10 , 10 );
}

function drawPower(){
    powerContext.clearRect(0, 0, powerCanvas.width, powerCanvas.height);
    // if power is not yet eaten, return
    if( !power[0].isEated ){
        drawNewPower(power[0]);
        return
    }

    const newPower = {
        pos: { x: Math.random() * (300 - 10), y: Math.random() * (300 - 10) },
        isEated: false
    };
    // replace the head with the newPower
    power[0] = newPower

    drawNewPower(newPower)
}

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
    console.log('moving right');

    let newRect = { x: rect[0].x + dx , y: rect[0].y };

    if( newRect.x > 300 ){
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

function moveRectLeft(){
    console.log('Moving Left');

    let newRect = { x: rect[0].x - dx , y: rect[0].y };

    if( newRect.x < 0 ){
        newRect.x = 300;
    }else if( newRect.x > 300 ){
        newRect.x = 0;
    }

    rect.unshift(newRect);
    rect.pop();

    console.log(newRect.x)

    context.clearRect(0 , 0 , canvas.width, canvas.height);
    drawRect();
}

function moveRectDown(){
    console.log('Moving Down');

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
    console.log('moving up');

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

let powerInterval;
const createPower = ()=>{
    powerInterval = setInterval( ()=>{
        drawPower();

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

let intervalID;

document.addEventListener('keydown', function(event){

    if( event.key === 'w'){

        if( moveDir.down ){
            return
        }
        // if the rect is moving, stop it
        if( intervalID ){
            console.log('clearing interval: ', intervalID);
            clearInterval(intervalID)
        }

        // set the moveDir.up to true, to indicate the current direction
        moveDir.up = true;
        // reset the X axis's direction
        resetDirX();

        // start an interval to move the rect up
        intervalID = setInterval( moveRectUp , 50 );

    }else if( event.key === 'd'){

        if( moveDir.left ){
            return
        }
        // if the rect is moving, stop it
        if( intervalID ){
            console.log('clearing interval: ', intervalID);
            clearInterval(intervalID)
        }

        // set the moveDir.right to true, to indicate the current direction
        moveDir.right = true;
        // reset the Y axis's direction
        resetDirY();

        // start an interval to move the rect side
        intervalID = setInterval( moveRectRight , 50 );

    }else if( event.key === 'a'){

        if( moveDir.right ){
            return
        }
        // if the rect is moving, stop it
        if( intervalID ){
            console.log('clearing interval: ', intervalID);
            clearInterval(intervalID)
        }

        // set the moveDir.left to true, to indicate the current direction
        moveDir.left = true;
        // reset the Y axis's direction
        resetDirY();

        // start an interval to move the rect side
        intervalID = setInterval( moveRectLeft , 50 );

    }else if( event.key === 's'){

        if( moveDir.up ){
            return
        }
        // if the rect is moving, stop it
        if( intervalID ){
            console.log('clearing interval: ', intervalID);
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
