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
    if (input.actions.forward) {
      this.parent.setState(ActionName.WALK)
    } else if (input.actions.backward) {
      this.parent.setState(ActionName.WALK_BACKWARD)
    } else if (input.actions.jump) {
      this.parent.setState(ActionName.JUMP)
    } else if (input.actions.left) {
      this.parent.setState(ActionName.TURN_LEFT)
    } else if (input.actions.right) {
      this.parent.setState(ActionName.TURN_RIGHT)
    }
  }
}
