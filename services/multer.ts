import multer from 'multer';

export const fileUploadMulter = (imageName: string) => {
    return multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, 'profilePictures/');
            },
            filename: (req: any, file, cb) => {
                const fileName = `${req.verifiedUserId}.png`;
                cb(null, fileName)
            }
        }),
        fileFilter: function(req: any, file, cb) {
            // if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
            //   req.fileValidationError = 'Only PNG and JPEG files are allowed';
            //   return cb(null, false);
            // }
            cb(null, true);
        }
    }).single(imageName)
}