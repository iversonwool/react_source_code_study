import React from 'react';
import logo from './logo.svg';
import './App.css';
import obj from './script1'
import {root} from './index'

function App() {
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    console.log('App useEffect' )
  }, [])

  console.log('obj', obj)
  return (
    <div className="App">
      <header className="App-header">header</header>
      <Content />
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

function Content(props) {

  React.useEffect(() => {
    console.log('Content useEffect' )
  }, [])
  console.log('anotherApp', typeof props.children)
  return (
    <>
      <p>1</p>
      <p>2</p>
    </>
  )
}

function Com() {

  return (
    <>
      {
        [
          1, 2, 3
        ]
      }
    </>
  )

  // return (
  //   <>

  //     <p>1</p>
  //     <p>2</p>
  //   </>
  // )
}
