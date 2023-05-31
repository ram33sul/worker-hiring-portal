"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePositiveNumber = exports.validateNumber = exports.validateStringArray = exports.validateString = exports.validateBoolean = void 0;
const validateBoolean = (value) => {
    return value === true || value === false;
};
exports.validateBoolean = validateBoolean;
const validateString = (value) => {
    return typeof value === 'string';
};
exports.validateString = validateString;
const validateStringArray = (value) => {
    if (!Array.isArray(value)) {
        return false;
    }
    for (let i = 0; i < value.length - 1; i++) {
        if (typeof value[i] !== 'string') {
            return false;
        }
    }
    return true;
};
exports.validateStringArray = validateStringArray;
const validateNumber = (value) => {
    return typeof value === 'number';
};
exports.validateNumber = validateNumber;
const validatePositiveNumber = (value) => {
    return typeof value === 'number' && value >= 0;
};
exports.validatePositiveNumber = validatePositiveNumber;
