import React from 'react';
import logo from './logo.svg';
import './App.css';

import {root} from './index'

function App() {
  const [count, setCount] = React.useState(0)

  
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={()=> setCount(count+1)}>click me</button>
        <button onClick={()=> root.render(<App />)}>another app</button>
        <span>{count}</span>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <AnotherApp>
        <div>x</div>
        <div>y</div>
      </AnotherApp>
    </div>
  );
}

export default App;

function createDom(fiber) {
  const dom = fiber.type === 'TEXT_ELEMENT' 
    ? document.createTextNode('')
    : document.createElement(fiber.type)

  const isProperty = key => key !== 'children'
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach(keyName => {
      dom[keyName] = fiber.props[keyName]
    })
  
  return dom;
}

function performUnitOfWork(fiber) {
  // 1.把该元素添加到dom树
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }

  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom)
  }
  // 2.为该元素的children创建fiber
  const elements = fiber.props.children
  let index = 0
  let prevSibling = null

  while (index < elements.length) {
    const element = elements[index]

    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    }

    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
    index++
  }
  // 3.确定nextUnitOfWork
  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}

function AnotherApp(props) {
  console.log('anotherApp', typeof props.children)
  return <div>AnotherApp</div>
}
