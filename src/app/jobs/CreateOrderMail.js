import Mail from '../../lib/Mail';

class CreateOrderMail {
  get key() {
    return 'CreateOrderMail';
  }

  async handle({ data }) {
    const { order, deliverymanExists, recipientExists } = data;

    await Mail.sendMail({
      to: `${deliverymanExists.name} <${deliverymanExists.email}>`,
      subject: `Nova encomenda registada`,
      template: 'createOrder',
      context: {
        deliveryman: deliverymanExists.name,
        recipient: recipientExists.name,
        product: order.product,
      },
    });
  }
}

export default new CreateOrderMail();
