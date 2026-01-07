// Design Philosophy: Neomorphism Automotivo Premium
// Backend Server para Checkout de Reserva de Estacionamento GuaruPark

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration
const PAYEVO_API_URL = 'https://apiv2.payevo.com.br/functions/v1/transactions';
const PAYEVO_SECRET_KEY = process.env.PAYEVO_SECRET_KEY;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'GuaruPark Checkout Server' });
});

/**
 * Process payment by method
 */
app.post('/api/payments/:method', async (req, res) => {
    const { method } = req.params;
    const paymentData = req.body;

    try {
        console.log(`Processing ${method} payment:`, paymentData);

        // Validate payment method
        if (!['pix', 'credit', 'boleto'].includes(method)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid payment method' 
            });
        }

        // Validate required fields
        if (!paymentData.email || !paymentData.firstName || !paymentData.cpf) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }

        // Format payment data for Payevo API
        const formattedPaymentData = formatPaymentData(method, paymentData);

        // Send to Payevo API
        const authHeader = `Basic ${Buffer.from(PAYEVO_SECRET_KEY + ':').toString('base64')}`;
        const response = await axios.post(PAYEVO_API_URL, formattedPaymentData, {
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        console.log('Payevo response:', response.data);

        // Save reservation to database (mock implementation)
        saveReservation(paymentData, response.data);

        // Send success response
        res.status(200).json({
            success: true,
            message: 'Payment processed successfully',
            transactionId: response.data.id || generateTransactionId(),
            data: response.data
        });

    } catch (error) {
        console.error('Payment processing error:', error.response?.data || error.message);
        
        res.status(error.response?.status || 500).json({
            success: false,
            message: error.response?.data?.message || 'Error processing payment',
            error: error.response?.data || { message: error.message }
        });
    }
});

/**
 * Get reservation by ID
 */
app.get('/api/reservations/:id', (req, res) => {
    const { id } = req.params;
    
    // Mock implementation - in production, query database
    const reservation = {
        id: id,
        status: 'confirmed',
        customerName: 'João Silva',
        vehiclePlate: 'ABC1D23',
        entryDate: '15/01/2026',
        entryTime: '14:00',
        exitDate: '18/01/2026',
        exitTime: '14:00',
        totalPrice: 180.00,
        paymentMethod: 'pix'
    };

    res.json(reservation);
});

/**
 * List all reservations (admin)
 */
app.get('/api/reservations', (req, res) => {
    // Mock implementation - in production, query database
    const reservations = [
        {
            id: 'GP12345678',
            customerName: 'João Silva',
            vehiclePlate: 'ABC1D23',
            entryDate: '15/01/2026',
            totalPrice: 180.00,
            status: 'confirmed'
        },
        {
            id: 'GP12345679',
            customerName: 'Maria Santos',
            vehiclePlate: 'XYZ9W87',
            entryDate: '16/01/2026',
            totalPrice: 200.00,
            status: 'confirmed'
        }
    ];

    res.json(reservations);
});

/**
 * Webhook for payment status updates
 */
app.post('/api/webhooks/payment', (req, res) => {
    const { transactionId, status, paymentMethod } = req.body;

    console.log(`Webhook received - Transaction: ${transactionId}, Status: ${status}`);

    // Update reservation status in database
    updateReservationStatus(transactionId, status);

    // Send confirmation
    res.json({ success: true, message: 'Webhook processed' });
});

// Helper Functions

/**
 * Format payment data according to payment method
 */
function formatPaymentData(method, paymentData) {
    const baseData = {
        amount: Math.round(paymentData.totalAmount * 100), // Convert to cents
        currency: 'BRL',
        description: `Reserva de Estacionamento - ${paymentData.vehiclePlate}`,
        customer: {
            name: paymentData.firstName,
            email: paymentData.email,
            phone: paymentData.phone,
            document: paymentData.cpf.replace(/\D/g, ''),
        },
        metadata: {
            reservationId: generateReservationId(),
            vehiclePlate: paymentData.vehiclePlate,
            vehicleType: paymentData.vehicleType,
            entryDate: paymentData.entryDate,
            exitDate: paymentData.exitDate,
            parkingType: paymentData.parkingType,
            insurance: paymentData.insurance,
        }
    };

    // Add method-specific data
    switch (method) {
        case 'pix':
            return {
                ...baseData,
                paymentMethod: 'pix',
                pixKey: process.env.PIX_KEY || 'chave-pix-default'
            };

        case 'credit':
            return {
                ...baseData,
                paymentMethod: 'credit_card',
                card: {
                    number: paymentData.cardNumber.replace(/\s/g, ''),
                    holderName: paymentData.cardName,
                    expiryMonth: paymentData.cardExpiry.split('/')[0],
                    expiryYear: '20' + paymentData.cardExpiry.split('/')[1],
                    cvv: paymentData.cardCvv,
                },
                installments: parseInt(paymentData.installments) || 1
            };

        case 'boleto':
            return {
                ...baseData,
                paymentMethod: 'boleto',
                dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            };

        default:
            return baseData;
    }
}

/**
 * Generate unique reservation ID
 */
function generateReservationId() {
    return `GP${Date.now().toString().slice(-8)}`;
}

/**
 * Generate unique transaction ID
 */
function generateTransactionId() {
    return `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Save reservation to database (mock implementation)
 */
function saveReservation(paymentData, transactionData) {
    const reservation = {
        id: generateReservationId(),
        ...paymentData,
        transactionId: transactionData.id,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    console.log('Reservation saved:', reservation);

    // In production, save to database:
    // db.reservations.insert(reservation);
    // Send confirmation email
    // sendConfirmationEmail(paymentData.email, reservation);
}

/**
 * Update reservation status (mock implementation)
 */
function updateReservationStatus(transactionId, status) {
    console.log(`Updating reservation ${transactionId} to status: ${status}`);

    // In production:
    // db.reservations.updateOne({ transactionId }, { $set: { status } });
}

/**
 * Send confirmation email (mock implementation)
 */
function sendConfirmationEmail(email, reservation) {
    console.log(`Sending confirmation email to ${email}`);

    // In production, integrate with email service (SendGrid, Mailgun, etc.)
    // const mailOptions = {
    //     from: 'noreply@guarupark.com',
    //     to: email,
    //     subject: 'Reserva de Estacionamento Confirmada',
    //     html: generateEmailTemplate(reservation)
    // };
    // transporter.sendMail(mailOptions);
}

/**
 * Generate email template (mock implementation)
 */
function generateEmailTemplate(reservation) {
    return `
        <h2>Reserva Confirmada!</h2>
        <p>Código: ${reservation.id}</p>
        <p>Placa: ${reservation.vehiclePlate}</p>
        <p>Entrada: ${reservation.entryDate} às ${reservation.entryTime}</p>
        <p>Saída: ${reservation.exitDate} às ${reservation.exitTime}</p>
        <p>Valor: R$ ${reservation.totalPrice.toFixed(2)}</p>
    `;
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'production' ? {} : err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚗 GuaruPark Checkout Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`API URL: http://localhost:${PORT}`);
});

module.exports = app;
