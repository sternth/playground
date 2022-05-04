import * as THREE from 'three'

import { State } from './FiniteStateMachine'
import { ActionName } from '../utils'
import { BasicControllerInput } from '../BasicControllerInput'
import { CharacterFSM } from './CharacterFSM'

export class IdleState extends State<CharacterFSM> {
  public constructor (parent: CharacterFSM) {
    super(parent)
  }

  get name (): string {
    return ActionName.IDLE
  }

  enter (prevState: State<CharacterFSM>): void {
    const idleAction = this.parent.proxy.animations[this.name].action

    if (prevState) {
      const prevAction = this.parent.proxy.animations[prevState.name].action

      idleAction.time = 0.0
      idleAction.enabled = true
      idleAction.setEffectiveTimeScale(1.0)
      idleAction.setEffectiveWeight(1.0)
      idleAction.crossFadeFrom(prevAction, 0.5, true)
    }

    idleAction.play()
  }

  exit (): void {
  }

  update (_: number, input: BasicControllerInput): void {
    const { forward, backward, jump, left, right } = input.actions
    const rightButton = input.mouseButtonPressed[THREE.MOUSE.RIGHT]

    if (forward) {
      this.parent.setState(ActionName.WALK)
    } else if (backward) {
      this.parent.setState(ActionName.WALK_BACKWARD)
    } else if (jump) {
      this.parent.setState(ActionName.JUMP)
    } else if (left) {
      this.parent.setState(rightButton ? ActionName.WALK : ActionName.TURN_LEFT)
    } else if (right) {
      this.parent.setState(rightButton ? ActionName.WALK : ActionName.TURN_RIGHT)
    }
  }
}
