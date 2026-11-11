/* =========================================================
   CAFÉ MORI — Script
   - ヘッダーのスクロール時スタイル
   - ハンバーガーメニュー（スマホ）
   - スムーススクロール（固定ヘッダー分のオフセット込み）
   - スクロールに応じたナビのアクティブ表示
   - セクションのフェードイン
   - メニュータブの切り替え
   - ページ上部へ戻るボタン
   ========================================================= */

(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  const menuToggle = document.getElementById("menu-toggle");
  const globalNav = document.getElementById("global-nav");
  const backToTop = document.getElementById("back-to-top");
  const navLinks = document.querySelectorAll(".nav-link");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- ヘッダーの背景切り替え ---------- */
  function updateHeader() {
    const scrolled = window.scrollY > 40;
    header.classList.toggle("is-scrolled", scrolled);
    backToTop.classList.toggle("is-visible", window.scrollY > 600);
  }

  /* ---------- ハンバーガーメニュー ---------- */
  function setMenuOpen(open) {
    menuToggle.classList.toggle("is-open", open);
    globalNav.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
    document.body.style.overflow = open ? "hidden" : "";
  }

  menuToggle.addEventListener("click", function () {
    setMenuOpen(!globalNav.classList.contains("is-open"));
  });

  /* ---------- スムーススクロール ---------- */
  // CSS の scroll-behavior に加え、固定ヘッダーの高さを考慮して JS でも制御する
  function smoothScrollTo(targetId) {
    const target = document.querySelector(targetId);
    if (!target) return;

    const headerHeight = header.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight + 1;

    window.scrollTo({
      top: top,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      const href = link.getAttribute("href");
      if (href === "#" || href.length < 2) return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      setMenuOpen(false);
      smoothScrollTo(href);
      history.pushState(null, "", href);
    });
  });

  /* ---------- 現在位置のナビゲーション表示 ---------- */
  const sections = document.querySelectorAll("main section[id]");

  const navObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sections.forEach(function (section) {
    navObserver.observe(section);
  });

  /* ---------- スクロール時のフェードイン ---------- */
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- メニュータブの切り替え ---------- */
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".menu-panel");

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      const key = tab.dataset.tab;

      tabs.forEach(function (t) {
        const active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", String(active));
      });

      panels.forEach(function (panel) {
        panel.classList.toggle("is-active", panel.dataset.panel === key);
      });
    });
  });

  /* ---------- お問い合わせフォーム（バリデーション） ---------- */
  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 各フィールドのチェック。エラー文言を返す（問題なければ空文字）
    function validateName() {
      return nameInput.value.trim() === "" ? "お名前を入力してください。" : "";
    }

    function validateEmail() {
      const value = emailInput.value.trim();
      if (value === "") return "メールアドレスを入力してください。";
      if (!emailPattern.test(value)) return "メールアドレスの形式が正しくありません。";
      return "";
    }

    function validateMessage() {
      return messageInput.value.trim() === "" ? "お問い合わせ内容を入力してください。" : "";
    }

    const fields = [
      { input: nameInput, validate: validateName, error: document.getElementById("name-error") },
      { input: emailInput, validate: validateEmail, error: document.getElementById("email-error") },
      { input: messageInput, validate: validateMessage, error: document.getElementById("message-error") },
    ];

    function showError(field) {
      const message = field.validate();
      field.error.textContent = message;
      field.input.setAttribute("aria-invalid", String(message !== ""));
      field.input.closest(".form-field").classList.toggle("has-error", message !== "");
      return message === "";
    }

    // 入力中は、エラーが出ているフィールドだけ再チェックする
    fields.forEach(function (field) {
      field.input.addEventListener("input", function () {
        if (field.error.textContent !== "") {
          showError(field);
        }
      });
    });

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      let firstInvalid = null;
      fields.forEach(function (field) {
        const valid = showError(field);
        if (!valid && !firstInvalid) {
          firstInvalid = field.input;
        }
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      alert("送信しました");
      contactForm.reset();
    });
  }

  /* ---------- ページ上部へ戻るボタン ---------- */
  backToTop.addEventListener("click", function (event) {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  /* ---------- イベント登録 ---------- */
  let ticking = false;
  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          updateHeader();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  window.addEventListener("resize", function () {
    if (window.innerWidth > 720) {
      setMenuOpen(false);
    }
  });

  updateHeader();
})();
