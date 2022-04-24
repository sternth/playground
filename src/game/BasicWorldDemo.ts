import * as THREE from 'three'
import { AxesHelper } from './debug/AxesHelper'
import { ThirdPersonCamera } from './ThirdPersonCamera'
import { BasicCharacter } from './BasicCharacter'
import { BasicController } from './BasicController'

export class BasicWorldDemo {
  private readonly clock: THREE.Clock

  private renderer: THREE.WebGLRenderer
  private camera: THREE.PerspectiveCamera
  private scene: THREE.Scene

  private mixers: THREE.AnimationMixer[]

  private controls: BasicController
  private thirdPersonCamera: ThirdPersonCamera

  public constructor () {
    this.clock = new THREE.Clock()
    this.mixers = []
    this.initialize()
    window.addEventListener('resize', () => this.onResize(), false)
  }

  private initialize () {
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    document.body.appendChild(this.renderer.domElement)

    const fov = 60
    const aspect = 1_920 / 1_080
    const near = 1.0
    const far = 1_000.0
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    this.camera.position.set(-10, 10, 20)

    this.scene = new THREE.Scene()

    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1.0)
    directionalLight.position.set(100, 50, -300)
    directionalLight.target.position.set(0, 0, 0)
    directionalLight.castShadow = true
    directionalLight.shadow.bias = -0.001
    directionalLight.shadow.mapSize.width = 2_048
    directionalLight.shadow.mapSize.height = 2_048
    directionalLight.shadow.camera.near = 0.5
    directionalLight.shadow.camera.far = 500
    directionalLight.shadow.camera.left = 100
    directionalLight.shadow.camera.right = -100
    directionalLight.shadow.camera.top = 100
    directionalLight.shadow.camera.bottom = -100
    this.scene.add(directionalLight)

    const ambientLight = new THREE.AmbientLight(0x404040)
    this.scene.add(ambientLight)

    // TODO: refactor to keep it in front of camera
    const axesHelper = new AxesHelper(5)
    this.scene.add(axesHelper)

    const loader = new THREE.CubeTextureLoader()
    this.scene.background = loader.load([
      '/assets/posx.png',
      '/assets/negx.png',
      '/assets/posy.png',
      '/assets/negy.png',
      '/assets/posz.png',
      '/assets/negz.png',
    ])

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0xFFFFFF }),
    )
    plane.castShadow = false
    plane.receiveShadow = true
    plane.rotation.x = -Math.PI / 2
    this.scene.add(plane)

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshStandardMaterial({ color: 0x808080 }),
    )
    box.position.set(10, 1, -20)
    box.castShadow = true
    box.receiveShadow = true
    box.add(new THREE.AxesHelper(10))
    this.scene.add(box)

    const basicChar = new BasicCharacter({
      name: 'Tom',
      scene: this.scene,
    })
    this.controls = new BasicController({
      domElement: this.renderer.domElement,
      target: basicChar,
      camera: this.camera,
    })

    this.render()
  }

  private onResize () {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  private render () {
    requestAnimationFrame(() => {
      const delta = this.clock.getDelta()
      this.mixers.map(mixer => mixer.update(delta))
      if (this.controls) {
        this.controls.update(delta)
      }
      if (this.thirdPersonCamera) {
        this.thirdPersonCamera.update(delta)
      }
      this.renderer.render(this.scene, this.camera)
      this.render()
    })
  }
}
