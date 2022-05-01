import { State } from './FiniteStateMachine'
import { ActionName } from '../utils'
import { BasicControllerInput } from '../BasicControllerInput'
import { CharacterFSM } from './CharacterFSM'

export class TurnRightState extends State<CharacterFSM> {
  public constructor (parent: CharacterFSM) {
    super(parent)
  }

  get name (): string {
    return ActionName.TURN_RIGHT
  }

  enter (prevState: State<CharacterFSM>): void {
    const turnRightAction = this.parent.proxy.animations[this.name].action

    if (prevState) {
      const prevAction = this.parent.proxy.animations[prevState.name].action

      turnRightAction.time = 0.0
      turnRightAction.enabled = true
      turnRightAction.setEffectiveTimeScale(1.0)
      turnRightAction.setEffectiveWeight(1.0)
      turnRightAction.crossFadeFrom(prevAction, 0.5, true)
    }

    turnRightAction.play()
  }

  exit (): void {
  }

  update (timeElapsed: number, input: BasicControllerInput): void {
    if (input.actions.jump) {
      this.parent.setState(ActionName.JUMP)
      return
    }

    if (input.actions.right) {
      if (input.actions.forward) {
        this.parent.setState(ActionName.WALK)
      } else if (input.actions.backward) {
        this.parent.setState(ActionName.WALK_BACKWARD)
      }
    } else {
      this.parent.setState(ActionName.IDLE)
    }
  }
}
