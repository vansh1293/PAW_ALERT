import mongoose, { Document, Schema } from 'mongoose';


export interface User extends Document {
    username: string,
    password: string,
    email: string,
    isVerified: boolean,
    verifyCode: string,
    verifyCodeExpires: Date,
    isAccepting: boolean,
    EarnedPoints: number,
    rescues?: mongoose.Types.ObjectId[]
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifyCode: {
        type: String,
        required: true
    },
    verifyCodeExpires: {
        type: Date,
        required: true
    },
    isAccepting: {
        type: Boolean,
        default: false
    },
    EarnedPoints: {
        type: Number,
        default: 0
    },
    rescues: [{
        type: Schema.Types.ObjectId,
        ref: 'Rescues'
    }]

});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User', UserSchema);
export default UserModel;

