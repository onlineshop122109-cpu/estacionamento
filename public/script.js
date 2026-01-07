// Design Philosophy: Neomorphism Automotivo Premium
// Checkout de Reserva de Estacionamento GuaruPark

// Constants
const CREDIT_CARD_FEE_PERCENTAGE = 5;

// State
let currentStep = 1;
let selectedPayment = 'pix';
let selectedShipping = 'standard';

// Reservation Data from URL
let reservationData = {
    entryDate: '',
    entryTime: '',
    exitDate: '',
    exitTime: '',
    parkingType: 'uncovered',
    insurance: false,
    totalDays: 0,
    totalPrice: 0,
};

// Form Data
let formData = {
    email: '',
    firstName: '',
    cpf: '',
    phone: '',
    vehiclePlate: '',
    vehicleType: 'car',
    paymentMethod: 'pix',
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    parseReservationFromURL();
    updateOrderDisplay();
    setupEventListeners();
    setupPaymentMethods();
});

/**
 * Parse reservation data from URL parameters
 */
function parseReservationFromURL() {
    const params = new URLSearchParams(window.location.search);
    
    reservationData = {
        entryDate: params.get('entryDate') || '',
        entryTime: params.get('entryTime') || '',
        exitDate: params.get('exitDate') || '',
        exitTime: params.get('exitTime') || '',
        parkingType: params.get('parkingType') || 'uncovered',
        insurance: params.get('insurance') === 'true',
        totalDays: parseInt(params.get('totalDays') || '0'),
        totalPrice: parseFloat(params.get('totalPrice') || '0'),
    };

    console.log('Reservation Data:', reservationData);
}

/**
 * Format date from YYYY-MM-DD to DD/MM/YYYY
 */
function formatDate(dateStr) {
    if (!dateStr) return '-';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
}

/**
 * Format currency to BRL
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
}

/**
 * Update order display with reservation data
 */
function updateOrderDisplay() {
    // Desktop sidebar
    document.getElementById('entryDateDisplay').textContent = formatDate(reservationData.entryDate);
    document.getElementById('entryTimeDisplay').textContent = reservationData.entryTime || '-';
    document.getElementById('exitDateDisplay').textContent = formatDate(reservationData.exitDate);
    document.getElementById('exitTimeDisplay').textContent = reservationData.exitTime || '-';
    document.getElementById('parkingTypeDisplay').textContent = 
        reservationData.parkingType === 'covered' ? 'Coberta' : 'Descoberta';
    document.getElementById('insuranceDisplay').textContent = 
        reservationData.insurance ? 'Sim' : 'Não';
    document.getElementById('totalDaysDisplay').textContent = 
        `${reservationData.totalDays} ${reservationData.totalDays === 1 ? 'dia' : 'dias'}`;

    // Mobile summary
    document.getElementById('mobileSubtotal').textContent = formatCurrency(reservationData.totalPrice);
    document.getElementById('mobileTotalDays').textContent = 
        `${reservationData.totalDays} ${reservationData.totalDays === 1 ? 'dia' : 'dias'}`;

    updateTotalPrice();
}

/**
 * Update total price display
 */
function updateTotalPrice() {
    let total = reservationData.totalPrice;
    let creditCardFee = 0;

    if (selectedPayment === 'credit') {
        creditCardFee = total * (CREDIT_CARD_FEE_PERCENTAGE / 100);
        total = total + creditCardFee;

        document.getElementById('creditCardFeeRow').style.display = 'flex';
        document.getElementById('creditCardFee').textContent = `+${formatCurrency(creditCardFee)}`;
    } else {
        document.getElementById('creditCardFeeRow').style.display = 'none';
    }

    const totalFormatted = formatCurrency(total);
    document.getElementById('subtotal').textContent = formatCurrency(reservationData.totalPrice);
    document.getElementById('totalPrice').textContent = totalFormatted;
    document.getElementById('mobileTotalPrice').textContent = totalFormatted;
    document.getElementById('mobileFinalPrice').textContent = totalFormatted;

    updatePaymentMethodValues(total, creditCardFee);
}

/**
 * Update payment method display values
 */
function updatePaymentMethodValues(total, creditCardFee) {
    const totalFormatted = formatCurrency(total);
    
    document.getElementById('pixValue').textContent = totalFormatted;
    document.getElementById('creditValue').textContent = totalFormatted;
    document.getElementById('boletoValue').textContent = totalFormatted;
}

