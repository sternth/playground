enum KEY {
  W_LOWERCASE = 'w',
  W_UPPERCASE = 'W',
  A_LOWERCASE = 'a',
  A_UPPERCASE = 'A',
  S_LOWERCASE = 's',
  S_UPPERCASE = 'S',
  D_LOWERCASE = 'd',
  D_UPPERCASE = 'D',
  SHIFT = 'Shift',
  SPACE = ' ',
  SLASH = '/',
}

type BasicCharacterControllerInputKeys = {
  forward: boolean,
  backward: boolean,
  left: boolean,
  right: boolean,
  space: boolean,
  shift: boolean,
  slash: boolean,
}

export class BasicCharacterControllerInput {
  public readonly keys: BasicCharacterControllerInputKeys

  public constructor () {
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      space: false,
      shift: false,
      slash: true,
    }
    this.registerEventListeners()
  }

  private registerEventListeners () {
    document.addEventListener('keydown', this.onKeyDown.bind(this), false)
    document.addEventListener('keyup', this.onKeyUp.bind(this), false)
  }

  private onKeyDown (event: KeyboardEvent) {
    switch (event.key) {
      case KEY.W_LOWERCASE:
      case KEY.W_UPPERCASE:
        this.keys.forward = true
        break
      case KEY.A_LOWERCASE:
      case KEY.A_UPPERCASE:
        this.keys.left = true
        break
      case KEY.S_LOWERCASE:
      case KEY.S_UPPERCASE:
        this.keys.backward = true
        break
      case KEY.D_LOWERCASE:
      case KEY.D_UPPERCASE:
        this.keys.right = true
        break
      case KEY.SPACE:
        this.keys.space = true
        break
      case KEY.SHIFT:
        this.keys.shift = true
        break
      case KEY.SLASH:
        this.keys.slash = !this.keys.slash
        break
    }
  }

  private onKeyUp (event: KeyboardEvent) {
    switch (event.key) {
      case KEY.W_LOWERCASE:
      case KEY.W_UPPERCASE:
        this.keys.forward = false
        break
      case KEY.A_LOWERCASE:
      case KEY.A_UPPERCASE:
        this.keys.left = false
        break
      case KEY.S_LOWERCASE:
      case KEY.S_UPPERCASE:
        this.keys.backward = false
        break
      case KEY.D_LOWERCASE:
      case KEY.D_UPPERCASE:
        this.keys.right = false
        break
      case KEY.SPACE:
        this.keys.space = false
        break
      case KEY.SHIFT:
        this.keys.shift = false
        break
    }
  }
}
