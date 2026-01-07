/**
 * CHECKOUT DE ESTACIONAMENTO - JavaScript
 * Funcionalidades: Captura de URL, validações, formatação e pagamento via Pix
 */

// ============================================
// ESTADO DA APLICAÇÃO
// ============================================

const state = {
    reservationData: {
        entryDate: '',
        entryTime: '',
        exitDate: '',
        exitTime: '',
        parkingType: 'uncovered',
        insurance: false,
        totalDays: '0',
        totalPrice: '0.00',
    },
    formData: {
        name: '',
        cpf: '',
        phone: '',
        email: '',
        licensePlate: '',
        vehicleType: 'sedan',
    },
    isSubmitting: false,
};

// ============================================
// ELEMENTOS DO DOM
// ============================================

const elements = {
    // Formulário
    form: document.getElementById('checkoutForm'),
    nameInput: document.getElementById('name'),
    cpfInput: document.getElementById('cpf'),
    phoneInput: document.getElementById('phone'),
    emailInput: document.getElementById('email'),
    licensePlateInput: document.getElementById('licensePlate'),
    vehicleTypeSelect: document.getElementById('vehicleType'),
    submitBtn: document.getElementById('submitBtn'),

    // Resumo
    summaryEntryDate: document.getElementById('summaryEntryDate'),
    summaryExitDate: document.getElementById('summaryExitDate'),
    summaryParkingType: document.getElementById('summaryParkingType'),
    summaryInsurance: document.getElementById('summaryInsurance'),
    summaryTotalDays: document.getElementById('summaryTotalDays'),
    summaryTotalPrice: document.getElementById('summaryTotalPrice'),

    // Modal
    pixModal: document.getElementById('pixModal'),
    qrCodeImage: document.getElementById('qrCodeImage'),
    modalTotalPrice: document.getElementById('modalTotalPrice'),
    pixKey: document.getElementById('pixKey'),
    copyPixBtn: document.getElementById('copyPixBtn'),
    backBtn: document.getElementById('backBtn'),
    confirmPaymentBtn: document.getElementById('confirmPaymentBtn'),

    // Toast
    toastContainer: document.getElementById('toastContainer'),
};

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    extractUrlParams();
    updateSummary();
    attachEventListeners();
});

// ============================================
// EXTRAÇÃO DE PARÂMETROS DA URL
// ============================================

function extractUrlParams() {
    const params = new URLSearchParams(window.location.search);

    state.reservationData = {
        entryDate: params.get('entryDate') || '',
        entryTime: params.get('entryTime') || '',
        exitDate: params.get('exitDate') || '',
        exitTime: params.get('exitTime') || '',
        parkingType: params.get('parkingType') || 'uncovered',
        insurance: params.get('insurance') === 'true',
        totalDays: params.get('totalDays') || '0',
        totalPrice: params.get('totalPrice') || '0.00',
    };
}

// ============================================
// ATUALIZAÇÃO DO RESUMO
// ============================================

function updateSummary() {
    const { entryDate, entryTime, exitDate, exitTime, parkingType, insurance, totalDays, totalPrice } = state.reservationData;

    elements.summaryEntryDate.textContent = `${formatDate(entryDate)} às ${entryTime}`;
    elements.summaryExitDate.textContent = `${formatDate(exitDate)} às ${exitTime}`;
    elements.summaryParkingType.textContent = parkingType === 'covered' ? 'Coberta' : 'Descoberta';
    elements.summaryInsurance.textContent = insurance ? 'Incluído' : 'Não incluído';
    elements.summaryTotalDays.textContent = totalDays;
    elements.summaryTotalPrice.textContent = formatCurrency(totalPrice);
    elements.modalTotalPrice.textContent = formatCurrency(totalPrice);
}

// ============================================
// FORMATAÇÃO DE DATA
// ============================================

function formatDate(dateStr) {
    if (!dateStr) return '--';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
}

// ============================================
// FORMATAÇÃO DE MOEDA
// ============================================

function formatCurrency(value) {
    const num = parseFloat(value);
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(num);
}

// ============================================
// FORMATAÇÃO DE ENTRADA
// ============================================

function formatCPF(value) {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length <= 3) return cleanValue;
    if (cleanValue.length <= 6) return `${cleanValue.slice(0, 3)}.${cleanValue.slice(3)}`;
    if (cleanValue.length <= 9) return `${cleanValue.slice(0, 3)}.${cleanValue.slice(3, 6)}.${cleanValue.slice(6)}`;
    return `${cleanValue.slice(0, 3)}.${cleanValue.slice(3, 6)}.${cleanValue.slice(6, 9)}-${cleanValue.slice(9, 11)}`;
}

function formatPhone(value) {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length <= 2) return cleanValue;
    if (cleanValue.length <= 7) return `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2)}`;
    return `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2, 7)}-${cleanValue.slice(7, 11)}`;
}

