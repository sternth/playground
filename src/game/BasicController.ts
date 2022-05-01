import * as THREE from 'three'
import { BasicControllerInput } from './BasicControllerInput'
import { BasicCharacter } from './BasicCharacter'
import { bindings, PI, PI_DIVIDED_BY_2, PI_DIVIDED_BY_4, PI_MULTIPLIED_BY_2 } from './constants'

type BasicControllerParams = {
  readonly target: BasicCharacter,
  readonly domElement: HTMLCanvasElement,
  readonly camera: THREE.Camera,
}

export class BasicController {
  private readonly params: BasicControllerParams
  private readonly velocity: THREE.Vector3
  private readonly acceleration: THREE.Vector3
  private readonly deceleration: THREE.Vector3
  private readonly currentPosition: THREE.Vector3
  private readonly currentLookAt: THREE.Vector3
  private readonly cameraOffset: THREE.Vector3
  private readonly spherical: THREE.Spherical
  private readonly input: BasicControllerInput

  private radius: number

  public constructor (params: BasicControllerParams) {
    this.params = params
    this.deceleration = new THREE.Vector3(-10, -0.0001, -10)
    this.acceleration = new THREE.Vector3(100, 1, 100)
    this.velocity = new THREE.Vector3(0, 0, 0)
    this.radius = 25
    this.currentPosition = new THREE.Vector3()
    this.currentLookAt = new THREE.Vector3()
    this.cameraOffset = new THREE.Vector3(0, 10, 0)
    this.spherical = new THREE.Spherical(this.radius, PI_DIVIDED_BY_4, PI)
    this.input = this.setInput()
  }

  public update (timeElapsed: number): void {
    if (!this.params.target.character) return

    this.params.target.stateMachine.update(timeElapsed, this.input)

    const velocity = this.velocity
    const frameDeceleration = new THREE.Vector3(
      velocity.x * this.deceleration.x,
      velocity.y * this.deceleration.y,
      velocity.z * this.deceleration.z,
    )
    frameDeceleration.multiplyScalar(timeElapsed)
    frameDeceleration.x = Math.sign(frameDeceleration.x) * Math.min(Math.abs(frameDeceleration.x), Math.abs(velocity.x))
    frameDeceleration.z = Math.sign(frameDeceleration.z) * Math.min(Math.abs(frameDeceleration.z), Math.abs(velocity.z))
    velocity.add(frameDeceleration)

    const controlObject = this.params.target.character
    const q = new THREE.Quaternion()
    const a = new THREE.Vector3()
    const r = controlObject.quaternion.clone()
    const acceleration = this.acceleration.clone()

    if (this.input.actions.toggleMovement) {
      acceleration.multiplyScalar(2.5)
    }

    if (this.params.target.stateMachine.currentState?.name === 'dance') {
      acceleration.multiplyScalar(0.0)
    }

    if (this.input.actions.forward) {
      velocity.z += acceleration.z * timeElapsed
    }

    if (this.input.actions.backward) {
      velocity.z -= acceleration.z * timeElapsed
    }

    const theta = PI * timeElapsed * this.acceleration.y

    if (this.input.mouseButtonPressed[THREE.MOUSE.RIGHT]) {
      a.set(0, 1, 0)
      q.setFromAxisAngle(a, this.spherical.theta + PI)
      const t = 1.0 - Math.pow(0.001, timeElapsed)
      r.slerp(q, t)

      if (this.input.actions.left) {
        velocity.x += acceleration.x * timeElapsed
      }

      if (this.input.actions.right) {
        velocity.x -= acceleration.x * timeElapsed
      }
    } else {
      if (this.input.actions.left) {
        if (!this.input.mouseButtonPressed[THREE.MOUSE.LEFT]) {
          this.spherical.theta = this.spherical.theta + theta
        }
        a.set(0, 1, 0)
        q.setFromAxisAngle(a, theta)
        r.multiply(q)
      }

      if (this.input.actions.right) {
        if (!this.input.mouseButtonPressed[THREE.MOUSE.LEFT]) {
          this.spherical.theta = this.spherical.theta - theta
        }
        a.set(0, 1, 0)
        q.setFromAxisAngle(a, -theta)
        r.multiply(q)
      }
    }

    controlObject.quaternion.copy(r)

    const oldPosition = new THREE.Vector3()
    oldPosition.copy(controlObject.position)

    const forward = new THREE.Vector3(0, 0, 2)
    forward.applyQuaternion(controlObject.quaternion)
    forward.normalize()

    const sideways = new THREE.Vector3(1, 0, 0)
    sideways.applyQuaternion(controlObject.quaternion)
    sideways.normalize()

    sideways.multiplyScalar(velocity.x * timeElapsed)
    forward.multiplyScalar(velocity.z * timeElapsed)

    controlObject.position.add(forward)
    controlObject.position.add(sideways)

    oldPosition.copy(controlObject.position)

    if (this.params.target.mixer) {
      this.params.target.mixer.update(timeElapsed)
    }

    const idealOffset = this.calculateIdealOffset(timeElapsed)
    const idealLookAt = this.calculateIdealLookAt()

    this.currentPosition.copy(idealOffset)
    this.currentLookAt.copy(idealLookAt)

    this.params.camera.position.copy(this.currentPosition)
    this.params.camera.lookAt(this.currentLookAt)
  }

  private setInput (): BasicControllerInput {
    return new BasicControllerInput({
      domElement: this.params.domElement,
      bindings: bindings,
      onMouseMoving: (...args) => this.onMouseMoving(...args),
      onWheeling: (...args) => this.onWheeling(...args),
    })
  }

  private onMouseMoving (movement: THREE.Vector2): void {
    const theta = PI_MULTIPLIED_BY_2 * movement.x / window.innerWidth
    const phi = PI_MULTIPLIED_BY_2 * movement.y / window.innerHeight

    this.spherical.theta = this.spherical.theta - theta
    this.spherical.phi = Math.max(Math.min(PI_DIVIDED_BY_2, this.spherical.phi - phi), 0)
    this.spherical.makeSafe()
  }

  private onWheeling (down: boolean): void {
    const radius = down ? this.radius - 5 : this.radius + 5
    this.radius = Math.max(5, Math.min(radius, 100))
  }

  private calculateIdealOffset (timeElapsed: number) {
    const idealOffset = new THREE.Vector3(0, 0, 0)
    const t = 1.0 - Math.pow(0.001, timeElapsed)
    this.spherical.radius = THREE.MathUtils.lerp(this.spherical.radius, this.radius, t)
    idealOffset.setFromSpherical(this.spherical)
    idealOffset.add(this.params.target.character.position).add(this.cameraOffset)
    return idealOffset
  }

  private calculateIdealLookAt () {
    const idealLookAt = this.cameraOffset.clone()
    idealLookAt.applyQuaternion(this.params.target.character.quaternion)
    idealLookAt.add(this.params.target.character.position)
    return idealLookAt
  }
}
