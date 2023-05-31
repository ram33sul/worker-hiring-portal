export const validate = (values: [string, (params: any) => boolean, unknown][]) => {
    const errors = [];
    for(let value of values){
        if(!value[1](value[2])){
            errors.push({field: value[0], message: "Invalid value!"})
        }
    }
    return errors;
}