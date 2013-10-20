
var WIDTH = 400, HEIGHT = 300;
var FOVY = 45, ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1, FAR = 10000;

var renderer;
var camera;
var scene;
var sphere;
var pointLight;
var sphereMatrix;
var rotateAngle = 0;

window.onload = function init(){

    var $container = $('#container');
    console.log(container);
    // Create a WebGL renderer object,
    // camera and scene
    renderer = new THREE.WebGLRenderer();
    camera = new THREE.PerspectiveCamera(FOVY, ASPECT, NEAR, FAR);
    scene = new THREE.Scene();

    // camera starts at [0, 0, 0] so move it
    camera.position.z = 300;

    // start the renderer
    renderer.setSize(WIDTH, HEIGHT);

    // Attach the render-supplied DOM element
    $container.append(renderer.domElement);

    // create sphere's material
    sphere = createSphere();

    // add the sphere to the scene
    scene.add(sphere);
    // add the camera to the scene
    scene.add(camera);

    pointLight = createPointLight(10, 20, 100);

    scene.add(pointLight);

    // draw!
    draw();
};


function createSphere(){
    sphereMatrix = new THREE.Matrix4();
    sphereMatrix.rotateX(rotateAngle);

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
    sphereMatrix.rotateX(rotateAngle += 10);
    if(rotateAngle > 360)
        rotateAngle = 0;
    sphere.matrix = sphereMatrix;
    sphere.applyMatrix(sphere.matrix);
    console.log(sphere.matrix);
}




