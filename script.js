/* Cityfied Capital Ltd - site interactions */
(function () {
  "use strict";

  /* ---------- Mobile navigation ---------- */
  var menuToggle = document.getElementById("menuToggle");
  var nav = document.getElementById("nav");

  menuToggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    menuToggle.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) {
      nav.classList.remove("open");
      menuToggle.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("click", function (e) {
    if (nav.classList.contains("open") &&
        !e.target.closest(".nav") &&
        !e.target.closest(".menu-toggle")) {
      nav.classList.remove("open");
      menuToggle.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- Header shadow on scroll ---------- */
  var header = document.getElementById("header");
  var onScroll = function () {
    header.classList.toggle("scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Hero image slider ---------- */
  var slider = document.getElementById("heroSlider");
  var slides = slider.querySelectorAll(".slide");
  var dotsWrap = document.getElementById("sliderDots");
  var current = 0;
  var timer = null;
  var INTERVAL = 6000;

  slides.forEach(function (_, i) {
    var dot = document.createElement("button");
    dot.setAttribute("aria-label", "Show image " + (i + 1));
    dot.addEventListener("click", function () { goTo(i); restart(); });
    dotsWrap.appendChild(dot);
  });
  var dots = dotsWrap.querySelectorAll("button");

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach(function (s, i) {
      s.classList.toggle("is-active", i === current);
    });
    dots.forEach(function (d, i) {
      d.classList.toggle("is-active", i === current);
    });
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(function () { goTo(current + 1); }, INTERVAL);
  }

  document.getElementById("slidePrev").addEventListener("click", function () {
    goTo(current - 1); restart();
  });
  document.getElementById("slideNext").addEventListener("click", function () {
    goTo(current + 1); restart();
  });

  slider.addEventListener("mouseenter", function () { clearInterval(timer); });
  slider.addEventListener("mouseleave", restart);

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  goTo(0);
  if (!reducedMotion) restart();

  /* ---------- Repayment calculator ---------- */
  var amount = document.getElementById("calcAmount");
  var period = document.getElementById("calcWeeks");
  var amountOut = document.getElementById("calcAmountOut");
  var periodOut = document.getElementById("calcPeriodOut");
  var instOut = document.getElementById("calcWeekly");
  var instLabel = document.getElementById("calcInstalmentLabel");
  var calcTitle = document.getElementById("calcTitle");
  var totalOut = document.getElementById("calcTotal");
  var freqWeekly = document.getElementById("freqWeekly");
  var freqMonthly = document.getElementById("freqMonthly");
  var mode = "weekly";
  var INTEREST = 0.15; // 15% charged upfront on the principal

  var fmt = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0
  });

  function setMode(next) {
    mode = next;
    var weekly = mode === "weekly";
    freqWeekly.classList.toggle("is-active", weekly);
    freqMonthly.classList.toggle("is-active", !weekly);
    freqWeekly.setAttribute("aria-pressed", weekly ? "true" : "false");
    freqMonthly.setAttribute("aria-pressed", weekly ? "false" : "true");
    calcTitle.textContent = weekly
      ? "Estimate your weekly instalment"
      : "Estimate your monthly instalment";
    if (weekly) {
      period.min = 4; period.max = 12; period.value = 4;
    } else {
      period.min = 1; period.max = 3; period.value = 1;
    }
    updateCalc();
  }

  function updateCalc() {
    var p = +amount.value;
    var total = p * (1 + INTEREST);      // interest charged upfront on principal
    var n = +period.value;
    var inst = total / n;

    if (mode === "weekly") {
      periodOut.textContent = n + " weeks";
      instLabel.textContent = "Estimated weekly instalment";
    } else {
      periodOut.textContent = n + (n === 1 ? " month" : " months");
      instLabel.textContent = "Estimated monthly instalment";
    }

    amountOut.textContent = fmt.format(p);
    instOut.textContent = fmt.format(inst);
    totalOut.textContent = "Total repayable: " + fmt.format(total);
  }

  freqWeekly.addEventListener("click", function () { setMode("weekly"); });
  freqMonthly.addEventListener("click", function () { setMode("monthly"); });
  [amount, period].forEach(function (el) {
    el.addEventListener("input", updateCalc);
  });
  updateCalc();


  /* ---------- FAQ: keep only one open ---------- */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) {
        faqItems.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var revealTargets = document.querySelectorAll(
    ".strip-item, .feature, .split, .process-step, .branch, " +
    ".careers-inner, .faq-item, .contact-card, .map-wrap, .calc"
  );
  revealTargets.forEach(function (el) { el.classList.add("reveal"); });

  if ("IntersectionObserver" in window && !reducedMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
