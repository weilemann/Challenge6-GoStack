import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const assetsFolder = path.resolve(__dirname, '..', 'assets');

export default {
  directory: assetsFolder,

  storage: multer.diskStorage({
    destination: assetsFolder,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
