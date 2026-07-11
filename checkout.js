const checkoutState = {
  item: null,
  selectedOption: null,
  allItems: [],
};

function getQueryValue(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function getItemsUrl() {
  return new URL('items.json', window.location.href).href;
}

function sanitizeImagePath(path) {
  if (!path) return null;
  return new URL(path, getItemsUrl()).href;
}

function renderError(message) {
  const errorContainer = document.getElementById('errorMessage');
  if (!errorContainer) return;
  errorContainer.textContent = message;
  errorContainer.style.display = 'block';
}

function hideError() {
  const errorContainer = document.getElementById('errorMessage');
  if (!errorContainer) return;
  errorContainer.style.display = 'none';
}

function loadProductData() {
  const itemId = getQueryValue('item');
  if (!itemId) {
    renderError('Produto não encontrado. Abra o link a partir de um produto válido.');
    return Promise.reject(new Error('Missing item query')); 
  }

  return fetch(getItemsUrl())
    .then(response => {
      if (!response.ok) throw new Error('Não foi possível carregar items.json.');
      return response.json();
    })
    .then(items => {
      checkoutState.allItems = items;
      const item = items.find(entry => String(entry.id) === String(itemId));
      if (!item) {
        renderError('Produto não existe ou o ID está errado.');
        return null;
      }
      return item;
    });
}

function setSelectedOption(option) {
  checkoutState.selectedOption = option;
  const buttons = document.querySelectorAll('.option-button');
  buttons.forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.optionId === String(option?.id));
  });
  const buyLink = document.getElementById('buyLink');
  if (buyLink) {
    buyLink.href = option?.url || checkoutState.item?.buy || '#';
  }
}

function renderProduct(item) {
  checkoutState.item = item;
  hideError();

  const title = document.getElementById('productName');
  const description = document.getElementById('productDescription');
  const mainImage = document.getElementById('mainImage');
  const price = document.getElementById('productPrice');
  const detailPrice = document.getElementById('detailPrice');
  const optionsList = document.getElementById('optionsList');

  if (title) title.textContent = item.name || 'Unnamed product';
  if (description) description.textContent = item.description || 'Sem descrição disponível.';
  if (price) price.textContent = item.price || '—';
  if (detailPrice) detailPrice.textContent = item.price || '—';
  if (document.getElementById('detailTotal')) {
    document.getElementById('detailTotal').textContent = item.price || '—';
  }

  if (mainImage) {
    mainImage.style.backgroundImage = item.image ? `url('${sanitizeImagePath(item.image)}')` : 'none';
  }

  const galleryThumbs = ['image', 'image2', 'image3', 'image4', 'image5', 'image6']
    .filter(key => item[key])
    .map(key => ({ url: sanitizeImagePath(item[key]), key }));

  const thumbsContainer = document.getElementById('thumbs');
  if (thumbsContainer) {
    thumbsContainer.innerHTML = '';
    galleryThumbs.forEach((photo, index) => {
      const thumb = document.createElement('button');
      thumb.type = 'button';
      thumb.className = 'thumb' + (index === 0 ? ' selected' : '');
      thumb.style.backgroundImage = `url('${photo.url}')`;
      thumb.dataset.photo = photo.url;
      thumb.addEventListener('click', () => {
        document.querySelectorAll('.thumb').forEach(el => el.classList.remove('selected'));
        thumb.classList.add('selected');
        if (mainImage) mainImage.style.backgroundImage = `url('${photo.url}')`;
      });
      thumbsContainer.appendChild(thumb);
    });
  }

  const buyLink = document.getElementById('buyLink');
  if (buyLink) buyLink.href = item.buy || '#';

  if (optionsList) {
    optionsList.innerHTML = '';
    const options = item.select?.options || [];
    if (options.length === 0) {
      optionsList.innerHTML = '<li class="notice">Sem opções adicionais.</li>';
    } else {
      options.forEach(option => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'option-button';
        button.dataset.optionId = String(option.id);
        button.textContent = option.name || `Opção ${option.id}`;
        button.addEventListener('click', () => {
          setSelectedOption(option);
        });
        optionsList.appendChild(button);
      });
      setSelectedOption(options[0]);
    }
  }
}

function setupBackLink() {
  const backLink = document.getElementById('backLink');
  if (!backLink) return;
  const previous = getQueryValue('back');
  backLink.href = previous || '/home.html';
}

function initCheckoutPage() {
  setupBackLink();
  loadProductData()
    .then(item => {
      if (item) renderProduct(item);
    })
    .catch(error => {
      console.error(error);
    });
}

window.addEventListener('DOMContentLoaded', initCheckoutPage);
