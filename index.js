let sharps = [];
let isInvolvedShape = [];
function detect_sharp (lineArray) {
    let connectedPoints = [];
    // lineArray.map((line) => {
        connectedPoints = [lineArray[0].a];
        findConnectedLine(lineArray[0].a, lineArray[0], lineArray, connectedPoints);
        // connectedPoints = [line.b];
        // findConnectedLine(line.b, line, lineArray, connectedPoints);
    // })
    checkInvolvedShapes();
}

function findConnectedLine (point, selfLine, lineArray, connectedPoints) {
    lineArray.forEach((secondLine) => {
        let points = JSON.parse(JSON.stringify(connectedPoints));
        if(JSON.stringify(selfLine) == JSON.stringify(secondLine)) {
            return;
        }

        if(
            point.x == secondLine.a.x && point.y == secondLine.a.y // check connected point (with point A)
        ) {
            checkConnectedPoint(secondLine.b, secondLine, lineArray, points);
        }
        else if (point.x == secondLine.b.x && point.y == secondLine.b.y) { // check connected point (with point B)
            checkConnectedPoint(secondLine.a, secondLine, lineArray, points);
        }
    })
}

function checkConnectedPoint(point, line, lineArray, points) {
    let isExistPoint = checkExistPoint(point, points);
    if(isExistPoint) return;
    points.push(point);
    let isMakeSharp = checkMakeSharp(points);
    if(isMakeSharp) return;
    findConnectedLine(point, line, lineArray, points);
}

function checkExistPoint (point, points) {
    if(points.length == 2) return false;
    for(let i = 1; i <= points.length - 1; i++) {
        if(point.x == points[i].x && point.y == points[i].y) {
            return true;
        }
    }
    return false;
}

function checkMakeSharp (points) {
    if(points.length == 2) return false;
    let lastIndex = points.length - 1;
    if(
        points[0].x == points[lastIndex].x &&
        points[0].y == points[lastIndex].y
    ) {
        let result = checkSameSharp(points);
        if(!result) {
            sharps.push(points);
        }   
        return true;
    }
    return false;
}

function checkSameSharp (points) {
    for(sharp of sharps) {
        if(sharp.length == points.length) {
            let result1 = isSameSharp(sharp, points);
            let result2 = isSameSharp(sharp, points.reverse());
            if(result1 || result2) return true;
        }
    }
    return false;
}

function isSameSharp (sharp, points) {
    let sharpCopy = JSON.parse(JSON.stringify(sharp));
    let pointsCopy = JSON.parse(JSON.stringify(points));
    let index = pointsCopy.findIndex((point1) => {
        return point1.x == sharpCopy[0].x && point1.y == sharpCopy[0].y;
    })
    if(index != -1) {
        sharpCopy = sharpCopy.slice(0, -1);
        pointsCopy = pointsCopy.slice(0, -1);
        let prefix = pointsCopy.slice(0, index);
        let subFix = pointsCopy.slice(index);
        let shape2 = subFix.concat(...prefix);
        if(JSON.stringify(shape2) == JSON.stringify(sharpCopy)) {
            return true;
        }
    }
    return false;
}

//////////////////////////////////////////////////////////////////////////////////////////

function checkInvolvedShapes() {
    for(let i = 0; i < sharps.length; i++) {
        let isInvolved = false;
        for(let j = 0; j < sharps.length; j++) {
            if(i == j) break;
            isInvolved = checkInvolved(sharps[i], sharps[j]);
            if(isInvolved) break;
        }
        isInvolvedShape.push(isInvolved);
    }
}

function checkInvolved(shape, compareShape) {
    let i;
    for(i = 0; i < shape.length; i++) {
        let involvedPoint = compareShape.find((point) => {
            return (point.x == shape[i].x && point.y == shape[i].y)
        });
        if(!involvedPoint) break;
    }
    console.log(i, shape.length);
    if(i == shape.length) return true;
    return false;
}

let lines = [
    {
        a: {x: 0, y: 0}, 
        b: {x: 1, y: 0}
    }, 
    {
        a: {x: 1, y: 1}, 
        b: {x: 1, y: 0}
    }, 
    {
        a: {x: 1, y: 1}, 
        b: {x: 0, y: 1}
    },
    {
        a: {x: 0, y: 1}, 
        b: {x: 0, y: 0}
    },
    {
        a: {x: 0, y: 0}, 
        b: {x: 1, y: 1}
    },
    {
        a: {x: 0, y: 1}, 
        b: {x: 1, y: 0}
    }
]
detect_sharp(lines)
console.log(sharps)
console.log(isInvolvedShape)