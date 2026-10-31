---
title: "线性映射与矩阵：同一件事的两种写法"
subtitle: "选定基之后，抽象映射才变成可计算的表格"
date: "2026-10-20"
category: "高等代数"
tags: ["线性映射", "矩阵", "基变换", "秩"]
concepts: ["linear-map", "matrix", "linear-space"]
excerpt: "线性映射是坐标无关的对象，矩阵只是它在某一组基下的坐标表示；换基不是换映射，而是换一种写法。"
draft: false
---

## 先有映射，后有矩阵

设 $V,W$ 是域 $\mathbb{F}$ 上的线性空间。映射 $T:V\to W$ 称为线性的，如果对任意 $u,v\in V$、$\alpha\in\mathbb{F}$，

$$
T(u+\alpha v)=T(u)+\alpha T(v).
$$

这个定义里没有坐标，也没有矩阵。它只说 $T$ 保持加法与数乘。线性空间里的向量可以是多项式、函数或矩阵，只要加法和数乘按同样的规则工作。

## 选定基，矩阵才出现

取 $V$ 的一组基 $\mathcal{B}=(b_1,\dots,b_n)$，$W$ 的一组基 $\mathcal{C}=(c_1,\dots,c_m)$。每个 $T(b_j)$ 都可以唯一地写成 $\mathcal{C}$ 的线性组合：

$$
T(b_j)=\sum_{i=1}^{m} a_{ij}c_i,\qquad j=1,\dots,n.
$$

把这 $n$ 列系数排成一个 $m\times n$ 的矩阵 $A=(a_{ij})$，就得到 $T$ 在基 $\mathcal{B},\mathcal{C}$ 下的矩阵表示。它可以简洁地写成

$$
[T]_{\mathcal{C}\leftarrow\mathcal{B}}=A.
$$

矩阵的列，是基向量被 $T$ 送到哪里之后，在目标基下的坐标。把向量 $v=\sum_j x_j b_j$ 的坐标记成 $[v]_{\mathcal{B}}=(x_1,\dots,x_n)^{\top}$，那么

$$
[T(v)]_{\mathcal{C}}=A\,[v]_{\mathcal{B}}.
$$

这就是“矩阵作用在坐标上”的全部含义。矩阵不是映射本身，而是映射在两个坐标系之间的账本。

## 一个具体的例子

令 $V=P_2$ 是次数不超过 $2$ 的实系数多项式，$W=P_1$ 是次数不超过 $1$ 的多项式，$D:P_2\to P_1$ 为求导：

$$
D(p)=p'.
$$

取基 $\mathcal{B}=(1,x,x^2)$、$\mathcal{C}=(1,x)$。逐个计算：

$$
D(1)=0,\qquad D(x)=1,\qquad D(x^2)=2x.
$$

把它们写成 $\mathcal{C}$ 下的坐标，得到

$$
[D]_{\mathcal{C}\leftarrow\mathcal{B}}=
\begin{pmatrix}
0 & 1 & 0\\
0 & 0 & 2
\end{pmatrix}.
$$

用矩阵乘坐标验证：$p=3+2x+5x^2$ 的坐标是 $(3,2,5)^{\top}$，乘完得到 $(2,10)^{\top}$，对应 $2+10x$，正是 $p'=2+10x$。

## 复合、换基与不变量

若 $T:U\to V$、$S:V\to W$ 都是线性的，那么复合 $S\circ T$ 也是线性的，并且在同一组基下

$$
[S\circ T]=[S]\,[T].
$$

注意顺序：先作用 $T$，再作用 $S$，矩阵乘法也从右往左读。矩阵乘法之所以这样定义，不是为了制造一条计算规则，而是为了让它对应映射的复合。

换一组基，矩阵会变。设 $\mathcal{B}'$ 是 $V$ 的另一组基，$P$ 的列是 $\mathcal{B}'$ 中向量在 $\mathcal{B}$ 下的坐标，即 $\mathcal{B}'=\mathcal{B}P$。同一个线性映射 $T:V\to V$ 在新基下的矩阵是

$$
[T]_{\mathcal{B}'}=P^{-1}\,[T]_{\mathcal{B}}\,P.
$$

这样的两个矩阵称为相似。相似矩阵描述的是同一个映射，只是换了观察坐标。因此迹与行列式在相似变换下不变：

$$
\operatorname{tr}(P^{-1}AP)=\operatorname{tr}(A),\qquad
\det(P^{-1}AP)=\det(A).
$$

特征多项式也一样，所以“特征值”是映射的性质，不是某一张矩阵表的性质。

## 核、像与秩

线性映射 $T:V\to W$ 的核与像分别是

$$
\ker T=\{v\in V:T(v)=0\},\qquad
\operatorname{im}T=\{T(v):v\in V\}.
$$

它们都是线性子空间，并且有秩–零化度定理：

$$
\dim V=\dim\ker T+\dim\operatorname{im}T.
$$

矩阵的秩等于 $\dim\operatorname{im}T$，所以“行秩等于列秩”并不是一条孤立的计算事实，而是这个维数公式的坐标版本。$T$ 是单射当且仅当 $\ker T=\{0\}$；是满射当且仅当 $\dim\operatorname{im}T=\dim W$。在有限维且维数相同的空间之间，单射、满射、可逆三者等价。

## 边界

矩阵表示依赖基。说“这个线性映射的矩阵”时，必须同时说明定义域与陪域的基；换基之后矩阵会变，但秩、迹、行列式、特征值这些不变量不变。

特征值与对角化还要求 $T$ 是同一个空间到自身的映射（自同态），否则 $T(v)=\lambda v$ 两边不在同一个空间里，比较没有意义。即便是在自同态中，特征值也可能落在基域之外：实矩阵 $\begin{pmatrix}0&-1\\1&0\end{pmatrix}$ 没有实特征值，但把它看成复线性映射时，特征值是 $\pm i$。

最后，相似与合同是两件不同的事。相似来自换基 $P^{-1}AP$，保持线性映射的结构；合同来自二次型的变量替换 $P^{\top}AP$，保持二次型的值。把两者混为一谈，是二次型一章最常见的错误。

## 参考文献

- Sheldon Axler, *Linear Algebra Done Right*, 4th ed., Springer, 2024.
- Kenneth Hoffman & Ray Kunze, *Linear Algebra*, 2nd ed., Prentice-Hall, 1971.
