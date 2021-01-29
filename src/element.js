let element = {
  "type": "div",
  "key": null,
  "ref": null,
  "props": {
    "id": "A1",
    "children": [
      {
        "type": "div",
        "key": null,
        "ref": null,
        "props": {
          "id": "B2",
          "children": [
            {
              "type": "div",
              "key": null,
              "ref": null,
              "props": {
                "id": "C1"
              },
              "_owner": null,
              "_store": {}
            },
            {
              "type": "div",
              "key": null,
              "ref": null,
              "props": {
                "id": "C2"
              },
              "_owner": null,
              "_store": {}
            }
          ]
        },
        "_owner": null,
        "_store": {}
      },
      {
        "type": "div",
        "key": null,
        "ref": null,
        "props": {
          "id": "B2"
        },
        "_owner": null,
        "_store": {}
      }
    ]
  },
  "_owner": null,
  "_store": {}
}
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
  parentDOM.appendChild(dom)
}

render(element, document.getElementById('root'))