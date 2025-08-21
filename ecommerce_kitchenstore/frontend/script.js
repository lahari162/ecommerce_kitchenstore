// Cart Toggle & Logic
document.addEventListener("DOMContentLoaded", () => {
  const cartToggle = document.getElementById("cart-toggle");
  const cartPanel = document.getElementById("cart-panel");
  const closeCart = document.getElementById("close-cart");
  const clearCartBtn = document.getElementById("clear-cart");
  const cartCount = document.getElementById("cart-count");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");
  const checkoutForm = document.getElementById("checkout-form");
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("nav ul li a");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 80;
      if (pageYOffset >= sectionTop) {
        current = section.getAttribute("id");
      }
    });
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").includes(current)) {
        link.classList.add("active");
      }
    });
  });

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function updateCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.name} - $${item.price.toFixed(2)}`;
      cartItemsContainer.appendChild(li);
      total += item.price;
    });

    cartTotalElement.textContent = total.toFixed(2);
    cartCount.textContent = cart.length;
    cartCount.style.display = cart.length > 0 ? "inline-block" : "none";
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function clearCart() {
    cart = [];
    updateCart();
  }

  const buttons = document.querySelectorAll(".add-to-cart");
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const name = button.getAttribute("data-name");
      const price = parseFloat(button.getAttribute("data-price"));
      cart.push({ name, price });
      updateCart();
    });
  });

  cartToggle?.addEventListener("click", () => {
    cartPanel.classList.add("open");
  });

  closeCart?.addEventListener("click", () => {
    cartPanel.classList.remove("open");
  });

  clearCartBtn?.addEventListener("click", clearCart);

  // ✅ Checkout Form Logic
  checkoutForm?.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const paymentMethod = document.getElementById("payment-method")?.value;
    const address = document.getElementById("Address")?.value.trim();

    if (!name || !email || !paymentMethod || !address) {
      alert("Please fill in all fields.");
      return;
    }

    localStorage.setItem("deliveryAddress", address);

    // 🟢 Store order history
    const orders = JSON.parse(localStorage.getItem("orderHistory")) || [];
    let total = cart.reduce((sum, item) => sum + item.price, 0);
    orders.push({
      items: cart,
      total: total.toFixed(2),
      address: address,
      payment: paymentMethod,
      date: new Date().toLocaleString()
    });
    localStorage.setItem("orderHistory", JSON.stringify(orders));

    // ✅ Redirect
    const redirectURL = `thankyou.html?name=${encodeURIComponent(name)}&method=${encodeURIComponent(paymentMethod)}`;
    window.location.href = redirectURL;

    // Optional cleanup
    //cart = [];
    //updateCart();
  });

  updateCart();

  // ✅ LOGIN / SIGNUP LOGIC FOR login.html
  const formTitle = document.getElementById("form-title");
  const toggleLink = document.getElementById("toggle-link");
  const toggleText = document.getElementById("toggle-text");
  const authForm = document.getElementById("auth-form");
  const nameGroup = document.getElementById("name-group");
  const confirmGroup = document.getElementById("confirm-group");

  let isSignup = false;

  if (toggleLink && authForm) {
    toggleLink.addEventListener("click", (e) => {
      e.preventDefault();
      isSignup = !isSignup;

      if (isSignup) {
        formTitle.textContent = "Sign Up";
        toggleLink.textContent = "Login";
        toggleText.firstChild.textContent = "Already have an account? ";
        nameGroup.style.display = "block";
        confirmGroup.style.display = "block";
      } else {
        formTitle.textContent = "Login";
        toggleLink.textContent = "Sign up";
        toggleText.firstChild.textContent = "Don’t have an account? ";
        nameGroup.style.display = "none";
        confirmGroup.style.display = "none";
      }
    });

    authForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      if (isSignup) {
        const name = document.getElementById("signup-name").value.trim();
        const confirmPassword = document.getElementById("confirm-password").value;

        if (!name || !email || !password || !confirmPassword) {
          alert("Please fill in all fields.");
          return;
        }

        if (password !== confirmPassword) {
          alert("Passwords do not match!");
          return;
        }

        localStorage.setItem("user", JSON.stringify({ name, email, password }));
        alert("Account created! Please log in.");
        toggleLink.click(); // Switch to login
      } else {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser && storedUser.email === email && storedUser.password === password) {
          alert(`Welcome back, ${storedUser.name}!`);
          localStorage.setItem("isLoggedIn", "true");
          window.location.href = "profile.html";
        } else {
          alert("Invalid credentials!");
        }
      }
    });
  }
});
