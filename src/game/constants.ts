import { KeyBindings } from './types'

export const PI = Math.PI

export const PI_MULTIPLIED_BY_2 = Math.PI * 2

export const PI_DIVIDED_BY_2 = Math.PI / 2

export const PI_DIVIDED_BY_4 = Math.PI / 4

export const bindings: KeyBindings = {
  forward: ['w', 'arrowup'],
  backward: ['s', 'arrowdown'],
  left: ['a', 'arrowleft'],
  right: ['d', 'arrowright'],
  jump: [' '],
  dance: ['x'],
  toggleMovement: ['/'],
}
