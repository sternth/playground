import { ActionName, Animation } from './utils'
import { CharacterFSM } from './state/CharacterFSM'
import * as THREE from 'three'
import { BasicCharacterControllerProxy } from './BasicCharacterControllerProxy'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

type BasicCharacterParams = {
  name: string,
  scene: THREE.Scene,
}

export class BasicCharacter {
  public readonly loading: Promise<BasicCharacter>
  public readonly stateMachine: CharacterFSM
  public readonly animations: Record<string, Animation>

  private readonly params: BasicCharacterParams

  public character?: THREE.Group
  public mixer?: THREE.AnimationMixer

  private manager?: THREE.LoadingManager

  public constructor (params: BasicCharacterParams) {
    this.params = params
    this.animations = {}
    this.stateMachine = this.setStateMachine()
    this.loading = this.loadModel()
  }

  public getName (): string {
    return this.params.name
  }

  private setStateMachine (): CharacterFSM {
    const proxy = new BasicCharacterControllerProxy(this.animations)
    return new CharacterFSM(proxy)
  }

  private async loadModel (): Promise<BasicCharacter> {
    const loader = new FBXLoader()

    loader.setPath('/assets/knight/')

    return new Promise((resolve, reject) => {
      loader.load('guard_model.fbx', fbx => {
        fbx.scale.setScalar(0.05)
        fbx.traverse(c => c.castShadow = true)

        console.log('loaded fbx')

        this.character = fbx
        this.character.position.y = 0
        this.params.scene.add(this.character)
        this.mixer = new THREE.AnimationMixer(this.character)
        this.manager = new THREE.LoadingManager()
        this.manager.onLoad = () => this.stateMachine.setState('idle')
        this.loadAnimations()

        resolve(this)
      }, null, reject)
    })
  }

  private loadAnimations (): void {
    const loader = new FBXLoader(this.manager)

    loader.setPath('/assets/knight/')
    loader.load('walking_animation.fbx', a => this.addAnimation(ActionName.WALK, a))
    loader.load('running_animation.fbx', a => this.addAnimation(ActionName.RUN, a))
    loader.load('walking_backward_animation.fbx', a => this.addAnimation(ActionName.WALK_BACKWARD, a))
    loader.load('running_backward_animation.fbx', a => this.addAnimation(ActionName.RUN_BACKWARD, a))
    loader.load('breathing_idle_animation.fbx', a => this.addAnimation(ActionName.IDLE, a))
    loader.load('gangnam_style_animation.fbx', a => this.addAnimation(ActionName.DANCE, a))
    loader.load('left_turn_animation.fbx', a => this.addAnimation(ActionName.TURN_LEFT, a))
    loader.load('right_turn_animation.fbx', a => this.addAnimation(ActionName.TURN_RIGHT, a))
    loader.load('jump_animation.fbx', a => this.addAnimation(ActionName.JUMP, a))
  }

  private addAnimation (animationName: string, animation: THREE.Group) {
    const clip = animation.animations[0]
    const action = this.mixer.clipAction(clip)

    this.animations[animationName] = { clip, action }
  }
}
