const { modes } = require('./constants')

const push = key => value => state => ({
  [key]: [
    ...state[key],
    value
  ]
})
const pushLog = push('logs')
const pushProject = push('projects')

const setMode = key => state => ({
  project: key !== 'detail' ? null : state.project,
  mode: modes[key] || modes.index
})

const openProject = name => state => {
  const project = state.projects.find(p => p.name === name)
  if (!project) return null
  return { project, mode: 'detail' }
}

const removeProject = name => state => {
  const index = state.projects.findIndex(p => p.name === name)
  if (index < 0) return null
  return {
    mode: modes.index,
    project: null,
    projects: [
      ...state.projects.slice(0, index),
      ...state.projects.slice(index + 1),
    ]
  }
}


module.exports = {
  push,
  pushLog,
  pushProject,
  setMode,
  openProject,
  removeProject,
}
