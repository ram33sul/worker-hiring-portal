"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = exports.validateAge = exports.validateBio = exports.validateGender = exports.validateName = void 0;
const validateName = (name) => {
    return (typeof name === 'string') && name.length < 20;
};
exports.validateName = validateName;
const validateGender = (gender) => {
    return ['male', 'female', 'other'].includes(gender);
};
exports.validateGender = validateGender;
const validateBio = (bio) => {
    return (typeof bio === 'string') && bio.length <= 400 && (bio.match(/\n/g) || '').length + 1 < 6;
};
exports.validateBio = validateBio;
const validateAge = (age) => {
    return (typeof age === 'number') && age >= 18 && age < 100;
};
exports.validateAge = validateAge;
const validateEmail = (email) => {
    if (!email) {
        return false;
    }
    const test = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (email.toLowerCase().match(test)) {
        return true;
    }
    return false;
};
exports.validateEmail = validateEmail;
