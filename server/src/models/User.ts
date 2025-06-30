import mongoose, { Schema, Document } from 'mongoose';

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    mobile_no: string;
    password: string;
    role: string;
    status?: number;
    accountStatus?: number;
    createdAt?: Date;
    updatedAt?: Date;
    lastLogin?: Date;
}

const UserSchema = new Schema<IUser>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    mobile_no: {
        type: String,
        required: true,
        validate: {
            validator: (v: string) => /^[6-9]\d{9}$/.test(v),
            message: (props: any) => `${props.value} is not a valid mobile number!`,
        }
    },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'customer', 'employee'] },
    status: { type: Number, default: 0 },
    accountStatus: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
    lastLogin: { type: Date }
})

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ mobile_no: 1 }, { unique: true });

const User = mongoose.model<IUser>("User", UserSchema);

export default User;