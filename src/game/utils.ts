import * as THREE from 'three'

export type Animation = {
  clip: THREE.AnimationClip,
  action: THREE.AnimationAction,
}

export enum ActionName {
  WALK = 'walk',
  RUN = 'run',
  WALK_BACKWARD = 'walk-backward',
  RUN_BACKWARD = 'run-backward',
  IDLE = 'idle',
  DANCE = 'dance',
  TURN_LEFT = 'turn-left',
  TURN_RIGHT = 'turn-right',
  JUMP = 'jump',
}
