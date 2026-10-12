const contactForm = document.querySelector("form");
const pickupDate = document.querySelector("#pickup-date");
const requestType = document.querySelector("#request-type");
const fields = [...contactForm.querySelectorAll("input, select, textarea")];
const draftKey = "north-star-contact-draft";
let submitted = false;

try {
  const draft = JSON.parse(localStorage.getItem(draftKey) || "{}");
  fields.forEach(field => {
    if (draft && typeof draft[field.id] === "string") field.value = draft[field.id];
  });
} catch {
  // Keep the form usable if storage is unavailable or the draft is unreadable.
}

function saveDraft() {
  const draft = {};
  fields.forEach(field => { draft[field.id] = field.value; });
  try {
    localStorage.setItem(draftKey, JSON.stringify(draft));
  } catch {
    // Validation still works when the browser cannot save the draft.
  }
}

// JavaScript shows all errors together; HTML validation remains a fallback.
contactForm.noValidate = true;
fields.forEach(field => {
  const error = document.createElement("span");
  error.id = field.id + "-error";
  error.className = "field-error";
  error.setAttribute("aria-live", "polite");
  field.setAttribute("aria-describedby", error.id);
  field.after(error);
});

function showError(field, message) {
  document.getElementById(field.id + "-error").textContent = message;
  field.setAttribute("aria-invalid", String(Boolean(message)));
  return !message;
}

function validateName(field) {
  const value = field.value.trim();
  const message = !value ? "Please enter your name."
    : value.length < field.minLength ? "Please enter at least 2 characters." : "";
  return showError(field, message);
}

function validateEmail(field) {
  const message = !field.value.trim() ? "Please enter your email address."
    : field.validity.typeMismatch ? "Please enter a valid email address." : "";
  return showError(field, message);
}

function validatePickupDate(field) {
  let message = "";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (field.validity.badInput) {
    message = "Please enter a valid pickup date.";
  } else if (requestType.value === "pre-order") {
    if (!field.value) message = "Please choose a pickup date.";
    else if (new Date(field.value + "T00:00:00") <= today) {
      message = "Please choose a pickup date of tomorrow or later.";
    }
  }
  return showError(field, message);
}

function validateRequestType(field) {
  return showError(field, field.value ? "" : "Please choose a request type.");
}

function validateItemDetails(field) {
  const value = field.value.trim();
  const message = !value ? "Please enter your item details."
    : value.length < field.minLength ? "Please enter at least 10 characters." : "";
  return showError(field, message);
}

const validators = {
  "name": validateName,
  "email": validateEmail,
  "pickup-date": validatePickupDate,
  "request-type": validateRequestType,
  "item-details": validateItemDetails
};

function updatePickupRequired() {
  pickupDate.required = requestType.value === "pre-order";
}

fields.forEach(field => {
  field.addEventListener("input", () => {
    saveDraft();
    updatePickupRequired();
    if (submitted) {
      if (validators[field.id]) validators[field.id](field);
      if (field === requestType) validatePickupDate(pickupDate);
    }
  });
  field.addEventListener("change", saveDraft);
});
requestType.addEventListener("change", () => {
  updatePickupRequired();
  if (submitted) {
    validateRequestType(requestType);
    validatePickupDate(pickupDate);
  }
});
window.addEventListener("pageshow", updatePickupRequired);
updatePickupRequired();

contactForm.addEventListener("submit", event => {
  submitted = true;
  updatePickupRequired();
  const invalidFields = fields.filter(field => validators[field.id] && !validators[field.id](field));
  if (invalidFields.length) {
    event.preventDefault();
    saveDraft();
    invalidFields[0].focus();
  } else {
    event.preventDefault();
    try {
      localStorage.removeItem(draftKey);
    } catch {
      // Allow confirmation even if storage is unavailable.
    }
    contactForm.reset();
    submitted = false;
    updatePickupRequired();
    window.alert("Your request is received");
  }
});
