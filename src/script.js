import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Axes helper
const axesHelper = new THREE.AxesHelper(3)
scene.add(axesHelper)
gui
.add(axesHelper, 'visible')
.name('Axes helper')
.setValue(false)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcap1 = textureLoader.load('/textures/matcaps/7.png')
const matcap2 = textureLoader.load('/textures/matcaps/4.png')
const matcap3 = textureLoader.load('/textures/matcaps/1.png')

/**
 * Fonts
 */
const fontloader = new THREE.FontLoader()
fontloader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {

        const textGeometry = new THREE.TextBufferGeometry(
            'Mohamed \n Sameh',
            {
                font,
                size:.5,
                height:.2,
                curveSegments: 6,
                bevelEnabled: true,
                bevelThickness: .03,
                bevelSize: .02,
                bevelOffset:0,
                bevelSegments: 3

            }
        )
        textGeometry.center()
        const material = new THREE.MeshMatcapMaterial()
        material.matcap = matcap1;
        material.wireframe = false
        const text = new THREE.Mesh(textGeometry,material)
        scene.add(text)
        gui
        .add(material,'wireframe')
        .name('Text wirframe')
    }
)

/**
 * Object
 */
const donutGeometry = new THREE.TorusBufferGeometry(.3, .15, 20, 45)
const cubeGeometry = new THREE.BoxBufferGeometry(.4,.4,.4)

const material1 = new THREE.MeshMatcapMaterial()
material1.matcap = matcap3
const material2 = new THREE.MeshMatcapMaterial()
material2.matcap = matcap2

for (let i = 0; i < 200; i++){
    let donut
    if(i % 2 == 0){
        donut = new THREE.Mesh(donutGeometry, material1)
    }
    else{
        donut = new THREE.Mesh(cubeGeometry, material2)
    }

    donut.position.x = (Math.random() - .5 ) * 10
    donut.position.y = (Math.random() - .5 ) * 10
    donut.position.z = (Math.random() - .5 ) * 10

    donut.rotation.x =  Math.random() * Math.PI 
    donut.rotation.y =  Math.random() * Math.PI

    const scale = Math.random()
    donut.scale.set(scale,scale,scale)

    scene.add(donut)

}

const cube = new THREE.Mesh(
    new THREE.BoxBufferGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)

// scene.add(cube)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1,1,2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()