/**
 * Setup payment method selection
 */
function setupPaymentMethods() {
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', function() {
            selectPayment.call(this);
        });
    });

    // Update installments when credit card is selected
    updateInstallmentOptions(reservationData.totalPrice);
}

/**
 * Select payment method
 */
function selectPayment() {
    document.querySelectorAll('.payment-method').forEach(method => {
        method.classList.remove('selected');
    });
    this.classList.add('selected');
    selectedPayment = this.dataset.payment;

    // Toggle credit card fields
    const creditCardFields = this.querySelector('.payment-details');
    if (creditCardFields) {
        document.querySelectorAll('.payment-details').forEach(field => {
            field.style.display = 'none';
        });
        if (selectedPayment === 'credit') {
            creditCardFields.style.display = 'block';
            document.getElementById('creditCardNotice').style.display = 'block';
        }
    }

    // Update required attributes
    const cardInputs = [
        document.getElementById('cardNumber'),
        document.getElementById('cardName'),
        document.getElementById('cardExpiry'),
        document.getElementById('cardCvv'),
        document.getElementById('installments')
    ];

    cardInputs.forEach(input => {
        if (input) {
            if (selectedPayment === 'credit') {
                input.setAttribute('required', '');
            } else {
                input.removeAttribute('required');
            }
        }
    });

    updateTotalPrice();
}

/**
 * Update installment options
 */
function updateInstallmentOptions(total) {
    const installmentsSelect = document.getElementById('installments');
    if (!installmentsSelect) return;

    const totalWithFee = total * (selectedPayment === 'credit' ? 1.05 : 1);

    while (installmentsSelect.children.length > 1) {
        installmentsSelect.removeChild(installmentsSelect.lastChild);
    }

    const installmentOptions = [
        { value: 1, text: `1x ${formatCurrency(totalWithFee)} à vista` },
        { value: 2, text: `2x ${formatCurrency(totalWithFee / 2)} sem juros` },
        { value: 3, text: `3x ${formatCurrency(totalWithFee / 3)} sem juros` },
        { value: 4, text: `4x ${formatCurrency(totalWithFee / 4)} sem juros` },
        { value: 5, text: `5x ${formatCurrency(totalWithFee / 5)} sem juros` },
        { value: 6, text: `6x ${formatCurrency(totalWithFee / 6)} sem juros` },
        { value: 7, text: `7x ${formatCurrency((totalWithFee * 1.05) / 7)} com juros` },
        { value: 8, text: `8x ${formatCurrency((totalWithFee * 1.08) / 8)} com juros` },
        { value: 9, text: `9x ${formatCurrency((totalWithFee * 1.12) / 9)} com juros` },
        { value: 10, text: `10x ${formatCurrency((totalWithFee * 1.15) / 10)} com juros` },
        { value: 11, text: `11x ${formatCurrency((totalWithFee * 1.18) / 11)} com juros` },
        { value: 12, text: `12x ${formatCurrency((totalWithFee * 1.20) / 12)} com juros` }
    ];

    installmentOptions.forEach(option => {
        const optionEl = document.createElement('option');
        optionEl.value = option.value;
        optionEl.textContent = option.text;
        installmentsSelect.appendChild(optionEl);
    });
}

/**
 * Format CPF
 */
function formatCPF(value) {
    const numbers = value.replace(/\D/g, '');
    return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
}

/**
 * Format phone
 */
function formatPhone(value) {
    const numbers = value.replace(/\D/g, '');
    return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
}

/**
 * Format vehicle plate
 */
function formatPlate(value) {
    return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);
}

/**
 * Format card number
 */
function formatCardNumber(value) {
    const numbers = value.replace(/\D/g, '').slice(0, 16);
    return numbers.replace(/(\d{4})/g, '$1 ').trim();
}

/**
 * Format card expiry
 */
