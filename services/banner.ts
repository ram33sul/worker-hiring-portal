import Banner from "../model/bannerSchema"

interface AddBannerService {
    title: string,
    description: string,
    imageUrl: string,
    deeplinkUrl: string
}
export const addBannerService = ({ title, description, imageUrl, deeplinkUrl }: AddBannerService) => {
    return new Promise((resolve, reject) => {
        try {
            Banner.create({
                title,
                description,
                imageUrl,
                deeplinkUrl
            }).then((response) => {
                resolve({data: response})
            }).catch((error) => {
                reject({status: 502, error: "Database error occured!"})
            })
        } catch (error) {
            reject({status: 500, error: "Internal error occured!"})
        }
    })
}

export const getBannersService = () => {
    return new Promise((resolve, reject) => {
        try {
            Banner.find().then((response) => {
                resolve({data: response})
            }).catch((error) => {
                reject({status: 502, error: "Database error occured!"})
            })
        } catch (error) {
            reject({status: 500, error: "Internal error occured!"})
        }
    })
}