import { Request, Response, NextFunction } from 'express';
import { verifyUserService } from '../services/account';

export const auth = (req: any, res: Response, next: NextFunction) => {
    const token = req.headers["access-token"] ?? req.body["access-token"] ?? req.query["access-token"];
    verifyUserService({token: token}).then((response) => {
        req.verifiedUserId = response;
        next();
    }).catch((error) => {
        res.send({
            status: false,
            message: error
        })
    })
}