import twilio from 'twilio';
import User from '../model/userSchema';
import mongoose from 'mongoose';
import jwt, {JwtPayload} from 'jsonwebtoken'
import { jwtSignAccess, jwtSignRefresh } from '../authentication/jwt';

export const sendSmsOtpService = ({mobile, countryCode}: {mobile: string, countryCode: string}) => {
    return new Promise(async (resolve, reject) => {
        try {
            const errors = []
            if(!mobile){
                errors.push(`"mobile" is required!`)
            }
            if(!countryCode){
                errors.push(`"countryCode" is required!`)
            }
            if(errors.length){
                return reject(errors);
            }
            const accountSid: string = process.env.TWILIO_SID!;
            const authToken: string = process.env.TWILIO_TOKEN!;
            const verifySid: string = process.env.TWILIO_VERIFY_SID!;
            const client = twilio(accountSid, authToken);
            client.verify.v2
                .services(verifySid)
                .verifications.create({
                    to: countryCode + mobile,
                    channel: "sms"
                })
                .then((verification) => console.log(verification.status))
                .then(() => {
                    resolve({data: countryCode + mobile})
                })
                .catch((error) => {
                    reject("Can't send OTP!");
                })
        } catch (error) {
            reject("Internal error occured at sendSmsOtpService!");
        }
    })
}

export const verifySmsOtpService = ({mobile, countryCode, otpCode}: {mobile: string, countryCode: string, otpCode: string}) => {
    return new Promise((resolve, reject) => {
        try {
            const errors = []
            if(!mobile){
                errors.push(`'mobile' is required!`)
            }
            if(!countryCode){
                errors.push(`'countryCode' is required!`)
            }
            if(!otpCode){
                errors.push(`'otpCode' is required`)
            }
            if(errors.length){
                return reject(errors);
            }
            const accountSid: string = process.env.TWILIO_SID!;
            const authToken: string = process.env.TWILIO_TOKEN!;
            const verifySid: string = process.env.TWILIO_VERIFY_SID!;
            const client = twilio(accountSid, authToken);
            client.verify.v2
                .services(verifySid)
                .verificationChecks.create({ to: countryCode+mobile, code: otpCode })
                .then(async (verification_check) => {
                    if(verification_check.status === 'approved'){
                        const userData: mongoose.AnyObject | null = await User.findOne({mobile: mobile, countryCode: countryCode});
                        if(!userData || !Object.keys(userData).length){
                            User.create({
                                mobile: mobile,
                                countryCode: countryCode
                            }).then((response) => {
                                const accessToken = jwtSignAccess({userId: response._id});
                                const refreshToken = jwtSignRefresh({userId: response._id});
                                resolve({data: response, headers: {accessToken, refreshToken}});
                            }).catch((error) => {
                                reject("Error occured in database!")
                            })
                        } else {
                            if(!userData.status){
                                reject("User is blocked!")
                            } else {
                                const accessToken = jwtSignAccess({userId: userData._id});
                                const refreshToken = jwtSignRefresh({userId: userData._id});
                                resolve({data: userData, headers: {accessToken, refreshToken}});
                            }
                        }
                    } else {
                        reject("OTP is incorrect!");
                    }
                }).catch((error) => {
                    reject("OTP expired!");
                })
        } catch (error) {
            reject("Internal error occured!");
        }
    })
}

export const verifyUserService = ({token}:{token: string}) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!token){
                return reject('Token is missing!');
            }
            jwt.verify(token, process.env.ACCESS_TOKEN_KEY!, async (error, data) => {
                if(error) {
                    reject("Token is not valid or expired!");
                } else {
                    resolve({data: (data as JwtPayload).userId});
                }
            });
        } catch (error) {
            reject('Internal error occured!');
        }
    })
}

export const refreshTokenService = ({token}:{token: string}) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!token){
                return reject("Token is missing!")
            }
            jwt.verify(token, process.env.REFRESH_TOKEN_KEY!, async (error, data) => {
                if(error) {
                    reject("Token is not valid or expired!");
                } else {
                    const accessToken = jwtSignAccess({userId: (data as JwtPayload).userId})
                    resolve({data: {userId: (data as JwtPayload).userId}, headers:{accessToken}});
                }
            });
        } catch (error) {
            reject("Internal error occured!")
        }
    })
}