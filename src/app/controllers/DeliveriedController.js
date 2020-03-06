import { isBefore, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import * as Yup from 'yup';
import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import File from '../models/File';

class DeliveriedController {
  async index(req, res) {
    const { deliveryman_id } = req.params;
    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(400).json({ error: "Deliveryman doesn't exist." });
    }

    const deliveries_delivered = await Order.findAll({
      where: {
        deliveryman_id,
        end_date: {
          [Op.ne]: null,
        },
      },
    });

    return res.json(deliveries_delivered);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      signature_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { delivery_id, deliveryman_id } = req.params;
    const { signature_id } = req.body;

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(400).json({ error: "Deliveryman doesn't exist." });
    }

    const order = await Order.findByPk(delivery_id, {
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name', 'signature_id'],
        },
      ],
    });

    if (!order) {
      return res.status(401).json({ error: "Order doesn't exist." });
    }

    if (order.deliveryman_id !== deliveryman.id) {
      res.status(401).json({ error: 'Order assigned to another deliveryman.' });
    }

    if (!order.start_date) {
      return res
        .status(400)
        .json({ error: "Order delivery doesn't started yet." });
    }

    if (order.canceled_at) {
      return res.status(400).json({ error: 'Order already canceled.' });
    }

    const WithdrawalsCount = await Order.findAndCountAll({
      where: {
        start_date: {
          [Op.between]: [startOfDay(new Date()), endOfDay(new Date())],
        },
        deliveryman_id,
      },
    });

    if (WithdrawalsCount.count === 5 || WithdrawalsCount.count > 5) {
      return res
        .status(401)
        .json({ error: 'The limit of start withdrawals was reached.' });
    }

    // Verify if end_date > start_date
    if (isBefore(new Date(), order.start_date)) {
      return res
        .status(400)
        .json({ error: 'Start date is more recent than end date.' });
    }

    const signature = await File.findByPk(signature_id);
    if (!signature) {
      return res.status(400).json({ error: "Signature doesn't exist." });
    }

    await order.update({
      end_date: new Date(),
      signature_id,
    });

    return res.json(order);
  }
}

export default new DeliveriedController();
