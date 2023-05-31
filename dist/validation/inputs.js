"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAge = exports.validateBio = exports.validateGender = exports.validateName = void 0;
const validateName = (name) => {
    return (typeof name === 'string') && name.length < 16 && name.length > 1;
};
exports.validateName = validateName;
const validateGender = (gender) => {
    return ['male', 'female', 'other'].includes(gender);
};
exports.validateGender = validateGender;
const validateBio = (bio) => {
    return (typeof bio === 'string') && bio.length < 256 && (bio.match(/\n/g) || '').length + 1 < 6;
};
exports.validateBio = validateBio;
const validateAge = (age) => {
    return (typeof age === 'number') && age > 0 && age < 150;
};
exports.validateAge = validateAge;
