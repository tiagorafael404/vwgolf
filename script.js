// Seleciona elementos
const cookieBox = document.getElementById('cookiesBox');
const acceptBtn = document.getElementById('acceptBtn');
const declineBtn = document.getElementById('declineBtn');

// Função para verificar se o cookie de consentimento já foi definido
const isCookieSet = () => document.cookie.includes("cookieBy=codinglab");

// Função para verificar se o cookie de recusa já foi definido
const isCookieDeclined = () => document.cookie.includes("cookieDeclined=true");

// Função para configurar o cookie de aceitação
const setCookie = () => {
  document.cookie = "cookieBy=codinglab; max-age=" + 60 * 60 * 24 * 30 + "; path=/"; // 30 dias
};

// Função para configurar o cookie de recusa
const setDeclineCookie = () => {
  document.cookie = "cookieDeclined=true; max-age=" + 60 * 60 * 24 * 30 + "; path=/"; // 30 dias
};

// Função para exibir a caixa de cookies
const showCookieBox = () => {
  cookieBox.classList.add("show");
  cookieBox.style.display = "block";
};

// Função para esconder a caixa de cookies
const hideCookieBox = () => {
  cookieBox.classList.remove("show");
  cookieBox.style.display = "none";
};

// Função para executar a lógica dos cookies
const executeCookiesLogic = () => {
  // Se o cookie de consentimento ou recusa já estiver configurado, não exibe a caixa de cookies
  if (isCookieSet() || isCookieDeclined()) return;

  // Exibe a caixa de cookies
  showCookieBox();

  // Adiciona o evento para o botão "Aceitar"
  acceptBtn.addEventListener("click", () => {
    setCookie(); // Configura o cookie de aceitação
    hideCookieBox(); // Esconde a caixa de cookies
  });

  // Adiciona o evento para o botão "Recusar"
  declineBtn.addEventListener("click", () => {
    setDeclineCookie(); // Configura o cookie de recusa
    hideCookieBox(); // Esconde a caixa de cookies
  });
};

// Variável global para o item carregado na página
let currentDetailItem = null;
const authVisualStateKey = 'loggedIn';
let firebaseAuthInstance = null;
let currentAuthUser = null;

function setAccountNavLabel(loggedIn) {
  document.querySelectorAll('.nav-login a, .navbar-phone .nav3 .name a').forEach(function(link) {
    link.textContent = loggedIn ? 'Account' : 'Sign in';
  });
}

function updateAccountActionButton(loggedIn) {
  const accountLoginButton = document.getElementById('account-login-button');
  if (!accountLoginButton) {
    return;
  }

  accountLoginButton.textContent = loggedIn ? 'Logout' : 'Login with Google';
}

function updateAccountCartVisibility(loggedIn) {
  document.querySelectorAll('.account-cart').forEach(function(cart) {
    cart.style.display = loggedIn ? 'flex' : 'none';
  });
}

function applyStoredAuthUiState() {
  const loggedIn = localStorage.getItem(authVisualStateKey) === 'true';

  setAccountNavLabel(loggedIn);
  updateAccountActionButton(loggedIn);
  updateAccountCartVisibility(loggedIn);

  document.querySelectorAll('.nav-login').forEach(function(button) {
    button.style.display = 'block';
  });

  document.querySelectorAll('.nav-logout').forEach(function(button) {
    button.style.display = 'none';
  });
}

// Executa a lógica dos cookies
executeCookiesLogic();

window.addEventListener('DOMContentLoaded', applyStoredAuthUiState);




document.addEventListener("DOMContentLoaded", function() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const main_photo = document.getElementById('main_photo');

  galleryItems.forEach(item => {
      item.addEventListener('click', function() {
          let newImage = item.getAttribute('photo');
          if (currentDetailItem) {
        if (item.id === 'photo1' && currentDetailItem.image) {
          newImage = currentDetailItem.image;
        } else if (item.id === 'photo2' && currentDetailItem.image2) {
          newImage = currentDetailItem.image2;
        } else if (item.id === 'photo3' && currentDetailItem.image3) {
          newImage = currentDetailItem.image3;
        } else if (item.id === 'photo4' && currentDetailItem.image4) {
          newImage = currentDetailItem.image4;
        } else if (item.id === 'photo5' && currentDetailItem.image5) {
          newImage = currentDetailItem.image5;
        } else if (item.id === 'photo6' && currentDetailItem.image6) {
          newImage = currentDetailItem.image6;
        }
          }
          if (main_photo && newImage) {
              const normalizedImage = new URL(newImage, getItemsJsonUrl()).href;
              main_photo.style.backgroundImage = `url('${normalizedImage}')`;
          }
      });
  });
});


