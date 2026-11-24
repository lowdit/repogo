/* Repogo — extension accessibilité pour Paged.js 0.4.x.
 *
 * Chargée après paged.polyfill.js et avant le démarrage du Previewer.
 * Elle ne modifie pas le polyfill : elle ajoute des repères ARIA, la
 * sémantique des notes, le focus du sommaire et la réécriture des
 * références du clone mobile.
 */
(function () {
  "use strict";

  const config = window.RepogoPrintConfig || {};
  const CLONE_PREFIX = "m-";
  const REF_ATTRIBUTES = [
    "for",
    "headers",
    "list",
    "form",
    "aria-labelledby",
    "aria-describedby",
    "aria-controls",
    "aria-owns",
    "aria-activedescendant",
    "aria-details",
    "aria-errormessage"
  ];

  function appendPageNumberToAnchor(el, pageNum) {
    const span = document.createElement("span");
    span.textContent = pageNum;
    el.append(span);
  }

  /* Le clone mobile est un innerHTML du document : les id sont préfixés,
     mais les attributs qui pointent vers ces id doivent l'être aussi. */
  function prefixClone(root) {
    if (!root) return;
    const ids = new Map();

    root.querySelectorAll("[id]").forEach((el) => {
      const oldId = el.id;
      if (!oldId) return;
      const newId = oldId.startsWith(CLONE_PREFIX) ? oldId : CLONE_PREFIX + oldId;
      ids.set(oldId, newId);
      el.id = newId;
    });

    root.querySelectorAll("a[href^='#']").forEach((link) => {
      const href = link.getAttribute("href");
      if (!href || href.length <= 1) return;
      const id = href.slice(1);
      if (ids.has(id)) link.setAttribute("href", "#" + ids.get(id));
    });

    root.querySelectorAll("*").forEach((el) => {
      REF_ATTRIBUTES.forEach((attr) => {
        const value = el.getAttribute(attr);
        if (!value) return;
        let changed = false;
        const next = value.split(/\s+/).map((part) => {
          if (!ids.has(part)) return part;
          changed = true;
          return ids.get(part);
        });
        if (changed) el.setAttribute(attr, next.join(" "));
      });
    });
  }

  function focusHeadingFromLink(link) {
    const href = link.getAttribute("href");
    if (!href || href.charAt(0) !== "#") return;
    const id = decodeURIComponent(href.slice(1));
    window.setTimeout(() => {
      const target = document.getElementById(id);
      if (!target || !/^H[1-6]$/.test(target.tagName)) return;
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }, 0);
  }

  /* Paged.js 0.4.x produit déjà des liens appel -> note, mais sans rôle
     ni retour. On complète sans réécrire le contenu des notes. */
  function enhanceFootnotes(preview) {
    const calls = Array.from(preview.querySelectorAll("a[data-footnote-call]"));
    const notes = Array.from(preview.querySelectorAll("[data-footnote-marker][id^='note-']"));
    if (!calls.length && !notes.length) return;

    const numbers = new Map();
    calls.forEach((call, index) => {
      const ref = call.getAttribute("data-footnote-call");
      const n = index + 1;
      if (ref) numbers.set(ref, n);
      if (!call.id && ref) call.id = "fnref-" + ref;
      call.setAttribute("role", "doc-noteref");
      call.setAttribute("aria-label", "Note " + n);
    });

    notes.forEach((note) => {
      const ref = note.getAttribute("data-footnote-marker");
      const n = ref ? numbers.get(ref) : null;
      note.setAttribute("role", "doc-endnote");
      if (!n || note.querySelector(".footnote-backref")) return;
      const back = document.createElement("a");
      back.className = "footnote-backref";
      back.href = "#fnref-" + ref;
      back.setAttribute("aria-label", "Retour à l’appel de note " + n);
      back.textContent = "↩";
      note.appendChild(back);
    });

    const area = preview.querySelector(".pagedjs_footnote_inner_content");
    if (area) {
      area.setAttribute("role", "doc-endnotes");
      area.setAttribute("aria-label", "Notes de bas de page");
    }
  }

  function enhanceTocFocus() {
    const links = document.querySelectorAll(
      ".pagedjs_pages .toc-element a[href^='#'], .repogo-mobile__toc-list a[href^='#']"
    );
    links.forEach((link) => {
      if (link.dataset.repogoFocus === "true") return;
      link.dataset.repogoFocus = "true";
      link.addEventListener("click", () => focusHeadingFromLink(link));
    });
  }

  class RepogoA11yHandler extends Paged.Handler {
    beforeParsed(content) {
      if (config.type === "letter" || config.type === "record") {
        const root = content.querySelector(".courrier-body") || content;
        root.querySelectorAll("h2, h3, h4").forEach((heading) => {
          const next = heading.nextElementSibling;
          if (!next || next.classList.contains("keep-with-next")) return;
          const wrap = document.createElement("div");
          wrap.className = "keep-with-next";
          heading.parentNode.insertBefore(wrap, heading);
          wrap.appendChild(heading);
          wrap.appendChild(next);
        });
        return;
      }

      if (config.type === "report" && config.toc && typeof createToc === "function") {
        createToc({
          content,
          tocElement: "#toc-list",
          titleElements: [".chapter h2", ".chapter h3"]
        });
      }
    }

    afterPageLayout(pageEl) {
      if (!config.toc) return;
      const pageNum = pageEl.dataset.pageNumber;
      pageEl.querySelectorAll(".title-element").forEach((titleEl) => {
        document
          .querySelectorAll(`.toc-element a[href="#${titleEl.id}"]`)
          .forEach((link) => appendPageNumberToAnchor(link, pageNum));
      });
    }

    afterRendered() {
      const preview = document.querySelector(".pagedjs_pages");
      if (!preview) return;

      preview.tabIndex = 0;
      preview.setAttribute("role", "main");
      preview.setAttribute("aria-label", "Document paginé — aperçu A4");
      preview.scrollLeft = 0;

      /* Paged.js fragmente le <main> source : chaque page en reçoit une
         copie. On garde un seul main (l’aperçu) et on neutralise les copies. */
      preview.querySelectorAll("main").forEach((oldMain) => {
        const div = document.createElement("div");
        for (const attr of oldMain.attributes) div.setAttribute(attr.name, attr.value);
        while (oldMain.firstChild) div.appendChild(oldMain.firstChild);
        oldMain.replaceWith(div);
      });

      /* Marges courantes et folios sont répétés à chaque page. */
      preview.querySelectorAll(".pagedjs_margin").forEach((margin) => {
        margin.setAttribute("aria-hidden", "true");
      });

      /* Repère de page lisible par les aides techniques. */
      preview.querySelectorAll(".pagedjs_page").forEach((page) => {
        const n = page.dataset.pageNumber;
        if (!n || page.querySelector(":scope > [role='doc-pagebreak']")) return;
        const marker = document.createElement("span");
        marker.setAttribute("role", "doc-pagebreak");
        marker.setAttribute("aria-label", "Page " + n);
        marker.className = "pagedjs_pagebreak";
        marker.style.cssText =
          "position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)";
        page.prepend(marker);
      });

      enhanceFootnotes(preview);
      enhanceTocFocus();
    }
  }

  Paged.registerHandlers(RepogoA11yHandler);

  window.RepogoA11y = {
    prefixClone,
    appendPageNumberToAnchor
  };
})();
