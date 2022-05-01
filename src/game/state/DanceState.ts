import { State } from './FiniteStateMachine'
import { ActionName } from '../utils'
import * as THREE from 'three'
import { CharacterFSM } from './CharacterFSM'

export class DanceState extends State<CharacterFSM> {
  public readonly finishedCallback: () => void

  public constructor (parent: CharacterFSM) {
    super(parent)

    this.finishedCallback = () => this.finished()
  }

  public get name (): string {
    return ActionName.DANCE
  }

  public enter (prevState: State<CharacterFSM>): void {
    const danceAction = this.parent.proxy.animations[this.name].action

    danceAction.getMixer().addEventListener('finished', this.finishedCallback)

    if (prevState) {
      const prevAction = this.parent.proxy.animations[prevState.name].action
      danceAction.reset()
      danceAction.setLoop(THREE.LoopOnce, 1)
      danceAction.clampWhenFinished = true
      danceAction.crossFadeFrom(prevAction, 0.2, true)
    }

    danceAction.play()
  }

  public finished (): void {
    this.cleanup()
    this.parent.setState(ActionName.IDLE)
  }

  public cleanup (): void {
    this.parent.proxy.animations.dance.action.getMixer().removeEventListener('finished', this.finishedCallback)
  }

  public exit (): void {
    this.cleanup()
  }

  update (): void {
  }
}
