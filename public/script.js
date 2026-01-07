/* ============================================
   CHECKOUT DE ESTACIONAMENTO - CSS
   Design: Minimalismo Corporativo
   Paleta: Azul profundo, Verde sucesso, Vermelho erro
   ============================================ */

/* ============================================
   RESET E VARIÁVEIS
   ============================================ */

:root {
    --primary: #1e40af;
    --primary-hover: #1e3a8a;
    --primary-light: #3b82f6;
    --success: #10b981;
    --success-light: #d1fae5;
    --error: #ef4444;
    --error-light: #fee2e2;
    --background: #ffffff;
    --foreground: #1f2937;
    --border: #e5e7eb;
    --muted: #9ca3af;
    --muted-light: #f3f4f6;
    --radius: 0.5rem;
    --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background-color: var(--background);
    color: var(--foreground);
    line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
}

/* ============================================
   CONTAINER E LAYOUT
   ============================================ */

.container {
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1rem;
}

@media (min-width: 640px) {
    .container {
        padding: 0 1.5rem;
    }
}

@media (min-width: 1024px) {
    .container {
        padding: 0 2rem;
    }
}

/* ============================================
   HEADER
   ============================================ */

.header {
    border-bottom: 1px solid var(--border);
    background-color: var(--background);
    box-shadow: var(--shadow);
    padding: 1.5rem 0;
}

.header-title {
    font-size: 1.875rem;
    font-weight: 700;
    color: var(--foreground);
    margin-bottom: 0.25rem;
}

.header-subtitle {
    font-size: 0.875rem;
    color: var(--muted);
}

/* ============================================
   MAIN CONTAINER
   ============================================ */

.main-container {
    padding: 2rem 0;
    min-height: calc(100vh - 120px);
}

.checkout-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
}

@media (min-width: 1024px) {
    .checkout-grid {
        grid-template-columns: 2fr 1fr;
    }
}

/* ============================================
   FORMULÁRIO
   ============================================ */

.form-section {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.checkout-form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

/* ============================================
   CARDS
   ============================================ */

.form-card {
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1.5rem;
    background-color: var(--background);
    box-shadow: var(--shadow);
}

.card-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
}

.card-icon {
    width: 1.25rem;
    height: 1.25rem;
    color: var(--primary);
    flex-shrink: 0;
}

.card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--foreground);
}

/* ============================================
   FORMULÁRIO - GRUPOS
   ============================================ */

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
}

@media (min-width: 640px) {
    .form-row {
        grid-template-columns: 1fr 1fr;
    }
}

.form-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--foreground);
}

.form-input,
.form-input select {
    padding: 0.75rem;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    font-size: 1rem;
    font-family: inherit;
    background-color: var(--background);
    color: var(--foreground);
    transition: all 0.2s ease;
}

.form-input:focus,
.form-input select:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
}

.form-input::placeholder {
    color: var(--muted);
}

.form-input:invalid:not(:placeholder-shown) {
    border-color: var(--error);
}

/* ============================================
   PAGAMENTO
   ============================================ */

.payment-option {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid var(--primary);
    border-radius: var(--radius);
    background-color: rgba(30, 64, 175, 0.05);
    cursor: pointer;
    transition: all 0.2s ease;
}

.payment-option:hover {
    background-color: rgba(30, 64, 175, 0.1);
}

.payment-radio {
    width: 1.25rem;
    height: 1.25rem;
    cursor: pointer;
    accent-color: var(--primary);
}

.payment-label {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    cursor: pointer;
    flex: 1;
}

.payment-name {
    font-weight: 500;
    color: var(--foreground);
}

.payment-desc {
    font-size: 0.875rem;
    color: var(--muted);
}

/* ============================================
   BOTÃO DE ENVIO
   ============================================ */

.submit-btn {
    padding: 1.5rem;
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: var(--radius);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
    background-color: var(--primary-hover);
    box-shadow: var(--shadow-md);
}

.submit-btn:active:not(:disabled) {
    transform: scale(0.98);
}

.submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.submit-btn.loading {
    pointer-events: none;
}

/* ============================================
   RESUMO DA RESERVA
   ============================================ */

.summary-section {
    display: flex;
    flex-direction: column;
}

.summary-card {
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1.5rem;
    background-color: var(--background);
    box-shadow: var(--shadow-md);
    position: sticky;
    top: 2rem;
}

.summary-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--foreground);
    margin-bottom: 1.5rem;
}

.summary-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-bottom: 1.5rem;
}

.summary-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.summary-label {
    font-size: 0.875rem;
    color: var(--muted);
}

.summary-value {
    font-size: 1rem;
    font-weight: 500;
    color: var(--foreground);
}

