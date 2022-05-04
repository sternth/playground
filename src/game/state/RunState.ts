import { State } from './FiniteStateMachine'
import { ActionName } from '../utils'
import { BasicControllerInput } from '../BasicControllerInput'
import { CharacterFSM } from './CharacterFSM'
import * as THREE from 'three'

export class RunState extends State<CharacterFSM> {
  public constructor (parent: CharacterFSM) {
    super(parent)
  }

  get name (): string {
    return ActionName.RUN
  }

  enter (prevState: State<CharacterFSM>): void {
    const runAction = this.parent.proxy.animations[this.name].action

    if (prevState) {
      const prevAction = this.parent.proxy.animations[prevState.name].action

      runAction.enabled = true

      if (prevState.name === ActionName.WALK) {
        const ratio = runAction.getClip().duration / prevAction.getClip().duration
        runAction.time = prevAction.time * ratio
      } else {
        runAction.time = 0.0
        runAction.setEffectiveTimeScale(1.0)
        runAction.setEffectiveWeight(1.0)
      }

      runAction.crossFadeFrom(prevAction, 0.5, true)
    }

    runAction.play()
  }

  exit (): void {
  }

  update (_: number, input: BasicControllerInput): void {
    const { jump, left, right, forward, backward, toggleMovement } = input.actions
    const rightButton = input.mouseButtonPressed[THREE.MOUSE.RIGHT]

    if (jump) {
      this.parent.setState(ActionName.JUMP)
    } else if (forward) {
      if (!toggleMovement) this.parent.setState(ActionName.WALK)
    } else if (backward) {
      this.parent.setState(ActionName.RUN_BACKWARD)
    } else if (rightButton && (left || right)) {
      if (!toggleMovement) this.parent.setState(ActionName.WALK)
    } else {
      this.parent.setState(ActionName.IDLE)
    }
  }
}
