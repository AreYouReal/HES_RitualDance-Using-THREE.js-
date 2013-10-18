/**
 * Contains objects information and methods for objects generation
 */

var NumVertices = 36;

var circlePoints = 0, spherePoints = 0, cylinderPoints = 0, conePoints = 0;
var points = [], colors = [];

var vertices = [
        vec3( -0.5, -0.5,  0.5),
        vec3( -0.5,  0.5,  0.5),
        vec3(  0.5,  0.5,  0.5),
        vec3(  0.5, -0.5,  0.5),
        vec3( -0.5, -0.5, -0.5),
        vec3( -0.5,  0.5, -0.5),
        vec3(  0.5,  0.5, -0.5),
        vec3(  0.5, -0.5, -0.5)];

var vertexColors = [
        vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
        vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
        vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
        vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
        vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];

var indices = [
    1, 0, 3,
    3, 2, 1,
    2, 3, 7,
    7, 6, 2,
    3, 0, 4,
    4, 7, 3,
    6, 5, 1,
    1, 2, 6,
    4, 5, 6,
    6, 7, 4,
    5, 4, 0,
    0, 1, 5
];

var baseColors = [
    vec3(1.0, 0.0, 0.0),
    vec3(0.0, 1.0, 0.0),
    vec3(0.0, 0.0, 1.0),
    vec3(0.0, 0.0, 0.0)];

var grayTones = [
    vec3(.3, 0.3, 0.3),
    vec3(0.5, .5, 0.5),
    vec3(0.7, 0.7, .7),
    vec3(0.9, 0.9, 0.9)];



// Create sphere vertices and add to points array
function createCphere(numOfSegments, r){
    var height = 0;
    var nextHeight = 0;
    var heightStepDegrees = (Math.PI / 2) / (numOfSegments / 2);
    var previousRadius = r;
    var nextRadius = r;

    for(var j = 1; j <= numOfSegments / 2; j++){
        previousRadius = nextRadius;
        nextRadius = r * Math.cos(heightStepDegrees * j);
        height = nextHeight;
        nextHeight = r * Math.sin(heightStepDegrees * j);
        //console.log(Math.sin(heightStepDegrees * j) , nextHeight);
        for(var i = 0; i <= numOfSegments; i++){
            var angle =  i * 2 * Math.PI / numOfSegments;
            points.push([previousRadius * Math.cos(angle), height, previousRadius * Math.sin(angle)]);
            colors.push(grayTones[( Math.floor(Math.random() * 10)) % 4]);

            points.push([nextRadius * Math.cos(angle), nextHeight, nextRadius * Math.sin(angle)]);
            colors.push(grayTones[( Math.floor(Math.random() * 10)) % 4]);
            spherePoints+=2;
        }
    }

    for(var j = 0; j <= numOfSegments / 2; j++){
        previousRadius = nextRadius;
        nextRadius = r * Math.cos(heightStepDegrees * j);
        height = nextHeight;
        nextHeight = - r * Math.sin(heightStepDegrees * j);
        //console.log(Math.sin(heightStepDegrees * j) , nextHeight);
        for(var i = 0; i <= numOfSegments; i++){
            var angle =  i * 2 * Math.PI / numOfSegments;
            points.push([previousRadius * Math.cos(angle), height, previousRadius * Math.sin(angle)]);
            colors.push(grayTones[( Math.floor(Math.random() * 10)) % 4]);

            points.push([nextRadius * Math.cos(angle), nextHeight, nextRadius * Math.sin(angle)]);
            colors.push(grayTones[( Math.floor(Math.random() * 10)) % 4]);
            spherePoints+=2;
        }
    }
    //console.log(spherePoints);
    //console.log(colors);

}

// Create circle vertices and add to points array
function createCircle(segments, radius){
    points.push([0.0, 0.0, 0.0]);
    colors.push([1.0, 1.0, 1.0]);
    circlePoints++;
    for(var i = 0; i <= segments; i++){
        var rads = i * 2 * Math.PI / segments;
        points.push([radius * Math.cos(rads), radius * Math.sin(rads), 0]);
        colors.push(baseColors[3]);
        circlePoints++;
    }
    //console.log(circlePoints, points.length, colors.length);
}

function createCylinder(numOfSegments, r, height){
    for(var i = 0; i <= numOfSegments; i++){
        var angle = i * 2 * Math.PI / numOfSegments;
        points.push([r * Math.cos(angle), 0, r * Math.sin(angle)]);
        colors.push(grayTones[( Math.floor(Math.random() * 10)) % 3]);

        points.push([r * Math.cos(angle), height, r * Math.sin(angle)]);
        colors.push(grayTones[( Math.floor(Math.random() * 10)) % 3]);
        cylinderPoints+=2;
    }
}

function createCone(numOfSegments, r, height){
    for(var i = 0; i <= numOfSegments; i++){
        var angle = i * 2 * Math.PI / numOfSegments;
        points.push([r * Math.cos(angle), 0, r * Math.sin(angle)]);
        colors.push(baseColors[( Math.floor(Math.random() * 10)) % 4]);

        points.push([0, height, 0]);
        colors.push(baseColors[( Math.floor(Math.random() * 10)) % 4]);
        conePoints+=2;
    }
}

function createDoubleCone(numOfSegments, r, height){
    createCone(numOfSegments, r, height/2);
    createCone(numOfSegments, r, -height/2);
}