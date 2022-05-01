import { State } from './FiniteStateMachine'
import { ActionName } from '../utils'
import * as THREE from 'three'
import { CharacterFSM } from './CharacterFSM'

export class JumpState extends State<CharacterFSM> {
  public readonly finishedCallback: () => void

  private prevActionName: string

  public constructor (parent: CharacterFSM) {
    super(parent)

    this.finishedCallback = () => this.finished()
    this.prevActionName = ActionName.IDLE
  }

  public get name (): string {
    return ActionName.JUMP
  }

  public enter (prevState: State<CharacterFSM>): void {
    const jumpAction = this.parent.proxy.animations[this.name].action

    jumpAction.getMixer().addEventListener('finished', this.finishedCallback)

    if (prevState) {
      const prevAction = this.parent.proxy.animations[prevState.name].action
      jumpAction.reset()
      jumpAction.setLoop(THREE.LoopOnce, 1)
      jumpAction.clampWhenFinished = true
      jumpAction.crossFadeFrom(prevAction, 0.2, true)
      this.prevActionName = prevState.name
    }

    jumpAction.play()
  }

  public finished (): void {
    this.cleanup()
    this.parent.setState(this.prevActionName)
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
