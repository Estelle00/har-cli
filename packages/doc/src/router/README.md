---
title: 按钮 Button
description: 按钮是一种命令组件，可发起一个即时操作。
---
## 标题
```java
public class HelloWorld {
    public static void main(String []args) {
       System.out.println("Hello World");
    }
}
```
内容
```vue
<template>
  <a>test</a>
</template>
```
123

@import "./__demo__/basic.md"

### `<button>` Props

|参数名|描述|类型|默认值|
|---|---|---|:---:|
|type|按钮的类型，分为五种：次要按钮、主要按钮、虚框按钮、线性按钮、文字按钮。|`'secondary' \| 'primary' \| 'dashed' \| 'outline' \| 'text'`|`'secondary'`|
|shape|按钮的形状|`'square' \| 'round' \| 'circle'`|`'square'`|
|status|按钮的状态|`'normal' \| 'warning' \| 'success' \| 'danger'`|`'normal'`|
|size|按钮的尺寸|`'mini' \| 'small' \| 'medium' \| 'large'`|`'medium'`|
|long|按钮的宽度是否随容器自适应。|`boolean`|`false`|
|loading|按钮是否为加载中状态|`boolean`|`false`|
|disabled|按钮是否禁用|`boolean`|`false`|
|html-type|设置 `button` 的原生 `type` 属性，可选值参考 [HTML标准](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-type "_blank")|`string`|`'button'`|
|href|设置跳转链接。设置此属性时，按钮渲染为a标签。|`string`|`-`|
