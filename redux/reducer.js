let initState = {
  count: 0,
};

export const reducer = (state = initState, action) => {
  switch (action.type) {
    case 'add':
      return {...state, count: state.count ++}
    case 'delete':
      return {...state, count: state.count --}
    default:
      return state;
  }
}
