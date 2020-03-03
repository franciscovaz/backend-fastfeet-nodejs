import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import Order from '../models/Order';

class OrderController {
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
}

export default new OrderController();
