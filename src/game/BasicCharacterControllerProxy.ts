import { Animation } from './utils'

export class BasicCharacterControllerProxy {
  private readonly _animations: Record<string, Animation>

  public constructor (animations: Record<string, Animation>) {
    this._animations = animations
  }

  public get animations (): Record<string, Animation> {
    return this._animations
  }
}
