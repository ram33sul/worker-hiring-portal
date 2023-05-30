import twilio from 'twilio';

export const sendSmsOtpService = ({mobile, countryCode}: {mobile: string, countryCode: string}) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!mobile){
                return reject("Mobile is required!")
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
                    resolve(countryCode + mobile)
                })
                .catch((error) => {
                    reject("Can't send OTP!");
                })
        } catch (error) {
            reject("Internal error occured at sendSmsOtpService!");
        }
    })
}