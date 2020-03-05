import { isBefore } from 'date-fns';
import Order from '../models/Order';

class DeliveriedController {
  async update(req, res) {
    const { order_id } = req.params;

    const order = await Order.findByPk(order_id);

    if (!order) {
      return res.status(401).json({ error: "Order doesn't exist." });
    }

    if (!order.start_date) {
      return res
        .status(400)
        .json({ error: "Order delivery doesn't started yet." });
    }

    if (order.canceled_at) {
      return res.status(400).json({ error: 'Order already canceled.' });
    }

    // Verify if end_date > start_date
    if (isBefore(new Date(), order.start_date)) {
      return res
        .status(400)
        .json({ error: 'Start date is more recent than end date.' });
    }

    await order.update({
      end_date: new Date(),
    });

    return res.json(order);
  }
}

export default new DeliveriedController();
