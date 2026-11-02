---
title: "ε–δ 到底在说什么"
subtitle: "把「无限接近」翻译成量词顺序"
date: "2026-10-28"
category: "数学分析"
tags: ["极限", "ε–δ", "量词", "连续"]
concepts: ["limit", "derivative"]
excerpt: "极限的定义难，不难在 ε 和 δ，而难在「对任意」与「存在」的先后顺序；把量词读对，定义就不再神秘。"
draft: false
---

## 一句话直觉

极限说的是：只要 $x$ 离 $a$ 足够近，$f(x)$ 就会离 $L$ 足够近。问题在于“足够近”对不同的人、不同的误差要求，含义并不一样。ε–δ 的作用，是把它变成一句可以逐字检查的话。

## 把“接近”写成量词

设 $f$ 在 $a$ 的某个去心邻域内有定义。我们说 $f$ 在 $a$ 处的极限是 $L$，记作

$$
\lim_{x\to a} f(x)=L,
$$

它的完整定义是

$$
\forall \varepsilon>0\ \exists \delta>0\ \forall x\in\mathbb{R}
\big(0<|x-a|<\delta \Rightarrow |f(x)-L|<\varepsilon\big).
$$

这句话可以按顺序读成四步：

1. 任给一个误差上限 $\varepsilon>0$；
2. 我都能找到一个距离上限 $\delta>0$；
3. 使得对任意一个 $x$；
4. 只要 $x$ 落在 $a$ 的去心 $\delta$ 邻域里，$f(x)$ 就落在 $L$ 的 $\varepsilon$ 邻域里。

关键是第 1、2 步的先后。$\delta$ 是在 $\varepsilon$ 给定之后才选的，所以它可以依赖 $\varepsilon$；通常写成 $\delta=\delta(\varepsilon)$。如果把两个量词对调，

$$
\exists \delta>0\ \forall \varepsilon>0\ \forall x\ \big(0<|x-a|<\delta \Rightarrow |f(x)-L|<\varepsilon\big),
$$

就要求同一个 $\delta$ 同时适应所有 $\varepsilon$。这比极限定义强得多：它逼着 $f$ 在整个去心邻域里恒等于 $L$。极限不需要这么强。

## 一个可以算的例子

取 $f(x)=2x+1$，$a=3$。直觉上极限是 $7$。验证时，对任意 $\varepsilon>0$，取

$$
\delta=\frac{\varepsilon}{2}.
$$

那么当 $0<|x-3|<\delta$ 时，

$$
|f(x)-7|=|2x+1-7|=2|x-3|<2\delta=\varepsilon.
$$

这里的 $\delta$ 确实依赖 $\varepsilon$：要求越严，$\delta$ 越小。定义不要求找到“最好的” $\delta$，只要求存在一个够用的。

::: note 去心邻域
条件写成 $0<|x-a|$，意味着 $x=a$ 这一点被排除在外。极限只关心 $a$ 附近发生了什么，不关心 $f(a)$ 是否有定义、等于多少。
:::

## 连续只多了一步

如果 $f$ 在 $a$ 处有定义，并且

$$
\lim_{x\to a} f(x)=f(a),
$$

就说 $f$ 在 $a$ 处连续。把极限定义代进去，连续可以写成

$$
\forall \varepsilon>0\ \exists \delta>0\ \forall x
\big(|x-a|<\delta \Rightarrow |f(x)-f(a)|<\varepsilon\big).
$$

差别只有两个：去心条件变成了包含 $a$ 的邻域，极限值换成了函数值。这也解释了一个常见误解：极限存在并不等于连续；函数可以在 $a$ 处被挖掉，或者被重新定义一个值。

## 一致连续：$\delta$ 不能再依赖 $x$

连续是逐点说的。对每个 $a$，都可以有自己的 $\delta(a,\varepsilon)$。如果把 $\delta$ 提到 $x$ 前面，

$$
\forall \varepsilon>0\ \exists \delta>0\ \forall x,y
\big(|x-y|<\delta \Rightarrow |f(x)-f(y)|<\varepsilon\big),
$$

就得到一致连续：同一个 $\delta$ 要对整个定义域里的所有点同时有效。

$f(x)=x^2$ 在 $\mathbb{R}$ 上连续，但不一致连续。给定 $\varepsilon=1$，无论取多小的 $\delta$，只要让 $x$ 很大、$y=x+\delta/2$，就有

$$
|y^2-x^2|=\delta\left|x+\frac{\delta}{2}\right|,
$$

它随 $x$ 增大而没有上界。把定义域换成 $[0,1]$，同样的函数就一致连续了：有界闭区间上的连续函数自动一致连续。

## 边界

ε–δ 定义是一个局部定义。它只说 $a$ 附近的行为，不承诺 $f$ 在别处如何；它也不要求 $f(a)$ 有定义。若把 $\mathbb{R}$ 换成别的定义域，比如有理数或复数，量词里的 $x$ 也要跟着换。

最后，极限存在比连续弱，连续比可导弱。$f(x)=|x|$ 在 $0$ 处连续但不可导；$f(x)=1/x$ 在 $0$ 处连极限都不存在。把这些包含关系记清楚，比背下定义本身更有用。

## 参考文献

- Walter Rudin, *Principles of Mathematical Analysis*, 3rd ed., McGraw-Hill, 1976.
- Terence Tao, *Analysis I*, 3rd ed., Springer, 2016.
