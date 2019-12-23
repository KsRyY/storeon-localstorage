const picomatch = require('picomatch')

/**
 * Storeon module to persist state to local storage
 *
 * @param {String[]} paths The keys of state object
 *    that will be store in local storage
 * @param {Object} config The config object
 * @param {String} [config.key='storeon'] The default key
 *    to use in local storage
 */
const persistState = function(paths = [], config = {}) {
  const key = config.key || 'storeon'

  return function(store) {
    let initialized = false

    let matchers = []

    store.on('@init', function() {
      initialized = true

      try {
        const savedState = localStorage.getItem(key)
        if (savedState !== null) {
          return JSON.parse(savedState)
        }
      } catch (error) {
        console.error(error)
      }
    })
    store.on('@dispatch', function(state) {
      if (!initialized) {
        return
      }

      let stateToStore = {}
      if (paths.length === 0) {
        stateToStore = state
      } else {
        matchers = paths.map(path => picomatch(path))
        Object.keys(state).forEach(key => {
          matchers.forEach(matcher => {
            if (matcher(key)) {
              stateToStore[key] = state[key]
            }
          })
        })
      }

      try {
        const saveState = JSON.stringify(stateToStore)
        localStorage.setItem(key, saveState)
      } catch (_) {}
    })
  }
}

module.exports = persistState
