import * as Yup from 'yup';
import {
  parseISO,
  startOfHour,
  setHours,
  isWithinInterval,
  isBefore,
} from 'date-fns';

import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';

class DeliveryController {
  async update(req, res) {
    const schema = Yup.object().shape({
      deliveryman_id: Yup.number().required(),
      order_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails.' });
    }

    const { order_id, deliveryman_id } = req.body;

    const order = await Order.findByPk(order_id);

    if (!order) {
      return res.status(401).json({ error: "Order doesn't exist." });
    }

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(401).json({ error: "Deliveryman doesn't exist." });
    }

    // check if deliveryman have the choosen order
    if (order.deliveryman_id !== deliveryman_id) {
      return res
        .status(401)
        .json({ error: "Deliveryman isn't asigned to choosen order." });
    }

    // se data atual do start ésta entre as 8h e as 18h, e se nao é data do passado

    // const currentDate = new Date();
    const currentDate = parseISO('2020-03-05T17:17:39.082Z');

    // console.log('Current Date: ', currentDate);

    if (
      !isWithinInterval(currentDate, {
        start: startOfHour(setHours(currentDate, 8)),
        end: startOfHour(setHours(currentDate, 18)),
      })
    ) {
      return res.status(401).json({
        error: 'You can only withdraw deliveries between 08:00h and 18:00h.',
      });
    }

    /**
     * Check if it's a past hour
     */
    if (isBefore(currentDate, new Date())) {
      return res.status(400).json({ error: "Past dates aren't permitted." });
    }

    const updatedOrder = await order.update({
      start_date: currentDate,
    });

    return res.json(updatedOrder);
  }
}

export default new DeliveryController();
