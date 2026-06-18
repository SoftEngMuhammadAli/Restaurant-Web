import { PaymentProvider } from './PaymentProvider.js';

export class PaypalProvider extends PaymentProvider {
  async createPayment(payment) {
    return {
      provider: 'PAYPAL',
      status: 'AUTHORIZED',
      reference: `paypal_${Date.now()}`,
      amount: payment.amount,
    };
  }

  async refund(payment) {
    return { provider: 'PAYPAL', status: 'REFUNDED', reference: payment.providerReference };
  }
}
