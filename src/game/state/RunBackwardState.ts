import { State } from './FiniteStateMachine'
import { ActionName } from '../utils'
import { BasicControllerInput } from '../BasicControllerInput'
import { CharacterFSM } from './CharacterFSM'

export class RunBackwardState extends State<CharacterFSM> {
  public constructor (parent: CharacterFSM) {
    super(parent)
  }

  get name (): string {
    return ActionName.RUN_BACKWARD
  }

  enter (prevState: State<CharacterFSM>): void {
    const runBackwardAction = this.parent.proxy.animations[this.name].action

    if (prevState) {
      const prevAction = this.parent.proxy.animations[prevState.name].action

      runBackwardAction.enabled = true

      if (prevState.name === ActionName.WALK_BACKWARD) {
        const ratio = runBackwardAction.getClip().duration / prevAction.getClip().duration
        runBackwardAction.time = prevAction.time * ratio
      } else {
        runBackwardAction.time = 0.0
        runBackwardAction.setEffectiveTimeScale(1.0)
        runBackwardAction.setEffectiveWeight(1.0)
      }

      runBackwardAction.crossFadeFrom(prevAction, 0.5, true)
    }

    runBackwardAction.play()
  }

  exit (): void {
  }

  update (_: number, input: BasicControllerInput): void {
    if (input.actions.jump) {
      this.parent.setState(ActionName.JUMP)
      return
    }

    if (input.actions.backward) {
      if (!input.actions.toggleMovement) {
        this.parent.setState(ActionName.WALK_BACKWARD)
      }
      return
    }

    this.parent.setState(ActionName.IDLE)
  }
}
