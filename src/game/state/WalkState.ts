import * as THREE from 'three'

import { State } from './FiniteStateMachine'
import { ActionName } from '../utils'
import { BasicControllerInput } from '../BasicControllerInput'
import { CharacterFSM } from './CharacterFSM'

export class WalkState extends State<CharacterFSM> {
  public constructor (parent: CharacterFSM) {
    super(parent)
  }

  get name (): string {
    return ActionName.WALK
  }

  enter (prevState: State<CharacterFSM>): void {
    const walkAction = this.parent.proxy.animations[this.name].action

    if (prevState) {
      const prevAction = this.parent.proxy.animations[prevState.name].action

      walkAction.enabled = true

      if (prevState.name === ActionName.RUN) {
        const ratio = walkAction.getClip().duration / prevAction.getClip().duration
        walkAction.time = prevAction.time * ratio
      } else {
        walkAction.time = 0.0
        walkAction.setEffectiveTimeScale(1.0)
        walkAction.setEffectiveWeight(1.0)
      }

      walkAction.crossFadeFrom(prevAction, 0.5, true)
    }

    walkAction.play()
  }

  exit (): void {
  }

  update (_: number, input: BasicControllerInput): void {
    const { jump, forward, backward, toggleMovement, left, right } = input.actions
    const rightButton = input.mouseButtonPressed[THREE.MOUSE.RIGHT]

    if (jump) {
      this.parent.setState(ActionName.JUMP)
    } else if (forward) {
      if (toggleMovement) this.parent.setState(ActionName.RUN)
    } else if (backward) {
      this.parent.setState(ActionName.WALK_BACKWARD)
    } else if (rightButton && (left || right)) {
      if (toggleMovement) this.parent.setState(ActionName.RUN)
    } else {
      this.parent.setState(ActionName.IDLE)
    }
  }
}