function formatCardExpiry(value) {
    const numbers = value.replace(/\D/g, '').slice(0, 4);
    return numbers.replace(/(\d{2})(\d)/, '$1/$2');
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Contact form
    document.getElementById('contactForm').addEventListener('submit', handleContactSubmit);

    // Input formatting
    document.getElementById('cpf').addEventListener('input', function() {
        this.value = formatCPF(this.value);
    });

    document.getElementById('phone').addEventListener('input', function() {
        this.value = formatPhone(this.value);
    });

    document.getElementById('vehiclePlate').addEventListener('input', function() {
        this.value = formatPlate(this.value);
    });

    document.getElementById('cardNumber').addEventListener('input', function() {
        this.value = formatCardNumber(this.value);
    });

    document.getElementById('cardExpiry').addEventListener('input', function() {
        this.value = formatCardExpiry(this.value);
    });

    document.getElementById('cardCvv').addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '').slice(0, 4);
    });

    document.getElementById('cardName').addEventListener('input', function() {
        this.value = this.value.toUpperCase();
    });

    // Form validation on blur
    document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('blur', () => validateField(input));
    });

    // Payment method selection
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', selectPayment);
    });
}

/**
 * Validate individual field
 */
function validateField(input) {
    const value = input.value.trim();
    const errorEl = document.getElementById(input.id + 'Error');
    
    if (!errorEl) return true;

    let isValid = true;

    switch (input.id) {
        case 'email':
            isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            break;
        case 'firstName':
            isValid = value.length > 0;
            break;
        case 'cpf':
            isValid = value.replace(/\D/g, '').length === 11;
            break;
        case 'phone':
            isValid = value.replace(/\D/g, '').length >= 10;
            break;
        case 'vehiclePlate':
            isValid = value.length === 7;
            break;
        case 'cardNumber':
            isValid = value.replace(/\D/g, '').length === 16;
            break;
        case 'cardName':
            isValid = value.length > 0;
            break;
        case 'cardExpiry':
            isValid = value.length === 5;
            break;
        case 'cardCvv':
            isValid = value.length >= 3;
            break;
    }

    if (isValid) {
        input.classList.remove('error');
        input.classList.add('success');
        errorEl.classList.remove('show');
    } else {
        input.classList.remove('success');
        input.classList.add('error');
        errorEl.classList.add('show');
    }

    return isValid;
}

/**
 * Validate entire form
 */
function validateForm() {
    const inputs = document.querySelectorAll('.form-input[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

/**
 * Handle contact form submission
 */
async function handleContactSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }

    // Collect form data
    formData = {
        email: document.getElementById('email').value,
        firstName: document.getElementById('firstName').value,
        cpf: document.getElementById('cpf').value,
        phone: document.getElementById('phone').value,
        vehiclePlate: document.getElementById('vehiclePlate').value,
        vehicleType: document.querySelector('input[name="vehicleType"]:checked').value,
        paymentMethod: selectedPayment,
    };

    // Add payment method specific data
    if (selectedPayment === 'credit') {
        formData.cardNumber = document.getElementById('cardNumber').value;
        formData.cardName = document.getElementById('cardName').value;
        formData.cardExpiry = document.getElementById('cardExpiry').value;
        formData.cardCvv = document.getElementById('cardCvv').value;
        formData.installments = document.getElementById('installments').value;
    }

    console.log('Form Data:', formData);

    // Show loading overlay
    document.getElementById('loadingOverlay').style.display = 'flex';

    try {
        // Send payment request to server
        const response = await fetch(`/api/payments/${selectedPayment}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...formData,
                ...reservationData,
                totalAmount: reservationData.totalPrice * (selectedPayment === 'credit' ? 1.05 : 1),
            }),
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Payment successful:', result);
            
            // Redirect to success page
            window.location.href = '/sucesso';
        } else {
            const error = await response.json();
            console.error('Payment error:', error);
            alert('Erro ao processar pagamento. Tente novamente.');
            document.getElementById('loadingOverlay').style.display = 'none';
        }
    } catch (error) {
        console.error('Request error:', error);
        alert('Erro ao conectar com o servidor. Tente novamente.');
        document.getElementById('loadingOverlay').style.display = 'none';
    }
}

/**
 * Toggle order summary on mobile
 */
function toggleOrderSummary() {
    const toggle = document.querySelector('.summary-toggle');
    const content = document.getElementById('summaryContent');
    const icon = document.querySelector('.summary-toggle-icon');

    toggle.classList.toggle('expanded');
    content.classList.toggle('expanded');

    if (toggle.classList.contains('expanded')) {
        icon.textContent = '▲';
        document.querySelector('.summary-toggle-text').textContent = 'Ocultar resumo da reserva';
    } else {
        icon.textContent = '▼';
        document.querySelector('.summary-toggle-text').textContent = 'Exibir resumo da reserva';
    }
}
