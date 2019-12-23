# Storeon localStorage

> This is a fork version of the original package, adding glob-pattern support.

<img src="https://storeon.github.io/storeon/logo.svg" align="right"
     alt="Storeon logo by Anton Lovchikov" width="160" height="142">

Tiny module for [Storeon] to store and sync state to `localStorage`. It restores state from `localStorage` during page loading and saves state on every change.

It is an 8kb module (it uses [Size Limit] to control the size) with only one dependency (picomatch).

It is significantly bigger than the original version (173 bytes), but it is more powerful.

[size limit]: https://github.com/ai/size-limit
[storeon]: https://github.com/storeon/storeon

## Installation

```
npm install storeon-localstorage2
```

## Usage

If you want to store and sync state to `localStorage` you should import the `persistState` from `storeon-localstorage2` and add this module to `createStore`.

```js
import createStore from 'storeon'
import persistState from 'storeon-localstorage2'

let name = store => {
  store.on('@init', () => ({ name: '' }))

  store.on('save', (state, name) => ({ name: name }))
}

const store = createStore([name, persistState(['name'])])
```

Feel free to use glob patterns in the paths.

```js
import createStore from 'storeon'
import persistState from 'storeon-localstorage2'

let name = store => {
  store.on('@init', () => ({ 'save-name': '' }))

  store.on('save', (state, name) => ({ 'save-name': name }))
}

const store = createStore([name, persistState(['save-*'])])
```

Here you can see that the form ask user the name and after that show this name.

```js
import useStoreon from 'storeon/react'
import StoreContext from 'storeon/react/context'

const Form = () => {
  const { dispatch, name } = useStoreon('name')

  return (
    <React.Fragment>
      {name !== '' && <h3>Hello {name}!</h3>}
      {name === '' && (
        <div>
          <label>Name</label>
          <input type="text" id="name" />
          <br />
          <button
            onClick={() =>
              dispatch('save', document.getElementById('name').value)
            }
          >
            Save
          </button>
        </div>
      )}
    </React.Fragment>
  )
}
```

Event after refresh the page the state is updating from `localStorage`. And user see the greeting message.

![Example of store state to local storage](example.gif)

### persistState(paths, config)

```js
type paths = Void | Array<String>
```

If no pass the `paths` value then `persistState` store in local storage all state.

```js
type config.key = String
```

Default value of `config.key` is `storeon`. This key is using to store data in local storage.

## LICENSE

MIT

## Acknowledgments

This module based on [redux-localstorage](https://github.com/elgerlambert/redux-localstorage).
