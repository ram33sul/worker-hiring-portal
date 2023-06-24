import multer from 'multer';

export const fileUploadMulter = (imageName: string) => {
    return multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, `${imageName}/`);
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

export const fileUploadMulterField = (imageNames: any) => {
    const fields = imageNames.map((name: string) => ({name, maxCount: 1}))
    return multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                const fieldDestination = fields.find((config: any) => config.name === file.fieldname)?.destination;
                cb(null, fieldDestination || '');
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
    }).fields(fields);
}