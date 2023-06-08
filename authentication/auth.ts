import { Request, Response, NextFunction } from 'express';
import { verifyUserService } from '../services/account';

export const auth = (req: any, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"] ?? req.body["authorization"] ?? req.query["authorization"];
    verifyUserService({token: token}).then((response: any) => {
        req.verifiedUserId = response.data;
        next();
    }).catch((error) => {
        res.status(error?.status).send({
            status: false,
            error
        })
    })
}