
var WIDTH = 1024, HEIGHT = 768;
var FOVY = 45, ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1, FAR = 10000;

var renderer;
var camera;
var scene;
var sphere, plane;
var pointLight;
var sphereMatrix;
var rotateAngle = 0.1;



var cubicMan;
var leftHand, rightHand, leftLeg, rightLeg, head;
var limbAngle = 0;
var increase = true;

var cubicManPosition = [0, 0, 0];

var circleAngle = 0;





var flyingRobot;

var roboRotor = new THREE.Object3D();
var secondRoboRotor = new THREE.Object3D();

window.onload = function init(){

    var $container = $('#container');
    console.log(container);
    // Create a WebGL renderer object,
    // camera and scene
    renderer = new THREE.WebGLRenderer();
    camera = new THREE.PerspectiveCamera(FOVY, ASPECT, NEAR, FAR);
    scene = new THREE.Scene();

    // camera starts at [0, 0, 0] so move it
    camera.position.z = 1000;
    camera.position.y = 200;

    // start the renderer
    renderer.setSize(WIDTH, HEIGHT);

    // Attach the render-supplied DOM element
    $container.append(renderer.domElement);

    // create sphere's material
    sphere = createSphere();
    sphere.position.set(-200, 300, 0);
    plane = createPlane();

    var planeMatrix = new THREE.Matrix4();
    planeMatrix.makeScale(5, 5, 1);
    planeMatrix.makeRotationX(- Math.PI / 4);

    plane.position.y = - 200;
    plane.rotateX(-Math.PI / 2);
    plane.scale.set(20, 20, 1);


    cubicMan = createCubicMan();


    flyingRobot = createFlyingRobot();

    // add the sphere to the scene
    scene.add(plane);
    scene.add(sphere);
    scene.add(cubicMan);
    scene.add(flyingRobot);
    // add the camera to the scene
    scene.add(camera);

    pointLight = createPointLight(-200, 300, 200);

    scene.add(pointLight);

    document.onkeydown = function(){keyCatch(window.event.keyCode)};

    // draw!
    update();
    draw();
};

function createCube(){
    var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xFFFF00});
    return new THREE.Mesh(new THREE.CubeGeometry(100, 100, 50), cubeMaterial);
}

function createSphere(){
    sphereMatrix = new THREE.Matrix4();
    sphereMatrix.makeRotationX(rotateAngle);

    var sphereMaterial = new THREE.MeshLambertMaterial({color: 0xCC0000});
    var radius = 50, segments = 16, rings = 16;
    return new THREE.Mesh(new THREE.SphereGeometry(radius, segments, rings), sphereMaterial);
}

function createPointLight(x, y, z){
    var pointLight = new THREE.PointLight(0xFFFFFF);
    pointLight.position.x = x;
    pointLight.position.y = y;
    pointLight.position.z = z;
    return pointLight;
}

function draw(){
    renderer.render(scene, camera);
    setTimeout(function(){requestAnimationFrame(draw)}, 100);
}

function update(){
    setTimeout(function(){requestAnimationFrame(update)}, 50);
    sphere.rotateX(rotateAngle);

    //cubicMan.rotateZ(rotateAngle);
    if(increase){
        rightHand.rotateX(rotateAngle);
        leftHand.rotateX(-rotateAngle);
        rightLeg.rotateX(-rotateAngle);
        leftLeg.rotateX(rotateAngle);
        head.rotateX(rotateAngle);
    }else{
        rightHand.rotateX(-rotateAngle);
        leftHand.rotateX(rotateAngle);
        rightLeg.rotateX(rotateAngle);
        leftLeg.rotateX(-rotateAngle);
        head.rotateX(-rotateAngle);
    }

    if(limbAngle > Math.PI / 4)
        increase = false;
    if(limbAngle < -Math.PI / 4)
        increase = true;

    if(increase){
        limbAngle += 0.1;
    }else{
        limbAngle -= 0.1;
    }


    cubicManPosition[0] = 200 * Math.cos(circleAngle);
    cubicManPosition[1] = 200 * Math.sin(circleAngle);
    circleAngle -= 0.1;

    cubicMan.position.x = cubicManPosition[0];
    cubicMan.position.z = cubicManPosition[1];

    cubicMan.rotateY(rotateAngle);

    roboRotor.rotateY(rotateAngle);
    secondRoboRotor.rotateY(-rotateAngle);
}


function createCubicMan(){
    var cubeMan = new THREE.Object3D();
    cubeMan.add(createCube());

    leftHand = createHand(true);
    cubeMan.add(leftHand);
    rightHand = createHand(false);
    cubeMan.add(rightHand);


    leftLeg = createLeg(true);
    cubeMan.add(leftLeg);
    rightLeg = createLeg(false);
    cubeMan.add(rightLeg);

    head = createSphere();
    head.material = (new THREE.MeshLambertMaterial({color: 0x00FFFF}))
    head.position.y = 100;

    cubeMan.add(head);

    cubeMan.position.x = cubicManPosition[0];

    return cubeMan;
}


function createHand(left){
    var hand = new THREE.Object3D();
    var tempCube = createCube();
    if(left)
        tempCube.position.x = -60;
    else
        tempCube.position.x = 60;
    tempCube.position.y = -5;
    tempCube.scale.set(0.2, 1.1, 0.7);
    hand.add(tempCube);
    return hand;
}

function createLeg(left){
    var leg = new THREE.Object3D();
    var tempCube = createCube();
    if(left)
        tempCube.position.x = -25;
    else
        tempCube.position.x = 25;
    tempCube.position.y = -100;
    tempCube.scale.set(0.3, 1, 1);
    leg.add(tempCube);
    return leg;
}

function createPlane(){
    var planeTexture = new THREE.ImageUtils.loadTexture('roughgrass1.jpg');
    planeTexture.wrapT = planeTexture.wrapS = THREE.RepeatWrapping;
    planeTexture.repeat.set(10, 10);
    var planeMaterial = new THREE.MeshBasicMaterial({map: planeTexture});
    return new THREE.Mesh(new THREE.PlaneGeometry(100, 100), planeMaterial);
}

function createFlyingRobot(){
    var bladeMaterial = new THREE.MeshLambertMaterial({color: 0xCC00FF});
    var sphere = new THREE.Mesh(new THREE.SphereGeometry(20, 16, 16), bladeMaterial);
    roboRotor.add(sphere);

    for(var i = 0; i < 6; i++){
        var blade = new THREE.Mesh(new THREE.CubeGeometry(20, 5, 115), bladeMaterial);
        blade.rotateY(Math.PI * 2 / 6 * i);
        blade.position.z = 75 * Math.cos(Math.PI * 2 / 6 * i);
        blade.position.x = 75 * Math.sin(Math.PI * 2 / 6 * i);
        roboRotor.add(blade);
    }

    secondRoboRotor = roboRotor.clone();
    secondRoboRotor.position.y = - 75;

    var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 150), bladeMaterial);
    cylinder.position.y = -75;

    var robot = new THREE.Object3D();

    robot.add(roboRotor);
    robot.add(cylinder);
    robot.add(secondRoboRotor);
    return robot;
}



function keyCatch(keyCode){
    switch(window.event.keyCode){
        case 37:
            console.log("left");
            camera.position.x -= 10;
            break;
        case 38:
            console.log("up");
            camera.position.y += 10;
            break;
        case 39:
            console.log("right");
            camera.position.x += 10;
            break;
        case 40:
            console.log("down");
            camera.position.y -= 10;
            break;
    }
}












