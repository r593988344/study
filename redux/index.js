const createStore = (reducer) => {
  let currentState = {};
  let observers = [];

  const getState = () => currentState;

  const dispatch = (action) => {
    currentState = reducer(currentState, action);
    observers.forEach((fn) => {
      fn();
    })
  }

  const subscribe = (fn) => {
    observers.push(fn);
  }

  dispatch({
    type: '@REDUX_INIT'
  })
}
