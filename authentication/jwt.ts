import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export const jwtSignAccess = ({userId}: {userId: mongoose.Types.ObjectId}) => {
    return jwt.sign(
        {
            userId
        },
        process.env.ACCESS_TOKEN_KEY!,
        {
            expiresIn: '30m'
        }
    );
}

export const jwtSignRefresh = ({userId}: {userId: mongoose.Types.ObjectId}) => {
    return jwt.sign(
        {
            userId
        },
        process.env.REFRESH_TOKEN_KEY!,
        {
            expiresIn: '2 years'
        }
    );
}