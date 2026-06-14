const progressFill = document.querySelector(".progress-bar span");
const navLinks = [...document.querySelectorAll(".room-nav a")];
const sections = [...document.querySelectorAll(".gallery-room")];
const revealItems = [...document.querySelectorAll(".reveal")];
const presentToggle = document.querySelector(".present-toggle");

const updateProgress = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const percent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
  progressFill.style.width = `${Math.min(100, Math.max(0, percent))}%`;
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const roomObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navLinks.forEach((link) => {
      link.classList.toggle(
        "is-active",
        link.getAttribute("href") === `#${visible.target.id}`
      );
    });
  },
  {
    rootMargin: "-28% 0px -58% 0px",
    threshold: [0.08, 0.18, 0.32, 0.5],
  }
);

sections.forEach((section) => roomObserver.observe(section));

presentToggle.addEventListener("click", () => {
  const isPresenting = document.body.classList.toggle("presentation-mode");
  presentToggle.setAttribute("aria-pressed", String(isPresenting));
  presentToggle.textContent = isPresenting ? "Exit" : "Present";
});

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();
