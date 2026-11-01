/**
 * Knowledge map data.
 *
 * Coordinates live in a 1000 × 600 viewBox. A concept is "lit" automatically
 * once a published post declares it in its `concepts` front matter.
 */
export const disciplines = [
  { id: "analysis", name: "数学分析", en: "Mathematical Analysis", color: "var(--tone-analysis)" },
  { id: "algebra", name: "高等代数", en: "Higher Algebra", color: "var(--tone-algebra)" },
  { id: "geometry", name: "解析几何", en: "Analytic Geometry", color: "var(--tone-geometry)" },
];

export const concepts = [
  {
    id: "limit",
    name: "极限与连续",
    en: "Limit and Continuity",
    disciplines: ["analysis"],
    summary:
      "ε–δ 把“无限接近”写成量词顺序；连续则进一步要求极限值等于函数值。",
    summaryEn:
      "The ε–δ definition turns “approaches” into an order of quantifiers; continuity further asks the limit to equal the value.",
    x: 128,
    y: 116,
  },
  {
    id: "derivative",
    name: "导数与微分",
    en: "Derivative and Differential",
    disciplines: ["analysis"],
    summary:
      "局部线性化：用一条直线替换曲线，误差是比增量更高阶的小量。可导蕴含连续，反之不然。",
    summaryEn:
      "Local linearisation: replace a curve by a line, with an error smaller than the increment. Differentiability implies continuity, but not conversely.",
    x: 270,
    y: 210,
  },
  {
    id: "mvt",
    name: "中值定理",
    en: "Mean Value Theorem",
    disciplines: ["analysis"],
    summary:
      "罗尔、拉格朗日与柯西中值定理把导数信息与区间增量连起来，是微分学的枢纽。",
    summaryEn:
      "Rolle, Lagrange and Cauchy connect derivative information with increments over an interval; the hinge of differential calculus.",
    x: 408,
    y: 112,
  },
  {
    id: "integral",
    name: "Riemann 积分",
    en: "Riemann Integral",
    disciplines: ["analysis"],
    summary:
      "分割、取点、求和、取极限。可积性不只取决于函数是否连续，也取决于不连续点集的大小。",
    summaryEn:
      "Partition, sample, sum, take a limit. Integrability depends not only on continuity, but also on the size of the discontinuity set.",
    x: 258,
    y: 342,
  },
  {
    id: "series",
    name: "函数项级数",
    en: "Series of Functions",
    disciplines: ["analysis"],
    summary:
      "逐点收敛、一致收敛与绝对收敛是三种强度；交换极限与积分需要一致收敛这类额外条件。",
    summaryEn:
      "Pointwise, uniform and absolute convergence are three different strengths; swapping limits with integrals needs uniform convergence.",
    x: 102,
    y: 298,
  },
  {
    id: "linear-space",
    name: "线性空间",
    en: "Vector Space",
    disciplines: ["algebra", "geometry"],
    summary:
      "向量、多项式、函数都可能是向量；真正定义它的是加法与数乘所满足的公理。",
    summaryEn:
      "Vectors, polynomials and functions can all be vectors; what defines a vector space is the axioms for addition and scalar multiplication.",
    x: 548,
    y: 122,
  },
  {
    id: "linear-map",
    name: "线性映射",
    en: "Linear Map",
    disciplines: ["algebra"],
    summary:
      "保持加法与数乘的映射。选定基之后，它才写成矩阵；换基给出相似矩阵。",
    summaryEn:
      "A map preserving addition and scalar multiplication. Only after choosing bases does it become a matrix; changing bases gives similar matrices.",
    x: 692,
    y: 188,
  },
  {
    id: "matrix",
    name: "矩阵与行列式",
    en: "Matrix and Determinant",
    disciplines: ["algebra"],
    summary:
      "线性映射的坐标表示。行列式衡量体积伸缩，也判断可逆性；秩给出像的维数。",
    summaryEn:
      "The coordinate form of a linear map. Determinants measure volume scaling and detect invertibility; rank gives the dimension of the image.",
    x: 548,
    y: 286,
  },
  {
    id: "eigen",
    name: "特征值与对角化",
    en: "Eigenvalues and Diagonalization",
    disciplines: ["algebra"],
    summary:
      "特征向量是方向上不改变、只被伸缩的向量；可对角化与否取决于特征空间是否铺满整个空间。",
    summaryEn:
      "An eigenvector keeps its direction and is only scaled; diagonalisability depends on whether eigenspaces span the whole space.",
    x: 724,
    y: 322,
  },
  {
    id: "quadratic-form",
    name: "二次型",
    en: "Quadratic Form",
    disciplines: ["algebra", "geometry"],
    summary:
      "对称矩阵给出的二次齐次函数。配方法与合同变换把交叉项消掉，正负惯性指数决定形状。",
    summaryEn:
      "A homogeneous quadratic function given by a symmetric matrix. Completing the square and congruence remove cross terms; inertia decides the shape.",
    x: 866,
    y: 238,
  },
  {
    id: "vector",
    name: "向量与坐标",
    en: "Vectors and Coordinates",
    disciplines: ["geometry", "algebra"],
    summary:
      "有向线段与坐标数组是同一对象的两张面孔；点积给出长度与夹角，叉积给出定向面积。",
    summaryEn:
      "A directed segment and a coordinate array are two faces of one object; dot products give length and angle, cross products give oriented area.",
    x: 444,
    y: 398,
  },
  {
    id: "line-plane",
    name: "直线与平面",
    en: "Lines and Planes",
    disciplines: ["geometry"],
    summary:
      "一次方程描述直线与平面；法向量与方向向量把几何条件翻译成线性方程组。",
    summaryEn:
      "Linear equations describe lines and planes; normal and direction vectors translate geometric conditions into linear systems.",
    x: 306,
    y: 486,
  },
  {
    id: "conic",
    name: "二次曲线",
    en: "Conic Sections",
    disciplines: ["geometry", "algebra"],
    summary:
      "二次曲线的形状由二次型矩阵的惯性指数决定；判别式与不变量把椭圆、双曲线、抛物线分开。",
    summaryEn:
      "The shape of a conic is fixed by the inertia of its quadratic matrix; the discriminant and invariants separate ellipses, hyperbolas and parabolas.",
    x: 574,
    y: 482,
  },
  {
    id: "quadric",
    name: "二次曲面",
    en: "Quadric Surfaces",
    disciplines: ["geometry"],
    summary:
      "二次曲面是三维中的二次方程；截痕法与主轴变换把椭圆面、双曲面、抛物面区分开。",
    summaryEn:
      "Quadrics are quadratic equations in three dimensions; slicing and principal-axis transforms distinguish ellipsoids, hyperboloids and paraboloids.",
    x: 720,
    y: 524,
  },
  {
    id: "curvature",
    name: "曲线与曲率",
    en: "Curves and Curvature",
    disciplines: ["geometry", "analysis"],
    summary:
      "曲率衡量曲线偏离直线的程度；参数化、弧长与 Frenet 标架让几何量可以计算。",
    summaryEn:
      "Curvature measures how far a curve deviates from a straight line; parametrisation, arc length and the Frenet frame make geometric quantities computable.",
    x: 874,
    y: 420,
  },
];

