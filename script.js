const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const revealItems = document.querySelectorAll(".reveal");
const progressBar = document.querySelector(".scroll-progress");

revealItems.forEach((item, index) => {
  item.style.setProperty("--reveal-delay", `${Math.min(index * 70, 560)}ms`);
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

revealItems.forEach((item) => observer.observe(item));

const updateProgress = () => {
  if (!progressBar) return;

  const scrollTop = window.scrollY;
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? scrollTop / scrollableHeight : 0;

  progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
};

window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

// Rastreamento automático de cliques do Google Analytics via Event Delegation
document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-ga-event]");
  if (!target) return;

  const eventName = target.getAttribute("data-ga-event");
  const eventParams = {};

  // Coleta parâmetros dinâmicos (data-ga-*)
  for (const attr of target.attributes) {
    if (attr.name.startsWith("data-ga-") && attr.name !== "data-ga-event") {
      const paramName = attr.name.slice(8).replace(/-/g, "_");
      eventParams[paramName] = attr.value;
    }
  }

  if (typeof gtag === "function") {
    gtag("event", eventName, eventParams);
  }
});

// Controle do Banner de Consentimento de Cookies (LGPD)
const cookieBanner = document.getElementById("cookie-consent");
const cookieAcceptBtn = document.getElementById("cookie-accept");
const cookieDeclineBtn = document.getElementById("cookie-decline");

if (cookieBanner && cookieAcceptBtn && cookieDeclineBtn) {
  const consent = localStorage.getItem("cookie-consent");

  // Exibe o banner se o usuário ainda não tiver tomado uma decisão
  if (!consent) {
    setTimeout(() => {
      cookieBanner.classList.remove("cookie-banner-hidden");
    }, 1000);
  }

  cookieAcceptBtn.addEventListener("click", () => {
    localStorage.setItem("cookie-consent", "accepted");
    cookieBanner.classList.add("cookie-banner-hidden");

    if (typeof gtag === "function") {
      gtag("consent", "update", {
        "ad_storage": "granted",
        "analytics_storage": "granted"
      });
      gtag("event", "cookie_consent_accepted", {
        event_category: "privacy",
        event_label: "Cookie Consent Accepted"
      });
    }
  });

  cookieDeclineBtn.addEventListener("click", () => {
    localStorage.setItem("cookie-consent", "rejected");
    cookieBanner.classList.add("cookie-banner-hidden");

    if (typeof gtag === "function") {
      gtag("consent", "update", {
        "ad_storage": "denied",
        "analytics_storage": "denied"
      });
    }
  });
}
// Accordion do FAQ - Garante que apenas uma pergunta fique aberta por vez
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((currentItem) => {
  currentItem.addEventListener("toggle", () => {
    if (currentItem.open) {
      faqItems.forEach((item) => {
        if (item !== currentItem && item.open) {
          item.removeAttribute("open");
        }
      });
    }
  });
});

