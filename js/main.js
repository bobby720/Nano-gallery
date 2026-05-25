// ================= COPY BUTTON =================
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
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    updateDisplay();
  });
});