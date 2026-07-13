(function () {
  if (window.__vwGolfCookiesLoaded) {
    return;
  }
  window.__vwGolfCookiesLoaded = true;

  function isCookieSet() {
    return document.cookie.includes("cookieBy=codinglab");
  }

  function isCookieDeclined() {
    return document.cookie.includes("cookieDeclined=true");
  }

  function setCookie() {
    document.cookie = "cookieBy=codinglab; max-age=" + 60 * 60 * 24 * 30 + "; path=/";
  }

  function setDeclineCookie() {
    document.cookie = "cookieDeclined=true; max-age=" + 60 * 60 * 24 * 30 + "; path=/";
  }

  function showCookieBox(cookieBox) {
    cookieBox.classList.add("show");
    cookieBox.style.display = "block";
  }

  function hideCookieBox(cookieBox) {
    cookieBox.classList.remove("show");
    cookieBox.style.display = "none";
  }

  function executeCookiesLogic() {
    var cookieBox = document.getElementById("cookiesBox");
    var acceptBtn = document.getElementById("acceptBtn");
    var declineBtn = document.getElementById("declineBtn");

    if (!cookieBox || !acceptBtn || !declineBtn) {
      return;
    }

    if (isCookieSet() || isCookieDeclined()) {
      hideCookieBox(cookieBox);
      return;
    }

    showCookieBox(cookieBox);

    acceptBtn.addEventListener("click", function () {
      setCookie();
      hideCookieBox(cookieBox);
    });

    declineBtn.addEventListener("click", function () {
      setDeclineCookie();
      hideCookieBox(cookieBox);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", executeCookiesLogic);
  } else {
    executeCookiesLogic();
  }
})();
