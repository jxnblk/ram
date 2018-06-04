const index = 'index'
const detail = 'detail'
const create = 'create'
const debug = 'debug'

const modes = {
  index,
  detail,
  create,
  debug
}

const appTypes = {
  react: {
    name: 'React App',
    install: 'create-react-app',
    defaults: {
      type: 'create-react-app',
      port: 3000,
      run: 'run start'
    }
  },
  next: {
    name: 'Next.js App',
    install: 'create-next-app',
    defaults: {
      type: 'create-next-app',
      port: 3000,
      run: 'run dev'
    }
  },
  gatsby: {
    name: 'Gatsby App',
    install: 'gatsby-cli new',
    defaults: {
      type: 'gatsby-cli',
      port: 8000,
      run: 'run develop'
    }
  },
  razzle: {
    name: 'Razzle App',
    install: 'create-razzle-app',
    defaults: {
      type: 'create-razzle-app',
      port: 3000,
      run: 'run start'
    }
  },
  nuxt: {
    name: 'Vue App',
    install: 'vue create -d',
    defaults: {
      type: 'create-vue-app',
      port: 8080,
      run: 'run serve'
    }
  }
}

appTypes.options = Object.keys(appTypes).map(key => ({
  key,
  name: appTypes[key].name
}))

module.exports = {
  modes,
  appTypes
}
