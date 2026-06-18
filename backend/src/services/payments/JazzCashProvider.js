import { PaymentProvider } from './PaymentProvider.js';

export class JazzCashProvider extends PaymentProvider {
  async createPayment(payment) {
    return {
      provider: 'JAZZCASH',
      status: 'AUTHORIZED',
      reference: `jazzcash_${Date.now()}`,
      amount: payment.amount,
    };
  }

  async refund(payment) {
    return { provider: 'JAZZCASH', status: 'REFUNDED', reference: payment.providerReference };
  }
}
