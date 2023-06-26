"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploadMulterField = exports.fileUploadMulter = void 0;
const multer_1 = __importDefault(require("multer"));
const fileUploadMulter = (imageName) => {
    return (0, multer_1.default)({
        storage: multer_1.default.diskStorage({
            destination: (req, file, cb) => {
                cb(null, `${imageName}/`);
            },
            filename: (req, file, cb) => {
                const fileName = `${req.verifiedUserId}.png`;
                cb(null, fileName);
            }
        }),
        fileFilter: function (req, file, cb) {
            // if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
            //   req.fileValidationError = 'Only PNG and JPEG files are allowed';
            //   return cb(null, false);
            // }
            cb(null, true);
        }
    }).single(imageName);
};
exports.fileUploadMulter = fileUploadMulter;
const fileUploadMulterField = (imageNames) => {
    const fields = imageNames.map((name) => ({ name, maxCount: 1 }));
    return (0, multer_1.default)({
        storage: multer_1.default.diskStorage({
            destination: (req, file, cb) => {
                let fieldDestination = `${file.fieldname}/`;
                cb(null, fieldDestination || '');
            },
            filename: (req, file, cb) => {
                const fileName = `${req.verifiedUserId}.png`;
                cb(null, fileName);
            }
        }),
        fileFilter: function (req, file, cb) {
            // if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
            //   req.fileValidationError = 'Only PNG and JPEG files are allowed';
            //   return cb(null, false);
            // }
            cb(null, true);
        }
    }).fields(fields);
};
exports.fileUploadMulterField = fileUploadMulterField;
