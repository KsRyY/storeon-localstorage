const createStore = require('storeon')

const persistState = require('..')

afterEach(() => {
  localStorage.clear()
  jest.restoreAllMocks()
})

it('should update the localStorage', () => {
  const store = createStore([persistState()])
  store.on('test', () => {
    return { b: 1 }
  })
  store.dispatch('test')

  expect(localStorage.getItem('storeon')).toEqual(JSON.stringify({ b: 1 }))
})

it('should update the state after init', () => {
  const data = JSON.stringify({ a: 1, b: 2 })
  localStorage.setItem('storeon', data)

  createStore([persistState()])

  expect(localStorage.getItem('storeon')).toEqual(data)
})

it('should update the localStorage only white listed names', () => {
  const store = createStore([persistState(['a'])])

  store.on('test', () => {
    return { a: 1, b: 1 }
  })
  store.dispatch('test')

  expect(localStorage.getItem('storeon')).toEqual(JSON.stringify({ a: 1 }))
})

it('should work with missed config key', () => {
  const store = createStore([persistState(['a'], {})])

  store.on('test', () => {
    return { a: 1 }
  })
  store.dispatch('test')

  expect(localStorage.getItem('storeon')).toEqual(JSON.stringify({ a: 1 }))
})

it('should hande non jsonable object in localStorage', () => {
  localStorage.setItem('storeon', 'test string')

  const store = createStore([persistState()])

  expect(store.get()).toEqual({})
})

it('should handle non jsonable object in state', () => {
  jest.spyOn(JSON, 'stringify').mockImplementationOnce(() => {
    throw new Error('mock error')
  })
  const store = createStore([persistState(['a'])])

  store.on('test', () => {
    return 'nonce'
  })

  expect(store.get()).toEqual({})
})

it('should not process @dispatch before @init', () => {
  localStorage.setItem('storeon', JSON.stringify({ a: 'foo' }))

  const store = createStore([
    // This module tries to trigger a save in the local storage module
    function(s) {
      s.on('@init', () => {
        s.dispatch('foo')
      })
    },

    persistState(['a'])
  ])

  // If a save was triggered by the first module, the state would now be blank
  expect(store.get()).toEqual({ a: 'foo' })
})
