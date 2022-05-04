import { State } from './FiniteStateMachine'
import { ActionName } from '../utils'
import { BasicControllerInput } from '../BasicControllerInput'
import { CharacterFSM } from './CharacterFSM'
import * as THREE from 'three'

export class TurnLeftState extends State<CharacterFSM> {
  public constructor (parent: CharacterFSM) {
    super(parent)
  }

  get name (): string {
    return ActionName.TURN_LEFT
  }

  enter (prevState: State<CharacterFSM>): void {
    const turnLeftAction = this.parent.proxy.animations[this.name].action

    if (prevState) {
      const prevAction = this.parent.proxy.animations[prevState.name].action

      turnLeftAction.time = 0.0
      turnLeftAction.enabled = true
      turnLeftAction.setEffectiveTimeScale(1.0)
      turnLeftAction.setEffectiveWeight(1.0)
      turnLeftAction.crossFadeFrom(prevAction, 0.5, true)
    }

    turnLeftAction.play()
  }

  exit (): void {
  }

  update (timeElapsed: number, input: BasicControllerInput): void {
    const { jump, left, forward, backward } = input.actions
    const rightButton = input.mouseButtonPressed[THREE.MOUSE.RIGHT]

    if (jump) {
      this.parent.setState(ActionName.JUMP)
    } else if (left) {
      if (forward || rightButton) {
        this.parent.setState(ActionName.WALK)
      } else if (backward) {
        this.parent.setState(ActionName.WALK_BACKWARD)
      }
    } else {
      this.parent.setState(ActionName.IDLE)
    }
  }
}
