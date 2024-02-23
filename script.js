import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';



const renderer = new THREE.WebGL1Renderer();
renderer.shadowMap.enabled=true; 
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);



const scene = new THREE.Scene();
const camera= new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const orbit=new OrbitControls(camera,renderer.domElement);

const axesHelper = new THREE.AxesHelper(4);
scene.add(axesHelper);

camera.position.x= -10;
camera.position.y= 30;
camera.position.z= 30;
orbit.update();

const ambientLight=new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

//const directionalLight=new THREE.DirectionalLight(0xffffff,0.8);
//scene.add(directionalLight);
//directionalLight.position.set(-30, 50, 0);
//directionalLight.castShadow = true; 
//directionalLight.shadow.camera.bottom = -12;
//
//
//
//const dLightHelper=new THREE.DirectionalLightHelper(directionalLight,5);
//scene.add(dLightHelper);
//
//const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
//scene.add(dLightShadowHelper);

const spotLight = new THREE.SpotLight(0x000000);
scene.add(spotLight);
spotLight.position.set(0,0,0)
spotLight.castShadow= true;

const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);

const boxGeometry= new THREE.BoxGeometry();
const boxMaterial= new THREE.MeshBasicMaterial({color:0x4cb2ba});
const box = new THREE.Mesh(boxGeometry,boxMaterial);
scene.add(box);

box.position.set(0,0,0);



const sphereGeometry= new THREE.SphereGeometry(4,50,50);
const sphereMaterial= new THREE.MeshStandardMaterial({color:0x00ff00,
    wireframe:false
})
const sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);
scene.add(sphere);
sphere.position.set(-10,10,0);
sphere.castShadow = true;

const planeGeometry= new THREE.PlaneGeometry(30,30);
const planeMaterial= new THREE.MeshStandardMaterial({ color:0xffffff   ,side:THREE.DoubleSide});
const plane = new THREE.Mesh(planeGeometry,planeMaterial);
scene.add(plane);
plane.rotation.x= -0.5 * Math.PI;
plane.receiveShadow = true;


const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

const gui = new dat.GUI();

const options ={
    sphere_Color: '#00ff00',
    wireframe: false,
    speed:0.01
    
};

gui.addColor(options,'sphere_Color').onChange(function(e){
    sphere.material.color.set(e);
});

gui.add(options,'wireframe').onChange(function(e){
    sphere.material.wireframe =e;
});

gui.add(options,'speed', 0, 0.1);

let step=0;


function animate(time){
    box.rotation.x = time/1000;
    box.rotation.y =time/1000;

    step += options.speed;
    sphere.position.y= 10* Math.abs(Math.sin(step));
renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);