import * as Yup from 'yup';
import {
  startOfDay,
  endOfDay,
  startOfHour,
  setHours,
  isWithinInterval,
  isBefore,
} from 'date-fns';
import { Op } from 'sequelize';

import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';

class DeliveryController {
  async index(req, res) {
    const { deliveryman_id } = req.params;

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(400).json({ error: "Deliveryman doesn't exist." });
    }

    const deliveries = await Order.findAll({
      where: {
        deliveryman_id,
        end_date: null,
        canceled_at: null,
      },
    });

    if (!deliveries.length) {
      return res
        .status(400)
        .json({ error: "This deliveryman doesn't have deliveries." });
    }

    return res.json(deliveries);
  }

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
        .json({ error: 'the limit of start withdrawals reached' });
    }

    // se data atual do start ésta entre as 8h e as 18h, e se nao é data do passado

    const currentDate = new Date();
    // const currentDate = parseISO('2020-03-05T17:17:39.082Z');

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
