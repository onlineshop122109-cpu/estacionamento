// ============================================
// ESTADO GLOBAL
// ============================================

const state = {
    formData: {
        name: '',
        cpf: '',
        phone: '',
        email: '',
        licensePlate: '',
        vehicleType: 'Sedan'
    },
    reservationData: {
        entryDate: '',
        entryTime: '',
        exitDate: '',
        exitTime: '',
        parkingType: 'covered',
        insurance: false,
        totalDays: 0,
        totalPrice: 0
    },
    isSubmitting: false
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

    // Modal Pix
    pixModal: document.getElementById('pixModal'),
    qrCodeImage: document.getElementById('qrCodeImage'),
    pixKey: document.getElementById('pixKey'),
    copyPixBtn: document.getElementById('copyPixBtn'),
    backBtn: document.getElementById('backBtn'),
    confirmPaymentBtn: document.getElementById('confirmPaymentBtn'),
    modalTotalPrice: document.getElementById('modalTotalPrice'),

    // Toast
    toastContainer: document.getElementById('toastContainer')
};

// ============================================
// CARREGAMENTO DE DADOS DA URL
// ============================================

function loadReservationDataFromURL() {
    const params = new URLSearchParams(window.location.search);

    state.reservationData.entryDate = params.get('entryDate') || '';
    state.reservationData.entryTime = params.get('entryTime') || '';
    state.reservationData.exitDate = params.get('exitDate') || '';
    state.reservationData.exitTime = params.get('exitTime') || '';
    state.reservationData.parkingType = params.get('parkingType') || 'covered';
    state.reservationData.insurance = params.get('insurance') === 'true';
    state.reservationData.totalDays = parseInt(params.get('totalDays')) || 0;
    state.reservationData.totalPrice = parseFloat(params.get('totalPrice')) || 0;
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
    const { name, cpf, phone, email } = state.formData;

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

async function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    state.isSubmitting = true;
    elements.submitBtn.disabled = true;
    elements.submitBtn.innerHTML = '<span class="spinner"></span> Processando...';

    try {
        await processPixPayment();
    } catch (error) {
        console.error('Erro:', error);
        showToast(error.message || 'Erro ao processar pagamento', 'error');
        elements.submitBtn.disabled = false;
        elements.submitBtn.textContent = 'Confirmar e Pagar';
        state.isSubmitting = false;
    }
}

async function processPixPayment() {
    const pixData = {
        paymentMethod: 'PIX',
        amount: Math.round(state.reservationData.totalPrice * 100), // Converte para centavos
        customer: {
            name: state.formData.name,
            email: state.formData.email,
            phone: state.formData.phone.replace(/\D/g, ''),
            document: {
                number: state.formData.cpf.replace(/\D/g, ''),
                type: 'CPF'
            }
        },
        items: [{
            title: 'Reserva de Estacionamento',
            quantity: 1,
            price: Math.round(state.reservationData.totalPrice * 100)
        }],
        pix: {
            expiresIn: 3600 // Expira em 1 hora
        }
    };

    try {
        const response = await fetch('/api/payments/pix', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pixData)
        });

        const result = await response.json();

        if (response.ok) {
            showPixModal(result);
            showToast('Dados validados com sucesso!', 'success');
        } else {
            const errorMsg = result.error || result.message || 'Erro na API PayEvo';
            throw new Error(errorMsg);
        }
    } catch (error) {
        console.error('Erro ao gerar PIX:', error);
        throw error;
    }
}

function copyPixKey() {
    const pixKey = elements.pixKey.value;
    navigator.clipboard.writeText(pixKey).then(() => {
        showToast('Chave Pix copiada!', 'success');
        elements.copyPixBtn.textContent = 'Copiado!';
        setTimeout(() => {
            elements.copyPixBtn.textContent = 'Copiar Código';
        }, 2000);
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

function showPixModal(paymentResult) {
    if (paymentResult.pix && paymentResult.pix.qrcode) {
        const pixCode = paymentResult.pix.qrcode;
        
        // Exibe o código "Copia e Cola"
        elements.pixKey.value = pixCode;
        
        // Gera QR Code usando API externa (se disponível)
        if (paymentResult.pix.qrcodeUrl) {
            elements.qrCodeImage.src = paymentResult.pix.qrcodeUrl;
        } else {
            // Fallback: gera QR Code usando uma API pública
            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixCode)}`;
            elements.qrCodeImage.src = qrCodeUrl;
        }

        elements.pixModal.classList.remove('hidden');
        
        // Atualiza o botão de submit
        elements.submitBtn.textContent = 'Já Paguei';
        elements.submitBtn.style.backgroundColor = '#10b981';
        elements.submitBtn.style.borderColor = '#10b981';
        elements.submitBtn.type = 'button';
        elements.submitBtn.onclick = function() {
            window.location.href = '/sucesso';
        };

        state.isSubmitting = false;
        
        // Inicia o contador de tempo para a validade do PIX
        startPixTimer(3600); // 1 hora
    } else {
        throw new Error('Não foi possível obter os dados do PIX.');
    }
}

function closePixModal() {
    elements.pixModal.classList.add('hidden');
}

let pixTimer = null;

function startPixTimer(seconds) {
    const timerElement = document.getElementById('pixTimeRemaining');
    let timeLeft = seconds;
    
    if (pixTimer) clearInterval(pixTimer);
    
    pixTimer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(pixTimer);
            timerElement.textContent = 'Expirado';
            showToast('O código PIX expirou. Por favor, gere um novo código.', 'error');
        }
        
        timeLeft--;
    }, 1000);
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
