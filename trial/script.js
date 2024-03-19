import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import { hexToRgb } from '@material-ui/core';
import space from './images/space.jpg'
import { Raycaster } from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

//3d model
//const monkeyUrl= new URL('./images/monkey.glb', import.meta.url);

//scene
const scene = new THREE.Scene();
//camera
const camera= new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(-10, 30, 30);
//renderer
const renderer = new THREE.WebGL1Renderer();
//shadows
renderer.shadowMap.enabled = true;


        document.body.appendChild(renderer.domElement);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.type = THREE.BasicShadowMap;
//orbit controls
const orbit=new OrbitControls(camera,renderer.domElement);

const axesHelper = new THREE.AxesHelper(4);
scene.add(axesHelper);



orbit.update();
//background image
const textureLoader =new THREE.TextureLoader();
//scene.background= textureLoader.load(space);

//plane geometry
const planeGeometry= new THREE.PlaneGeometry(30,30);
const planeMaterial= new THREE.MeshStandardMaterial({ color:0xffffff,side:THREE.DoubleSide,
map: textureLoader.load(space)});
const plane = new THREE.Mesh(planeGeometry,planeMaterial);
plane.castShadow = false;
        plane.receiveShadow = true;
        plane.rotation.x = -Math.PI / 2;
        scene.add(plane);

//sphere 
const sphereGeometry= new THREE.SphereGeometry(4,50,50);
const sphereMaterial= new THREE.MeshStandardMaterial({color:0x93beff,
    wireframe:false,
});
const sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);
sphere.position.set(-10,10,0);
sphere.castShadow = true;
scene.add(sphere);
const sphereId = sphere.id;
//spotlight
const spotLight = new THREE.SpotLight(0xffffff,100);
spotLight.position.set(-100,100,0);
spotLight.castShadow=true;
scene.add(spotLight);

//mouse pointer
const mousePointer = new THREE.Vector2();
window.addEventListener('mousemove',function(e){
    mousePointer.x = (e.clientX / this.innerWidth) * 2 - 1;
    mousePointer.y = -(e.clientY /this.innerHeight) * 2 + 1;
})
const rayCaster = new THREE.Raycaster();

//ambient light
//const ambientLight=new THREE.AmbientLight(0xffffff);
//scene.add(ambientLight);

/*const directionalLight=new THREE.DirectionalLight(0xffffff,0.8);
scene.add(directionalLight);
directionalLight.position.set(-30, 50, 0);
directionalLight.castShadow = true; 
directionalLight.shadow.camera.bottom = -12;
const dLightHelper=new THREE.DirectionalLightHelper(directionalLight,5);
scene.add(dLightHelper);

    const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(dLightShadowHelper);
*/
const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);

const boxGeometry= new THREE.BoxGeometry();
const boxMaterial= new THREE.MeshStandardMaterial({color:0x4cb2ba});
const box = new THREE.Mesh(boxGeometry,boxMaterial);
scene.add(box);

box.position.set(0,0,0);

const boxGeometry2= new THREE.BoxGeometry();
const boxMaterial2= new THREE.MeshStandardMaterial({color:0x4cb2ba});
const box2 = new THREE.Mesh(boxGeometry2,boxMaterial2);
scene.add(box2);

box2.position.set(10,10,0);
box2.name='Thebox';

//backgrund
scene.background =textureLoader.load(space)
//Glb Model 
const Loader = new GLTFLoader();
Loader.load( './images/monkey.glb', function (gltf) {
    monkey = gltf.scene;
    monkey.position.set(0,4,0);
    monkey.position.y = 4;
    scene.add(monkey);
})
/*const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);
*/
const gui = new dat.GUI();

const options ={
    sphere_Color: '#93beff',
    wireframe: false,
    speed:0.01,
    spotangle:0.2,
    spotpenumbra:0,
    spotintensity:1100
    
};

gui.addColor(options,'sphere_Color').onChange(function(e){
    sphere.material.color.set(e);
});

gui.add(options,'wireframe').onChange(function(e){
    sphere.material.wireframe =e;
});

gui.add(options,'speed', 0, 0.1);
gui.add(options,'spotangle', 0, 1);
gui.add(options,'spotpenumbra', 0, 1);
gui.add(options,'spotintensity', 0, 99999);

scene.fog = new THREE.Fog( 0xffffff, 0, 350 ); 


let step=0;


function animate(time){
    box.rotation.x = time/1000;
    box.rotation.y =time/1000;

    spotLight.angle= options.spotangle;
    spotLight.penumbra= options.spotpenumbra;
    spotLight.intensity= options.spotintensity;
    sLightHelper.update();

    step += options.speed;
    sphere.position.y= 10* Math.abs(Math.sin(step));

   rayCaster.setFromCamera(mousePointer, camera);  
    const intersects = rayCaster.intersectObjects(scene.children);
    console.log(intersects);

    for(let i=0;i<intersects.length;i++){               
        if(intersects[i].object.id===sphereId){
            intersects[i].object.material.color.set(0xff0000);
        }

        if(intersects[i].object.name==='Thebox'){
            intersects[i].object.rotation.x = time/1000;
            intersects[i].object.rotation.y =time/1000;
        }
    }

renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);