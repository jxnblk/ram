const fs = require('fs')
const log = require('electron-log')
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
  if (!fs.existsSync(project.dirname)) {
    log.error('Cannot find directory:', project.dirname)
    return {
      ...removeProject(project.name)(state),
      err: 'Cannot find directory for ' + project.dirname
    }
  }
  return { project, mode: 'detail' }
}

const clearError = state => ({ err: null })

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

const saveThumbnail = thumbnail => state => {
  if (!state.project) return null
  const { dirname } = state.project
  const index = state.projects.findIndex(p => p.dirname === dirname)
  if (index < 0) return null
  return {
    projects: [
      ...state.projects.slice(0, index),
      Object.assign({}, state.projects[index], {
        thumbnail
      }),
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
  saveThumbnail,
  clearError
}
