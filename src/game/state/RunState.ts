import { State } from './FiniteStateMachine'
import { ActionName } from '../utils'
import { BasicControllerInput } from '../BasicControllerInput'
import { CharacterFSM } from './CharacterFSM'

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
    if (input.actions.jump) {
      this.parent.setState(ActionName.JUMP)
      return
    }

    if (input.actions.forward || input.actions.backward) {
      if (!input.actions.toggleMovement) {
        this.parent.setState(ActionName.WALK)
      }
      return
    }

    this.parent.setState(ActionName.IDLE)
  }
}
