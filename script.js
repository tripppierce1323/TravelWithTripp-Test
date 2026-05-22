// =============================
// PAGE LOADING
// =============================

const validPages = [
  "home.html",
  "wallet.html",
  "bonuses.html",
  "calculator.html",
  "tracker.html",
  "trips.html",
  "about.html"
];

function pageToHash(page) {
  return page.replace(".html", "");
}

function hashToPage(hash) {
  const cleanHash = (hash || "").replace("#", "");
  const page = cleanHash ? cleanHash + ".html" : "home.html";
  return validPages.includes(page) ? page : "home.html";
}

function setActiveMenu(page) {
  document.querySelectorAll("#menu a").forEach(function(link) {
    const action = link.getAttribute("onclick") || "";
    link.classList.toggle("active", action.includes(page));
  });
}

function initRevealAnimations() {
  const items = document.querySelectorAll(".animate-in");

  if (!("IntersectionObserver" in window)) {
    items.forEach(function(item) {
      item.classList.add("visible");
    });
    return;
  }

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(function(item) {
    observer.observe(item);
  });
}

function loadPage(page, updateHash = true) {

  fetch("pages/" + page)

    .then(function(res) {
      return res.text();
    })

    .then(function(data) {

      document.getElementById("content").innerHTML = data;

      if (updateHash) {
        const newHash = pageToHash(page);
        if (window.location.hash.replace("#", "") !== newHash) {
          history.pushState(null, "", "#" + newHash);
        }
      }

      setActiveMenu(page);
      initRevealAnimations();

      // =============================
      // LOAD PAGE-SPECIFIC SCRIPTS
      // =============================

      if (page === "calculator.html") {

        const oldScript =
          document.getElementById("calculatorScript");

        if (oldScript) {
          oldScript.remove();
        }

        const script =
          document.createElement("script");

        script.src =
          "pages/calculator-script.js?v=" + Date.now();

        script.id = "calculatorScript";

        document.body.appendChild(script);
      }

      if (page === "bonuses.html") {

        const oldScript =
          document.getElementById("bonusesScript");

        if (oldScript) {
          oldScript.remove();
        }

        const script =
          document.createElement("script");

        script.src =
          "pages/bonuses-script.js?v=" + Date.now();

        script.id = "bonusesScript";

        document.body.appendChild(script);
      }

      var menu =
        document.getElementById("menu");

      if (menu) {
        menu.classList.remove("open");
      }

      window.scrollTo({
        top: 0,
        behavior: "auto"
      });

    });
}


// =============================
// MOBILE MENU
// =============================

function toggleMenu() {

  var menu =
    document.getElementById("menu");

  if (menu) {
    menu.classList.toggle("open");
  }
}


// =============================
// LOAD CURRENT PAGE
// =============================

document.addEventListener(
  "DOMContentLoaded",
  function() {

    loadPage(hashToPage(window.location.hash), false);

  }
);

window.addEventListener("hashchange", function() {
  loadPage(hashToPage(window.location.hash), false);
});


// =============================
// GLOBAL EXPORTS
// =============================

window.loadPage =
  loadPage;

window.toggleMenu =
  toggleMenu;