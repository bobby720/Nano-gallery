// ================= RENDER PROMPTS FROM DATA =================
function createPromptCard(prompt) {
  const card = document.createElement("div");
  card.className = "prompt-card";
  card.dataset.category = prompt.category;

  card.innerHTML = `
    <img src="${prompt.image}" alt="${prompt.title}">
    <div class="prompt-info">
      <h3>${prompt.title}</h3>
      <p class="prompt-text">${prompt.text}</p>
      <div class="buttons">
        <button class="copy">
          <span class="copy-text">COPY</span>
          <span class="copy-icon">📋</span>
        </button>
        <a href="${prompt.generateUrl}" target="_blank">
          <button class="gen">GENERATE</button>
        </a>
      </div>
    </div>
  `;

  return card;
}

function attachCopyHandlers() {
  document.querySelectorAll(".copy").forEach(button => {
    button.addEventListener("click", () => {
      const card = button.closest(".prompt-card");
      const text = card.querySelector(".prompt-text").innerText;

      navigator.clipboard.writeText(text)
        .then(() => {
          const textSpan = button.querySelector(".copy-text");
          const icon = button.querySelector(".copy-icon");

          button.classList.add("copied");
          textSpan.innerText = "COPIED!";
          icon.innerText = "✅";

          setTimeout(() => {
            button.classList.remove("copied");
            textSpan.innerText = "COPY";
            icon.innerText = "📋";
          }, 2000);
        })
        .catch(() => {
          alert("Copy failed");
        });
    });
  });
}

function renderPrompts() {
  const promptGrid = document.getElementById("promptGrid");
  const noResults = document.getElementById("noResults");
  const promptSource = typeof promptData !== "undefined" ? promptData : (window.promptData || []);

  if (!promptGrid || !promptSource.length) return;

  const currentPage = window.location.pathname.includes("page2") ? 2 : window.location.pathname.includes("page3") ? 3 : 1;
  const pagePrompts = promptSource.filter(prompt => prompt.page === currentPage);

  promptGrid.innerHTML = "";

  pagePrompts.forEach(prompt => {
    promptGrid.appendChild(createPromptCard(prompt));
  });

  attachCopyHandlers();
  updateDisplay();

  if (noResults) {
    noResults.style.display = pagePrompts.length === 0 ? "block" : "none";
  }
}

// ================= SELECT ELEMENTS =================
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".cat-card");
const noResults = document.getElementById("noResults");

let currentFilter = "all";

// ================= MAIN DISPLAY FUNCTION =================
function updateDisplay() {
  const value = searchInput ? searchInput.value.toLowerCase() : "";
  const cards = document.querySelectorAll(".prompt-card");
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

    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    updateDisplay();
  });
});

// Render after DOM is ready
window.addEventListener("DOMContentLoaded", renderPrompts);