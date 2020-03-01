import File from '../models/File';

class FileController {
  async store(req, res) {
    // quero guardar originalname como name e filename como path, na BD
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    return res.json(file);
  }
}

export default new FileController();
