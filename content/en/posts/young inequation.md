---
title: "Young's Inequality: Integrals and Inverse Functions"
subtitle: "From an Integral Identity to a Parametric Minimum"
date: "2026-11-02"
category: "Mathematical Analysis"
tags: ["Young's inequality", "integral", "inverse function", "parametric inequality", "differentiation"]
concepts: ["derivative"]
excerpt: "Young's inequality connects a definite integral with the integral of an inverse function; the key is to first examine the equality case and then reduce the general case to a minimum problem for a function with a parameter."
draft: false
---

## Problem

::: note Young's Inequality
Let \(y=f(x)\) be a strictly increasing continuous function on \([0,+\infty)\) with \(f(0)=0\), and let its inverse function be \(\displaystyle x=f^{-1}(y)\). Prove that

$$
\int_0^a f(x)\,\mathrm{d}x+\int_0^b f^{-1}(y)\,\mathrm{d}y\ge ab\quad(a>0,\ b>0).
$$
:::

## Solution and Analysis

First, we present the solution from the reference book, and then analyze how this answer is discovered.

### Reference Solution

First prove that equality holds when \(b=f(a)\).

Partition the interval \([0,a]\) as \(0=x_0<x_1<\cdots<x_{n-1}<x_n=a\), and set \(y_i=f(x_i)\) \((i=0,1,2,\cdots,n)\). Then \(0=y_0<y_1<\cdots<y_{n-1}<y_n=b\). Also set \(\Delta x_i=x_i-x_{i-1}\) and \(\Delta y_i=y_i-y_{i-1}\). Then

$$
\begin{aligned}
\sum_{i=1}^n f(x_{i-1})\Delta x_i + \sum_{i=1}^n f^{-1}(y_i)\Delta y_i
&= \sum_{i=1}^n y_{i-1}(x_i-x_{i-1}) + \sum_{i=1}^n x_i(y_i-y_{i-1}) \\
&= x_n y_n - x_0 y_0 = ab.
\end{aligned}
$$

Let \(\lambda = \max\limits_{1\le i\le n}\{\Delta x_i\}\). As \(\lambda\to 0\),

$$
\sum_{i=1}^n f(x_{i-1})\Delta x_i + \sum_{i=1}^n f^{-1}(y_i)\Delta y_i
$$

tends to

$$
\int_0^a f(x)\,\mathrm{d}x + \int_0^b f^{-1}(y)\,\mathrm{d}y.
$$

This proves that when \(b=f(a)\),

$$
\int_0^a f(x)\,\mathrm{d}x + \int_0^b f^{-1}(y)\,\mathrm{d}y = ab.
$$

In the general case, define

$$
F(a) = \int_0^a f(x)\,\mathrm{d}x + \int_0^b f^{-1}(y)\,\mathrm{d}y - ab.
$$

Then \(F'(a) = f(a) - b\). Let \(f(T) = b\). It follows that \(F(a)\) is monotonically decreasing for \(0<a<T\) and monotonically increasing for \(a>T\). Hence \(F(a)\) attains its minimum at \(a=T\). From the discussion above, the minimum value is \(F(T)=0\), and therefore \(F(a)\ge 0\). This is precisely what was to be proved.

### Analysis: Insight from High School Parametric Inequalities

In fact, the idea behind this problem comes from the parametric inequalities we frequently encountered in high school. Consider the following high school problem:

For any \(x>0\) and any real number \(a\), prove that the inequality

$$
x-\mathrm{e}^a\ln x+a\mathrm{e}^a-a-1\ge 0
$$

always holds.

First fix \(a\) and regard \(x\) as the variable. Let

$$
F(x)=x-\mathrm{e}^a\ln x+a\mathrm{e}^a-a-1\quad (x>0).
$$

Differentiating gives

$$
F'(x)=1-\frac{\mathrm{e}^a}{x}=\frac{x-\mathrm{e}^a}{x}.
$$

Since \(\mathrm{e}^a>0\), we have:

- When \(0<x<\mathrm{e}^a\), \(F'(x)<0\), so \(F(x)\) is monotonically decreasing;
- When \(x>\mathrm{e}^a\), \(F'(x)>0\), so \(F(x)\) is monotonically increasing.

Therefore \(F(x)\) attains its minimum at \(x=\mathrm{e}^a\). Substituting \(x=\mathrm{e}^a\), we obtain the minimum value

$$
F_{\min}
=\mathrm{e}^a-\mathrm{e}^a\ln(\mathrm{e}^a)+a\mathrm{e}^a-a-1.
$$

Since \(\ln(\mathrm{e}^a)=a\), we get

$$
F_{\min}
=\mathrm{e}^a-\mathrm{e}^a\cdot a+a\mathrm{e}^a-a-1
=\mathrm{e}^a-a-1.
$$

Next, regard the minimum value as a function of \(a\):

$$
\varphi(a)=\mathrm{e}^a-a-1.
$$

Differentiating with respect to \(a\) gives

$$
\varphi'(a)=\mathrm{e}^a-1.
$$

At this point,

- When \(a<0\), \(\varphi'(a)<0\);
- When \(a>0\), \(\varphi'(a)>0\).

Therefore \(\varphi(a)\) attains its minimum at \(a=0\):

$$
\varphi(0)=\mathrm{e}^0-0-1=0.
$$

Hence

$$
\varphi(a)=\mathrm{e}^a-a-1\ge 0.
$$

Thus, for any \(x>0\) and any real number \(a\), we have

$$
F(x)\ge F_{\min}=\varphi(a)\ge 0.
$$

That is,

$$
x-\mathrm{e}^a\ln x+a\mathrm{e}^a-a-1\ge 0
$$

always holds.

Now let us return to the original problem. Before proceeding, we need to make clear that \(b\) must belong to the range of \(f\). For example, \(f(x)=1-\mathrm{e}^{-x}\) satisfies the stated conditions, but when \(b\ge 1\), the integral of the inverse function in the problem is undefined. Therefore, we prove the result under the assumption that \(b\) belongs to the range.

We observe that the inequality to be proved is actually an inequality involving the parameters \(a\) and \(b\), merely dressed in the notation of definite integrals. Therefore, its essence is the same as the high school exercise: differentiating with respect to \(a\) shows that the minimum is attained when \(f(a)=b\). For this reason, the solution first analyzes the case \(f(a)=b\); once this case is understood, differentiation reduces the general problem to the case \(f(a)=b\).