/** from → to. type: prereq (solid), extends (solid), applies (dotted), contrast (dashed). */
export const edges = [
  { from: "limit", to: "derivative", type: "prereq" },
  { from: "limit", to: "series", type: "prereq" },
  { from: "derivative", to: "mvt", type: "prereq" },
  { from: "derivative", to: "integral", type: "prereq" },
  { from: "mvt", to: "integral", type: "extends" },
  { from: "integral", to: "series", type: "extends" },
  { from: "series", to: "curvature", type: "applies" },
  { from: "vector", to: "line-plane", type: "prereq" },
  { from: "vector", to: "linear-space", type: "extends" },
  { from: "vector", to: "conic", type: "prereq" },
  { from: "linear-space", to: "linear-map", type: "prereq" },
  { from: "linear-map", to: "matrix", type: "extends" },
  { from: "matrix", to: "eigen", type: "prereq" },
  { from: "eigen", to: "quadratic-form", type: "extends" },
  { from: "quadratic-form", to: "conic", type: "applies" },
  { from: "matrix", to: "conic", type: "applies" },
  { from: "line-plane", to: "conic", type: "prereq" },
  { from: "conic", to: "quadric", type: "extends" },
  { from: "quadratic-form", to: "quadric", type: "applies" },
  { from: "derivative", to: "curvature", type: "applies" },
  { from: "conic", to: "curvature", type: "contrast" },
];

export const categories = {
  数学分析: { en: "Mathematical Analysis", tone: "analysis" },
  高等代数: { en: "Higher Algebra", tone: "algebra" },
  解析几何: { en: "Analytic Geometry", tone: "geometry" },
};

export function conceptById(id) {
  return concepts.find((concept) => concept.id === id);
}
