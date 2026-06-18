import { PaymentProvider } from './PaymentProvider.js';

export class StripeProvider extends PaymentProvider {
  async createPayment(payment) {
    return {
      provider: 'STRIPE',
      status: 'AUTHORIZED',
      reference: `stripe_${Date.now()}`,
      amount: payment.amount,
    };
  }

  async refund(payment) {
    return { provider: 'STRIPE', status: 'REFUNDED', reference: payment.providerReference };
  }
}
