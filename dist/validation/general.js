"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (values) => {
    const errors = [];
    for (let value of values) {
        if (!value[1](value[2])) {
            errors.push({ field: value[0], message: "Invalid value!" });
        }
    }
    return errors;
};
exports.validate = validate;
