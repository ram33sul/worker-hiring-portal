import mongoose from 'mongoose';

const connect = () => {
    const URI: string = process.env.MONGOOSE_URI!;
    mongoose.connect(URI).then(() => {
        console.log(`Database connected: ${URI}`)
    })
}

export default { connect };