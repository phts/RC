import runHandlers from './handlers'

export default async function run(actions) {
  if (!Array.isArray(actions)) {
    actions = [actions]
  }
  for (const act of actions) {
    await runHandlers(act)
  }
}
