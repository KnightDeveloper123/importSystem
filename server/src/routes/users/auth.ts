import { Request, Response, Router } from 'express';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import User from '../../models/User';
import { createHttpError } from '../../errors/htttpErrors';
dotenv.config();

const router = Router();

interface RegisterEmployeeRequest {
    firstName: string;
    lastName: string;
    email: string;
    mobile_no: string;
    password: string;
    role?: string;
}

router.post('/employee/register', async (req: Request, res: Response, next) => {
    try {
        const { firstName, lastName, email, mobile_no, password, role }: RegisterEmployeeRequest = req.body;

        if (!firstName || !lastName || !email || !mobile_no || !password) {
            throw createHttpError(400, 'All fields are required');
        }

        const checkUser = await User.exists({ email: email });
        if (checkUser) {
            throw createHttpError(400, 'Email already exists');
        }

        const checkMobile = await User.exists({ mobile_no: mobile_no });
        if (checkMobile) {
            throw createHttpError(400, 'Mobile number already exists');
        }

        const salt = bcrypt.genSaltSync(10);
        const secPass = await bcrypt.hash(password, salt);

        const newEmployee = new User({ firstName, lastName, email, mobile_no, password: secPass, role });
        await newEmployee.save();
        res.status(201).json({ success: 'Employee registered successfully' });
        return;
    } catch (error) {
        next(error);
    }
});

router.post('/customer/register', async (req: Request, res: Response, next) => {
    try {
        const { firstName, lastName, email, mobile_no, password }: RegisterEmployeeRequest = req.body;

        if (!firstName || !lastName || !email || !mobile_no || !password) {
            throw createHttpError(400, 'All fields are required');
        }

        const checkUser = await User.exists({ email: email });
        if (checkUser) {
            throw createHttpError(400, 'Email already exists');
        }

        const checkMobile = await User.exists({ mobile_no: mobile_no });
        if (checkMobile) {
            throw createHttpError(400, 'Mobile number already exists');
        }

        const salt = bcrypt.genSaltSync(10);
        const secPass = await bcrypt.hash(password, salt);

        const newCustomer = new User({ firstName, lastName, email, mobile_no, password: secPass, role: 'customer' });
        await newCustomer.save();
        res.status(201).json({ message: 'Employee registered successfully' });
        return;
    } catch (error) {
        next(error);
    }
});

router.post('/login', async (req: Request, res: Response, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw createHttpError(400, "Invalid credentials");
        }

        const checkUser = await User.findOne({ email: email });
        if (!checkUser) throw createHttpError(404, "User not found");
        if (checkUser.accountStatus === 1) throw createHttpError(404, "Account is not active! Please contact admin.");

        const pwdCompare = await bcrypt.compare(password, checkUser.password);

        if (!pwdCompare) {
            throw createHttpError(404, "Invalid Credentials");
        }

        if (pwdCompare) {
            const payload = {
                email: email,
                user_id: checkUser?.id,
                user_type: checkUser.role
            };
            let full_token: string = jwt.sign(payload, process.env.JWT_SECRET!, {
                expiresIn: "3d"
            });
            const [header, payloadEnc, signature] = full_token.split('.');

            res.cookie("jwt_sig", signature, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 3 * 24 * 60 * 60 * 1000,
                // domain: "localhost",
            });

            await User.findByIdAndUpdate(checkUser.id, { $set: { lastLogin: new Date() } })
            res.json({ success: `Welcome Back, ${checkUser?.firstName + " " + checkUser?.lastName}`, data: { firstName: checkUser?.firstName, lastName: checkUser?.lastName, email: checkUser?.email, role: checkUser.role, id: checkUser.id }, auth_token: `${header}.${payloadEnc}` })
            return;
        } else {
            throw createHttpError(400, "Invalid Credentials.");
            return;
        }
    } catch (error) {
        next(error);
    }
})

export default router;
