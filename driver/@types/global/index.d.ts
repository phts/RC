declare module '*/settings.json' {
  interface RunningOperator {
    running: string
  }

  interface KeyAction {
    key: string | string[]
  }

  interface ExecAction {
    exec: string | string[]
  }

  interface IfThenElseAction {
    if: RunningOperator
    then: Action | Actions
    else: Action | Actions
  }

  type Action = KeyAction | ExecAction | IfThenElseAction
  type Actions = Array<Action>

  interface Settings {
    serialPort: string
    debounceDelay: number
    noDebounce: string[]
    mappings: {[key: string]: Action | Actions}
  }

  const settings: Settings
  export default settings
}
