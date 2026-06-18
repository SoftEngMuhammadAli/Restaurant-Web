import { ApiError } from '../utils/ApiError.js';
import { Payment } from '../models/Payment.js';
import { Order } from '../models/Order.js';
import { Transaction } from '../models/Transaction.js';
import { StripeProvider } from './payments/StripeProvider.js';
import { PaypalProvider } from './payments/PaypalProvider.js';
import { JazzCashProvider } from './payments/JazzCashProvider.js';
import { EasyPaisaProvider } from './payments/EasyPaisaProvider.js';

const providers = {
  STRIPE: new StripeProvider(),
  PAYPAL: new PaypalProvider(),
  JAZZCASH: new JazzCashProvider(),
  EASYPAISA: new EasyPaisaProvider(),
};

class PaymentService {
  async create({ user, payload }) {
    const order = await Order.findOne({ _id: payload.order, restaurant: user.restaurant, deletedAt: null });
    if (!order) throw new ApiError(404, 'Order not found');

    const provider = providers[payload.provider];
    if (!provider && payload.provider !== 'CASH') throw new ApiError(400, 'Unsupported payment provider');

    const payment = await Payment.create({
      restaurant: user.restaurant,
      order: order._id,
      provider: payload.provider,
      amount: payload.amount || order.grandTotal,
      currency: payload.currency || 'USD',
      status: payload.provider === 'CASH' ? 'PAID' : 'PENDING',
    });

    if (provider) {
      const result = await provider.createPayment(payment);
      payment.status = result.status;
      payment.providerReference = result.reference;
      payment.metadata = result;
      await payment.save();
    }

    await Transaction.create({
      payment: payment._id,
      type: 'CAPTURE',
      amount: payment.amount,
      status: payment.status === 'FAILED' ? 'FAILED' : 'SUCCESS',
      reference: payment.providerReference,
      raw: payment.metadata,
    });

    if (['PAID', 'AUTHORIZED'].includes(payment.status)) {
      order.paymentStatus = 'PAID';
      await order.save();
    }

    return payment;
  }
}

export const paymentService = new PaymentService();
