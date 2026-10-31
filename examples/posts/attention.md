---
title: "缩放点积注意力：为什么除以 √d"
subtitle: "从方差、softmax 饱和与梯度尺度理解那个根号"
date: "2026-09-18"
category: "深度学习"
tags: ["注意力机制", "Transformer", "数值稳定性"]
concepts: ["attention", "vae"]
excerpt: "点积的方差随维度线性增长，logit 随之变大，softmax 因此饱和；除以 √d 把尺度拉回常数，也划出了它管不到的地方：结构性的差距仍在。"
draft: false
---

## 一个随维度增长的方差

假设 $q,k\in\mathbb{R}^{d}$ 的各分量相互独立、均值为零、方差为一——经过 LayerNorm 之后大致如此。那么

$$
\mathbb{E}[q\cdot k]=\sum_{i=1}^{d}\mathbb{E}[q_i]\,\mathbb{E}[k_i]=0,
\qquad
\operatorname{Var}(q\cdot k)=\sum_{i=1}^{d}\operatorname{Var}(q_i k_i)=d,
$$

最后一步用了 $\operatorname{Var}(q_i k_i)=\mathbb{E}[q_i^2]\,\mathbb{E}[k_i^2]=1$。点积的标准差因此是 $\sqrt{d}$：维度变成四倍，logit 的典型幅度变成两倍。

这不是注意力独有的现象，而是“把 $d$ 个独立项相加”的一般结果。若分量均值不为零，均值项 $\mu_q\cdot\mu_k$ 也会随 $d$ 增长，情况只会更糟。若分量之间还相关，方差里会多出协方差项，$\sqrt{d}$ 就不再是精确的标准差——它是一条建立在独立假设上的校准线。

## 除以 √d 与 softmax 的饱和

除以 $\sqrt{d}$ 之后，$\operatorname{Var}(q\cdot k/\sqrt{d})=1$，logit 的尺度与维度脱钩。为什么必须是这个幂次？因为方差随 $d$ 线性增长，标准差随 $\sqrt{d}$ 增长，只有除以 $\sqrt{d}$，才能把方差拉回 1。除以 $d$ 会让 logit 缩到 $1/\sqrt{d}$ 的量级，softmax 趋于均匀，这是另一个方向的失效。

softmax 与它的雅可比矩阵是

$$
s_i=\frac{e^{z_i}}{\sum_j e^{z_j}},\qquad
\frac{\partial s_i}{\partial z_j}=s_i(\delta_{ij}-s_j).
$$

雅可比的每一项都带着因子 $s_i$。当某个 $s_i$ 接近一时，$s_i(1-s_i)$ 接近零，整行几乎不再随 $z$ 变化，这就是饱和。此时 $z$ 的微小改动几乎不改变注意力分布，经由权重回传的梯度随之趋近于零，$q$、$k$ 以及它们上游的表征几乎收不到信号。

有一个容易混淆的地方值得说清楚：交叉熵对 logit 的直接梯度 $\partial L/\partial z=s-y$ 并不会因为饱和而消失；消失的是“注意力权重对 logit 的敏感度”，也就是经过 $s$ 的那条路径。所以饱和不是训练完全停住，而是模型失去了通过调整查询与键来重新分配注意力的能力。

还有一层容易被忽略的作用：logit 的尺度同时是梯度进入查询与键的尺度。$\partial L/\partial q$ 里带着因子 $1/\sqrt{d}$，不缩放时它随 $\sqrt{d}$ 增长，同一个学习率在不同维度上于是意味着不同的有效步长。

::: note 直觉
除以 $\sqrt{d}$ 相当于给 softmax 定一个固定的温度。不除，温度太低，分布是硬的；除以 $d$，温度太高，分布是糊的。$\sqrt{d}$ 是让温度不随维度漂移的那个刻度。
:::

## 缩放没有解决的问题

- **不改变次序。** $z/\sqrt{d}$ 是单调变换，argmax 不变。它调的是尖锐程度，不是“选哪一个”的能力。
- **不消除均值。** 若各分量同均值 $\mu$，缩放后仍留下 $\sqrt{d}\,\mu^{2}$ 量级的偏移。
- **不随训练自适应。** 学到的投影范数会变，固定的 $1/\sqrt{d}$ 只是初始校准；位置偏置或重复 token 造成的结构性差距会随训练放大，饱和也会回来。
- **不保证熵可控。** 温度固定不等于熵固定，熵还取决于 logit 的分布形状与键的数量，缩放只固定了其中一个尺度。
- **不解决数值溢出。** 计算 $e^{z}$ 时仍然需要先减去最大值。
- **不修复表示退化。** 注意力矩阵低秩、不同位置的表示趋同，是另一类问题，缩放无能为力。

## 参考文献

- Vaswani, A. et al. *Attention Is All You Need*. NeurIPS, 2017. <https://arxiv.org/abs/1706.03762>
- Bahdanau, D., Cho, K., Bengio, Y. *Neural Machine Translation by Jointly Learning to Align and Translate*. ICLR, 2015. <https://arxiv.org/abs/1409.0473>
- Glorot, X., Bengio, Y. *Understanding the Difficulty of Training Deep Feedforward Neural Networks*. AISTATS, 2010.

## 边界

方差论证依赖独立、零均值、单位方差这三个假设。真实模型里 $q,k$ 来自同一序列的线性投影，分量相关，均值也未必为零；$\sqrt{d}$ 只是量纲上的一次校准，不是对真实分布的刻画。

如果模型已经用 LayerNorm 或其他方式控制了尺度，$1/\sqrt{d}$ 的作用就会与初始化、归一化的位置耦合，换了架构不该照搬。

饱和一旦发生，缩放救不回来：训练中投影范数增长、位置偏置或重复 token 造成的结构性差距，都会把 logit 重新推进饱和区，此时需要的是温度、熵正则或更好的归一化。反过来，$d$ 很小时 logit 本来就小，除以 $\sqrt{d}$ 会让分布过于平坦，这也是小头上偶尔去掉缩放仍能训练的原因。

所以我更愿意把 $1/\sqrt{d}$ 看成一次量纲校准，而不是一条普适的定律。
