/* --------------------------------------------------
   Small interactions for the portfolio website.
   No frameworks or external JavaScript libraries.
--------------------------------------------------- */

// Mobile navigation: open/close the menu and close it after a link is selected.
const menuToggle = document.querySelector("#menu-toggle");
const primaryNav = document.querySelector("#primary-nav");

if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    primaryNav.classList.toggle("is-open", !isOpen);
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      primaryNav.classList.remove("is-open");
    });
  });

  // Close the mobile menu when the Escape key is pressed.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      primaryNav.classList.remove("is-open");
      menuToggle.focus();
    }
  });
}

// Keep the footer year current automatically.
const yearElement = document.querySelector("#current-year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// Copy the contact email address. Use a fallback for browsers without Clipboard API access.
const copyEmailButton = document.querySelector("#copy-email");
const toast = document.querySelector("#toast");

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2400);
}

if (copyEmailButton) {
  copyEmailButton.addEventListener("click", async () => {
    const email = copyEmailButton.dataset.email;
    if (!email) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else {
        // Fallback for local previews or older browsers.
        const temporaryInput = document.createElement("textarea");
        temporaryInput.value = email;
        temporaryInput.setAttribute("readonly", "");
        temporaryInput.style.position = "absolute";
        temporaryInput.style.left = "-9999px";
        document.body.appendChild(temporaryInput);
        temporaryInput.select();
        const copied = document.execCommand("copy");
        temporaryInput.remove();
        if (!copied) throw new Error("Copy command was not successful");
      }
      showToast("Email address copied.");
    } catch (error) {
      showToast("Please copy: " + email);
    }
  });
}

// Reveal sections as they enter the viewport. Content remains visible if unsupported.
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
