/**
 * Knowledge map data.
 *
 * Coordinates live in a 1000 × 600 viewBox. A concept is "lit" automatically
 * once a published post declares it in its `concepts` front matter.
 */
export const disciplines = [
  { id: "probability", name: "概率论", en: "Probability", color: "#4f7cff" },
  { id: "information", name: "信息论", en: "Information", color: "#2f9e8f" },
  { id: "statistics", name: "统计", en: "Statistics", color: "#c08a2e" },
  { id: "optimization", name: "优化", en: "Optimization", color: "#d96c4f" },
  { id: "rl", name: "强化学习", en: "Reinforcement", color: "#c2568a" },
  { id: "learning", name: "学习理论", en: "Learning Theory", color: "#7d8f3a" },
  { id: "deep", name: "深度学习", en: "Deep Learning", color: "#8567e8" },
];

export const concepts = [
  {
    id: "law-large-numbers",
    name: "大数定律",
    en: "Law of Large Numbers",
    disciplines: ["probability"],
    summary:
      "样本均值收敛到期望，是频率学派推断的起点。它说明稳定性，却不说明收敛速度。",
    x: 112,
    y: 128,
  },
  {
    id: "entropy",
    name: "Shannon 熵",
    en: "Shannon Entropy",
    disciplines: ["information"],
    summary:
      "不确定性的基本度量。它同时决定无损压缩的极限与典型集大小的指数增长率。",
    x: 322,
    y: 104,
  },
  {
    id: "mle",
    name: "最大似然估计",
    en: "Maximum Likelihood",
    disciplines: ["statistics"],
    summary:
      "选择让观测数据概率最大的参数。渐近有效、不变，但小样本下未必最优。",
    x: 560,
    y: 88,
  },
  {
    id: "score-matching",
    name: "Score Matching",
    en: "Score Matching",
    disciplines: ["statistics", "deep"],
    summary:
      "绕过难以计算的归一化常数，直接匹配对数密度的梯度场。",
    x: 792,
    y: 112,
  },
  {
    id: "vc-dimension",
    name: "VC 维度",
    en: "VC Dimension",
    disciplines: ["learning"],
    summary:
      "假设类能打散的最大点集大小，给出统一收敛的充分条件——而非必要条件。",
    x: 898,
    y: 214,
  },
  {
    id: "littlestone",
    name: "Littlestone 维度",
    en: "Littlestone Dimension",
    disciplines: ["learning"],
    summary:
      "在线学习的容量度量，刻画最坏情况下必须犯多少错误。",
    x: 706,
    y: 232,
  },
  {
    id: "typical-set",
    name: "典型集与 AEP",
    en: "Typical Set",
    disciplines: ["probability", "information"],
    summary:
      "在高维中，几乎全部概率质量集中在一个大小约为 2^{nH} 的薄壳上。",
    x: 218,
    y: 240,
  },
  {
    id: "kl-divergence",
    name: "KL 散度与交叉熵",
    en: "KL Divergence",
    disciplines: ["information", "statistics", "rl"],
    summary:
      "衡量两个分布差异的非对称量；交叉熵等于熵加上 KL 散度。",
    x: 458,
    y: 222,
  },
  {
    id: "convex-optimization",
    name: "凸优化",
    en: "Convex Optimization",
    disciplines: ["optimization"],
    summary:
      "局部最优即全局最优，但现实问题的凸性往往来自建模时的选择。",
    x: 92,
    y: 332,
  },
  {
    id: "sgd",
    name: "随机梯度方法",
    en: "Stochastic Gradient",
    disciplines: ["optimization", "deep"],
    summary:
      "用无偏的梯度估计换取可扩展性。噪声既是成本，也可能是一种正则化。",
    x: 232,
    y: 396,
  },
  {
    id: "mdp",
    name: "MDP 与价值函数",
    en: "Markov Decision Process",
    disciplines: ["rl"],
    summary:
      "把序贯决策写成状态、动作、转移与回报。价值函数是期望回报的递归。",
    x: 356,
    y: 468,
  },
  {
    id: "policy-gradient",
    name: "Policy Gradient",
    en: "Policy Gradient",
    disciplines: ["rl", "deep"],
    summary:
      "直接对策略参数求期望回报的梯度。方差与步长决定它能否真正工作。",
    x: 494,
    y: 364,
  },
  {
    id: "attention",
    name: "缩放点积注意力",
    en: "Scaled Dot-Product Attention",
    disciplines: ["deep"],
    summary:
      "用查询与键的相似度加权聚合值。除以 √d 是为了控制 logits 的方差。",
    x: 700,
    y: 366,
  },
  {
    id: "vae",
    name: "VAE 与 ELBO",
    en: "Variational Autoencoder",
    disciplines: ["deep"],
    summary:
      "用变分下界逼近难以计算的对数似然，在重构与正则之间做拉扯。",
    x: 574,
    y: 506,
  },
  {
    id: "sigreg",
    name: "LeWorldModel / SIGReg",
    en: "SIGReg",
    disciplines: ["deep"],
    summary:
      "在潜空间预测中约束表示分布，避免所有输入塌缩成同一个常数向量。",
    x: 796,
    y: 482,
  },
];

/** from → to. type: prereq (solid), extends (solid), applies (dotted), contrast (dashed). */
export const edges = [
  { from: "law-large-numbers", to: "typical-set", type: "prereq" },
  { from: "entropy", to: "typical-set", type: "prereq" },
  { from: "entropy", to: "kl-divergence", type: "prereq" },
  { from: "typical-set", to: "kl-divergence", type: "extends" },
  { from: "mle", to: "kl-divergence", type: "extends" },
  { from: "mle", to: "score-matching", type: "extends" },
  { from: "kl-divergence", to: "score-matching", type: "extends" },
  { from: "kl-divergence", to: "policy-gradient", type: "applies" },
  { from: "kl-divergence", to: "vae", type: "applies" },
  { from: "mdp", to: "policy-gradient", type: "prereq" },
  { from: "sgd", to: "policy-gradient", type: "applies" },
  { from: "convex-optimization", to: "sgd", type: "prereq" },
  { from: "typical-set", to: "littlestone", type: "extends" },
  { from: "littlestone", to: "vc-dimension", type: "contrast" },
  { from: "attention", to: "vae", type: "extends" },
  { from: "attention", to: "sigreg", type: "applies" },
  { from: "vae", to: "sigreg", type: "extends" },
  { from: "score-matching", to: "vae", type: "applies" },
];

export const categories = {
  概率论: { en: "Probability", tone: "probability" },
  信息论: { en: "Information Theory", tone: "information" },
  统计: { en: "Statistics", tone: "statistics" },
  优化: { en: "Optimization", tone: "optimization" },
  强化学习: { en: "Reinforcement Learning", tone: "rl" },
  学习理论: { en: "Learning Theory", tone: "learning" },
  深度学习: { en: "Deep Learning", tone: "deep" },
};

export function conceptById(id) {
  return concepts.find((concept) => concept.id === id);
}
