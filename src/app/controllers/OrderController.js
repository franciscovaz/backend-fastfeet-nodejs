import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import Order from '../models/Order';
import File from '../models/File';

class OrderController {
  async index(req, res) {
    const orders = await Order.findAll({
      attributes: [
        'id',
        'recipient_id',
        'deliveryman_id',
        'product',
        'signature_id',
        'canceled_at',
        'start_date',
        'end_date',
      ],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name', 'signature_id'],
          include: [
            {
              model: File,
              as: 'signature',
              attributes: ['url'],
            },
          ],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email', 'avatar_id'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(orders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails.' });
    }

    const { deliveryman_id, recipient_id, product } = req.body;

    const recipientExists = await Recipient.findByPk(recipient_id);

    if (!recipientExists) {
      return res.status(401).json({ error: "Recipient doesn't exist." });
    }

    const deliverymanExists = await Deliveryman.findByPk(deliveryman_id);

    if (!deliverymanExists) {
      return res.status(401).json({ error: "Deliveryman doesn't exist." });
    }

    /* const hourStart = parseISO(start_date);

    if (
      !isWithinInterval(hourStart, {
        start: startOfHour(setHours(hourStart, 8)),
        end: startOfHour(setHours(hourStart, 18)),
      })
    ) {
      return res.status(401).json({
        error: 'You can only withdraw deliveries between 08:00h and 18:00h.',
      });
    }

    /**
     * Check if it's a past hour
     */
    /*
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: "Past dates aren't permitted." });
    } */

    const order = await Order.create({
      recipient_id,
      deliveryman_id,
      product,
    });
    return res.json(order);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
      product: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails' });
    }

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(400).json({ error: "Order doesn't exist." });
    }

    const { recipient_id, deliveryman_id, product } = req.body;

    const recipientExists = await Recipient.findByPk(recipient_id);

    if (!recipientExists) {
      return res.status(401).json({ error: "Recipient doesn't exist." });
    }

    const deliverymanExists = await Deliveryman.findByPk(deliveryman_id);

    if (!deliverymanExists) {
      return res.status(401).json({ error: "Deliveryman doesn't exist." });
    }

    const { id } = await order.update(req.body);

    return res.json({ id, recipient_id, deliveryman_id, product });
  }

  async delete(req, res) {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(401).json({ error: "Order doesn't exist." });
    }

    await order.destroy();

    return res.json(order);
  }
}

export default new OrderController();
