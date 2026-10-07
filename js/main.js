(function () {
  if (window.__nanoGalleryInit) return;
  window.__nanoGalleryInit = true;

// ================= COPY BUTTON =================
const CHECK_ICON =
  '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';

function fallbackCopy(text) {
  return new Promise((resolve, reject) => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy") ? resolve() : reject();
    } catch (e) {
      reject(e);
    } finally {
      document.body.removeChild(ta);
    }
  });
}

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
  }
  return fallbackCopy(text);
}

document.querySelectorAll(".copy").forEach(button => {
  const textSpan = button.querySelector(".copy-text");
  const icon = button.querySelector(".copy-icon");
  const originalIcon = icon.innerHTML;
  let resetTimer;

  button.addEventListener("click", () => {
    const card = button.closest(".prompt-card");
    const text = card.querySelector(".prompt-text").innerText;

    copyToClipboard(text)
      .then(() => {
        button.classList.add("copied");
        textSpan.innerText = "COPIED!";
        icon.innerHTML = CHECK_ICON;

        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
          button.classList.remove("copied");
          textSpan.innerText = "COPY";
          icon.innerHTML = originalIcon;
        }, 2000);
      })
      .catch(() => {
        alert("Copy failed");
      });
  });
});


// ================= SELECT ELEMENTS =================
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".cat-card");
const cards = document.querySelectorAll(".prompt-card");
const noResults = document.getElementById("noResults");

let currentFilter = "all";


// ================= MAIN DISPLAY FUNCTION =================
function updateDisplay() {
  const value = searchInput.value.toLowerCase();
  let visibleCount = 0;

  cards.forEach(card => {
    const title = card.querySelector("h3").innerText.toLowerCase();
    const text = card.querySelector(".prompt-text").innerText.toLowerCase();
    const category = card.dataset.category;

    const matchesSearch = title.includes(value) || text.includes(value);
    const matchesFilter = currentFilter === "all" || category === currentFilter;

    if (matchesSearch && matchesFilter) {
      card.style.display = "";
      visibleCount++;
    } else {
      card.style.display = "none";
    }
  });

  // Show / Hide "No Results"
  if (noResults) {
    noResults.style.display = visibleCount === 0 ? "block" : "none";
  }
}


// ================= SEARCH =================
if (searchInput) {
  searchInput.addEventListener("input", updateDisplay);
}


// ================= FILTER =================
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {

    currentFilter = btn.dataset.filter;

    // Active button UI
    filterButtons.forEach(b => {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-pressed", "true");

    updateDisplay();
  });
});


// ================= SIDEBAR ACTIVE SECTION =================
const sideItems = document.querySelectorAll('.side-item[href^="#"]');
const sectionMap = [];

sideItems.forEach(item => {
  const target = document.querySelector(item.getAttribute("href"));
  if (target) sectionMap.push({ item, target });
});

function setActiveSide() {
  const offset = window.scrollY + 140;
  let current = sectionMap[0];

  sectionMap.forEach(entry => {
    if (entry.target.offsetTop <= offset) current = entry;
  });

  // "About" lives in the footer; highlight it when the page bottom is reached
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
    current = sectionMap[sectionMap.length - 1];
  }

  sideItems.forEach(i => i.classList.remove("active"));
  if (current) current.item.classList.add("active");
}

if (sectionMap.length) {
  window.addEventListener("scroll", setActiveSide, { passive: true });
  setActiveSide();
}

})();
