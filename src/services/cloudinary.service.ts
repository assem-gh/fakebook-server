import { v2 } from 'cloudinary';
import { FileArray, UploadedFile } from 'express-fileupload';

import { cloudinary } from '../config';

v2.config({
  cloud_name: cloudinary.NAME,
  api_key: cloudinary.KEY,
  api_secret: cloudinary.SECRET,
  secure: true,
});

const upload = (files: FileArray | undefined, userId: string) => {
  if (!files) return Promise.resolve([]);

  const images = Object.values(files).map(
    (file: UploadedFile) =>
      new Promise<string>((resolve, reject) => {
        v2.uploader
          .upload_stream(
            {
              resource_type: 'image',
              folder: `fakebook/${userId}/posts/`,
            },
            (error, result) => {
              if (error) {
                return reject(error);
              }
              resolve(result?.secure_url as string);
            }
          )
          .end(file.data);
      })
  );

  return Promise.all(images);
};

export default { upload };
