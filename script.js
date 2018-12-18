function resizeCanvas(width, height) {
    canvas.width = width;
    canvas.height = height;
}
function resizeToFit() {
    var width = parseFloat(window.getComputedStyle(canvas).width);
    var height = parseFloat(window.getComputedStyle(canvas).height);
    resizeCanvas(width, height);
}

function isInCircle(circle, click) {
    var v = {
        x: circle.x - click.x,
        y: circle.y - click.y
    };
    return (Math.sqrt(v.x * v.x + v.y * v.y) <= circle.radius);
}

function clickedAnyPoint(click){
    var touchedAny = false;
    for (let index = 0; index < pointArray.length; index++) {
        const element = pointArray[index];
        if (isInCircle(element, click)){
            moveIndex = index;
            touchedAny = true;
        }
    }
    return touchedAny;
}

function drawEverything() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pointArray.forEach(element => {
        draw(element);
    });
}

function draw(circle) {
    ctx.beginPath();
    ctx.fillStyle = "#FF0000";
    console.log(circle);
    ctx.arc(circle.x, circle.y, circle.radius , 0, 2*Math.PI);
    ctx.fill();
}

var container = document.getElementById('container');
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var pointArray = Array();
pointArray.push({
    x: 100,
    y: 100,
    radius: 16
});
pointArray.push({
    x: 200,
    y: 200,
    radius: 16
});
var move = false;
var moveIndex = 0;

resizeToFit();
drawEverything();

canvas.addEventListener('mousedown', function(e) {
    move = clickedAnyPoint({
        x: e.offsetX,
        y: e.offsetY
    }) 

});

canvas.addEventListener('mousemove', function(e) {
    if (move) {
        pointArray[moveIndex].x = e.offsetX;
        pointArray[moveIndex].y = e.offsetY;
        drawEverything();
    }
});

canvas.addEventListener('mouseup', function(e) {
    move = false;
});