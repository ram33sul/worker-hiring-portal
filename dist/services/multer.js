"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploadMulter = void 0;
const multer_1 = __importDefault(require("multer"));
const fileUploadMulter = () => {
    return (0, multer_1.default)({
        storage: multer_1.default.diskStorage({
            destination: (req, file, cb) => {
                cb(null, 'profilePictures/');
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
    }).single('profilePicture');
};
exports.fileUploadMulter = fileUploadMulter;
