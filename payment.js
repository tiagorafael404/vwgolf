const paymentState = {
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

function loadProductData() {
  const itemId = getQueryValue('item');
  if (!itemId) {
    console.error('Produto não encontrado. Item ID é obrigatório.');
    return Promise.reject(new Error('Missing item query'));
  }

  return fetch(getItemsUrl())
    .then(response => {
      if (!response.ok) throw new Error('Não foi possível carregar items.json.');
      return response.json();
    })
    .then(items => {
      paymentState.allItems = items;
      const item = items.find(entry => String(entry.id) === String(itemId));
      if (!item) {
        console.error('Produto não existe ou o ID está errado.');
        return null;
      }
      return item;
    });
}

function renderProduct(item) {
  paymentState.item = item;

  const productName = document.getElementById('productName');
  const productDescription = document.getElementById('productDescription');
  const productImage = document.getElementById('productImage');
  const productPrice = document.getElementById('productPrice');
  const detailTotal = document.getElementById('detailTotal');

  if (productName) productName.textContent = item.name || 'Unnamed product';
  if (productDescription) productDescription.textContent = item.description || 'Sem descrição disponível.';
  if (productPrice) productPrice.textContent = item.price || '—';
  if (detailTotal) detailTotal.textContent = item.price || '—';

  if (productImage && item.image) {
    productImage.style.backgroundImage = `url('${sanitizeImagePath(item.image)}')`;
  }

  // Render options if available
  const optionsGrid = document.getElementById('optionsGrid');
  const optionsSection = document.getElementById('optionsSection');
  
  if (optionsGrid && item.select?.options) {
    optionsGrid.innerHTML = '';
    const options = item.select.options;
    
    if (options.length > 0) {
      options.forEach(option => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'option-button';
        button.dataset.optionId = String(option.id);
        button.textContent = option.name || `Opção ${option.id}`;
        button.addEventListener('click', () => {
          document.querySelectorAll('.option-button').forEach(btn => {
            btn.classList.remove('selected');
          });
          button.classList.add('selected');
          paymentState.selectedOption = option;
        });
        optionsGrid.appendChild(button);
      });
      // Select first option by default
      if (options.length > 0) {
        paymentState.selectedOption = options[0];
        document.querySelector('.option-button')?.classList.add('selected');
      }
    } else {
      optionsSection.style.display = 'none';
    }
  } else if (optionsSection) {
    optionsSection.style.display = 'none';
  }
}

function setupPaymentMethods() {
  const radioButtons = document.querySelectorAll('input[name="payment-method"]');
  const creditcardSection = document.getElementById('creditcard-section');
  const paypalSection = document.getElementById('paypal-section');
  
  function toggleSections() {
    const selectedMethod = document.querySelector('input[name="payment-method"]:checked')?.value;
    
    if (selectedMethod === 'paypal') {
      creditcardSection.hidden = true;
      paypalSection.hidden = false;
    } else {
      creditcardSection.hidden = false;
      paypalSection.hidden = true;
    }
  }
  
  // Event listener em cada radio button
  radioButtons.forEach(radio => {
    radio.addEventListener('change', toggleSections);
  });
  
  // Inicializar com o estado correto
  toggleSections();
}

function setupFormSubmit() {
  const paymentForm = document.getElementById('paymentForm');
  if (!paymentForm) return;

  paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData(paymentForm);
      const data = Object.fromEntries(formData);
      
      // Log the form data and selected payment method
      console.log('Dados do formulário:', data);
      console.log('Método de pagamento:', paymentState.selectedPaymentMethod);
      console.log('Produto selecionado:', paymentState.item);
      console.log('Opção selecionada:', paymentState.selectedOption);
      
      // Process credit card payment
      processCreditCardPayment(data);
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      alert('Erro ao processar o pagamento. Verifique os dados e tente novamente.');
    }
  });
}

function processCreditCardPayment(formData) {
  console.log('Processando pagamento com cartão de crédito...');
  console.log('Dados do cliente:', formData);
  // Here you would normally send to your payment processor
}

function setupBackLink() {
  const backLink = document.querySelector('.back');
  if (!backLink) return;
  const previous = getQueryValue('back');
  backLink.href = previous || '/vwgolf/home.html';
}

function initPaymentPage() {
  setupBackLink();
  setupPaymentMethods();
  setupFormSubmit();
  
  loadProductData()
    .then(item => {
      if (item) renderProduct(item);
    })
    .catch(error => {
      console.error(error);
    });
}

window.addEventListener('DOMContentLoaded', initPaymentPage);
