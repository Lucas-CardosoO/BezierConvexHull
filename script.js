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

    if(controlPointsElem.checked){
        drawPoints();
    }

    if(controlPoligonalElem.checked){
        drawControlPoligonals();
    }

    if(bezierCurveElem.checked){
        drawBezier();
    }

    if(convexHullElem.checked){
        drawConvexHull();
    }
}

function drawConvexHull(){
    if(pointArray.length >= 3){
        var convexHullPoints = convexhull(pointArray);

        var color = "#00FFFF";
        for (let index = 0; index < convexHullPoints.length - 1; index++) {
            var point1 = convexHullPoints[index];
            var point2 = convexHullPoints[index + 1];
            
            drawLine(point1, point2, color);
        }

        drawLine(convexHullPoints[0], convexHullPoints[convexHullPoints.length - 1], color);
    }
}

function drawPoints() {
    pointArray.forEach(element => {
        draw(element);
    });
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
        for (let index = 0; index < 1; index += 1.0/numberOft) {
            var point2 = deCasteljau(pointArray, index);

            color = "#FFFFFF";

            drawLine(point1, point2, color);
            point1 = point2;
        }

        if(numberOft > 0){
            drawLine(point1, pointArray[pointArray.length - 1]);
        }
    }
}

function cross(a, b, c) {
    return (b.x-a.x)*(c.y-a.y) - (b.y-a.y)*(c.x-a.x);
}
  
function convexhull(points) {
    if(points.length < 3) return; 
    var pts = points.slice();
    pts.sort(function(a, b) {
        return a.x == b.x ? a.y - b.y : a.x - b.x;
        // if(a.y != b.y) return a.y < b.y;
        // else return a.x < b.x;
        //return a.x*a.x + a.y*a.y > b.x*b.x + b.y*b.y;
    });
    var hull = new Array();
    for(i = 0; i < pts.length; i++) {
        while(hull.length >= 2 && cross(hull[hull.length-2], hull[hull.length-1], pts[i]) <= 0) {
            hull.pop();
        }
        hull.push(pts[i]);
    }
    var lowerHullLimit = hull.length + 1;

    var hullUpper = new Array();
    for(i = pts.length - 1; i >= 0; i--) {
        while(hullUpper.length >= 2 && cross(hullUpper[hullUpper.length-2], hullUpper[hullUpper.length-1], pts[i]) <= 0) {
            hullUpper.pop();
        }
        hullUpper.push(pts[i]);
    }

    hullUpper.pop();
    hull.pop();

    return hull.concat(hullUpper);
}

var generalRadius = 8;
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
    var value = document.getElementById("evaluations").value;
    if(value >= 0){
        numberOft = value;
    } else {
        alert("Apenas números positivos");
        document.getElementById("evaluations").value = 0;
    }
    drawEverything();
});

controlPointsElem.addEventListener(("change"), (e) => {
    drawEverything();
});
controlPoligonalElem.addEventListener(("change"), (e) => {
    drawEverything();
});
convexHullElem.addEventListener(("change"), (e) => {
    drawEverything();
});
bezierCurveElem.addEventListener(("change"), (e) => {
    drawEverything();
});


