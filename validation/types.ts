export const validateBoolean = (value: boolean) => {
    return value === true || value === false;
}

export const validateString = (value: string) => {
    return typeof value === 'string';
}

export const validateStringArray = (value: string[]) => {
    if(!Array.isArray(value)){
        return false;
    }
    for(let i = 0; i < value.length - 1; i++){
        if(typeof value[i] !== 'string'){
            return false;
        }
    }
    return true;
}


export const validateNumber = (value: number) => {
    return typeof value === 'number';
}

export const validatePositiveNumber = (value: number) => {
    return typeof value === 'number' && value >= 0;
}