// ===========================
// VARIÁVEIS GLOBAIS
// ===========================

const reservationForm = document.getElementById('reservationForm');
const confirmationForm = document.getElementById('confirmationForm');
const modal = document.getElementById('reservationModal');
const modalClose = document.querySelector('.modal-close');

const entryDateInput = document.getElementById('entryDate');
const exitDateInput = document.getElementById('exitDate');
const parkingTypeSelect = document.getElementById('parkingType');

// Elementos de resumo
const summaryEntry = document.getElementById('summaryEntry');
const summaryExit = document.getElementById('summaryExit');
const summaryType = document.getElementById('summaryType');
const summaryDays = document.getElementById('summaryDays');
const summaryPrice = document.getElementById('summaryPrice');
const summaryTotal = document.getElementById('summaryTotal');

// Elementos do modal
const modalEntry = document.getElementById('modalEntry');
const modalExit = document.getElementById('modalExit');
const modalType = document.getElementById('modalType');
const modalDays = document.getElementById('modalDays');
const modalTotal = document.getElementById('modalTotal');

// Dados da reserva
let reservationData = {
    entryDate: null,
    exitDate: null,
    parkingType: null,
    days: 0,
    total: 0
};

// Preços
const PRICES = {
    covered: 19.00,
    open: 12.00
};

// ===========================
// FUNÇÕES UTILITÁRIAS
// ===========================

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function calculateDays(entryDate, exitDate) {
    const diffTime = Math.abs(exitDate - entryDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
}

function formatCurrency(value) {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

function updateSummary() {
    if (!reservationData.entryDate || !reservationData.exitDate || !reservationData.parkingType) {
        return;
    }

    const entryDate = new Date(reservationData.entryDate);
    const exitDate = new Date(reservationData.exitDate);

    if (exitDate <= entryDate) {
        summaryEntry.textContent = '--/--/---- 12:00';
        summaryExit.textContent = '--/--/---- 12:00';
        summaryDays.textContent = '0';
        summaryPrice.textContent = 'R$ 0,00';
        summaryTotal.textContent = 'R$ 0,00';
        return;
    }

    const days = calculateDays(entryDate, exitDate);
    const price = PRICES[reservationData.parkingType];
    const total = days * price;

    const parkingTypeLabel = reservationData.parkingType === 'covered' ? 'Coberta' : 'Descoberta';

    summaryEntry.textContent = formatDate(entryDate);
    summaryExit.textContent = formatDate(exitDate);
    summaryType.textContent = parkingTypeLabel;
    summaryDays.textContent = days;
    summaryPrice.textContent = formatCurrency(price);
    summaryTotal.textContent = formatCurrency(total);

    // Atualizar dados da reserva
    reservationData.days = days;
    reservationData.total = total;
}

function updateModalSummary() {
    const entryDate = new Date(reservationData.entryDate);
    const exitDate = new Date(reservationData.exitDate);
    const parkingTypeLabel = reservationData.parkingType === 'covered' ? 'Coberta' : 'Descoberta';

    modalEntry.textContent = formatDate(entryDate);
    modalExit.textContent = formatDate(exitDate);
    modalType.textContent = parkingTypeLabel;
    modalDays.textContent = reservationData.days;
    modalTotal.textContent = formatCurrency(reservationData.total);
}

// ===========================
// VALIDAÇÃO DE FORMULÁRIO
// ===========================

function validateFullName(fullName) {
    const trimmed = fullName.trim();
    if (!trimmed) return 'Nome completo é obrigatório';
    if (trimmed.split(' ').length < 2) return 'Informe nome e sobrenome';
    return '';
}

function validateCPF(cpf) {
    if (!cpf.trim()) return 'CPF é obrigatório';
    const cpfClean = cpf.replace(/\D/g, '');
    if (cpfClean.length !== 11) return 'CPF deve conter 11 dígitos';
    return '';
}

function validateEmail(email) {
    if (!email.trim()) return 'E-mail é obrigatório';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'E-mail inválido';
    return '';
}

function validatePhone(phone) {
    if (!phone.trim()) return 'Telefone é obrigatório';
    const phoneClean = phone.replace(/\D/g, '');
    if (phoneClean.length < 10 || phoneClean.length > 11) return 'Telefone deve conter 10 ou 11 dígitos';
    return '';
}

function validateLicensePlate(plate) {
    if (!plate.trim()) return 'Placa do veículo é obrigatória';
    const plateRegex = /^[A-Z]{3}-?\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/;
    if (!plateRegex.test(plate.toUpperCase())) return 'Placa inválida (use ABC-1234 ou ABC1D23)';
    return '';
}

function validateVehicleType(type) {
    if (!type) return 'Tipo de veículo é obrigatório';
    return '';
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    if (message) {
        field.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    } else {
        field.classList.remove('error');
        errorElement.classList.remove('show');
        errorElement.textContent = '';
    }
}

function validateConfirmationForm() {
    const fullName = document.getElementById('fullName').value;
    const cpf = document.getElementById('cpf').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const licensePlate = document.getElementById('licensePlate').value;
    const vehicleType = document.getElementById('vehicleType').value;

    let isValid = true;

    const fullNameError = validateFullName(fullName);
    showError('fullName', fullNameError);
    if (fullNameError) isValid = false;

    const cpfError = validateCPF(cpf);
    showError('cpf', cpfError);
    if (cpfError) isValid = false;

    const emailError = validateEmail(email);
    showError('email', emailError);
    if (emailError) isValid = false;

    const phoneError = validatePhone(phone);
    showError('phone', phoneError);
    if (phoneError) isValid = false;

    const licensePlateError = validateLicensePlate(licensePlate);
    showError('licensePlate', licensePlateError);
    if (licensePlateError) isValid = false;

    const vehicleTypeError = validateVehicleType(vehicleType);
    showError('vehicleType', vehicleTypeError);
    if (vehicleTypeError) isValid = false;

    return isValid;
}

// ===========================
// EVENTOS DO FORMULÁRIO DE RESERVA
// ===========================

entryDateInput.addEventListener('change', () => {
    reservationData.entryDate = entryDateInput.value;
    updateSummary();
});

exitDateInput.addEventListener('change', () => {
    reservationData.exitDate = exitDateInput.value;
    updateSummary();
});

parkingTypeSelect.addEventListener('change', () => {
    reservationData.parkingType = parkingTypeSelect.value;
    updateSummary();
});

reservationForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!reservationData.entryDate || !reservationData.exitDate || !reservationData.parkingType) {
        alert('Por favor, preencha todos os campos');
        return;
    }

    const entryDate = new Date(reservationData.entryDate);
    const exitDate = new Date(reservationData.exitDate);

    if (exitDate <= entryDate) {
        alert('A data de saída deve ser posterior à data de entrada');
        return;
    }

    updateModalSummary();
    modal.classList.add('active');
});

