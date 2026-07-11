(function () {
  var fragments = [];

  if (!document.getElementById("account-modal")) {
    fragments.push(
      '<div class="account-modal" id="account-modal">' +
        '<div class="account-window">' +
          '<div class="account-header">' +
            '<div class="space"></div>' +
            '<div class="title">' +
              '<div class="title1"><i class="fa fa-user-circle"></i></div>' +
              '<div class="title2"><a>My account</a></div>' +
            '</div>' +
            '<div class="close"><i class="fa fa-close" id="account-close"></i></div>' +
          '</div>' +
          '<div class="account-content">' +
            '<div class="account-cart"><a href="cart.html" id="account-cart-link">Cart</a></div>' +
            '<div class="account-login" id="account-login-button">Login with Google</div>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  if (!document.getElementById("auth-modal")) {
    fragments.push(
      '<div class="auth-modal" id="auth-modal">' +
        '<div class="auth-window">' +
          '<div class="auth-header">' +
            '<div class="space"></div>' +
            '<div class="title">' +
              '<div class="title1"><i class="fa fa-user"></i></div>' +
              '<div class="title2"><a>Login or create account</a></div>' +
            '</div>' +
            '<div class="close"><i class="fa fa-close" id="auth-close"></i></div>' +
          '</div>' +
          '<div class="auth-content">' +
            '<img src="google icon.png" alt="Google" id="google-auth-button" role="button" tabindex="0">' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  if (!document.getElementById("cookiesBox")) {
    fragments.push(
      '<div class="cookies-box" id="cookiesBox">' +
        '<div class="cookies-title">' +
          '<i class="bx bx-cookie"></i>' +
          '<h1>Cookies (sugar free)</h1>' +
        '</div>' +
        '<div class="text">' +
          '<h2>Would you please accept some cookies?</h2><a href="cookies.html">Read more...</a>' +
        '</div>' +
        '<div class="buttons">' +
          '<button class="button" id="acceptBtn">Accept</button>' +
          '<button class="button" id="declineBtn">Decline</button>' +
        '</div>' +
      '</div>'
    );
  }

  if (fragments.length > 0) {
    document.body.insertAdjacentHTML("beforeend", fragments.join(""));
  }
})();
