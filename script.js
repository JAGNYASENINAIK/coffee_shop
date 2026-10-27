
document.addEventListener("DOMContentLoaded", () => {
  // Mobile navigation
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");

  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    });
  });

  // Menu category filtering
  const filterButtons = document.querySelectorAll(".filter-btn");
  const products = document.querySelectorAll(".menu-card");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(btn => {
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
      });

      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      const selectedCategory = button.dataset.filter;

      products.forEach(product => {
        const matches =
          selectedCategory === "all" ||
          product.dataset.category === selectedCategory;

        product.hidden = !matches;
      });
    });
  });

  // Shopping cart
  let cartCount = 0;
  let cartTotal = 0;

  const countDisplay = document.getElementById("cartCount");
  const totalDisplay = document.getElementById("cartTotal");
  const clearCartButton = document.getElementById("clearCart");

  function updateCart() {
    countDisplay.textContent = cartCount;
    totalDisplay.textContent =
      "₹" + cartTotal.toLocaleString("en-IN");
  }

  document.querySelectorAll(".add-cart").forEach(button => {
    button.addEventListener("click", () => {
      const product = button.closest(".menu-card");
      const price = Number(product.dataset.price);

      if (!Number.isFinite(price) || price < 0) {
        return;
      }

      cartCount++;
      cartTotal += price;
      updateCart();

      const originalText = button.textContent;
      button.textContent = "Added ✓";
      button.disabled = true;

      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 700);
    });
  });

  clearCartButton.addEventListener("click", () => {
    cartCount = 0;
    cartTotal = 0;
    updateCart();
  });

  // Contact form validation
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  const fields = [
    {
      input: document.getElementById("name"),
      error: document.getElementById("nameError"),
      validate: value => value.trim().length >= 2,
      message: "Please enter a name with at least 2 characters."
    },
    {
      input: document.getElementById("email"),
      error: document.getElementById("emailError"),
      validate: value =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
      message: "Please enter a valid email address."
    },
    {
      input: document.getElementById("message"),
      error: document.getElementById("messageError"),
      validate: value => value.trim().length >= 10,
      message: "Your message must contain at least 10 characters."
    }
  ];

  fields.forEach(field => {
    field.input.addEventListener("input", () => {
      field.error.textContent = "";
      field.input.removeAttribute("aria-invalid");
      formStatus.textContent = "";
      formStatus.className = "form-status";
    });
  });

  contactForm.addEventListener("submit", event => {
    event.preventDefault();

    let isValid = true;
    let firstInvalidField = null;

    fields.forEach(field => {
      const valid = field.validate(field.input.value);

      field.error.textContent = valid ? "" : field.message;

      if (valid) {
        field.input.removeAttribute("aria-invalid");
      } else {
        field.input.setAttribute("aria-invalid", "true");
        isValid = false;

        if (!firstInvalidField) {
          firstInvalidField = field.input;
        }
      }
    });

    if (!isValid) {
      formStatus.textContent = "Please correct the highlighted fields.";
      formStatus.className = "form-status failure";
      firstInvalidField.focus();
      return;
    }

    formStatus.textContent =
      "Validation successful! This demo does not send messages.";
    formStatus.className = "form-status success";
  });

  // Automatically update the footer year
  document.getElementById("year").textContent =
    new Date().getFullYear();

  updateCart();
});
