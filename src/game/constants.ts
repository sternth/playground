import { KeyBindings } from './types'

/* PI */
export const PI = Math.PI

/* double PI */
export const PI_MPY2 = Math.PI * 2

/* half PI */
export const PI_DIV2 = Math.PI / 2

/* one quarter PI */
export const PI_DIV4 = Math.PI / 4

/* three-quarter PI */
export const PI_DIV4_MPY3 = Math.PI / 4 * 3

export const bindings: KeyBindings = {
  forward: ['w', 'arrowup'],
  backward: ['s', 'arrowdown'],
  left: ['a', 'arrowleft'],
  right: ['d', 'arrowright'],
  jump: [' '],
  dance: ['x'],
  toggleMovement: ['/'],
}
