import { State } from './FiniteStateMachine'
import { ActionName } from '../utils'
import { BasicControllerInput } from '../BasicControllerInput'
import { CharacterFSM } from './CharacterFSM'

export class WalkBackwardState extends State<CharacterFSM> {
  public constructor (parent: CharacterFSM) {
    super(parent)
  }

  get name (): string {
    return ActionName.WALK_BACKWARD
  }

  enter (prevState: State<CharacterFSM>): void {
    const walkBackwardAction = this.parent.proxy.animations[this.name].action

    if (prevState) {
      const prevAction = this.parent.proxy.animations[prevState.name].action

      walkBackwardAction.enabled = true

      if (prevState.name === ActionName.RUN_BACKWARD) {
        const ratio = walkBackwardAction.getClip().duration / prevAction.getClip().duration
        walkBackwardAction.time = prevAction.time * ratio
      } else {
        walkBackwardAction.time = 0.0
        walkBackwardAction.setEffectiveTimeScale(1.0)
        walkBackwardAction.setEffectiveWeight(1.0)
      }

      walkBackwardAction.crossFadeFrom(prevAction, 0.5, true)
    }

    walkBackwardAction.play()
  }

  exit (): void {
  }

  update (_: number, input: BasicControllerInput): void {
    if (input.actions.jump) {
      this.parent.setState(ActionName.JUMP)
      return
    }

    if (input.actions.backward) {
      if (input.actions.toggleMovement) {
        this.parent.setState(ActionName.RUN_BACKWARD)
      }
      return
    }

    this.parent.setState(ActionName.IDLE)
  }
}
