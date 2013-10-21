
var WIDTH = 1024, HEIGHT = 768;
var FOVY = 45, ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1, FAR = 10000;

var renderer;
var camera;
var scene;
var sphere, plane, coin;
var lightTurnsOn = true;
var pointLight, pointLight_2;
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
    sphere = createSphere(50, 16, 16);
    sphere.position.set(-200, 300, 0);
    plane = createPlane();
    coin = createCoin();

    cubicMan = createCubicMan();
    flyingRobot = createFlyingRobot();

    // add the sphere to the scene
    scene.add(plane);
    scene.add(sphere);
    scene.add(cubicMan);
    scene.add(flyingRobot);
    scene.add(coin);
    // add the camera to the scene
    scene.add(camera);

    pointLight = createPointLight(-200, 300, 200);
    pointLight_2 = createPointLight(0, 0, 0);

    scene.add(pointLight);
    scene.add(pointLight_2);

    document.onkeydown = function(){keyCatch(window.event.keyCode)};

    // draw!
    update();
    draw();
};

// Creates white cube
function createCube(width, height, depth){
    var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
    return new THREE.Mesh(new THREE.CubeGeometry(width, height, depth), cubeMaterial);
}

// Creates white sphere
function createSphere(radius, segments, rings){
    sphereMatrix = new THREE.Matrix4();
    sphereMatrix.makeRotationX(rotateAngle);
    var sphereMaterial = new THREE.MeshLambertMaterial({color: 0xFDFDAD});
    return new THREE.Mesh(new THREE.SphereGeometry(radius, segments, rings), sphereMaterial);
}

// Creates white point light
function createPointLight(x, y, z){
    var pointLight = new THREE.PointLight(0xFFFFFF);
    pointLight.position.x = x;
    pointLight.position.y = y;
    pointLight.position.z = z;
    return pointLight;
}

// Draw all objects
function draw(){
    renderer.render(scene, camera);
    setTimeout(function(){requestAnimationFrame(draw)}, 100);
}

// Update object on the scene
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

    roboRotor.rotateY(3 * rotateAngle);
    secondRoboRotor.rotateY(-rotateAngle * 3);
    flyingRobot.position.x = 500 * Math.cos(-0.5 * circleAngle);
    flyingRobot.position.z = 300 * Math.sin(-0.5 * circleAngle);
    flyingRobot.position.y = 100 * Math.sin(circleAngle) + 500;
    pointLight_2.position.x = flyingRobot.position.x;
    pointLight_2.position.z = flyingRobot.position.z;
    pointLight_2.position.y = flyingRobot.position.y;

    coin.rotateZ(5 * rotateAngle);
}

// Create cubicMan
function createCubicMan(){
    var cubeMan = new THREE.Object3D();
    cubeMan.add(createCube(100, 100, 50));
    leftHand = createHand(true);
    cubeMan.add(leftHand);
    rightHand = createHand(false);
    cubeMan.add(rightHand);
    leftLeg = createLeg(true);
    cubeMan.add(leftLeg);
    rightLeg = createLeg(false);
    cubeMan.add(rightLeg);
    head = createSphere(50, 16, 16);
    head.material = (new THREE.MeshLambertMaterial({color: 0xFFFFFF}))
    head.position.y = 100;
    cubeMan.add(head);
    return cubeMan;
}

// Creates cubicMan hands (left and right)
function createHand(left){
    var hand = new THREE.Object3D();
    var tempCube = createCube(100, 100, 50);
    if(left)
        tempCube.position.x = -60;
    else
        tempCube.position.x = 60;
    tempCube.position.y = -5;
    tempCube.scale.set(0.2, 1.1, 0.7);
    hand.add(tempCube);
    return hand;
}
// Creates cubicMan legs (left and right)
function createLeg(left){
    var leg = new THREE.Object3D();
    var tempCube = createCube(100, 100, 50);
    if(left)
        tempCube.position.x = -25;
    else
        tempCube.position.x = 25;
    tempCube.position.y = -100;
    tempCube.scale.set(0.3, 1, 1);
    leg.add(tempCube);
    return leg;
}

// Creates plane cubicMan running on.
function createPlane(){
    var planeTexture = new THREE.ImageUtils.loadTexture('roughgrass1.jpg');
    var planeMaterial = new THREE.MeshLambertMaterial({color: 0x334411});
    planeTexture.wrapT = planeTexture.wrapS = THREE.RepeatWrapping;
    planeTexture.repeat.set(10, 10);
    //var planeMaterial = new THREE.MeshBasicMaterial({map: planeTexture});
    var tempPlane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), planeMaterial);
    tempPlane.position.y = - 150;
    tempPlane.rotateX(-Math.PI / 2);
    tempPlane.scale.set(50, 50, 1);
    return tempPlane;
}

// Creates robot which is flying around
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
    var bulbMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFF, opacity: 1});
    bulbMaterial.emissive = new THREE.Color( 0xCC00ff );
    var bulb = createSphere(50, 16, 16);
    bulb.position.y = -175;
    bulb.material = bulbMaterial;
    var robot = new THREE.Object3D();
    robot.add(roboRotor);
    robot.add(cylinder);
    robot.add(secondRoboRotor);
    robot.add(bulb);
    robot.position.y = 500;
    return robot;
}

// Create coin in the center of the scene
function createCoin(){
    var coneMaterial = new THREE.MeshLambertMaterial({color: 0xFFFF00});
    var tempCoin = new THREE.Mesh(new THREE.CylinderGeometry(120, 120, 10, 32), coneMaterial);
    tempCoin.position.y = - 30;
    tempCoin.rotateX(Math.PI / 2);
    return tempCoin;
}

// Catch keyboar events
function keyCatch(keyCode){
    switch(window.event.keyCode){
        case 37:
            camera.position.x -= 50;
            break;
        case 38:
            camera.position.z -= 50;
            break;
        case 39:
            camera.position.x += 50;
            break;
        case 40:
            camera.position.z += 50;
            break;
        case 76:
            if(lightTurnsOn){
                scene.remove(pointLight);
                lightTurnsOn = false;
            }else{
                scene.add(pointLight);
                lightTurnsOn = true;
            }
            break;
    }
}












