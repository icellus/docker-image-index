var LANG_KEY = "alist_lang";

function applyLanguage(lang) {
  var root = document.documentElement;
  var body = document.body;
  root.setAttribute("data-lang", lang);
  root.setAttribute("lang", lang === "en" ? "en" : "zh-CN");
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch (error) {}

  document.querySelectorAll("[data-lang-switch]").forEach(function (button) {
    button.setAttribute("data-active", button.getAttribute("data-lang-switch") === lang ? "true" : "false");
  });

  document.querySelectorAll("[data-i18n-placeholder-zh]").forEach(function (input) {
    input.placeholder = lang === "en"
      ? (input.getAttribute("data-i18n-placeholder-en") || "")
      : (input.getAttribute("data-i18n-placeholder-zh") || "");
  });

  if (body) {
    var title = lang === "en"
      ? body.getAttribute("data-title-en")
      : body.getAttribute("data-title-zh");
    if (title) {
      document.title = title;
    }
  }
}

function setupLanguageToggle() {
  var preferred = "zh";
  try {
    preferred = localStorage.getItem(LANG_KEY) || "zh";
  } catch (error) {}
  applyLanguage(preferred === "en" ? "en" : "zh");

  document.querySelectorAll("[data-lang-switch]").forEach(function (button) {
    button.addEventListener("click", function () {
      applyLanguage(button.getAttribute("data-lang-switch"));
    });
  });
}

function setupSearch() {
  document.querySelectorAll("[data-filter-target]").forEach(function (input) {
    var selector = input.getAttribute("data-filter-target");
    var rows = Array.prototype.slice.call(document.querySelectorAll(selector));
    input.addEventListener("input", function () {
      var keyword = input.value.trim().toLowerCase();
      rows.forEach(function (row) {
        var haystack = (row.getAttribute("data-search") || "").toLowerCase();
        row.style.display = !keyword || haystack.indexOf(keyword) !== -1 ? "" : "none";
      });
    });
  });
}

// 自动排序详情页的家族块，确保 php:7.2 及其衍生体排在一起，再到 7.2.9
function sortFamilies() {
  document.querySelectorAll(".family-grid").forEach(function(grid) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".family-card"));
    if (cards.length <= 1) return;

    cards.sort(function(a, b) {
      var textA = a.querySelector("h3").innerText.trim();
      var textB = b.querySelector("h3").innerText.trim();
      // 使用 localeCompare 配合 numeric: true 实现版本号逻辑排序
      // 在 ASCII 中 '-' (45) 小于 '.' (46)，所以 7.2-cli 会排在 7.2.9 之前
      return textA.localeCompare(textB, undefined, { numeric: true });
    });

    cards.forEach(function(card) {
      grid.appendChild(card);
    });
  });
}

function setupCopyButtons() {
  var items = document.querySelectorAll(".version-item");
  items.forEach(function (item) {
    var h3 = item.querySelector("h3");
    if (!h3) return;

    var tag = h3.innerText.trim();
    var btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.type = "button";
    btn.innerText = "Copy";
    
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      copyToClipboard(tag, btn);
    });

    item.appendChild(btn);
  });
}

function copyToClipboard(text, btn) {
  var textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy");
    var originalText = btn.innerText;
    btn.innerText = "Copied!";
    btn.style.borderColor = "#2da44e";
    btn.style.color = "#2da44e";
    setTimeout(function () {
      btn.innerText = originalText;
      btn.style.borderColor = "";
      btn.style.color = "";
    }, 2000);
  } catch (err) {
    console.error("Copy failed", err);
  }
  document.body.removeChild(textarea);
}

function enhanceDetailsNav() {
  var detailNav = document.querySelector(".page > .inline-nav");
  if (detailNav) {
    detailNav.classList.add("inline-nav-details");
  }
}

setupLanguageToggle();
setupSearch();
sortFamilies(); // 执行自动排序
setupCopyButtons();
enhanceDetailsNav();
