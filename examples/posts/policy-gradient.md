---
title: "Policy Gradient 的优化视角"
subtitle: "从目标函数、梯度估计到方差与步长"
date: "2026-05-06"
category: "强化学习"
tags: ["策略梯度", "REINFORCE", "方差"]
concepts: ["policy-gradient", "mdp", "kl-divergence", "sgd"]
excerpt: "策略梯度看起来只是对回报求导，真正的困难却在于：更新之后，采样分布也变了。理解这一点，才能理解方差、基线与信赖域。"
draft: false
---

## 目标函数

把策略参数化为 $\pi_\theta(a\mid s)$，强化学习的目标是期望回报

$$
J(\theta) = \mathbb{E}_{\tau \sim p_\theta}\left[R(\tau)\right],
$$

其中轨迹 $\tau=(s_0,a_0,s_1,a_1,\dots)$ 的分布由初始分布、策略与环境转移共同决定：

$$
p_\theta(\tau) = \rho(s_0)\prod_{t=0}^{T-1} \pi_\theta(a_t\mid s_t)\,P(s_{t+1}\mid s_t,a_t).
$$

直接对 $\theta$ 求导，会同时遇到策略和环境两部分。但环境转移与 $\theta$ 无关，取对数后它们全部消失：

$$
\nabla_\theta \log p_\theta(\tau) = \sum_{t=0}^{T-1} \nabla_\theta \log \pi_\theta(a_t\mid s_t).
$$

于是

$$
\nabla_\theta J(\theta) = \mathbb{E}_{\tau\sim p_\theta}\left[\sum_{t=0}^{T-1}\nabla_\theta\log\pi_\theta(a_t\mid s_t)\,R(\tau)\right].
$$

这就是策略梯度定理最朴素的形式：**不需要对环境建模，只需要能采样并计算动作的对数概率。**

## 从回报到优势

朴素的估计量方差很大，因为 $R(\tau)$ 是整条轨迹的回报。两个改进几乎是标准配置。

第一，**只看未来**。$t$ 时刻的动作不可能影响之前的奖励，因此可以用

$$
G_t = \sum_{k=t}^{T-1}\gamma^{k-t} r_{k+1}
$$

代替 $R(\tau)$，这不改变期望，只降低方差。

第二，**减去基线**。对任意只依赖状态的函数 $b(s_t)$，

$$
\mathbb{E}_{a\sim\pi_\theta}\left[\nabla_\theta\log\pi_\theta(a\mid s_t)\,b(s_t)\right]
= b(s_t)\sum_a \nabla_\theta\pi_\theta(a\mid s_t)
= b(s_t)\nabla_\theta 1 = 0.
$$

所以减去基线不引入偏差。取 $b(s_t)\approx V^{\pi}(s_t)$，剩下的就是优势 $A_t = G_t - V(s_t)$：这个动作比“平均而言”好多少。优势的符号比回报的绝对大小更有信息量，这也是 actor-critic 的出发点。

::: note 直觉
基线不是“让奖励变小”，而是把“这个动作好不好”从一个绝对分数变成相对分数。策略梯度只关心相对好坏，绝对水平对梯度没有贡献。
:::

## 它不是普通的梯度上升

如果 $J$ 是一个固定的函数，那么采样估计梯度、做随机梯度上升就够了。策略梯度麻烦的地方在于：**每一次参数更新都会改变采样分布**。

这带来三个后果。

1. **估计是有偏的，如果我们复用旧数据。** 用旧策略采样的数据估计新策略的梯度，需要重要性采样比率 $\rho_t = \pi_\theta(a_t\mid s_t)/\pi_{\theta_{\text{old}}}(a_t\mid s_t)$。比率连乘之后方差会爆炸。
2. **参数空间的距离不等于策略空间的距离。** 参数走一小步，策略可能变化很大；相反，参数变化很大时策略也可能几乎不变。用固定的学习率在参数空间里走，并不能保证策略的改进是单调的。
3. **目标函数在变。** 这正是信赖域方法（TRPO）和近端策略优化（PPO）的动机：限制新旧策略之间的 KL 散度或概率比，让每一步更新都停留在“仍然可以用旧数据近似”的区域内。

一个粗略的对比：

| 方法 | 梯度估计 | 数据复用 | 主要问题 |
| --- | --- | --- | --- |
| REINFORCE | $G_t$ 或 $G_t-b(s_t)$ | 不复用 | 方差极高 |
| Actor-Critic | 优势估计 | 可部分复用 | 价值函数偏差 |
| PPO | 裁剪的重要性比率 | 多轮复用 | 裁剪带来的保守性 |

## 边界

策略梯度的无偏性建立在**同策略采样**和**可交换求导与期望**之上。实践中常见的失效方式包括：

- **奖励稀疏**：$G_t$ 几乎总是零，梯度信号被方差淹没。此时需要更好的探索或回报塑形，而不是调学习率。
- **回合过长**：蒙特卡洛回报的方差随长度增长；自举（bootstrap）能降方差，但引入偏差。
- **重尾回报**：梯度的二阶矩可能不存在，中心极限定理和常用的方差估计都不再可靠。
- **策略参数化不当**：高斯策略的方差参数、softmax 的温度，都会改变梯度的尺度，固定步长很难同时适配。

最重要的一点也许是：策略梯度并没有解决信用分配问题，它只是把这个问题推给了回报或优势估计。没有好的价值函数，策略梯度就只是一个高方差的随机搜索。

## 参考文献

- R. J. Williams, *Simple Statistical Gradient-Following Algorithms for Connectionist Reinforcement Learning*, 1992.
- R. S. Sutton and A. G. Barto, *Reinforcement Learning: An Introduction*, 2nd ed., 2018.
- J. Schulman et al., *Proximal Policy Optimization Algorithms*, 2017.
