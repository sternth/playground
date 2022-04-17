import * as THREE from 'three'
import { BasicCharacterControllerInput } from './BasicCharacterControllerInput'
import { CharacterFSM } from './CharacterFSM'
import { BasicCharacterControllerProxy } from './BasicCharacterControllerProxy'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { ActionName } from './utils'

type Animation = {
  clip: THREE.AnimationClip,
  action: THREE.AnimationAction,
}

type BasicCharacterControllerParams = {
  scene: THREE.Scene,
  onReady: (target: THREE.Object3D) => void,
}

export class BasicCharacterController {
  private readonly params: BasicCharacterControllerParams
  private readonly velocity: THREE.Vector3
  private readonly acceleration: THREE.Vector3
  private readonly deceleration: THREE.Vector3
  private readonly animations: Record<string, Animation>
  private readonly input: BasicCharacterControllerInput
  private readonly stateMachine: CharacterFSM

  private target?: THREE.Group
  private mixer?: THREE.AnimationMixer
  private manager?: THREE.LoadingManager

  public constructor (params: BasicCharacterControllerParams) {
    this.params = params
    this.deceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0)
    this.acceleration = new THREE.Vector3(1, 0.25, 50.0)
    this.velocity = new THREE.Vector3(0, 0, 0)
    this.animations = {}
    this.input = new BasicCharacterControllerInput()
    this.stateMachine = this.setStateMachine()
    this.loadModels()
  }

  private setStateMachine (): CharacterFSM {
    const proxy = new BasicCharacterControllerProxy(this.animations)
    return new CharacterFSM(proxy)
  }

  private loadModels (): void {
    const loader = new FBXLoader()

    loader.setPath('/assets/knight/')
    loader.load('guard_model.fbx', fbx => {
      fbx.scale.setScalar(0.05)
      fbx.traverse(c => c.castShadow = true)

      this.target = fbx
      this.target.position.y = 0
      this.params.scene.add(this.target)
      this.params.onReady(this.target)

      this.mixer = new THREE.AnimationMixer(this.target)
      this.manager = new THREE.LoadingManager()
      this.manager.onLoad = () => this.stateMachine.setState('idle')

      const onLoad = (animationName: string, animation: THREE.Group) => {
        const clip = animation.animations[0]
        const action = this.mixer.clipAction(clip)

        this.animations[animationName] = { clip, action }
      }

      const loader = new FBXLoader(this.manager)
      loader.setPath('/assets/knight/')
      loader.load('walking_animation.fbx', a => onLoad(ActionName.WALK, a))
      loader.load('running_animation.fbx', a => onLoad(ActionName.RUN, a))
      loader.load('walking_backward_animation.fbx', a => onLoad(ActionName.WALK_BACKWARD, a))
      loader.load('running_backward_animation.fbx', a => onLoad(ActionName.RUN_BACKWARD, a))
      loader.load('breathing_idle_animation.fbx', a => onLoad(ActionName.IDLE, a))
      loader.load('gangnam_style_animation.fbx', a => onLoad(ActionName.DANCE, a))
      loader.load('left_turn_animation.fbx', a => onLoad(ActionName.TURN_LEFT, a))
      loader.load('right_turn_animation.fbx', a => onLoad(ActionName.TURN_RIGHT, a))
      loader.load('jump_animation.fbx', a => onLoad(ActionName.JUMP, a))
    })
  }

  public update (timeInSeconds) {
    if (!this.target) {
      return
    }

    this.stateMachine.update(timeInSeconds, this.input)

    const velocity = this.velocity
    const frameDeceleration = new THREE.Vector3(
      velocity.x * this.deceleration.x,
      velocity.y * this.deceleration.y,
      velocity.z * this.deceleration.z,
    )
    frameDeceleration.multiplyScalar(timeInSeconds)
    frameDeceleration.z = Math.sign(frameDeceleration.z) * Math.min(Math.abs(frameDeceleration.z), Math.abs(velocity.z))
    velocity.add(frameDeceleration)

    const controlObject = this.target
    const q = new THREE.Quaternion()
    const a = new THREE.Vector3()
    const r = controlObject.quaternion.clone()
    const acceleration = this.acceleration.clone()

    if (this.input.keys.slash) {
      acceleration.multiplyScalar(2.5)
    }

    if (this.stateMachine.currentState?.name === 'dance') {
      acceleration.multiplyScalar(0.0)
    }

    if (this.input.keys.forward) {
      velocity.z += acceleration.z * timeInSeconds
    }

    if (this.input.keys.backward) {
      velocity.z -= acceleration.z * timeInSeconds
    }

    if (this.input.keys.left) {
      a.set(0, 1, 0)
      q.setFromAxisAngle(a, 5.0 * Math.PI * timeInSeconds * this.acceleration.y)
      r.multiply(q)
    }

    if (this.input.keys.right) {
      a.set(0, 1, 0)
      q.setFromAxisAngle(a, 5.0 * -Math.PI * timeInSeconds * this.acceleration.y)
      r.multiply(q)
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

    sideways.multiplyScalar(velocity.x * timeInSeconds)
    forward.multiplyScalar(velocity.z * timeInSeconds)

    controlObject.position.add(forward)
    controlObject.position.add(sideways)

    oldPosition.copy(controlObject.position)

    if (this.mixer) {
      this.mixer.update(timeInSeconds)
    }
  }
}
