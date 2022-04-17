import * as THREE from 'three'

type ThirdPersonCameraParams = {
  camera: THREE.Camera,
  target: THREE.Object3D,
}

const PI = Math.PI
const PI_MULTIPLIED_BY_2 = Math.PI * 2
const PI_DIVIDED_BY_2 = Math.PI / 2
const PI_DIVIDED_BY_4 = Math.PI / 4

export class ThirdPersonCamera {
  private readonly params: ThirdPersonCameraParams
  private readonly currentPosition: THREE.Vector3
  private readonly currentLookAt: THREE.Vector3

  private readonly headOffset: THREE.Vector3
  private readonly spherical: THREE.Spherical

  private readonly pressed: boolean[]

  private locked: boolean
  private radius: number

  public constructor (params: ThirdPersonCameraParams) {
    this.params = params
    this.currentPosition = new THREE.Vector3()
    this.currentLookAt = new THREE.Vector3()

    this.headOffset = new THREE.Vector3(0, 10, 0)
    this.pressed = []

    this.radius = 25
    this.spherical = new THREE.Spherical(this.radius, PI_DIVIDED_BY_4, PI)

    this.locked = false

    document.addEventListener('mousedown', event => {
      document.body.requestPointerLock()
      this.locked = true
      this.pressed[event.button] = true
    })

    document.addEventListener('mouseup', event => {
      document.exitPointerLock()
      this.locked = false
      this.pressed[event.button] = false
    })

    document.addEventListener('mousemove', event => {
      if (this.locked) {
        const theta = PI_MULTIPLIED_BY_2 * event.movementX / window.innerWidth
        const phi = PI_MULTIPLIED_BY_2 * event.movementY / window.innerHeight

        this.spherical.theta = this.spherical.theta - theta
        this.spherical.phi = Math.max(Math.min(PI_DIVIDED_BY_2, this.spherical.phi - phi), 0)
        this.spherical.makeSafe()
      }
    })

    document.addEventListener('wheel', event => {
      if (event.deltaY < 0 && this.radius > 10) {
        this.radius -= 5
      } else if (event.deltaY > 0 && this.radius < 100) {
        this.radius += 5
      }
    })
  }

  public update (timeElapsed: number) {
    const idealOffset = this.calculateIdealOffset(timeElapsed)
    const idealLookAt = this.calculateIdealLookAt()

    this.currentPosition.copy(idealOffset)
    this.currentLookAt.copy(idealLookAt)

    this.params.camera.position.copy(this.currentPosition)
    this.params.camera.lookAt(this.currentLookAt)


    if (this.pressed[THREE.MOUSE.RIGHT]) {
      const v1 = new THREE.Vector3()

      this.params.camera.getWorldDirection(v1)
      v1.y = 0
      v1.add(this.params.target.position)

      this.params.target.lookAt(v1)
    }
  }

  private calculateIdealOffset (timeElapsed: number) {
    const idealOffset = new THREE.Vector3(0, 0, 0)
    const t = 1.0 - Math.pow(0.001, timeElapsed)
    this.spherical.radius = THREE.MathUtils.lerp(this.spherical.radius, this.radius, t)
    idealOffset.setFromSpherical(this.spherical)
    idealOffset.add(this.params.target.position).add(this.headOffset)
    return idealOffset
  }

  private calculateIdealLookAt () {
    const idealLookAt = this.headOffset.clone()
    idealLookAt.applyQuaternion(this.params.target.quaternion)
    idealLookAt.add(this.params.target.position)
    return idealLookAt
  }
}
