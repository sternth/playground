import { BasicControllerInput } from '../BasicControllerInput'

interface StateConstructor {
  new (parent: FiniteStateMachine): State<FiniteStateMachine>;
}

export abstract class State<T extends FiniteStateMachine> {
  protected readonly parent: T

  protected constructor (parent: T) {
    this.parent = parent
  }

  abstract get name (): string

  abstract enter (prevState: State<T>): void

  abstract exit (): void

  abstract update (timeElapsed: number, input: BasicControllerInput): void
}


export class FiniteStateMachine {
  private readonly states: Record<string, StateConstructor>

  public currentState: State<FiniteStateMachine> | null

  public constructor () {
    this.states = {}
    this.currentState = null
  }

  protected addState (name: string, type: StateConstructor) {
    this.states[name] = type
  }

  public setState (name: string) {
    const prevState = this.currentState

    if (prevState) {
      if (prevState.name === name) {
        return
      }
      prevState.exit()
    }

    const state = new this.states[name](this)

    this.currentState = state
    state.enter(prevState)
  }

  public update (timeElapsed: number, input: BasicControllerInput) {
    if (this.currentState) {
      this.currentState.update(timeElapsed, input)
    }
  }
}
