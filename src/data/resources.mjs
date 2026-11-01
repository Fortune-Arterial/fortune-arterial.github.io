export const resourceGroups = [
  {
    id: "analysis",
    label: "数学分析",
    labelEn: "Mathematical Analysis",
    en: "MATHEMATICAL ANALYSIS",
    note: "用严密的逻辑重塑对“无穷”的直觉，让每一步极限推导都有理有据。",
    noteEn: "Rebuild your intuition for the infinite with rigorous logic, so every limit is justified step by step.",
    items: [
    ],
  },
  {
    id: "algebra",
    label: "高等代数",
    labelEn: "Higher Algebra",
    en: "HIGHER ALGEBRA",
    note: "把线性空间、线性映射与矩阵放在一起看，而不是先背矩阵运算。",
    noteEn: "See vector spaces, linear maps and matrices together, instead of memorising matrix operations first.",
    items: [
    ],
  },
  {
    id: "geometry",
    label: "解析几何",
    labelEn: "Analytic Geometry",
    en: "ANALYTIC GEOMETRY",
    note: "先建立图形直觉，再用坐标与方程把它算出来。",
    noteEn: "Build geometric intuition first, then compute it with coordinates and equations.",
    items: [
    ],
  },
  {
    id: "tools",
    label: "工具与写作",
    labelEn: "Tools & Writing",
    en: "TOOLS & WRITING",
    note: "让公式、图形与推导更快变成可读的东西。",
    noteEn: "Tools that turn formulas, figures and derivations into something readable, faster.",
    items: [
      {
        title: "GeoGebra",
        by: "GeoGebra",
        desc: "画函数、曲线与曲面，拖动参数看形状怎么变。",
        descEn: "Plot functions, curves and surfaces, and drag parameters to see how the shape changes.",
        href: "https://www.geogebra.org/",
        tag: "tool",
      },
      {
        title: "Overleaf",
        by: "Overleaf",
        desc: "在线 LaTeX 编辑器。适合写长推导，也方便把公式直接贴进笔记。",
        descEn: "An online LaTeX editor for long derivations, and for pasting formulas directly into notes.",
        href: "https://www.overleaf.com/",
        tag: "tool",
      },
    ],
  },
  {
    id: "latex",
    label: "LaTeX 模板",
    labelEn: "LaTeX template",
    en: "LATEX TEMPLATE",
    note: "本站笔记使用的XeLaTeX模板，可直接下载源文件。",
    noteEn: "The XeLaTeX template used for these notes; download the source files directly.",
    items: [
      {
        title: "Fortune-Book",
        by: "XeLaTeX 模板",
        byEn: "XeLaTeX template",
        desc: "一份完整的 XeLaTeX 书稿示例，包含排版、公式、图表与参考文献的写法。",
        descEn: "A complete XeLaTeX book example covering layout, formulas, figures, and references.",
        tag: "template",
        files: [
          { label: "PDF", size: "4.6 MB", href: "/downloads/latex/fortune-book.pdf", name: "Fortune-Book.pdf" },
          { label: "ZIP", size: "9.1 MB", href: "/downloads/latex/fortune-book.zip", name: "Fortune-Book.zip", source: true },
        ],
      },
      {
        title: "LaTeX 公式表",
        titleEn: "LaTeX Formula Sheet",
        by: "Fortune Arterial",
        byEn: "Fortune Arterial",
        desc: "常用数学公式的 LaTeX 写法速查，适合放在手边随时查。",
        descEn: "A handy reference for LaTeX notation of common mathematical formulas.",
        tag: "template",
        files: [
          { label: "PDF", size: "400 KB", href: "/downloads/latex/latex-formula-sheet.pdf", name: "LaTeX公式表.pdf" },
          { label: "ZIP", size: "933 KB", href: "/downloads/latex/latex-formula-sheet.zip", name: "LaTeX公式表.zip", source: true },
        ],
      },
    ],
  },
];
