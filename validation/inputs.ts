export const validateName = (name: string) => {
    return (typeof name === 'string') && name.length < 16 && name.length > 1;
}

export const validateGender = (gender: string) => {
    return ['male','female','other'].includes(gender);
}

export const validateBio = (bio: string) => {
    return (typeof bio === 'string') && bio.length < 256 && (bio.match(/\n/g) || '').length + 1 < 6;
 
}

export const validateAge = (age: number) => {
    return (typeof age === 'number') && age > 0 && age < 150; 
}
