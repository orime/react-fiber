// * 拿到虚拟 DOM
import element from "./element"

// * 拿到容器 DOM
const container = document.getElementById("root")

// ? 定义一些常量开始
const PLACEMENT = "PLACEMENT"
// ? 定义一些常量结束

// * 编写render函数，将element渲染进去

// * 定义下一个工作单元
// * fiber其实也是一个普通的js对象

let workInProgressRoot = {
  stateNode: container, // * 此 fiber 对应的 DOM 节点
  props: { children: [element] }, // * 此 fiber 的属性
  // child, 指向大儿子
  // sibling, 指向兄弟
  // return 指向父节点
}

let nextUnitOfWork = workInProgressRoot

// * 工作循环放到 requestIdleCallback里面
function workLoop(deadLine) {
  // ! 如果有工作单元并且有空闲时间就执行它，并重置下一个工作单元
  while (nextUnitOfWork && deadLine.timeRemaining() > 0) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
  }
  // ? 如果走到了这里，说明已经没有工作单元了，可以开始提交
  commitRoot()
}

function commitRoot() {
  let currentFiber = workInProgressRoot.firstEffect // 指向C1
  console.log(currentFiber, 'currentFiber')
  while(currentFiber){
    console.log('commitRoot', currentFiber.props.id)
    if(currentFiber.effectTag === PLACEMENT){
      currentFiber.return.stateNode.appendChild(currentFiber.stateNode)
    }
    currentFiber = currentFiber.nextEffect
  }
  workInProgressRoot = null;
}

/**
 * * begin 根据虚拟DOM创建fiber树结构
 * @param {*} workingInProgressFiber
 */
function performUnitOfWork(workingInProgressFiber) {
  beginWork(workingInProgressFiber)
  if (workingInProgressFiber.child) {
    // * 如果当前fiber节点有儿子，则优先处理大儿子
    return workingInProgressFiber.child
  }
  while (workingInProgressFiber) {
    // * 如果进到这里，说明当前节点已经没有儿子了/儿子都已经完成了
    completeUnitOfWork(workingInProgressFiber)
    if (workingInProgressFiber.sibling) {
      // * 没有儿子了，看是否有弟弟，如果有，返回弟弟进行处理
      return workingInProgressFiber.sibling
    }
    // * 如果既没有儿子也没有叔叔，那么就指针重置到父节点，找父节点的弟弟（也就是当前节点的叔叔）
    workingInProgressFiber = workingInProgressFiber.return
  }
}

// * fiber处理函数
function beginWork(workingInProcessFiber) {
  console.log("begin", workingInProcessFiber.props.id)
  // * 判断如果没有对应的DOM节点，就创建
  if (!workingInProcessFiber.stateNode) {
    // * 根据该 fiber 的类型创建真实DOM节点
    workingInProcessFiber.stateNode = document.createElement(
      workingInProcessFiber.type
    )
    // * 根据该 fiber 的 props 赋属性
    for (let key in workingInProcessFiber.props) {
      // * 判断是否为children，children要单独处理
      if (key !== "children") {
        workingInProcessFiber.stateNode[key] = workingInProcessFiber.props[key]
      }
    }
  }
  // ! 注意：在beginWork里面只是创建DOM元素，而不会挂载
  // * 创建子 Fiber
  let previousFiber
  // children 是一个虚拟DOM的js对象
  // ! 如果children是个数组才要循环
  if (Array.isArray(workingInProcessFiber.props.children)) {
    workingInProcessFiber.props.children.forEach((child, index) => {
      let childFiber = {
        type: child.type, // DOM 节点的类型
        props: child.props,
        return: workingInProcessFiber,
        effectTag: PLACEMENT, // * 这个 Fiber 对应的 DOM 节点需要被插入到页面中去
        nextEffect: null, // * 下一个有副作用的节点
      }
      if (index === 0) {
        // * 如果是大儿子
        workingInProcessFiber.child = childFiber
      } else {
        previousFiber.sibling = childFiber
      }
      previousFiber = childFiber
    })
  }
}

// * 完成函数
function completeUnitOfWork(workingInProcessFiber) {
  console.log("complete", workingInProcessFiber.props.id)
  // * 使用链表结构构建副作用链
  // * 拿到父fiber，将自己子Fiber的副作用整理好了挂到父Fiber的副作用链上
  let returnFiber = workingInProcessFiber.return
  if (returnFiber) {
    // * 把当前fiber有副作用的子链表挂载到父亲身上
    if (!returnFiber.firstEffect) {
      returnFiber.firstEffect = workingInProcessFiber.firstEffect
    }
    // * 如果当前Fiber有lastEffect
    if (workingInProcessFiber.lastEffect) {
      if (returnFiber.lastEffect) {
        returnFiber.lastEffect.nextEffect = workingInProcessFiber.firstEffect
      }
      returnFiber.lastEffect = workingInProcessFiber.lastEffect
    }
    // * 在把自己挂上去
    if (workingInProcessFiber.effectTag) {
      if (returnFiber.lastEffect) {
        returnFiber.lastEffect.nextEffect = workingInProcessFiber
      } else {
        returnFiber.firstEffect = workingInProcessFiber
      }
      returnFiber.lastEffect = workingInProcessFiber
    }
  }
}

requestIdleCallback(workLoop)