function toggleMobileMenuContent() {
  var divmenu = document.getElementById("menu");
  if (!divmenu) {
    return;
  }

  var contentWrapper = divmenu.closest(".content");
  var isOpen = divmenu.style.display === "block";

  if (contentWrapper) {
    contentWrapper.style.display = isOpen ? "none" : "block";
  }

  divmenu.style.display = isOpen ? "none" : "block";
}

var desktopMoreButton = document.getElementById("more");
if (desktopMoreButton) {
  desktopMoreButton.addEventListener("click", toggleMobileMenuContent);
}

var phoneMoreButton = document.querySelector(".navbar-phone .more");
if (phoneMoreButton) {
  phoneMoreButton.addEventListener("click", toggleMobileMenuContent);
}

var phoneNav1Button = document.querySelector(".navbar-phone .nav1");
if (phoneNav1Button) {
  phoneNav1Button.addEventListener("click", function(event) {
    event.preventDefault();
    toggleMobileMenuContent();
  });
}

var phoneNav3Button = document.querySelector(".navbar-phone .nav3");
if (phoneNav3Button) {
  phoneNav3Button.addEventListener("click", function(event) {
    event.preventDefault();
    openLoginEntryModal();
  });
}

document.addEventListener("DOMContentLoaded", () => {
    const divsFodass = document.querySelectorAll(".menubutton"); // Seleciona todas as divs com a classe 'fodass'

    divsFodass.forEach(div => {
        div.addEventListener("click", function () {
            const divmenu = document.getElementById("menu");
            const contentWrapper = divmenu ? divmenu.closest(".content") : null;

            if (divmenu.style.display === "block") {
                divmenu.style.display = "none"; // Esconde a div
              if (contentWrapper) {
                contentWrapper.style.display = "none";
              }
            } else {
                divmenu.style.display = "block"; // Mostra a div
              if (contentWrapper) {
                contentWrapper.style.display = "block";
              }
            }
        });
    });
});

function showSlidingWindow(element) {
  if (!element) {
    return;
  }

  element.style.display = "block";
  setTimeout(function() {
    element.classList.add("show");
  }, 10);
}

function hideSlidingWindow(element) {
  if (!element) {
    return;
  }

  element.classList.remove("show");
  setTimeout(function() {
    element.style.display = "none";
  }, 500);
}

function toggleSlidingWindow(element) {
  if (!element) {
    return;
  }

  if (element.classList.contains("show")) {
    hideSlidingWindow(element);
  } else {
    showSlidingWindow(element);
  }
}

function openExclusiveSlidingWindow(elementToOpen, elementToClose) {
  if (!elementToOpen) {
    return;
  }

  if (elementToClose && elementToClose.classList.contains("show")) {
    hideSlidingWindow(elementToClose);
    setTimeout(function() {
      showSlidingWindow(elementToOpen);
    }, 500);
    return;
  }

  toggleSlidingWindow(elementToOpen);
}

function isUserLoggedIn() {
  return localStorage.getItem(authVisualStateKey) === 'true';
}

function openLoginEntryModal() {
  var accountModal = document.getElementById("account-modal");
  var contactModal = document.getElementById("contact");
  var authModal = document.getElementById("auth-modal");

  if (accountModal) {
    if (contactModal && contactModal.classList.contains("show")) {
      openExclusiveSlidingWindow(accountModal, contactModal);
      return;
    }

    if (authModal && authModal.classList.contains("show")) {
      openExclusiveSlidingWindow(accountModal, authModal);
      return;
    }

    toggleSlidingWindow(accountModal);
    return;
  }

  openExclusiveSlidingWindow(authModal, contactModal);
}

function openAuthModal() {
  var authModal = document.getElementById("auth-modal");
  var accountModal = document.getElementById("account-modal");
  openExclusiveSlidingWindow(authModal, accountModal);
}

function handleContactClick() {
  var contactModal = document.getElementById("contact");
  var authModal = document.getElementById("auth-modal");

  if (!isUserLoggedIn()) {
    openLoginEntryModal();
    return;
  }

  openExclusiveSlidingWindow(contactModal, authModal);
}

const contactButton = document.getElementById("contactme");
if (contactButton) {
  contactButton.addEventListener("click", function() {
    handleContactClick();
  });
}

const contactPhoneButton = document.getElementById("contactme-phone");
if (contactPhoneButton) {
  contactPhoneButton.addEventListener("click", function() {
    handleContactClick();
  });
}