.summary-divider {
    height: 1px;
    background-color: var(--border);
    margin: 1rem 0;
}

.summary-total {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 0.5rem;
}

.total-label {
    font-size: 0.875rem;
    color: var(--muted);
}

.total-value {
    font-size: 1.875rem;
    font-weight: 700;
    color: var(--primary);
}

.summary-payment-method {
    font-size: 0.75rem;
    color: var(--muted);
    margin-bottom: 1rem;
}

/* ============================================
   BADGE DE SEGURANÇA
   ============================================ */

.security-badge {
    display: flex;
    gap: 0.75rem;
    padding: 0.75rem;
    background-color: rgba(16, 185, 129, 0.1);
    border-radius: var(--radius);
}

.badge-icon {
    width: 1.25rem;
    height: 1.25rem;
    color: var(--success);
    flex-shrink: 0;
}

.badge-text {
    font-size: 0.75rem;
    color: var(--foreground);
}

/* ============================================
   MODAL PIX
   ============================================ */

.modal {
    position: fixed;
    inset: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal.hidden {
    display: none;
}

.modal-overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
    position: relative;
    z-index: 51;
    background-color: var(--background);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 2rem;
    max-width: 28rem;
    width: 100%;
    margin: 1rem;
    box-shadow: var(--shadow-md);
}

.modal-header {
    text-align: center;
    margin-bottom: 1.5rem;
}

.modal-icon {
    width: 4rem;
    height: 4rem;
    color: var(--success);
    margin: 0 auto 1.5rem;
}

.modal-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--foreground);
    margin-bottom: 0.5rem;
}

.modal-subtitle {
    font-size: 0.875rem;
    color: var(--muted);
}

/* ============================================
   QR CODE
   ============================================ */

.qr-code-container {
    display: flex;
    justify-content: center;
    background-color: white;
    padding: 1rem;
    margin-bottom: 1.5rem;
    border-radius: var(--radius);
}

.qr-code {
    width: 16rem;
    height: 16rem;
}

/* ============================================
   VALOR DO PAGAMENTO
   ============================================ */

.modal-amount {
    background-color: var(--muted-light);
    padding: 1rem;
    border-radius: var(--radius);
    margin-bottom: 1.5rem;
}

.amount-label {
    font-size: 0.875rem;
    color: var(--muted);
    margin-bottom: 0.5rem;
}

.amount-value {
    font-size: 1.875rem;
    font-weight: 700;
    color: var(--foreground);
}

/* ============================================
   CHAVE PIX
   ============================================ */

.pix-key-section {
    margin-bottom: 1.5rem;
}

.pix-key-label {
    font-size: 0.75rem;
    color: var(--muted);
    margin-bottom: 0.5rem;
}

.pix-key-input-group {
    display: flex;
    gap: 0.5rem;
}

.pix-key-input {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    font-size: 0.875rem;
    background-color: var(--muted-light);
    color: var(--foreground);
}

.copy-btn {
    padding: 0.75rem 1rem;
    background-color: var(--background);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--foreground);
    cursor: pointer;
    transition: all 0.2s ease;
}

.copy-btn:hover {
    background-color: var(--muted-light);
    border-color: var(--primary);
}

/* ============================================
   BOTÕES DO MODAL
   ============================================ */

.modal-buttons {
    display: flex;
    gap: 0.75rem;
}

.modal-btn {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.modal-btn-secondary {
    background-color: var(--background);
    color: var(--foreground);
}

.modal-btn-secondary:hover {
    background-color: var(--muted-light);
    border-color: var(--primary);
}

.modal-btn-primary {
    background-color: var(--success);
    color: white;
    border-color: var(--success);
}

.modal-btn-primary:hover {
    background-color: #059669;
}

/* ============================================
   TOAST
   ============================================ */

.toast-container {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 100;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    pointer-events: none;
}

.toast {
    padding: 1rem;
    border-radius: var(--radius);
    box-shadow: var(--shadow-md);
    font-size: 0.875rem;
    font-weight: 500;
    animation: slideIn 0.3s ease;
    pointer-events: auto;
}

.toast.success {
    background-color: var(--success);
    color: white;
}

.toast.error {
    background-color: var(--error);
    color: white;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOut {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

.toast.removing {
    animation: slideOut 0.3s ease;
}

/* ============================================
   SPINNER
   ============================================ */

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.spinner {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

/* ============================================
   RESPONSIVO
   ============================================ */

@media (max-width: 768px) {
    .header-title {
        font-size: 1.5rem;
    }

    .summary-card {
        position: static;
        top: auto;
    }

    .modal-content {
        margin: 1rem;
    }

    .qr-code {
        width: 12rem;
        height: 12rem;
    }
}
