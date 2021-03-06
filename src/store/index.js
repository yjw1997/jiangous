import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import myPlugin from './plugins/persist'
import setPersist from './plugins/setPersist'
setPersist
Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/)


const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

const store = new Vuex.Store({
  modules,
  plugins: [myPlugin, setPersist],
  getters
})

export default store
