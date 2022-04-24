export type BasicControllerActions = {
  forward: boolean,
  backward: boolean,
  left: boolean,
  right: boolean,
  jump: boolean,
  dance: boolean,
  toggleMovement: boolean,
}

export type KeyBindings = Record<keyof BasicControllerActions, string[]>
export type KeyMappings = Record<string, keyof BasicControllerActions>
