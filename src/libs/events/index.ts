import { EventEmitter } from 'eventemitter3'

const eventEmitter = new EventEmitter()

export enum MenuEvent {
  Back = 'back',
  ToggleEditorMode = 'toggleEditorMode',
}

export default eventEmitter
