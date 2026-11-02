---
title: "Young 不等式：积分与反函数"
subtitle: "从积分恒等式到含参最值"
date: "2026-11-02"
category: "数学分析"
tags: ["Young不等式", "积分", "反函数", "含参不等式", "求导"]
concepts: ["derivative"]
excerpt: "Young 不等式把定积分与反函数积分联系起来；证明的关键是先看等号情形，再把一般情形化为含参函数的最小值问题。"
draft: false
---

## 题目

::: note Young 不等式
设 $y=f(x)$ 是 $[0,+\infty)$上严格单调增加的连续函数，且 $f(0)=0$，记它的反函数为 $\displaystyle x=f^{-1}(y)$。证明：

$$
\int_0^a f(x)\,\mathrm{d}x+\int_0^b f^{-1}(y)\,\mathrm{d}y\ge ab\quad(a>0,\ b>0).
$$
:::

## 解答与分析

先给出参考书上的解答，再分析这个答案是怎样想出来的。

### 参考解答

先证当 $b=f(a)$ 时等号成立。

将区间 $[0,a]$ 作划分：$0=x_0<x_1<\cdots<x_{n-1}<x_n=a$，记 $y_i=f(x_i)$ $(i=0,1,2,\cdots,n)$，则 $0=y_0<y_1<\cdots<y_{n-1}<y_n=b$。再记 $\Delta x_i=x_i-x_{i-1}, \Delta y_i=y_i-y_{i-1}$，于是

$$
\begin{aligned}
\sum_{i=1}^n f(x_{i-1})\Delta x_i + \sum_{i=1}^n f^{-1}(y_i)\Delta y_i
&= \sum_{i=1}^n y_{i-1}(x_i-x_{i-1}) + \sum_{i=1}^n x_i(y_i-y_{i-1}) \\
&= x_n y_n - x_0 y_0 = ab,
\end{aligned}
$$

记 $\lambda = \max\limits_{1\le i\le n}\{\Delta x_i\}$，当 $\lambda\to 0$ 时，

$$
\sum_{i=1}^n f(x_{i-1})\Delta x_i + \sum_{i=1}^n f^{-1}(y_i)\Delta y_i
$$

的极限为

$$
\int_0^a f(x)\,\mathrm{d}x + \int_0^b f^{-1}(y)\,\mathrm{d}y,
$$

这就证明了当 $b=f(a)$ 时，

$$
\int_0^a f(x)\,\mathrm{d}x + \int_0^b f^{-1}(y)\,\mathrm{d}y = ab.
$$

在一般情况下，设

$$
F(a) = \int_0^a f(x)\,\mathrm{d}x + \int_0^b f^{-1}(y)\,\mathrm{d}y - ab,
$$

则 $F'(a) = f(a) - b$。记 $f(T) = b$，可知当 $0<a<T$ 时，$F(a)$单调减少；当 $a>T$ 时，$F(a)$ 单调增加，所以 $F(a)$ 在 $a=T$ 处取到最小值。由上面的讨论可知最小值 \(F(T)=0\)，从而 \(F(a)\ge 0\)，这就是所要证明的。

### 分析：从高中含参不等式看思路

事实上，本题的想法源自高中做过的含参不等式证明。先看高中题目：

对任意 $x>0$，任意实数 $a$，证明不等式

$$
x-\mathrm{e}^a\ln x+a\mathrm{e}^a-a-1\ge 0
$$

恒成立。

先固定 $a$，把 $x$ 看成变量。令

$$
F(x)=x-\mathrm{e}^a\ln x+a\mathrm{e}^a-a-1\quad (x>0).
$$

求导得

$$
F'(x)=1-\frac{\mathrm{e}^a}{x}=\frac{x-\mathrm{e}^a}{x}.
$$

因为 $\mathrm{e}^a>0$，所以：

- 当 $0<x<\mathrm{e}^a$ 时，$F'(x)<0$，$F(x)$ 单调递减；
- 当 $x>\mathrm{e}^a$ 时，$F'(x)>0$，$F(x)$ 单调递增。

因此 $F(x)$ 在$x=\mathrm{e}^a$处取得最小值。代入 $x=\mathrm{e}^a$，得最小值

$$
F_{\min}
=\mathrm{e}^a-\mathrm{e}^a\ln(\mathrm{e}^a)+a\mathrm{e}^a-a-1.
$$

因为 $\ln(\mathrm{e}^a)=a$，所以

$$
F_{\min}
=\mathrm{e}^a-\mathrm{e}^a\cdot a+a\mathrm{e}^a-a-1
=\mathrm{e}^a-a-1.
$$

接下来把最小值看成关于 \(a\) 的函数：$\varphi(a)=\mathrm{e}^a-a-1$.对 $a$ 求导：

$$
\varphi'(a)=\mathrm{e}^a-1.
$$

此时

- 当 $a<0$ 时，$\varphi'(a)<0$；
- 当 $a>0$ 时，$\varphi'(a)>0$。

所以 $\varphi(a)$ 在 $a=0$ 处取得最小值：

$$
\varphi(0)=\mathrm{e}^0-0-1=0.
$$

因此 $\varphi(a)=\mathrm{e}^a-a-1\ge 0.$
故对任意 $x>0$，任意实数 $a$，都有

$$
F(x)\ge F_{\min}=\varphi(a)\ge 0.
$$

即 $x-\mathrm{e}^a\ln x+a\mathrm{e}^a-a-1\ge 0$恒成立。

现在回到本题。在此之前，需要明确题中 $b$ 须属于 $f$ 的值域；例如 $f(x)=1-\mathrm{e}^{-x}$ 符合所列条件，但当 $b\ge 1$ 时题中反函数积分无定义。所以我们在 $b$ 属于值域时进行证明。

我们发现，要证明的不等式其实就是一个关于参变量 $a,b$ 的不等式，只是披上了定积分的外壳。因此本质与高中习题一致：对 $a$ 求导，便能得到最小值在 $f(a)=b$ 时取得。因此答案先分析了 $f(a)=b$ 时的情形；分析清楚后，再通过求导将问题归结为 $f(a)=b$ 这一情形。
