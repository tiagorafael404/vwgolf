/*
  payment.js
  - Carrega dados do item via items.json com base em payment.html?item=ID
  - Renderiza imagens, nome, descrição, preço, opções e total
  - Configura botões PayPal Checkout para PayPal e cartão
*/

(function () {
  const els = {
    productImage: document.getElementById('productImage'),
    productName: document.getElementById('productName'),
    productDescription: document.getElementById('productDescription'),
    productPrice: document.getElementById('productPrice'),
    optionsGrid: document.getElementById('optionsGrid'),
    optionsSection: document.getElementById('optionsSection'),
    detailTotal: document.getElementById('detailTotal'),
    formError: document.getElementById('formError'),

    paymentForm: document.getElementById('paymentForm'),
    paypalSection: document.getElementById('paypal-section'),
    cardSection: document.getElementById('card-section'),
    paypalButtonsContainer: document.getElementById('paypal-buttons-container'),
    cardButtonsContainer: document.getElementById('card-buttons-container')
  };

  const PARAM_KEY = 'item';

  function showError(msg) {
    if (!els.formError) return;
    els.formError.hidden = false;
    els.formError.textContent = msg;
  }

  function toNumberFromPrice(priceStr) {
    if (typeof priceStr !== 'string') return NaN;
    // ex: "14.99€" -> 14.99
    const normalized = priceStr.replace(/[^0-9.,-]/g, '').replace(',', '.');
    const n = Number(normalized);
    return Number.isFinite(n) ? n : NaN;
  }

  function formatEUR(n) {
    if (!Number.isFinite(n)) return '—';
    return n.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });
  }

  function safeCreateImg(src, alt) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt || '';
    img.loading = 'lazy';
    return img;
  }

  function buildImageBlock(item) {
    if (!els.productImage) return;

    const folderOrPath = (item && item.image) ? String(item.image) : '';
    const imgSrc1 = folderOrPath;
    const imgSrc2 = item && item.image2 ? String(item.image2) : null;

    els.productImage.innerHTML = '';
    if (imgSrc1) {
      els.productImage.appendChild(safeCreateImg(imgSrc1, item.name));
      if (imgSrc2) els.productImage.appendChild(safeCreateImg(imgSrc2, item.name));
    } else {
      els.productImage.textContent = 'Imagem indisponível';
    }
  }

  function getItemId() {
    const sp = new URLSearchParams(window.location.search);
    const raw = sp.get(PARAM_KEY);
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }

  async function loadItemsJson() {
    const res = await fetch('items.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Não foi possível carregar items.json');
    return await res.json();
  }

  function getItemById(items, itemId) {
    // items.json pode ser array de itens (parece que sim)
    return (items || []).find((it) => Number(it.id) === Number(itemId)) || null;
  }

  function ensureOptionsSectionVisible(hasOptions) {
    if (!els.optionsSection) return;
    els.optionsSection.style.display = hasOptions ? '' : 'none';
  }

  function renderOptions(item) {
    const select = item && item.select;
    const options = select && Array.isArray(select.options) ? select.options : null;

    if (!els.optionsGrid) return;

    els.optionsGrid.innerHTML = '';

    if (!options || options.length === 0) {
      ensureOptionsSectionVisible(false);
      return null;
    }

    ensureOptionsSectionVisible(true);

    // Radio group
    const groupName = 'product-option';
    options.forEach((opt, idx) => {
      const label = document.createElement('label');
      label.className = 'payment-option';

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = groupName;
      radio.value = String(opt.id);
      radio.checked = idx === 0;

      const circle = document.createElement('span');
      circle.className = 'radio-circle';

      const text = document.createElement('span');
      text.className = 'option-text';
      text.textContent = opt.name || `Opção ${opt.id}`;

      label.appendChild(radio);
      label.appendChild(circle);
      label.appendChild(text);
      els.optionsGrid.appendChild(label);
    });

    // Total: como o seu JSON só tem preço base do item (não o preço por opção),
    // o total aqui fica igual ao preço do item.
    // Se quiser total diferente por opção, basta estender o JSON.
    updateTotalWithItemPrice(item);

    return {
      groupName,
      options
    };
  }

  function getSelectedOption(optionsInfo) {
    if (!optionsInfo) return null;
    const input = document.querySelector(`input[name="${optionsInfo.groupName}"]:checked`);
    if (!input) return null;
    const id = Number(input.value);
    return optionsInfo.options.find((o) => Number(o.id) === id) || null;
  }

  function updateTotalWithItemPrice(item) {
    if (!els.detailTotal) return;
    const n = toNumberFromPrice(item.price);
    els.detailTotal.textContent = Number.isFinite(n) ? formatEUR(n) : String(item.price || '—');
  }

  function getSelectedPaymentMethod() {
    const selected = document.querySelector('input[name="payment-method"]:checked');
    return selected ? selected.value : 'paypal';
  }

  let cardButtonsRendered = false;

  function setupPaymentSections() {
    const updateSections = () => {
      const method = getSelectedPaymentMethod();
      if (els.paypalSection) els.paypalSection.hidden = method !== 'paypal';
      if (els.cardSection) els.cardSection.hidden = method !== 'card';
    };

    document.querySelectorAll('input[name="payment-method"]').forEach((input) => {
      input.addEventListener('change', updateSections);
    });

    updateSections();
  }

  function renderPayPalButtons(item) {
    if (!window.paypal || !els.paypalButtonsContainer) return;

    els.paypalButtonsContainer.innerHTML = '';

    window.paypal.Buttons({
      fundingSource: window.paypal.FUNDING.PAYPAL,
      style: {
        shape: 'rect',
        layout: 'vertical',
        color: 'gold',
        label: 'checkout'
      },
      createOrder: function(data, actions) {
        const amount = toNumberFromPrice(item.price);
        return actions.order.create({
          purchase_units: [{
            amount: {
              currency_code: 'EUR',
              value: amount.toFixed(2)
            },
            description: item.name || 'Compra VW Golf'
          }]
        });
      },
      onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
          window.location.href = 'payment-success.html';
        });
      },
      onCancel: function(data) {
        window.location.href = 'payment-cancel.html';
      },
      onError: function(err) {
        showError('Ocorreu um erro no PayPal: ' + (err && err.message ? err.message : 'tente novamente.'));
      }
    }).render(els.paypalButtonsContainer);
  }

  function renderCardButtons(item) {
    if (!window.paypal || !els.cardButtonsContainer) return;

    const amount = toNumberFromPrice(item.price);
    if (!Number.isFinite(amount)) {
      showError('Preço inválido para processar o pagamento.');
      return;
    }

    els.cardButtonsContainer.innerHTML = '';

    const createButtonsConfig = {
      style: {
        shape: 'rect',
        layout: 'vertical',
        color: 'black',
        label: 'pay'
      },
      createOrder: function(data, actions) {
        return actions.order.create({
          purchase_units: [{
            amount: {
              currency_code: 'EUR',
              value: amount.toFixed(2)
            },
            description: item.name || 'Compra VW Golf'
          }]
        });
      },
      onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
          window.location.href = 'payment-success.html';
        });
      },
      onCancel: function(data) {
        window.location.href = 'payment-cancel.html';
      },
      onError: function(err) {
        showError('Ocorreu um erro no PayPal: ' + (err && err.message ? err.message : 'tente novamente.'));
      }
    };

    const cardButtons = window.paypal.Buttons(Object.assign({ fundingSource: window.paypal.FUNDING.CARD }, createButtonsConfig));
    if (typeof cardButtons.isEligible === 'function' && cardButtons.isEligible()) {
      cardButtons.render(els.cardButtonsContainer);
    } else {
      const fallbackButtons = window.paypal.Buttons(createButtonsConfig);
      fallbackButtons.render(els.cardButtonsContainer);
    }

    cardButtonsRendered = true;
  }

  function renderBaseItem(item) {
    if (!item) return;
    if (els.productName) els.productName.textContent = item.name || 'Produto';
    if (els.productDescription)
      els.productDescription.textContent = item.description || 'Descrição indisponível.';

    if (els.productPrice) {
      const n = toNumberFromPrice(item.price);
      els.productPrice.textContent = Number.isFinite(n) ? formatEUR(n) : String(item.price || '—');
    }

    buildImageBlock(item);
    updateTotalWithItemPrice(item);
  }

  async function init() {
    const itemId = getItemId();
    if (!itemId) {
      showError('Item não informado. Abra: payment.html?item=ID');
      return;
    }

    let items;
    try {
      items = await loadItemsJson();
    } catch (err) {
      showError(String(err && err.message ? err.message : err));
      return;
    }

    const item = getItemById(items, itemId);
    if (!item) {
      showError('Item não encontrado no items.json.');
      return;
    }

    renderBaseItem(item);

    // Render options
    const optionsInfo = renderOptions(item);

    setupPaymentSections();
    renderPayPalButtons(item);
    renderCardButtons(item);
  }

  document.addEventListener('DOMContentLoaded', init);
})();

