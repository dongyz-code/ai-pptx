# svg基本知识讲解

SVG是Scalable Vector Graphics的缩写，意为可缩放矢量图形。

## svg的属性

1. width 、height： 设置SVG的宽高 默认 300 \* 150
2. viewBox: `viewBox="x y w h"` x、y为起始点，w、h为显示区域的宽高。
3. version: svg的版本，纯粹就是个说明
4. xmlns和xmlns:xlink： 声明命名空间

## 基本图形

### circle 圆形

circle 标签能在屏幕上绘制一个圆形

语法：`<circle cx="100" cy="100" r="100"/>`

属性：`cx、cy为圆的坐标，r为圆的半径`

### rect 矩形

rect标签能在屏幕上绘制一个矩形

语法：`<rect x="0" y="0" rx="5" ry="5" width="300" height="200"/>`

属性：`x、y为矩形的起始点坐标，rx、ry为圆角x、y轴方向的半径， width、height为矩形的宽高`

### ellipse 椭圆

ellipse标签比circle标签功能更强大，ellipse标签也可以实现圆形的绘制，并且还可以分别缩放圆形的长轴半径和短轴半径，从而达到椭圆的效果。

语法：`<ellipse cx="100" cy="100" rx="100" ry="50"/>`

属性：`cx、cy为椭圆的坐标，rx为椭圆的x轴半径、ry为椭圆的y轴半径`

### line 线条

line标签可以根据两点的坐标绘制一条直线

语法：`<line x1="10" x2="50" y1="110" y2="150"/>`

属性：`x1、y1为起点的坐标，x2、y2为终点的坐标`

### polyline 折线

polyline标签可以把很多个点链接在一起成为一条折线。

语法：`<polyline points="0 0, 20 40, 70 80, 100 90, 200 30, 250 50" />`

属性：`points为点集数列，其中每个点都必须包含2个数字，一个是x坐标，一个是y坐标。`

### polygon 多边形

polygon标签和polyline标签类似，都是由很多个点链接在一起的。但不同的是polygon路径中的最后一个点和第一个点是默认闭合的。

语法：`<polygon points="0 0, 20 40, 70 80, 100 90, 200 30, 250 50" />`

属性：`points为点集数列，其中每个点都必须包含2个数字，一个是x坐标，一个是y坐标。`

## path 路径

path标签是所有图形中最复杂的，但他也是最强大的。在SVG中最常用的图形就是path标签，他可以绘制圆形、椭圆、矩形、线条、折线、多边形、贝塞尔曲线等。

- 语法：`<path d="M50 50 H 200 V 200 H 50 L 50 50"/>`

- 属性：`d为一个点集数列以及其它绘制路径的信息。`

```html
<svg width="300" height="300">
  <path d="M50 50 H 200 V 200 H 50 L 50 50" fill="none" style="stroke: #000000" />
</svg>
```

path标签的图形形状是通过属性d来定义的，属性d的值是以：命令 + 参数 的形式进行组合的，命令又是通过关键字来表示的。

### 命令

```text
M = Move to
L = Line to
H = Horizontal Line to
V = Vertical Line to
Q = Quadratic Bezier Curve to
T = Smooth Quadratic Bezier Curve to
C = Curve to
S = Smooth Curve to
A = Elliptical Arc
Z = close path
```

1. M / m —— Move To（移动到）

作用： 移动画笔到指定坐标，不绘制任何线条。
语法：

M x y
m dx dy

示例：

<path d="M100 100 L200 100" stroke="black" fill="none" />

这会让画笔先移动到 (100,100)，然后画一条线到 (200,100)。

注意：M 命令后面如果继续跟坐标，会自动当成连续的 L 命令使用。

2. L / l —— Line To（画直线）

作用： 从当前点绘制直线到目标点。
语法：

L x y
l dx dy

示例：

<path d="M50 50 L200 200" stroke="black" fill="none" />

画一条从 (50,50) 到 (200,200) 的直线。

3. H / h —— Horizontal Line To（水平线）

作用： 沿着 X 轴画水平线。
语法：

H x
h dx

示例：

<path d="M50 50 H200" stroke="black" fill="none" />

画从 (50,50) 到 (200,50) 的水平线。

4. V / v —— Vertical Line To（垂直线）

作用： 沿着 Y 轴画垂直线。
语法：

V y
v dy

示例：

<path d="M50 50 V200" stroke="black" fill="none" />

画从 (50,50) 到 (50,200) 的垂直线。

5. C / c —— Cubic Bezier Curve（三次贝塞尔曲线）

作用： 使用两个控制点和一个终点绘制平滑曲线。
语法：

C x1 y1, x2 y2, x y
c dx1 dy1, dx2 dy2, dx dy

(x1, y1)：第一个控制点

(x2, y2)：第二个控制点

(x, y)：曲线终点

示例：

<path d="M50 200 C150 100, 250 300, 350 200" stroke="black" fill="none" />

这条曲线由两个控制点控制弯曲方向。

6. S / s —— Smooth Cubic Bezier Curve（光滑三次贝塞尔）

作用： 在前一个 C 或 S 曲线基础上，自动推断第一个控制点，使曲线更平滑。
语法：

S x2 y2, x y
s dx2 dy2, dx dy

第一个控制点由上一段曲线的第二个控制点镜像得出。

(x2, y2)：当前曲线的第二控制点。

(x, y)：当前曲线终点。

示例：

<path d="M50 200 C150 100, 250 300, 350 200 S550 100, 650 200" stroke="black" fill="none" />

7. Q / q —— Quadratic Bezier Curve（二次贝塞尔曲线）

作用： 使用一个控制点和一个终点绘制曲线。
语法：

Q x1 y1, x y
q dx1 dy1, dx dy

示例：

<path d="M50 250 Q150 100, 250 250" stroke="black" fill="none" />

这里 (150,100) 控制曲线弯曲。

8. T / t —— Smooth Quadratic Bezier（光滑二次贝塞尔）

作用： 自动使用前一个 Q 或 T 的控制点镜像，使曲线连续平滑。
语法：

T x y
t dx dy

示例：

<path d="M50 250 Q150 100, 250 250 T450 250" stroke="black" fill="none" />

9. A / a —— Arc（椭圆弧线）

作用： 绘制椭圆弧。
语法：

A rx ry x-axis-rotation large-arc-flag sweep-flag x y
a rx ry x-axis-rotation large-arc-flag sweep-flag dx dy

参数说明：

rx, ry：椭圆半径

x-axis-rotation：椭圆相对于 x 轴的旋转角度

large-arc-flag：是否为大弧（0=小弧，1=大弧）

sweep-flag：绘制方向（0=逆时针，1=顺时针）

x, y：终点坐标

示例：

<path d="M100 100 A50 50 0 0 1 200 100" stroke="black" fill="none" />

10. Z / z —— Close Path（闭合路径）

作用： 连接当前点与起始点，形成封闭形状。
语法：

Z
z

示例：

<path d="M50 50 L200 50 L200 200 L50 200 Z" stroke="black" fill="none" />

等价于画一个矩形。
