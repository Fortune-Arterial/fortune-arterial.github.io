---
title: "Conic Sections: Classifying Them by Invariants"
subtitle: "From the Quadratic-Form Matrix to Ellipses, Hyperbolas, and Parabolas"
date: "2026-10-12"
category: "解析几何"
tags: ["conic sections", "quadratic form", "invariants", "classification"]
concepts: ["conic", "quadratic-form", "matrix"]
excerpt: "The shape of a conic need not be determined by completing the square case by case: the rank, determinant, and inertia index of the quadratic-form matrix have already sorted ellipses, hyperbolas, and parabolas into classes."
draft: false
---

## One Equation, Three Invariants

A conic in the plane is given by the general equation

$$
a_{11}x^2+2a_{12}xy+a_{22}y^2+2a_{13}x+2a_{23}y+a_{33}=0
$$

Writing the quadratic terms as the symmetric matrix

$$
A=\begin{pmatrix}a_{11}&a_{12}\\a_{12}&a_{22}\end{pmatrix},
\qquad
b=\begin{pmatrix}a_{13}\\a_{23}\end{pmatrix},
$$

and folding the constant term into the augmented matrix

$$
\widetilde A=
\begin{pmatrix}
a_{11}&a_{12}&a_{13}\\
a_{12}&a_{22}&a_{23}\\
a_{13}&a_{23}&a_{33}
\end{pmatrix},
$$

the equation can be written as

$$
\begin{pmatrix}x&y\end{pmatrix}A
\begin{pmatrix}x\\y\end{pmatrix}
+2b^{\top}\begin{pmatrix}x\\y\end{pmatrix}+a_{33}=0.
$$

Under translations and rotations, the following three quantities remain unchanged:

$$
I_1=\operatorname{tr}A=a_{11}+a_{22},\qquad
I_2=\det A=a_{11}a_{22}-a_{12}^2,\qquad
I_3=\det\widetilde A.
$$

$I_1$ and $I_2$ come from the quadratic form itself; $I_3$ also involves the linear terms and the constant term. None of them changes under a rigid motion of the coordinate system, so they can be used directly to determine the type of the curve.

::: note Why These Three
A rotation conjugates both $A$ and $\widetilde A$, leaving determinant and trace unchanged; a translation amounts to multiplying the augmented matrix on the left and on the right by a block matrix of determinant $1$, so $I_3$ is unchanged as well. The three quantities control, respectively, the sum of the quadratic terms, the determinant of the quadratic part, and whether the whole equation is "degenerate".
:::

## Splitting into Three Broad Classes with I₂

$I_2$ is the determinant of the quadratic-form matrix, and its sign determines the inertia index of the quadratic part:

- $I_2>0$: the two eigenvalues have the same sign, the quadratic part is positive or negative definite, and the curve falls into the elliptic type;
- $I_2<0$: the two eigenvalues have opposite signs, the quadratic part is indefinite, and the curve falls into the hyperbolic type;
- $I_2=0$: at least one eigenvalue is zero, the quadratic part is degenerate, and the curve falls into the parabolic type.

The quantity $I_3$ then decides whether the curve is degenerate. If $I_3\neq 0$, the curve is a non-degenerate conic; if $I_3=0$, the equation factors or degenerates into a point, a line, or the empty set.

| Condition | Type | Example |
| --- | --- | --- |
| $I_2>0,\ I_1I_3<0$ | real ellipse | $\dfrac{x^2}{4}+y^2=1$ |
| $I_2>0,\ I_3=0$ | a single point | $x^2+y^2=0$ |
| $I_2>0,\ I_1I_3>0$ | imaginary ellipse (no real points) | $x^2+y^2+1=0$ |
| $I_2<0,\ I_3\neq0$ | hyperbola | $x^2-y^2=1$ |
| $I_2<0,\ I_3=0$ | two intersecting lines | $x^2-y^2=0$ |
| $I_2=0,\ I_3\neq0$ | parabola | $y^2=x$ |
| $I_2=0,\ I_3=0$ | parallel lines, coincident lines, or the empty set | $y^2=1,\ y^2=0,\ y^2=-1$ |

This table is not something to memorize. $I_2$ decides whether the quadratic terms can be simultaneously positive or simultaneously negative; $I_3$ decides whether the equation carries an "offset produced by the constant term". Taken together, the two already separate most cases.

## A Worked Example: A Hyperbola

Take

$$
x^2+4xy+y^2-1=0.
$$

Here

$$
A=\begin{pmatrix}1&2\\2&1\end{pmatrix},
\qquad
I_1=2,\qquad
I_2=1-4=-3<0.
$$

The augmented matrix is

$$
\widetilde A=
\begin{pmatrix}
1&2&0\\
2&1&0\\
0&0&-1
\end{pmatrix},
\qquad
I_3=(1-4)(-1)=3\neq0.
$$

So it is a non-degenerate hyperbola. The eigenvalues of $A$ are $3$ and $-1$, and for the corresponding unit eigenvectors we may take

$$
u=\frac{1}{\sqrt2}(1,1)^{\top},
\qquad
v=\frac{1}{\sqrt2}(1,-1)^{\top}.
$$

Setting $x=(u+v)/\sqrt2$ and $y=(u-v)/\sqrt2$, that is, taking new coordinates along the two principal axes, reduces the quadratic form to

$$
3u^2-v^2=1,
$$

which is precisely the standard hyperbola. The rotation eliminates the cross term $4xy$, leaving two squared terms of opposite sign.

## Center, Principal Axes, and Completing the Square

When $I_2\neq0$, $A$ is invertible and the system

$$
A\begin{pmatrix}x_0\\y_0\end{pmatrix}=-b
$$

has a unique solution; $(x_0,y_0)$ is the center of the curve. Translating the origin to the center kills the linear terms, leaving only the quadratic terms and the constant. Rotating further to the eigendirections of $A$ diagonalizes the quadratic form, and the equation becomes

$$
\lambda_1 u^2+\lambda_2 v^2=\mu.
$$

At this point the difference between an ellipse, a hyperbola, and a point depends only on the signs of $\lambda_1,\lambda_2,\mu$. The parabola is the exception: $I_2=0$, $A$ is not invertible, and there is no unique center; rotation can only remove the cross term, leaving one squared term and one linear term.

## Boundaries

These invariants are invariant under **rigid motions** (translations and rotations). If general affine transformations are allowed, the sign of $I_2$ still distinguishes the elliptic, hyperbolic, and parabolic types, but the actual values of $I_1$ and $I_3$ change, and the classification table must be rewritten.

The degenerate cases with $I_3=0$ call for a finer analysis: two parallel lines, a single coincident line, and the empty set can all occur when $I_2=0$, and the three numbers $I_1,I_2,I_3$ alone do not always separate them completely. In practice, the safest route is still to complete the square or factor first, and then check the result against the invariants.

Finally, a conic is the solution set of a quadratic equation, not the quadratic form itself. The quadratic form $x^2+4xy+y^2$ is a function; it is its level sets that form curves. When matching "the inertia index of a matrix" to "the shape of a curve", the constant term decides which level the level set falls on.

## References

- Lü Lingen and Xu Zidao, *Analytic Geometry*, 5th ed., Higher Education Press.
- H. S. M. Coxeter, *Introduction to Geometry*, 2nd ed., Wiley, 1969.
