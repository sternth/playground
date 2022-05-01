import { FiniteStateMachine } from './FiniteStateMachine'
import { BasicCharacterControllerProxy } from '../BasicCharacterControllerProxy'
import { ActionName } from '../utils'
import { IdleState } from './IdleState'
import { WalkState } from './WalkState'
import { WalkBackwardState } from './WalkBackwardState'
import { RunState } from './RunState'
import { RunBackwardState } from './RunBackwardState'
import { DanceState } from './DanceState'
import { TurnLeftState } from './TurnLeftState'
import { TurnRightState } from './TurnRightState'
import { JumpState } from './JumpState'

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