// ===========================
// EVENTOS DO MODAL
// ===========================

modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

confirmationForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateConfirmationForm()) {
        return;
    }

    // Preparar dados para envio
    const formData = {
        fullName: document.getElementById('fullName').value,
        cpf: document.getElementById('cpf').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        licensePlate: document.getElementById('licensePlate').value,
        vehicleType: document.getElementById('vehicleType').value,
        entryDate: reservationData.entryDate,
        exitDate: reservationData.exitDate,
        parkingType: reservationData.parkingType,
        days: reservationData.days,
        total: reservationData.total
    };

    // Salvar dados em sessionStorage para possível recuperação
    sessionStorage.setItem('reservationData', JSON.stringify(formData));

    // Redirecionar para gateway de pagamento
    const paymentUrl = `https://pagonline.onrender.com/?subtotal=${formData.total.toFixed(2)}`;
    window.location.href = paymentUrl;
});

// ===========================
// FAQ ACCORDION
// ===========================

const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach((question) => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');

        // Fechar todos os itens
        document.querySelectorAll('.faq-item').forEach((item) => {
            item.classList.remove('active');
        });

        // Abrir o item clicado se não estava ativo
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// ===========================
// INICIALIZAÇÃO
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    // Definir data mínima como hoje
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    const minDate = today.toISOString().slice(0, 16);
    
    entryDateInput.min = minDate;
    exitDateInput.min = minDate;

    // Atualizar data mínima de saída quando entrada mudar
    entryDateInput.addEventListener('change', () => {
        if (entryDateInput.value) {
            exitDateInput.min = entryDateInput.value;
        }
    });

    console.log('GuaruPark - Sistema de Reserva Carregado');
});
