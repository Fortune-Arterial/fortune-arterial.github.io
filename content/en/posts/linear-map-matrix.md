---
title: "Linear Maps and Matrices: Two Ways of Writing the Same Thing"
subtitle: "Only after choosing a basis does the abstract map become a computable table"
date: "2026-10-20"
category: "高等代数"
tags: ["Linear Maps", "Matrices", "Change of Basis", "Rank"]
concepts: ["linear-map", "matrix", "linear-space"]
excerpt: "A linear map is an object independent of coordinates; a matrix is merely its coordinate representation with respect to some basis. Changing basis does not change the map, only the way it is written."
draft: false
---

## The map comes first, the matrix comes later

Let $V,W$ be linear spaces over a field $\mathbb{F}$. A map $T:V\to W$ is called linear if for any $u,v\in V$ and $\alpha\in\mathbb{F}$,

$$
T(u+\alpha v)=T(u)+\alpha T(v).
$$

This definition contains no coordinates and no matrices. It says only that $T$ preserves addition and scalar multiplication. The vectors in a linear space may be polynomials, functions, or matrices, as long as addition and scalar multiplication follow the same rules.

## Choose a basis, and the matrix appears

Take a basis $\mathcal{B}=(b_1,\dots,b_n)$ of $V$ and a basis $\mathcal{C}=(c_1,\dots,c_m)$ of $W$. Each $T(b_j)$ can be written uniquely as a linear combination of $\mathcal{C}$:

$$
T(b_j)=\sum_{i=1}^{m} a_{ij}c_i,\qquad j=1,\dots,n.
$$

Arranging these $n$ columns of coefficients into an $m\times n$ matrix $A=(a_{ij})$ gives the matrix representation of $T$ with respect to the bases $\mathcal{B},\mathcal{C}$. It can be written compactly as

$$
[T]_{\mathcal{C}\leftarrow\mathcal{B}}=A.
$$

The columns of the matrix are the coordinates, in the target basis, of where the basis vectors are sent by $T$. Writing the coordinates of a vector $v=\sum_j x_j b_j$ as $[v]_{\mathcal{B}}=(x_1,\dots,x_n)^{\top}$, we have

$$
[T(v)]_{\mathcal{C}}=A\,[v]_{\mathcal{B}}.
$$

This is the entire meaning of "a matrix acting on coordinates". A matrix is not the map itself; it is the ledger that translates the map between two coordinate systems.

## A concrete example

Let $V=P_2$ be the real polynomials of degree at most $2$, $W=P_1$ the polynomials of degree at most $1$, and $D:P_2\to P_1$ be differentiation:

$$
D(p)=p'.
$$

Take the bases $\mathcal{B}=(1,x,x^2)$ and $\mathcal{C}=(1,x)$. Compute one at a time:

$$
D(1)=0,\qquad D(x)=1,\qquad D(x^2)=2x.
$$

Writing these in coordinates with respect to $\mathcal{C}$ gives

$$
[D]_{\mathcal{C}\leftarrow\mathcal{B}}=
\begin{pmatrix}
0 & 1 & 0\\
0 & 0 & 2
\end{pmatrix}.
$$

Check by multiplying the matrix with coordinates: $p=3+2x+5x^2$ has coordinates $(3,2,5)^{\top}$; the product is $(2,10)^{\top}$, which corresponds to $2+10x$ — exactly $p'=2+10x$.

## Composition, change of basis, and invariants

If $T:U\to V$ and $S:V\to W$ are both linear, then the composition $S\circ T$ is also linear, and with respect to the same bases

$$
[S\circ T]=[S]\,[T].
$$

Note the order: $T$ acts first, then $S$, and matrix multiplication is likewise read from right to left. Matrix multiplication is defined this way not to create a computational rule, but to make it correspond to composition of maps.

Change the basis and the matrix changes. Let $\mathcal{B}'$ be another basis of $V$, and let the columns of $P$ be the coordinates of the vectors of $\mathcal{B}'$ with respect to $\mathcal{B}$, that is, $\mathcal{B}'=\mathcal{B}P$. The matrix of the same linear map $T:V\to V$ with respect to the new basis is

$$
[T]_{\mathcal{B}'}=P^{-1}\,[T]_{\mathcal{B}}\,P.
$$

Two such matrices are called similar. Similar matrices describe the same map, merely observed in different coordinates. Hence the trace and the determinant are invariant under similarity transformations:

$$
\operatorname{tr}(P^{-1}AP)=\operatorname{tr}(A),\qquad
\det(P^{-1}AP)=\det(A).
$$

The characteristic polynomial is likewise invariant, so "eigenvalue" is a property of the map, not of any one matrix table.

## Kernel, image, and rank

The kernel and image of a linear map $T:V\to W$ are

$$
\ker T=\{v\in V:T(v)=0\},\qquad
\operatorname{im}T=\{T(v):v\in V\}.
$$

Both are linear subspaces, and the rank–nullity theorem holds:

$$
\dim V=\dim\ker T+\dim\operatorname{im}T.
$$

The rank of a matrix equals $\dim\operatorname{im}T$, so "row rank equals column rank" is not an isolated computational fact but the coordinate version of this dimension formula. $T$ is injective if and only if $\ker T=\{0\}$; it is surjective if and only if $\dim\operatorname{im}T=\dim W$. Between finite-dimensional spaces of the same dimension, injective, surjective, and invertible are equivalent.

## Boundaries

A matrix representation depends on the basis. When we speak of "the matrix of this linear map", we must also specify bases for the domain and the codomain; after a change of basis the matrix changes, but invariants such as rank, trace, determinant, and eigenvalues do not.

Eigenvalues and diagonalization further require that $T$ be a map from a space to itself (an endomorphism); otherwise the two sides of $T(v)=\lambda v$ do not lie in the same space, and the comparison is meaningless. Even among endomorphisms, eigenvalues may fall outside the base field: the real matrix $\begin{pmatrix}0&-1\\1&0\end{pmatrix}$ has no real eigenvalues, but regarded as a complex linear map its eigenvalues are $\pm i$.

Finally, similarity and congruence are two different things. Similarity comes from a change of basis, $P^{-1}AP$, and preserves the structure of the linear map; congruence comes from a change of variables in a quadratic form, $P^{\top}AP$, and preserves the values of the quadratic form. Conflating the two is the most common mistake in the chapter on quadratic forms.

## References

- Sheldon Axler, *Linear Algebra Done Right*, 4th ed., Springer, 2024.
- Kenneth Hoffman & Ray Kunze, *Linear Algebra*, 2nd ed., Prentice-Hall, 1971.
