import * as THREE from 'three'

import { FiniteStateMachine, State } from './FiniteStateMachine'
import { BasicCharacterControllerProxy } from './BasicCharacterControllerProxy'
import { ActionName } from './utils'
import { BasicControllerInput } from './BasicControllerInput'

export class CharacterFSM extends FiniteStateMachine {
  public readonly proxy: BasicCharacterControllerProxy

  public constructor (proxy: BasicCharacterControllerProxy) {
    super()

    this.proxy = proxy
    this.addState(ActionName.IDLE, IdleState)
    this.addState(ActionName.WALK, WalkState)
    this.addState(ActionName.WALK_BACKWARD, WalkBackwardState)
    this.addState(ActionName.RUN, RunState)
    this.addState(ActionName.RUN_BACKWARD, RunBackwardState)
    this.addState(ActionName.DANCE, DanceState)
    this.addState(ActionName.TURN_LEFT, TurnLeftState)
    this.addState(ActionName.TURN_RIGHT, TurnRightState)
    this.addState(ActionName.JUMP, JumpState)
  }
}

class IdleState extends State<CharacterFSM> {
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

class WalkState extends State<CharacterFSM> {
  public constructor (parent: CharacterFSM) {
    super(parent)
  }

  get name (): string {
    return ActionName.WALK
  }

  enter (prevState: State<CharacterFSM>): void {
    const walkAction = this.parent.proxy.animations[this.name].action

    if (prevState) {
      const prevAction = this.parent.proxy.animations[prevState.name].action

      walkAction.enabled = true

      if (prevState.name === ActionName.RUN) {
        const ratio = walkAction.getClip().duration / prevAction.getClip().duration
        walkAction.time = prevAction.time * ratio
      } else {
        walkAction.time = 0.0
        walkAction.setEffectiveTimeScale(1.0)
        walkAction.setEffectiveWeight(1.0)
      }

      walkAction.crossFadeFrom(prevAction, 0.5, true)
    }

    walkAction.play()
  }

  exit (): void {
  }

  update (_: number, input: BasicControllerInput): void {
    if (input.actions.jump) {
      this.parent.setState(ActionName.JUMP)
      return
    }

    if (input.actions.forward) {
      if (input.actions.toggleMovement) {
        this.parent.setState(ActionName.RUN)
      }
      return
    }

    this.parent.setState(ActionName.IDLE)
  }
}

class WalkBackwardState extends State<CharacterFSM> {
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

class RunState extends State<CharacterFSM> {
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

class RunBackwardState extends State<CharacterFSM> {
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

class TurnLeftState extends State<CharacterFSM> {
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
    if (input.actions.jump) {
      this.parent.setState(ActionName.JUMP)
      return
    }

    if (input.actions.left) {
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

class TurnRightState extends State<CharacterFSM> {
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

class DanceState extends State<CharacterFSM> {
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

class JumpState extends State<CharacterFSM> {
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
