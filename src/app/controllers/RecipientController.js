import * as Yup from 'yup';
import Recipient from '../models/Recipient';
import File from '../models/File';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      street_number: Yup.number().required(),
      complement: Yup.string().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      cep: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(401)
        .json({ error: 'Validation Fails. Need to have all data' });
    }

    if (req.body.signature_id) {
      const signatureExists = await File.findByPk(req.body.signature_id);

      if (!signatureExists) {
        return res.status(400).json({ error: 'Signature ID doesnt exists.' });
      }
    }

    const recipient = await Recipient.create(req.body);

    return res.json(recipient);
  }

  async update(req, res) {
    // TODO validar cep, numbers...
    const schema = Yup.object().shape({
      name: Yup.string(),
      street: Yup.string(),
      street_number: Yup.number(),
      complement: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      cep: Yup.string(),
    });

    if (!req.params.id) {
      return res.status(401).json({ error: 'ID of recipient not provided.' });
    }

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails.' });
    }

    const recipientExists = await Recipient.findByPk(req.params.id);

    if (!recipientExists) {
      return res.status(400).json({ error: 'Recipient not exists.' });
    }

    if (req.body.signature_id) {
      const signatureExists = await File.findByPk(req.body.signature_id);

      if (!signatureExists) {
        return res.status(400).json({ error: 'Signature ID doesnt exists.' });
      }
    }

    const {
      id,
      name,
      street,
      street_number,
      complement,
      state,
      city,
      cep,
      signature_id,
    } = await recipientExists.update(req.body);

    return res.json({
      id,
      name,
      street,
      street_number,
      complement,
      state,
      city,
      cep,
      signature_id,
    });
  }
}

export default new RecipientController();
