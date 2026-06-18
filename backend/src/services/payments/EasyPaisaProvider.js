import { PaymentProvider } from './PaymentProvider.js';

export class EasyPaisaProvider extends PaymentProvider {
  async createPayment(payment) {
    return {
      provider: 'EASYPAISA',
      status: 'AUTHORIZED',
      reference: `easypaisa_${Date.now()}`,
      amount: payment.amount,
    };
  }

  async refund(payment) {
    return { provider: 'EASYPAISA', status: 'REFUNDED', reference: payment.providerReference };
  }
}
