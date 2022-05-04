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
    const { jump, forward, backward, toggleMovement } = input.actions

    if (jump) {
      this.parent.setState(ActionName.JUMP)
    } else if (forward) {
      this.parent.setState(ActionName.WALK)
    } else if (backward) {
      if (toggleMovement) this.parent.setState(ActionName.RUN_BACKWARD)
    } else {
      this.parent.setState(ActionName.IDLE)
    }
  }
}
