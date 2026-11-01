---
title: "What ε–δ Is Actually Saying"
subtitle: "Translating “gets arbitrarily close” into an order of quantifiers"
date: "2026-10-28"
category: "数学分析"
tags: ["limits", "ε–δ", "quantifiers", "continuity"]
concepts: ["limit", "derivative"]
excerpt: "The definition of a limit is hard not because of ε and δ, but because of the order in which “for all” and “there exists” appear; read the quantifiers in the right order and the definition stops being mysterious."
draft: false
---

## The intuition in one sentence

A limit says this: as long as $x$ is close enough to $a$, $f(x)$ will be close enough to $L$. The trouble is that “close enough” does not mean the same thing to different people, or under different error tolerances. The job of ε–δ is to turn it into a sentence that can be checked word by word.

## Writing “closeness” as quantifiers

Suppose $f$ is defined on some punctured neighbourhood of $a$. We say that the limit of $f$ at $a$ is $L$, written

$$
\lim_{x\to a} f(x)=L,
$$

and its full definition is

$$
\forall \varepsilon>0\ \exists \delta>0\ \forall x\in\mathbb{R}
\big(0<|x-a|<\delta \Rightarrow |f(x)-L|<\varepsilon\big).
$$

Read in order, the sentence says four things:

1. An error bound $\varepsilon>0$ is handed to me;
2. I can find a distance bound $\delta>0$;
3. such that for every $x$;
4. whenever $x$ lies in the punctured $\delta$ neighbourhood of $a$, $f(x)$ lies in the $\varepsilon$ neighbourhood of $L$.

What matters is the order of steps 1 and 2. The $\delta$ is chosen only after $\varepsilon$ has been given, so it may depend on $\varepsilon$; one usually writes $\delta=\delta(\varepsilon)$. If the two quantifiers are swapped,

$$
\exists \delta>0\ \forall \varepsilon>0\ \forall x\ \big(0<|x-a|<\delta \Rightarrow |f(x)-L|<\varepsilon\big),
$$

then the same $\delta$ must serve every $\varepsilon$ at once. That is far stronger than the definition of a limit: it forces $f$ to equal $L$ identically on the whole punctured neighbourhood. A limit does not need anything that strong.

## An example you can compute

Take $f(x)=2x+1$ and $a=3$. Intuitively the limit is $7$. To verify it, for any $\varepsilon>0$ take

$$
\delta=\frac{\varepsilon}{2}.
$$

Then whenever $0<|x-3|<\delta$,

$$
|f(x)-7|=|2x+1-7|=2|x-3|<2\delta=\varepsilon.
$$

Here $\delta$ really does depend on $\varepsilon$: the stricter the demand, the smaller the $\delta$. The definition does not ask for the “best” $\delta$, only that one adequate $\delta$ exists.

::: note Punctured neighbourhood
The condition is written $0<|x-a|$, which means the point $x=a$ is excluded. A limit cares only about what happens near $a$, not about whether $f(a)$ is defined or what value it takes.
:::

## Continuity is one step more

If $f$ is defined at $a$ and

$$
\lim_{x\to a} f(x)=f(a),
$$

then we say $f$ is continuous at $a$. Substituting the definition of a limit, continuity can be written as

$$
\forall \varepsilon>0\ \exists \delta>0\ \forall x
\big(|x-a|<\delta \Rightarrow |f(x)-f(a)|<\varepsilon\big).
$$

There are only two differences: the punctured condition becomes a neighbourhood that includes $a$, and the limit value is replaced by the function value. That also explains a common misconception: having a limit is not the same as being continuous; the function can have a hole punched out at $a$, or be given a new value there.

## Uniform continuity: δ may no longer depend on x

Continuity is pointwise. Each $a$ may have its own $\delta(a,\varepsilon)$. If $\delta$ is moved in front of $x$,

$$
\forall \varepsilon>0\ \exists \delta>0\ \forall x,y
\big(|x-y|<\delta \Rightarrow |f(x)-f(y)|<\varepsilon\big),
$$

we get uniform continuity: one and the same $\delta$ has to work for all points of the domain simultaneously.

$f(x)=x^2$ is continuous on $\mathbb{R}$ but not uniformly continuous. Given $\varepsilon=1$, no matter how small we take $\delta$, as long as we let $x$ be large and $y=x+\delta/2$, we get

$$
|y^2-x^2|=\delta\left|x+\frac{\delta}{2}\right|,
$$

which has no upper bound as $x$ grows. Change the domain to $[0,1]$ and the same function becomes uniformly continuous: a continuous function on a bounded closed interval is automatically uniformly continuous.

## Boundaries

The ε–δ definition is a local definition. It speaks only about behaviour near $a$ and promises nothing about $f$ elsewhere; nor does it require $f(a)$ to be defined. If $\mathbb{R}$ is replaced by some other domain, such as the rationals or the complex numbers, the $x$ in the quantifiers has to change with it.

Finally, having a limit is weaker than being continuous, and continuity is weaker than being differentiable. $f(x)=|x|$ is continuous at $0$ but not differentiable there; $f(x)=1/x$ does not even have a limit at $0$. Keeping these inclusions straight is more useful than memorising the definition itself.

## References

- Walter Rudin, *Principles of Mathematical Analysis*, 3rd ed., McGraw-Hill, 1976.
- Terence Tao, *Analysis I*, 3rd ed., Springer, 2016.
