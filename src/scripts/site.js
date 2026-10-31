/* ==========================================================================
   Fortune Arterial — client behaviour
   Theme, navigation, search, list filters, table of contents, map.
   ========================================================================== */

(() => {
  const doc = document.documentElement;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const themeKey = "fa-theme";

  const escapeHtml = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  function readStoredTheme() {
    try {
      const value = localStorage.getItem(themeKey);
      return value === "light" || value === "dark" ? value : null;
    } catch {
      return null;
    }
  }

  function storeTheme(value) {
    try {
      localStorage.setItem(themeKey, value);
    } catch {
      /* storage may be unavailable */
    }
  }

  function applyTheme(value) {
    doc.dataset.theme = value;
    $$("[data-theme-toggle]").forEach((button) => {
      button.setAttribute("aria-label", value === "dark" ? "切换到浅色模式" : "切换到深色模式");
      button.setAttribute("title", value === "dark" ? "切换到浅色模式" : "切换到深色模式");
    });
  }

  if (!/Mac|iPhone|iPad|iPod/.test(navigator.platform || "")) {
    $$(".search-trigger kbd").forEach((key) => {
      key.textContent = "Ctrl K";
    });
  }

  applyTheme(doc.dataset.theme || "light");

  $$("[data-theme-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = doc.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(next);
      storeTheme(next);
    });
  });

  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  systemTheme.addEventListener?.("change", (event) => {
    if (!readStoredTheme()) applyTheme(event.matches ? "dark" : "light");
  });

  /* ------------------------------------------------------------------ */
  /* Header, menu, progress                                             */
  /* ------------------------------------------------------------------ */

  const header = $("[data-header]");
  const progress = $("[data-progress]");
  const prose = $("[data-prose]");

  function updateScrollUi() {
    header?.classList.toggle("is-scrolled", window.scrollY > 8);
    if (!progress) return;
    if (prose) {
      const rect = prose.getBoundingClientRect();
      const start = window.innerHeight * 0.45;
      const total = rect.height - window.innerHeight * 0.55;
      const value = Math.min(Math.max((start - rect.top) / total, 0), 1);
      progress.style.width = `${(value * 100).toFixed(2)}%`;
    } else {
      const max = doc.scrollHeight - window.innerHeight;
      progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    }
  }

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateScrollUi();
        ticking = false;
      });
    },
    { passive: true },
  );
  window.addEventListener("resize", updateScrollUi, { passive: true });
  updateScrollUi();

  const menuToggle = $("[data-menu-toggle]");
  function closeMenu() {
    document.body.classList.remove("nav-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "打开菜单");
  }
  function toggleMenu() {
    const open = document.body.classList.toggle("nav-open");
    menuToggle?.setAttribute("aria-expanded", String(open));
    menuToggle?.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
  }
  menuToggle?.addEventListener("click", toggleMenu);
  $$(".nav-link").forEach((link) => link.addEventListener("click", closeMenu));

  /* ------------------------------------------------------------------ */
  /* Search                                                            */
  /* ------------------------------------------------------------------ */

  const modal = $("[data-search-modal]");
  const searchInput = modal ? $("[data-search-input]", modal) : null;
  const searchResults = modal ? $("[data-search-results]", modal) : null;
  const searchCount = modal ? $("[data-search-count]", modal) : null;
  let searchIndex = null;
  let searchLoading = false;
  let searchError = false;
  let results = [];
  let activeResult = -1;
  let lastFocused = null;

  function highlight(text, terms) {
    let html = escapeHtml(text);
    for (const term of terms) {
      if (!term) continue;
      html = html.replace(new RegExp(`(${escapeRegExp(escapeHtml(term))})`, "gi"), "<mark>$1</mark>");
    }
    return html;
  }

  function scoreItem(item, terms) {
    let total = 0;
    const title = item.title.toLowerCase();
    const tags = item.tags.join(" ").toLowerCase();
    const category = item.category.toLowerCase();
    const excerpt = item.excerpt.toLowerCase();
    const content = item.content.toLowerCase();

    for (const term of terms) {
      let score = 0;
      if (title.includes(term)) score += title.startsWith(term) ? 12 : 8;
      if (tags.includes(term)) score += 4;
      if (category.includes(term)) score += 3;
      if (excerpt.includes(term)) score += 2;
      if (content.includes(term)) score += 1;
      if (score === 0) return 0;
      total += score;
    }
    return total;
  }

  function setActiveResult(index) {
    const items = $$(".search-result", searchResults);
    if (!items.length) return;
    activeResult = (index + items.length) % items.length;
    items.forEach((item, itemIndex) => {
      item.classList.toggle("is-active", itemIndex === activeResult);
    });
    searchInput?.setAttribute("aria-activedescendant", items[activeResult].id);
    items[activeResult].scrollIntoView({ block: "nearest" });
  }

  function renderSearch(query) {
    if (!searchResults) return;
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let items = [];

    if (!searchIndex) {
      searchResults.innerHTML = `<p class="search-hint">搜索索引不可用。</p>`;
      return;
    }

    if (!searchIndex.length) {
      searchCount.textContent = "0 篇笔记";
      searchResults.innerHTML = `<p class="search-hint">还没有可搜索的笔记。<br>第一篇文章发布后，这里会自动建立索引。</p>`;
      return;
    }

    if (!terms.length) {
      items = searchIndex.slice(0, 5);
      activeResult = -1;
      searchCount.textContent = `最近 ${items.length} 篇`;
      searchResults.innerHTML = items
        .map(
          (item, index) => `<a class="search-result${index === 0 ? " is-active" : ""}" id="search-result-${index}" href="${escapeHtml(
            item.url,
          )}">
        <span class="search-result-cat cat-${escapeHtml(item.tone)}">${escapeHtml(item.category)}</span>
        <span class="search-result-body"><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.excerpt)}</p></span>
        <time>${escapeHtml(item.date.replace(/-/g, "."))}</time>
      </a>`,
        )
        .join("");
      items = [];
      activeResult = 0;
      return;
    }

    items = searchIndex
      .map((item) => ({ item, score: scoreItem(item, terms) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || (a.item.date < b.item.date ? 1 : -1))
      .slice(0, 8)
      .map((entry) => entry.item);

    if (!items.length) {
      searchCount.textContent = "0 条结果";
      searchResults.innerHTML = `<p class="search-hint">没有找到「${escapeHtml(query.trim())}」。<br>试试更短的关键词，或者只搜标签。</p>`;
      return;
    }

    searchCount.textContent = `${items.length} 条结果`;
    searchResults.innerHTML = items
      .map(
        (item, index) => `<a class="search-result${index === 0 ? " is-active" : ""}" id="search-result-${index}" href="${escapeHtml(
          item.url,
        )}">
        <span class="search-result-cat cat-${escapeHtml(item.tone)}">${escapeHtml(item.category)}</span>
        <span class="search-result-body"><strong>${highlight(item.title, terms)}</strong><p>${highlight(item.excerpt, terms)}</p></span>
        <time>${escapeHtml(item.date.replace(/-/g, "."))}</time>
      </a>`,
      )
      .join("");
    activeResult = 0;
    $$(".search-result", searchResults).forEach((element) => {
      element.addEventListener("mouseenter", () => {
        activeResult = Number(element.id.replace("search-result-", ""));
        $$(".search-result", searchResults).forEach((item, index) => {
          item.classList.toggle("is-active", index === activeResult);
        });
      });
    });
  }

  async function ensureSearchIndex() {
    if (searchIndex || searchLoading) return;
    searchLoading = true;
    searchError = false;
    if (searchResults) searchResults.innerHTML = '<p class="search-hint">正在载入索引…</p>';
    try {
      const response = await fetch(modal.dataset.searchIndex, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      searchIndex = await response.json();
      renderSearch(searchInput?.value || "");
    } catch (error) {
      searchError = true;
      if (searchResults) {
        searchResults.innerHTML =
          '<p class="search-hint">搜索索引加载失败。请确认页面是通过本地服务器或 GitHub Pages 打开的。</p>';
      }
    } finally {
      searchLoading = false;
    }
  }

  async function openSearch() {
    if (!modal) return;
    lastFocused = document.activeElement;
    closeMenu();
    modal.hidden = false;
    document.body.classList.add("search-open");
    if (searchInput) {
      searchInput.value = "";
      searchInput.focus();
    }
    await ensureSearchIndex();
  }

  function closeSearch() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove("search-open");
    if (lastFocused instanceof HTMLElement) lastFocused.focus();
  }

  $$("[data-search-open]").forEach((button) => button.addEventListener("click", openSearch));
  $$("[data-search-close]").forEach((element) => element.addEventListener("click", closeSearch));

  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if ((event.metaKey || event.ctrlKey) && key === "k") {
      event.preventDefault();
      if (modal?.hidden) openSearch();
      else closeSearch();
      return;
    }
    if (event.key === "Escape") {
      if (modal && !modal.hidden) {
        event.preventDefault();
        closeSearch();
        return;
      }
      closeMenu();
    }
  });

  searchInput?.addEventListener("input", () => renderSearch(searchInput.value));
  searchInput?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveResult(activeResult + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveResult(activeResult - 1);
    } else if (event.key === "Enter") {
      const active = $(".search-result.is-active", searchResults);
      if (active) {
        event.preventDefault();
        window.location.href = active.getAttribute("href");
      }
    }
  });

  modal?.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const focusables = $$('a[href], button, input, [tabindex]:not([tabindex="-1"])', modal).filter(
      (element) => element.offsetParent !== null,
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  /* ------------------------------------------------------------------ */
  /* Notes list: category filter + local search                         */
  /* ------------------------------------------------------------------ */

  const postList = $("[data-post-list]");
  if (postList) {
    const rows = $$(".post-row", postList);
    const filterButtons = $$("[data-filter]");
    const listSearch = $("[data-list-search]");
    const emptyState = $("[data-empty-state]");
    let activeFilter = "all";

    function applyListFilters() {
      const query = (listSearch?.value || "").trim().toLowerCase();
      let visible = 0;
      rows.forEach((row) => {
        const category = row.dataset.category || "";
        const text = (row.dataset.search || "").toLowerCase();
        const matchesCategory = activeFilter === "all" || category === activeFilter;
        const matchesQuery = !query || text.includes(query);
        const show = matchesCategory && matchesQuery;
        row.hidden = !show;
        if (show) visible += 1;
      });
      if (emptyState) emptyState.hidden = visible > 0;
    }

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        activeFilter = button.dataset.filter || "all";
        filterButtons.forEach((other) => {
          other.classList.toggle("is-active", other === button);
          other.setAttribute("aria-pressed", String(other === button));
        });
        applyListFilters();
      });
      button.setAttribute("aria-pressed", String(button.classList.contains("is-active")));
    });

    listSearch?.addEventListener("input", applyListFilters);
  }

  /* ------------------------------------------------------------------ */
  /* Table of contents                                                  */
  /* ------------------------------------------------------------------ */

  const tocLinks = $$(".toc-list a");
  if (tocLinks.length) {
    const headingPairs = tocLinks
      .map((link) => {
        const id = decodeURIComponent((link.getAttribute("href") || "").replace(/^#/, ""));
        return { link, heading: document.getElementById(id) };
      })
      .filter((pair) => pair.heading);

    const setActiveHeading = (id) => {
      tocLinks.forEach((link) => {
        const linkId = decodeURIComponent((link.getAttribute("href") || "").replace(/^#/, ""));
        link.closest(".toc-item")?.classList.toggle("is-active", linkId === id);
      });
    };

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          if (visible.length) setActiveHeading(visible[0].target.id);
        },
        { rootMargin: "-96px 0px -68% 0px", threshold: 0 },
      );
      headingPairs.forEach((pair) => observer.observe(pair.heading));
    }

    tocLinks.forEach((link) => link.addEventListener("click", () => setActiveHeading(link.getAttribute("href").slice(1))));
  }

  if (window.matchMedia("(max-width: 900px)").matches) {
    $$(".toc-box[open]").forEach((box) => box.removeAttribute("open"));
  }

  /* ------------------------------------------------------------------ */
  /* Copy helpers                                                       */
  /* ------------------------------------------------------------------ */

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      let ok = false;
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      area.remove();
      return ok;
    }
  }

  $$("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const block = button.closest(".code-block");
      const code = block?.querySelector("code");
      if (!code) return;
      const ok = await copyText(code.innerText);
      const original = button.textContent;
      button.textContent = ok ? "已复制" : "复制失败";
      window.setTimeout(() => {
        button.textContent = original;
      }, 1600);
    });
  });

  $$("[data-copy-link]").forEach((button) => {
    button.addEventListener("click", async () => {
      const ok = await copyText(window.location.href);
      const label = button.querySelector("span");
      if (!label) return;
      button.classList.toggle("is-copied", ok);
      label.textContent = ok ? "链接已复制" : "复制失败";
      window.setTimeout(() => {
        button.classList.remove("is-copied");
        label.textContent = "复制链接";
      }, 1800);
    });
  });

  /* ------------------------------------------------------------------ */
  /* Reveal on scroll                                                   */
  /* ------------------------------------------------------------------ */

  const reveals = $$(".reveal");
  if (reveals.length) {
    if ("IntersectionObserver" in window && !reduceMotion) {
      const observer = new IntersectionObserver(
        (entries, io) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
      );
      reveals.forEach((element) => observer.observe(element));
    } else {
      reveals.forEach((element) => element.classList.add("is-visible"));
    }
  }

  /* ------------------------------------------------------------------ */
  /* Knowledge map                                                      */
  /* ------------------------------------------------------------------ */

  function initMap(root) {
    const script = root.querySelector('script[type="application/json"]');
    const panel = $("[data-map-panel]", root);
    if (!script || !panel) return;

    let data;
    try {
      data = JSON.parse(script.textContent);
    } catch {
      return;
    }

    const nodes = $$(".map-node", root);
    const edges = $$(".map-edge", root);
    const chips = $$(".map-chip", root);
    const nodeById = new Map(nodes.map((node) => [node.dataset.id, node]));
    const conceptById = new Map(data.concepts.map((concept) => [concept.id, concept]));
    const disciplineById = new Map(data.disciplines.map((discipline) => [discipline.id, discipline]));
    const emptyPanel = panel.innerHTML;
    let selected = null;

    const clearHighlight = () => {
      nodes.forEach((node) => node.classList.remove("is-active", "is-dimmed"));
      edges.forEach((edge) => edge.classList.remove("is-active", "is-dimmed"));
    };

    const applyDiscipline = (discipline) => {
      nodes.forEach((node) => {
        const matches = discipline === "all" || node.dataset.disciplines.split(" ").includes(discipline);
        node.classList.toggle("is-dimmed", !matches);
      });
      edges.forEach((edge) => {
        const from = nodeById.get(edge.dataset.from);
        const to = nodeById.get(edge.dataset.to);
        const matches =
          discipline === "all" ||
          from.dataset.disciplines.split(" ").includes(discipline) ||
          to.dataset.disciplines.split(" ").includes(discipline);
        edge.classList.toggle("is-dimmed", !matches);
      });
    };

    const resetPanel = () => {
      selected = null;
      clearHighlight();
      panel.innerHTML = emptyPanel;
      applyDiscipline("all");
      chips.forEach((chip) => chip.classList.toggle("is-active", chip.dataset.discipline === "all"));
    };

    const selectConcept = (id) => {
      const concept = conceptById.get(id);
      const node = nodeById.get(id);
      if (!concept || !node) return;
      selected = id;
      clearHighlight();
      applyDiscipline("all");
      chips.forEach((chip) => chip.classList.toggle("is-active", chip.dataset.discipline === "all"));

      const related = new Set(concept.related);
      nodes.forEach((other) => {
        if (other === node) other.classList.add("is-active");
        else if (!related.has(other.dataset.id)) other.classList.add("is-dimmed");
      });
      edges.forEach((edge) => {
        if (edge.dataset.from === id || edge.dataset.to === id) edge.classList.add("is-active");
        else edge.classList.add("is-dimmed");
      });

      const index = String(data.concepts.findIndex((item) => item.id === id) + 1).padStart(2, "0");
      const discs = concept.disciplines
        .map((discId) => disciplineById.get(discId)?.name)
        .filter(Boolean)
        .map((name) => `<span class="map-detail-disc">${escapeHtml(name)}</span>`)
        .join("");
      const relatedLinks = concept.related
        .map((relatedId) => {
          const item = conceptById.get(relatedId);
          return item
            ? `<button type="button" data-related="${escapeHtml(item.id)}">${escapeHtml(item.name)}</button>`
            : "";
        })
        .join("");

      panel.innerHTML = `<div class="map-detail">
        <div class="map-detail-kicker"><span>CONCEPT ${index} / ${String(data.total).padStart(2, "0")}</span><button type="button" data-map-close aria-label="关闭详情">✕</button></div>
        <h3>${escapeHtml(concept.name)}</h3>
        <p class="map-detail-en">${escapeHtml(concept.en)}</p>
        <p class="map-detail-summary">${escapeHtml(concept.summary)}</p>
        <div class="map-detail-discs">${discs}</div>
        <p class="map-detail-label">关联概念</p>
        <div class="map-detail-related">${relatedLinks || '<span class="map-detail-disc">独立节点</span>'}</div>
        ${
          concept.postUrl
            ? `<a class="map-detail-link" href="${escapeHtml(concept.postUrl)}">阅读笔记 <span aria-hidden="true">→</span></a>`
            : '<p class="map-detail-empty">这个概念还没有写。它已经在待写清单里，只是还欠一次足够清楚的推导。</p>'
        }
      </div>`;

      $("[data-map-close]", panel)?.addEventListener("click", resetPanel);
      $$("[data-related]", panel).forEach((button) => {
        button.addEventListener("click", () => selectConcept(button.dataset.related));
      });

      if (window.matchMedia("(max-width: 900px)").matches) {
        panel.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
      }
    };

    nodes.forEach((node) => {
      node.addEventListener("click", () => selectConcept(node.dataset.id));
      node.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectConcept(node.dataset.id);
        }
      });
    });

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const discipline = chip.dataset.discipline;
        chips.forEach((item) => item.classList.toggle("is-active", item === chip));
        selected = null;
        clearHighlight();
        applyDiscipline(discipline);
        panel.innerHTML = emptyPanel;
        if (discipline !== "all") {
          const names = nodes.filter((node) => node.dataset.disciplines.split(" ").includes(discipline)).length;
          panel.innerHTML = `<div class="map-detail">
            <div class="map-detail-kicker"><span>FILTER</span><button type="button" data-map-close aria-label="清除筛选">✕</button></div>
            <h3>${escapeHtml(disciplineById.get(discipline)?.name || discipline)}</h3>
            <p class="map-detail-en">${escapeHtml(disciplineById.get(discipline)?.en || "")}</p>
            <p class="map-detail-summary">这个学科在地图上有 ${names} 个概念。亮色实心节点表示已经写过的笔记。</p>
            <p class="map-detail-label">提示</p>
            <div class="map-detail-empty">再次点击“全部”可以恢复完整视图。</div>
          </div>`;
          $("[data-map-close]", panel)?.addEventListener("click", resetPanel);
        }
      });
    });

    root.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && selected) {
        event.stopPropagation();
        resetPanel();
      }
    });
  }

  $$("[data-map]").forEach(initMap);
})();
