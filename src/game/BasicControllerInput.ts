import * as THREE from 'three'
import { BasicControllerActions, KeyBindings, KeyMappings } from './types'
import { isToggleAction } from './utils'

type BasicControllerInputParams = {
  domElement: HTMLCanvasElement,
  bindings: KeyBindings,
  onMouseMoving: (movement: THREE.Vector2) => void,
  onWheeling: (down: boolean) => void,
}

export class BasicControllerInput {
  private readonly params: BasicControllerInputParams
  private readonly destroy: () => void

  public actions: BasicControllerActions
  public mouseButtonPressed: boolean[]

  private pointerLocked: boolean
  private keyMappings: KeyMappings

  public constructor (params: BasicControllerInputParams) {
    this.params = params
    this.actions = BasicControllerInput.getActionDefaultValues()
    this.mouseButtonPressed = []
    this.pointerLocked = false
    this.setKeyMappings(params.bindings)
    this.destroy = this.registerEventListeners()
  }

  private static getActionDefaultValues (): BasicControllerActions {
    return {
      forward: false,
      backward: false,
      left: false,
      right: false,
      jump: false,
      dance: false,
      toggleMovement: true,
    }
  }

  public setKeyMappings (bindings: KeyBindings) {
    this.keyMappings = Object.entries(bindings).reduce((result, entry) => {
      const [action, keys] = entry
      keys.forEach(key => result[key] = action)
      return result
    }, {})
  }

  private registerEventListeners (): () => void {
    const onKeyDown = (event: KeyboardEvent) => {
      event.preventDefault()
      this.onKeyDown(event)
    }
    const onKeyUp = (event: KeyboardEvent) => {
      event.preventDefault()
      this.onKeyUp(event)
    }
    const onMouseDown = (event: MouseEvent) => {
      this.onMouseDown(event)
    }
    const onMouseUp = (event: MouseEvent) => {
      this.onMouseUp(event)
    }
    const onMouseMove = (event: MouseEvent) => {
      this.onMouseMove(event)
    }
    const onContextMenu = (event: MouseEvent) => {
      event.preventDefault()
    }
    const onWheel = (event: WheelEvent) => {
      this.onWheel(event)
    }

    window.addEventListener('keydown', onKeyDown, false)
    window.addEventListener('keyup', onKeyUp, false)
    this.params.domElement.addEventListener('mousedown', onMouseDown, false)
    this.params.domElement.addEventListener('mouseup', onMouseUp, false)
    this.params.domElement.addEventListener('mousemove', onMouseMove, false)
    this.params.domElement.addEventListener('contextmenu', onContextMenu, false)
    this.params.domElement.addEventListener('wheel', onWheel, false)

    return () => {
      window.removeEventListener('keydown', onKeyDown, false)
      window.removeEventListener('keyup', onKeyUp, false)
      this.params.domElement.removeEventListener('mousedown', onMouseDown, false)
      this.params.domElement.removeEventListener('mouseup', onMouseUp, false)
      this.params.domElement.removeEventListener('mousemove', onMouseMove, false)
      this.params.domElement.removeEventListener('contextmenu', onContextMenu, false)
      this.params.domElement.removeEventListener('wheel', onWheel, false)
    }
  }

  private onKeyDown (event: KeyboardEvent) {
    const key = event.key.toLowerCase()
    const actionName = this.keyMappings[key]

    if (actionName) {
      this.actions[actionName] = isToggleAction(actionName) ? !this.actions[actionName] : true
    }
  }

  private onKeyUp (event: KeyboardEvent) {
    const key = event.key.toLowerCase()
    const actionName = this.keyMappings[key]

    if (actionName && !isToggleAction(actionName)) {
      this.actions[actionName] = false
    }
  }

  private onMouseDown (event: MouseEvent) {
    this.params.domElement.requestPointerLock()
    this.pointerLocked = true
    this.mouseButtonPressed[event.button] = true
  }

  private onMouseUp (event: MouseEvent) {
    this.mouseButtonPressed[event.button] = false
    if (!this.mouseButtonPressed.some(active => active)) {
      document.exitPointerLock()
      this.pointerLocked = false
    }
  }

  private onMouseMove (event: MouseEvent) {
    if (this.pointerLocked) {
      this.params.onMouseMoving(new THREE.Vector2(event.movementX, event.movementY))
    }
  }

  private onWheel (event: WheelEvent) {
    this.params.onWheeling(event.deltaY < 0)
  }
}
