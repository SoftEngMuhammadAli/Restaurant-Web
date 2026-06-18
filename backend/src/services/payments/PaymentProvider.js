export class PaymentProvider {
  async createPayment(_payment) {
    throw new Error('createPayment must be implemented');
  }

  async refund(_payment) {
    throw new Error('refund must be implemented');
  }
}