const contactForm = document.querySelector(".contact-form form");
if (contactForm) {
  contactForm.addEventListener("submit", function(event) {
    if (isUserLoggedIn()) {
      return;
    }

    event.preventDefault();
    openLoginEntryModal();
  });
}

const accountCloseButton = document.getElementById("account-close");
if (accountCloseButton) {
  accountCloseButton.addEventListener("click", function() {
    var accountModal = document.getElementById("account-modal");
    hideSlidingWindow(accountModal);
  });
}

const accountLoginButton = document.getElementById("account-login-button");
if (accountLoginButton) {
  accountLoginButton.addEventListener("click", function() {
    if (currentAuthUser && firebaseAuthInstance) {
      updateAuthUi(null);
      firebaseAuthInstance.signOut().catch(function(error) {
        console.error("Erro ao terminar sessão:", error);
      });
      return;
    }

    openAuthModal();
  });
}

const contactCloseButton = document.getElementById("close");
if (contactCloseButton) {
  contactCloseButton.addEventListener("click", function() {
    var divmenu = document.getElementById("contact");
    hideSlidingWindow(divmenu);
  });
}

document.querySelectorAll(".nav-login").forEach(function(button) {
  button.addEventListener("click", function() {
    openLoginEntryModal();
  });
});

const authCloseButton = document.getElementById("auth-close");
if (authCloseButton) {
  authCloseButton.addEventListener("click", function() {
    var authModal = document.getElementById("auth-modal");
    hideSlidingWindow(authModal);
  });
}

function updateAuthUi(user) {
  currentAuthUser = user || null;
  localStorage.setItem(authVisualStateKey, user ? 'true' : 'false');
  setAccountNavLabel(Boolean(user));
  updateAccountActionButton(Boolean(user));
  updateAccountCartVisibility(Boolean(user));

  document.querySelectorAll(".nav-login").forEach(function(button) {
    button.style.display = "block";
  });

  document.querySelectorAll(".nav-logout").forEach(function(button) {
    button.style.display = "none";
  });
}

function hasConfiguredFirebase(config) {
  const requiredKeys = ["apiKey", "authDomain", "projectId", "appId"];

  return requiredKeys.every(function(key) {
    return typeof config?.[key] === "string"
      && config[key].trim() !== ""
      && !config[key].includes("COLE_AQUI");
  });
}

