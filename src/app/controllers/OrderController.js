class OrderController {
  async store(req, res) {
    return res.json({ ok: true });
  }
}

export default new OrderController();
