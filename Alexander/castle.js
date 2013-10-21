
var WIDTH = 1024, HEIGHT = 768;
var FOVY = 45, ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1, FAR = 10000;

var renderer;
var camera;
var scene;
var sphere, cube, plane;
var pointLight;
var sphereMatrix;
var rotateAngle = 0.1;

var cubicMan;

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

    // start the renderer
    renderer.setSize(WIDTH, HEIGHT);

    // Attach the render-supplied DOM element
    $container.append(renderer.domElement);

    // create sphere's material
    sphere = createSphere();
    cube = createCube();
    cube.position.x = 150;
    plane = createPlane();

    var planeMatrix = new THREE.Matrix4();
    planeMatrix.makeScale(5, 5, 1);
    planeMatrix.makeRotationX(- Math.PI / 4);

    plane.position.y = - 100;
    plane.rotateX(-Math.PI / 2);
    plane.scale.set(10, 10, 1);



    cubicMan = createCubicMan();


    // add the sphere to the scene
    scene.add(plane);
    scene.add(sphere);
    scene.add(cube);
    scene.add(cubicMan);
    // add the camera to the scene
    scene.add(camera);

    pointLight = createPointLight(10, 20, 100);

    scene.add(pointLight);

    // draw!
    update();
    draw();
};

function createCube(){
    var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xFFFF00});
    return new THREE.Mesh(new THREE.CubeGeometry(100, 100, 100), cubeMaterial);
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
    cube.rotateY(rotateAngle);
    cubicMan.rotateZ(rotateAngle);
}


function createCubicMan(){
    var cubeMan = new THREE.Object3D();
    cubeMan.add(createCube());
    cubeMan.position.x = - 150;
    return cubeMan;
}

function createPlane(){
    var planeTexture = new THREE.ImageUtils.loadTexture('roughgrass1.jpg');
    planeTexture.wrapT = planeTexture.wrapS = THREE.RepeatWrapping;
    planeTexture.repeat.set(10, 10);
    var planeMaterial = new THREE.MeshBasicMaterial({map: planeTexture});
    return new THREE.Mesh(new THREE.PlaneGeometry(100, 100), planeMaterial);
}