function initializeFirebaseAuth() {
  if (window.__vwGolfAuthInitialized) {
    return;
  }

  window.__vwGolfAuthInitialized = true;

  if (!window.firebase) {
    return;
  }

  const firebaseConfig = window.VWGolfFirebaseConfig;

  if (!hasConfiguredFirebase(firebaseConfig)) {
    console.warn("Firebase não configurado. Preencha firebase-config.js com as credenciais do seu projeto.");
    updateAuthUi(null);
    return;
  }

  if (!window.firebase.apps.length) {
    window.firebase.initializeApp(firebaseConfig);
  }

  const auth = window.firebase.auth();
  firebaseAuthInstance = auth;

  auth.setPersistence(window.firebase.auth.Auth.Persistence.LOCAL).catch(function(error) {
    console.error("Erro ao definir persistência do login:", error);
  });

  auth.onAuthStateChanged(function(user) {
    updateAuthUi(user);
  });

  const googleButton = document.getElementById("google-auth-button");
  if (googleButton && !googleButton.dataset.authBound) {
    googleButton.dataset.authBound = "true";

    const signInWithGoogle = function() {
      const provider = new window.firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      auth.signInWithPopup(provider)
        .then(function(result) {
          updateAuthUi(result.user);
          const authModal = document.getElementById("auth-modal");
          hideSlidingWindow(authModal);
        })
        .catch(function(error) {
          if (error.code !== "auth/popup-closed-by-user") {
            console.error("Erro ao autenticar com Google:", error);
          }
        });
    };

    googleButton.addEventListener("click", signInWithGoogle);
    googleButton.addEventListener("keydown", function(event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        signInWithGoogle();
      }
    });
  }

  document.querySelectorAll(".nav-logout").forEach(function(button) {
    if (button.dataset.authBound) {
      return;
    }

    button.dataset.authBound = "true";
    button.addEventListener("click", function() {
      localStorage.setItem(authVisualStateKey, 'false');
      updateAuthUi(null);

      auth.signOut().catch(function(error) {
        console.error("Erro ao terminar sessão:", error);
      });
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeFirebaseAuth);
} else {
  initializeFirebaseAuth();
}

  function getItemsJsonUrl() {
    const documentScript = document.currentScript || document.querySelector('script[src$="script.js"]');
    if (documentScript && documentScript.src) {
      return new URL('items.json', documentScript.src).href;
    }
    return 'items.json';
  }

  function loadProductItemsFromJson() {
    const itemsUrl = getItemsJsonUrl();

    fetch(itemsUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Não foi possível carregar items.json: ' + response.status);
        }
        return response.json();
      })
      .then(items => {
        const itemsById = new Map();
        const itemsByUrl = new Map();
        const currentGolf = window.location.pathname.includes('golf3') ? 3
          : window.location.pathname.includes('golf4') ? 4
          : window.location.pathname.includes('golf5') ? 5
          : window.location.pathname.includes('golf6') ? 6
          : null;

        const filteredItems = currentGolf === null
          ? items
          : items.filter(item => item.golf === currentGolf);

        filteredItems.forEach(item => {
          if (item.id !== undefined) {
            itemsById.set(String(item.id), item);
          }
          if (item.url) {
            itemsByUrl.set(item.url, item);
          }
        });

        const productsContainer = document.querySelector('.products');
        let productsList = productsContainer ? productsContainer.querySelector('ul') : null;

        if (productsContainer && !productsList) {
          productsList = document.createElement('ul');
          productsContainer.appendChild(productsList);
        }

        if (productsList) {
          while (productsList.children.length < filteredItems.length) {
            const li = document.createElement('li');
            li.innerHTML = `
              <a class="product-link" href="#">
                <div class="image"></div>
              </a>
              <div class="info">
                <div class="name"><a class="name-link" href="#"></a></div>
                <div class="price"><a class="price-text"></a></div>
              </div>
            `;
            productsList.appendChild(li);
          }

          while (productsList.children.length > filteredItems.length) {
            productsList.removeChild(productsList.lastElementChild);
          }

          Array.from(productsList.children).forEach((li, index) => {
            const item = filteredItems[index] || null;

            if (!item) {
              li.style.display = 'none';
              return;
            }

            li.style.display = '';

            const productLink = li.querySelector('.product-link');
            const nameLink = li.querySelector('.name-link');
            const priceText = li.querySelector('.price-text');
            const imageDiv = li.querySelector('.image');

            if (productLink) {
              productLink.href = item.url || '#';
            }
            if (nameLink) {
              nameLink.href = item.url || '#';
              nameLink.textContent = item.name || '';
            }
            if (priceText) {
              priceText.textContent = item.price || '';
            }
            if (imageDiv && item.image) {
              imageDiv.style.backgroundImage = `url('${item.image}')`;
            }
          });
        }

        function normalizeItemReference(reference) {
          if (reference === undefined || reference === null) {
            return '';
          }

          return String(reference)
            .trim()
            .split('#')[0]
            .replace(/\\/g, '/')
            .replace(/^\/+/, '');
        }

        function getItemByReference(reference) {
          if (reference === undefined || reference === null) {
            return null;
          }

          const normalizedReference = normalizeItemReference(reference);
          if (!normalizedReference) {
            return null;
          }

          if (itemsById.has(String(normalizedReference))) {
            return itemsById.get(String(normalizedReference));
          }

          if (itemsByUrl.has(normalizedReference)) {
            return itemsByUrl.get(normalizedReference);
          }

          for (const [itemUrl, item] of itemsByUrl.entries()) {
            const normalizedItemUrl = normalizeItemReference(itemUrl);
            if (normalizedItemUrl === normalizedReference) {
              return item;
            }

            const queryMatch = normalizedItemUrl.match(/(?:^|[?&])item=([^&]+)/);
            if (queryMatch && queryMatch[1] === normalizedReference) {
              return item;
            }
          }

          return null;
        }

        function getDetailItemFromPageUrl() {
          const bodyUrl = document.body.dataset.itemUrl;
          const bodyItem = getItemByReference(bodyUrl);
          if (bodyItem) {
            return bodyItem;
          }

          const params = new URLSearchParams(window.location.search);
          for (const key of ['item', 'url', 'product', 'id']) {
            const value = params.get(key);
            const matchedItem = getItemByReference(value);
            if (matchedItem) {
              return matchedItem;
            }
          }

          const path = window.location.pathname.replace(/\\/g, '/').replace(/^\/+/, '');
          return getItemByReference(path);
        }

        const detailItem = getDetailItemFromPageUrl();
        currentDetailItem = detailItem;

        if (!detailItem) {
          const productName = document.querySelector('.product_name a');
          const productPrice = document.querySelector('.product_price a');
          const optionsTitle = document.querySelector('.options_title a');

          if (productName) {
            productName.textContent = 'Product not available';
          }
          if (productPrice) {
            productPrice.textContent = '—';
          }
          if (optionsTitle) {
            optionsTitle.textContent = 'Unavailable';
          }

          const main_photoElement = document.getElementById('main_photo');
          if (main_photoElement) {
            main_photoElement.style.backgroundImage = 'none';
          }
          return;
        }

        if (detailItem) {
          const productName = document.querySelector('.product_name a');
          const productPrice = document.querySelector('.product_price a');
          const productDescription = document.querySelector('.product_description a');
          const optionsTitle = document.querySelector('.options_title a');
          const buyLink = document.getElementById('buyLink');
          const optionsList = document.querySelector('.options_list ul');

          if (productName) {
            productName.textContent = detailItem.name || productName.textContent;
          }
          if (productPrice) {
            productPrice.textContent = detailItem.price || productPrice.textContent;
          }
          if (productDescription) {
            productDescription.textContent = detailItem.description || '';
          }
          if (optionsTitle) {
            if (typeof detailItem.select === 'string') {
              optionsTitle.textContent = detailItem.select;
            } else {
              optionsTitle.textContent = detailItem.select?.label || optionsTitle.textContent;
            }
          }

          if (buyLink) {
            buyLink.href = detailItem.buy || buyLink.getAttribute('href') || '#';
          }

          if (optionsList && detailItem.select && Array.isArray(detailItem.select.options) && detailItem.select.options.length > 0) {
            optionsList.innerHTML = '';
            detailItem.select.options.forEach((option, index) => {
              const li = document.createElement('li');
              li.id = String(option.id);
              const a = document.createElement('a');
              a.href = '#';
              a.textContent = option.name || `Option ${option.id}`;
              li.appendChild(a);
              optionsList.appendChild(li);

              li.addEventListener('click', event => {
                event.preventDefault();
                optionsList.querySelectorAll('li').forEach(el => el.classList.remove('selected'));
                li.classList.add('selected');
                if (buyLink) {
                  buyLink.href = option.url || detailItem.buy || buyLink.getAttribute('href') || '#';
                }
              });

              if (index === 0) {
                li.classList.add('selected');
                if (buyLink) {
                  buyLink.href = option.url || detailItem.buy || buyLink.getAttribute('href') || '#';
                }
              }
            });
          }

          const main_photoElement = document.getElementById('main_photo');
          if (main_photoElement && detailItem.image) {
            const photoUrl = new URL(detailItem.image, itemsUrl).href;
            main_photoElement.style.backgroundImage = `url('${photoUrl}')`;
          }

          // Update gallery item background images from image, image2, image3
          if (detailItem.image) {
            const photo1 = document.getElementById('photo1');
            if (photo1) {
              const photo1Url = new URL(detailItem.image, itemsUrl).href;
              photo1.style.backgroundImage = `url('${photo1Url}')`;
              photo1.setAttribute('photo', detailItem.image);
            }
          }
          if (detailItem.image2) {
            const photo2 = document.getElementById('photo2');
            if (photo2) {
              const photo2Url = new URL(detailItem.image2, itemsUrl).href;
              photo2.style.backgroundImage = `url('${photo2Url}')`;
              photo2.setAttribute('photo', detailItem.image2);
            }
          }
          if (detailItem.image3) {
            const photo3 = document.getElementById('photo3');
            if (photo3) {
              const photo3Url = new URL(detailItem.image3, itemsUrl).href;
              photo3.style.backgroundImage = `url('${photo3Url}')`;
              photo3.setAttribute('photo', detailItem.image3);
            }
          }
          if (detailItem.image4) {
            const photo4 = document.getElementById('photo4');
            if (photo4) {
              const photo4Url = new URL(detailItem.image4, itemsUrl).href;
              photo4.style.backgroundImage = `url('${photo4Url}')`;
              photo4.setAttribute('photo', detailItem.image4);
            }
          }
          if (detailItem.image5) {
            const photo5 = document.getElementById('photo5');
            if (photo5) {
              const photo5Url = new URL(detailItem.image5, itemsUrl).href;
              photo5.style.backgroundImage = `url('${photo5Url}')`;
              photo5.setAttribute('photo', detailItem.image5);
            }
          }
          if (detailItem.image6) {
            const photo6 = document.getElementById('photo6');
            if (photo6) {
              const photo6Url = new URL(detailItem.image6, itemsUrl).href;
              photo6.style.backgroundImage = `url('${photo6Url}')`;
              photo6.setAttribute('photo', detailItem.image6);
            }
          }
        }
      })
      .catch(error => {
        console.error('Erro ao carregar items.json:', error);
      });
  }

  document.addEventListener('DOMContentLoaded', loadProductItemsFromJson);
 

