const storageKey = "north-star-wishlist";
let wishlist = [];
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
  if (Array.isArray(saved)) wishlist = saved.filter(item => typeof item === "string");
} catch {
  // Start empty if the saved data cannot be read.
}

function saveWishlist() {
  localStorage.setItem(storageKey, JSON.stringify(wishlist));
}

document.querySelectorAll("[data-product]").forEach(button => {
  function updateButton() {
    button.disabled = wishlist.includes(button.dataset.product);
    button.textContent = button.disabled ? "In wishlist" : "Add to wishlist";
  }
  button.addEventListener("click", () => {
    wishlist.push(button.dataset.product);
    saveWishlist();
    updateButton();
  });
  updateButton();
});

const list = document.querySelector("#wishlist");
function renderWishlist() {
  list.replaceChildren();
  document.querySelector("#wishlist-empty").hidden = wishlist.length > 0;
  wishlist.forEach(name => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    item.textContent = name + " ";
    button.type = "button";
    button.textContent = "Remove";
    button.setAttribute("aria-label", "Remove " + name + " from wishlist");
    button.addEventListener("click", () => {
      wishlist = wishlist.filter(product => product !== name);
      saveWishlist();
      renderWishlist();
    });
    item.append(button);
    list.append(item);
  });
}
if (list) renderWishlist();
