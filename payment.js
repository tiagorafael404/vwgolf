/*
  payment.js
  - Carrega dados do item via items.json com base em payment.html?item=ID
  - Renderiza imagens, nome, descrição, preço, opções e total
  - Atualiza o botão de pagamento para a URL definida no JSON (select.options[].url)
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
    creditcardSection: document.getElementById('creditcard-section'),
    paypalSection: document.getElementById('paypal-section')
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

  function setupPaymentRedirection(item, optionsInfo) {
    // Reaproveita o botão submit do form.
    // Quando enviar, redireciona para a URL do Stripe configurada.

    const submitButton = els.paymentForm && els.paymentForm.querySelector('button[type="submit"]');
    if (!els.paymentForm || !submitButton) return;

    els.paymentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const selectedOption = optionsInfo ? getSelectedOption(optionsInfo) : null;
      const destinationUrl =
        // prefer option URL se existir
        (selectedOption && selectedOption.url) ||
        // senão, se o item tiver buy (alguns itens têm)
        (item && item.buy) ||
        // fallback: se não tiver URL, não redireciona
        null;

      if (!destinationUrl) {
        showError('URL de pagamento não encontrada para este item/opção.');
        return;
      }

      // salva dados básicos no localStorage (opcional)
      try {
        const formData = new FormData(els.paymentForm);
        const payload = Object.fromEntries(formData.entries());
        payload.itemId = item.id;
        if (selectedOption) payload.optionId = selectedOption.id;
        localStorage.setItem('lastPaymentForm', JSON.stringify(payload));
      } catch (_) {}

      // Redirecionar
      window.location.href = destinationUrl;
    });
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

    // Setup submit redirection
    setupPaymentRedirection(item, optionsInfo);

    // Hide creditcard/paypal sections if not needed (keep as is, but ensure no JS errors)
    if (!els.creditcardSection && !els.paypalSection) return;
  }

  document.addEventListener('DOMContentLoaded', init);
})();

