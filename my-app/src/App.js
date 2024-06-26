import {useState, useEffect, createElement} from 'react';
import logo from './logo.svg';
import './App.css';
import obj from './script1'
import {root} from './index'

function getArray(obj) {
  const {title} = obj
  return [
    {title: '1', id: '1', render() { return title ? title : 'custom' }},
    {title: '1', id: '2',}, 
    {title: '1', id: '3', render() { return 'custom' }}, 
    {title: '1', id: '4', render() { return 'custom' }}, 
    {title: '1', id: '5', }, 
    {title: '1', id: '6', render() { return 'custom' }}, 
    {title: '1', id: '7',},
  ]
}

function Header() {
  return (
    <>
      <h1>title</h1>
      <h2>title2</h2>
    </>
  )
}

function App() {
  // const [count, setCount] = useState(0)
  // const [list, setList] = useState(['A', 'B', 'C'])
  // useEffect(() => {
  //   console.log('App useEffect' )
  // }, [])

  // const footer = createElement('div', { style: {fontSize: 20}, children: 'footer' }, )

  // console.log('obj', obj)
  const changeArray = () => {
    // setArray(getArray({}))
    array.push({id: 'ss', title: 'ss'})
    setArray([...array])
  }
  const [array, setArray] = useState(getArray({}))
  return (
    <div>Hello, React!
      <button onClick={changeArray}>click me</button>
      <TestDependcies array={array} />
    </div>
  )
  // return (
  //   <div className="App">
  //     <Header />
  //     {/* <button onClick={() => {setCount(count + 1)}}>点击发起更新 {count}</button> */}

  //     <button className="customButton" onClick={() => {setList(['C', 'A', 'X'])}}>点击发起更新</button>
  //     <div>
  //       {list.map(item => <p key={item}>{item}</p>)}
  //     </div>
  //     {footer}
  //   </div>
  // );
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

  useEffect(() => {
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

function TestDependcies(props) {
  const {array} = props

  useEffect(() => {
    console.log('rerender by array changes')
  }, [array])
  return (
    <div>

    </div>
  )
}