function formatLicensePlate(value) {
    const cleanValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (cleanValue.length <= 3) return cleanValue;
    if (cleanValue.length <= 7) return `${cleanValue.slice(0, 3)}-${cleanValue.slice(3)}`;
    return cleanValue.slice(0, 8);
}

// ============================================
// VALIDAÇÃO
// ============================================

function isValidCPF(cpf) {
    const cleanCpf = cpf.replace(/\D/g, '');
    return cleanCpf.length === 11 && !/^(\d)\1{10}$/.test(cleanCpf);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm() {
    const { name, cpf, phone, email, licensePlate } = state.formData;

    if (!name.trim()) {
        showToast('Por favor, insira seu nome', 'error');
        return false;
    }

    if (!isValidCPF(cpf)) {
        showToast('CPF inválido', 'error');
        return false;
    }

    if (!phone.replace(/\D/g, '') || phone.replace(/\D/g, '').length < 10) {
        showToast('Telefone inválido', 'error');
        return false;
    }

    if (!isValidEmail(email)) {
        showToast('Email inválido', 'error');
        return false;
    }

    if (!licensePlate.trim() || licensePlate.replace(/\D/g, '').length < 7) {
        showToast('Placa do veículo inválida', 'error');
        return false;
    }

    return true;
}

// ============================================
// EVENT LISTENERS
// ============================================

function attachEventListeners() {
    // Formulário
    elements.form.addEventListener('submit', handleFormSubmit);

    // Inputs com formatação
    elements.cpfInput.addEventListener('input', (e) => {
        e.target.value = formatCPF(e.target.value);
        state.formData.cpf = e.target.value;
    });

    elements.phoneInput.addEventListener('input', (e) => {
        e.target.value = formatPhone(e.target.value);
        state.formData.phone = e.target.value;
    });

    elements.licensePlateInput.addEventListener('input', (e) => {
        e.target.value = formatLicensePlate(e.target.value);
        state.formData.licensePlate = e.target.value;
    });

    // Inputs normais
    elements.nameInput.addEventListener('input', (e) => {
        state.formData.name = e.target.value;
    });

    elements.emailInput.addEventListener('input', (e) => {
        state.formData.email = e.target.value;
    });

    elements.vehicleTypeSelect.addEventListener('change', (e) => {
        state.formData.vehicleType = e.target.value;
    });

    // Modal
    elements.copyPixBtn.addEventListener('click', copyPixKey);
    elements.backBtn.addEventListener('click', closePixModal);
    elements.confirmPaymentBtn.addEventListener('click', confirmPayment);

    // Fechar modal ao clicar no overlay
    elements.pixModal.addEventListener('click', (e) => {
        if (e.target === elements.pixModal) {
            closePixModal();
        }
    });
}

// ============================================
// MANIPULADORES DE EVENTOS
// ============================================

function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    state.isSubmitting = true;
    elements.submitBtn.disabled = true;
    elements.submitBtn.innerHTML = '<span class="spinner"></span> Processando...';

    // Simular processamento
    setTimeout(() => {
        showPixModal();
        state.isSubmitting = false;
        elements.submitBtn.disabled = false;
        elements.submitBtn.textContent = 'Prosseguir para Pagamento';
        showToast('Dados validados com sucesso!', 'success');
    }, 1500);
}

function copyPixKey() {
    const pixKey = elements.pixKey.value;
    navigator.clipboard.writeText(pixKey).then(() => {
        showToast('Chave Pix copiada!', 'success');
    }).catch(() => {
        showToast('Erro ao copiar chave Pix', 'error');
    });
}

function confirmPayment() {
    showToast('Pagamento confirmado!', 'success');
    closePixModal();
    // Aqui você pode redirecionar ou fazer outras ações após o pagamento
    setTimeout(() => {
        // Exemplo: window.location.href = '/sucesso';
    }, 2000);
}

// ============================================
// MODAL PIX
// ============================================

function showPixModal() {
    const qrCode = generatePixQrCode();
    elements.qrCodeImage.src = qrCode;
    elements.pixModal.classList.remove('hidden');
}

function closePixModal() {
    elements.pixModal.classList.add('hidden');
}

function generatePixQrCode() {
    // QR Code simulado - em produção, isso viria de um servidor
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="white"/%3E%3Crect x="10" y="10" width="30" height="30" fill="black"/%3E%3Crect x="160" y="10" width="30" height="30" fill="black"/%3E%3Crect x="10" y="160" width="30" height="30" fill="black"/%3E%3Crect x="50" y="50" width="100" height="100" fill="black" opacity="0.1"/%3E%3C/svg%3E';
}

// ============================================
// TOAST
// ============================================

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    elements.toastContainer.appendChild(toast);

    // Auto-remover após 3 segundos
    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// ============================================
// INICIALIZAÇÃO
// ============================================

function init() {
    // Carregar dados da URL
    loadReservationDataFromURL();
    
    // Atualizar resumo
    updateSummary();
    
    // Anexar event listeners
    attachEventListeners();
    
    console.log('Checkout inicializado com sucesso');
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
