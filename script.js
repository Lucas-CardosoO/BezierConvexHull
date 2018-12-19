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
        }canvas
    }
    return touchedAny;
}

function pointClicked(click){
    var pointIndex = 0;
    for (let index = 0; index < pointArray.length; index++) {
        const element = pointArray[index];
        if (isInCircle(element, click)){
            moveIndex = index;
            pointIndex = index;
        }
    }
    return pointIndex;
}

function drawEverything() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pointArray.forEach(element => {
        draw(element);
    });
    drawControlPoligonals();
    drawBezier();
}

function draw(circle) {
    ctx.beginPath();
    ctx.fillStyle = "#FF0000";
    ctx.arc(circle.x, circle.y, circle.radius , 0, 2*Math.PI);
    ctx.fill();
}

function drawControlPoligonals() {
    for (let index = 0; index < pointArray.length - 1; index++) {
        const element1 = pointArray[index];
        const element2 = pointArray[index + 1];
        color = "#00FF00";
        drawLine(element1, element2, color);
    }
}

function drawLine(element1, element2, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(element1.x, element1.y);
    ctx.lineTo(element2.x, element2.y);
    ctx.stroke();
}

function addPoint(point) {
    pointArray.push()
}

function deCasteljau(points, t) {
    if (points.length == 1) {
        return points[0];
    }
    else {
        var newpoints = [];
        for(i=0; i < points.length - 1; i++) {
            var x = (1-t) * points[i].x + t * points[i+1].x;
            var y = (1-t) * points[i].y + t * points[i+1].y;
            newpoints.push({x: x, y: y});
        }
        return deCasteljau(newpoints, t);
    }
}

function drawBezier(){
    var point1 = pointArray[0];
    if(pointArray.length > 2) { 
        for (let index = 0; index <= 1; index += 1.0/numberOft) {
            var point2 = deCasteljau(pointArray, index);

            color = "#FFFFFF";

            drawLine(point1, point2, color);
            point1 = point2;
        }
    }
}


var generalRadius = 16;
var container = document.getElementById('container');
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var evaluationsNumber = document.getElementById('evaluations');
var controlPointsElem = document.getElementById('controlPoints');
var controlPoligonalElem = document.getElementById('controlPoligonal');
var convexHullElem = document.getElementById('convexHull');
var bezierCurveElem = document.getElementById('bezierCurve');

var pointArray = Array();

var bezierPoints = Array();

var numberOft = 500;

var move = false;
var moveIndex = 0;


resizeToFit();
drawEverything();

canvas.addEventListener('mousedown', function(e) {
    move = clickedAnyPoint({
        x: e.offsetX,
        y: e.offsetY
    }) 
    if (!move) {
        pointArray.push({
            x: e.offsetX,
            y: e.offsetY,
            radius: generalRadius
        })
        drawEverything();
    }
});

canvas.addEventListener('dblclick', function(e) {
    var delIndex = pointClicked({
        x: e.offsetX,
        y: e.offsetY
    });

    pointArray.splice(delIndex, 1);

    drawEverything();
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

document.getElementById("clear").onclick = function(){
    pointArray = new Array();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

evaluationsNumber.addEventListener(("change"), (e) => {
    numberOft = document.getElementById("evaluations").value;
    console.log(numberOft);
});