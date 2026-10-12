const pickupDate = document.querySelector("#pickup-date");
const requestType = document.querySelector("#request-type");
const contactForm = pickupDate.form;

function validatePickupDate() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isPreOrder = requestType.value === "pre-order";
  pickupDate.required = isPreOrder;
  pickupDate.setCustomValidity("");

  if (isPreOrder && pickupDate.value && new Date(pickupDate.value + "T00:00:00") <= today) {
    pickupDate.setCustomValidity("Please choose a pickup date of tomorrow or later.");
  }
}

pickupDate.addEventListener("input", validatePickupDate);
requestType.addEventListener("change", validatePickupDate);
window.addEventListener("pageshow", validatePickupDate);
contactForm.addEventListener("submit", event => {
  validatePickupDate();
  if (!contactForm.reportValidity()) event.preventDefault();
});
validatePickupDate();
