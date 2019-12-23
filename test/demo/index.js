const { useCallback } = require('react')
const { Fragment } = require('react')
const { render } = require('react-dom')
const h = require('react').createElement
const StoreContext = require('storeon/react/context')
const createStore = require('storeon')
const devtools = require('storeon/devtools')
const connect = require('storeon/react/connect')
const logger = require('storeon/devtools/logger')

const persistState = require('../..')

function counter(store) {
  store.on('@init', () => {
    return { count: 0 }
  })
  store.on('inc', state => {
    return { count: state.count + 1 }
  })
}

function Tracker(props) {
  const hue = Math.round(255 * Math.random())
  const style = { backgroundColor: 'hsla(' + hue + ', 50%, 50%, 0.2)' }
  return h('div', { className: 'tracker', style }, props.value)
}

function Button(props) {
  const onClick = useCallback(() => {
    props.dispatch(props.event)
  })
  return h('button', { onClick }, props.text)
}

function ButtonClear() {
  const onClick = function() {
    localStorage.clear()
  }

  return h('button', { onClick }, 'Clear localStorage')
}

const Tracker1 = connect('count', props => {
  return h(Tracker, {
    value: 'Counter: ' + props.count
  })
})

const Button1 = connect(props => {
  return h(Button, {
    dispatch: props.dispatch,
    event: 'inc',
    text: 'Increase counter'
  })
})

function App() {
  return h(
    Fragment,
    null,
    h('div', null, 'After refresh the page the state should be same'),
    h(Tracker1),
    h('div', { className: 'buttons' }, h(Button1), h(ButtonClear))
  )
}

const store = createStore([counter, logger, persistState(), devtools()])

render(
  h(StoreContext.Provider, { value: store }, h(App)),
  document.querySelector('main')
)
