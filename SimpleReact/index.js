import createElement from './React/createElement'
import render from './React/render'
const Didact = {
  createElement,
  render,
};

const container = document.getElementById('root')

function App(props) {
  return Didact.createElement(
    "h1",
    null,
    "Hi ",
    props.name
  )
}

const element = Didact.createElement(App, {
  name: "foo",
})

Didact.render(element, container)


