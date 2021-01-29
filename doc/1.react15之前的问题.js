import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// * 虚拟DOM
let element = (
  <div id="A1">
    <div id="B2">
      <div id="C1"></div>
      <div id="C2"></div>
    </div>
    <div id="B2"></div>
  </div>
)

// console.log(JSON.stringify(element, null, 2), '虚拟DOM element');

/**
 * 将虚拟DOM渲染成真实DOM的render方法
 * @param {*} element 虚拟DOM
 * @param {*} parentDOM 真实DOM
 */
function render(element, parentDOM){
  // 1. 创建对应类型的DOM元素
  let dom = document.createElement(element.type)
  // 2. 给该DOM元素绑定原element上的属性，id等属性
  Object.keys(element.props)
  .filter(key => key !== 'children')
  .forEach(key => {
    dom[key] = element.props[key]
  })
  if(Array.isArray(element.props.children)){
    element.props.children.forEach(child => {
      render(child, dom)
    })
  }
  parentDOM.appendChild(dom)
}

render(
  element,
  document.getElementById('root')
);

// ! 产生的问题，如果节点特别多，层级特别深，由于JS是单线程，而且UI渲染线程和JS执行线程是互斥的，就会有可能产生卡顿
// ! 浏览器每帧时间控制在16.66ms以内，那么看起来比较流畅，如何JS执行时间特别长，会造成某一帧停留时间过长，造成卡顿
