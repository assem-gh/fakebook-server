import {v2} from 'cloudinary';
import {FileArray, UploadedFile,} from 'express-fileupload';

import {cloudinary} from '../config';

v2.config({
    cloud_name: cloudinary.NAME,
    api_key: cloudinary.KEY,
    api_secret: cloudinary.SECRET,
    secure: true,
});

const upload = (files: FileArray | undefined, userId: string) => {
    if (!files?.images) return Promise.resolve([]);

    const images = Object.values(files.images).map(
        (file: UploadedFile) =>
            new Promise<string>((resolve, reject) => {
                v2.uploader
                    .upload_stream(
                        {
                            resource_type: 'image',
                            folder: `fakebook/${userId}/posts/`,
                            eager: {
                                quality: 'jpegmini',
                            }
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


const uploadImage = (file: UploadedFile | undefined, userId: string, type: 'coverImage' | 'profileImage') => {
    if (!file) return;
    const image = new Promise<string>((resolve, reject) => {
        v2.uploader
            .upload_stream(
                {
                    resource_type: 'image',
                    folder: `fakebook/${userId}/${type}/`,
                    eager: {
                        quality: 'jpegmini',
                    }
                },
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result?.secure_url as string);
                }
            )
            .end(file.data)
    })

    return Promise.resolve(image)


};

export default {upload, uploadImage};
