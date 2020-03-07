import * as Yup from 'yup';
import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import DeliveryProblem from '../models/DeliveryProblem';

import Mail from '../../lib/Mail';

class DeliveryProblemController {
  async index(req, res) {
    const delivery = await DeliveryProblem.findAll({
      where: {
        delivery_id: req.params.order_id,
      },
      order: ['created_at'],
      attributes: ['id', 'delivery_id', 'description', 'created_at'],
      include: [
        {
          model: Order,
          as: 'order',
          attributes: [
            'id',
            'deliveryman_id',
            'recipient_id',
            'product',
            'canceled_at',
            'start_date',
            'end_date',
          ],
          include: [
            {
              model: Deliveryman,
              as: 'deliveryman',
              attributes: ['id', 'name', 'email'],
            },
            {
              model: Recipient,
              as: 'recipient',
              attributes: ['id', 'name', 'street', 'street_number', 'city'],
            },
          ],
        },
      ],
    });
    return res.json(delivery);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Need to provide a description of problem.' });
    }

    const { order_id } = req.params;
    const { description } = req.body;

    const delivery = await Order.findByPk(order_id);

    if (!delivery) {
      return res.status(400).json({ error: "Delivery doesn't exist." });
    }

    const delivery_problem = await DeliveryProblem.create({
      delivery_id: order_id,
      description,
    });

    return res.json(delivery_problem);
  }

  async destroy(req, res) {
    const problem = await DeliveryProblem.findByPk(req.params.order_id);

    if (!problem) {
      return res.status(400).json({ error: "Problem doesn't exist." });
    }

    const order = await Order.findByPk(problem.delivery_id, {
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!order) {
      return res.status(400).json({ error: "Order doesn't exist anymore." });
    }

    if (order.canceled_at !== null) {
      return res.status(400).json({ error: 'Delivery already canceled.' });
    }

    if (order.end_date !== null) {
      return res.status(400).json({ error: 'Package already delivered.' });
    }

    order.canceled_at = new Date();

    await order.save();

    await Mail.sendMail({
      to: `${order.deliveryman.name} <${order.deliveryman.email}>`,
      subject: `Entrega Cancelada`,
      template: 'cancelationDelivery',
      context: {
        deliveryman: order.deliveryman.name,
        recipient: order.recipient.name,
        product: order.product,
        date: order.canceled_at,
      },
    });

    return res.json(order);
  }
}

export default new DeliveryProblemController();
