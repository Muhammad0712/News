import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/model/user.model';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User,
        private readonly jwtService: JwtService,
        private readonly userService: UsersService,
    ) { }

    async generateTokens(user: User) {
        const payload = {
            id: user.id,
            email: user.email,
            role: "user"
        }
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: process.env.ACCESS_TOKEN_KEY,
                expiresIn: process.env.ACCESS_TOKEN_TIME
            }),
            this.jwtService.signAsync(payload, {
                secret: process.env.REFRESH_TOKEN_KEY,
                expiresIn: process.env.REFRESH_TOKEN_TIME
            })
        ]);
        return {
            accessToken,
            refreshToken
        }
    }

    async signIn(signInDto: SignInDto, res: Response) {
        const user = await this.userService.findByEmail(signInDto.email);
        if (!user) {
            throw new NotFoundException("Email or password is incorrect");
        }
        const isValidPassword = await bcrypt.compare(
            signInDto.password,
            user.password
        );
        if (!isValidPassword) {
            throw new BadRequestException("Email or password is incorrect");
        }

        const tokens = await this.generateTokens(user);
        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            maxAge: Number(process.env.COOKIE_TIME),
        });
        user.refreshToken = tokens.refreshToken;
        await user.save();
        return {
            message: "Welcome back!",
            id: user.id,
            accessToken: tokens.accessToken,
        }
    }

    async signOut(refreshToken: string, res: Response) {
        const userData = await this.jwtService.verify(refreshToken, {
            secret: process.env.REFRESH_TOKEN_KEY,
        });
        if (!userData) {
            throw new ForbiddenException("User not verified!");
        }
        const user = await this.userService.findByEmail(userData.email);
        if (!user) {
            throw new BadRequestException("User not found!");
        }
        user.refreshToken = "";
        await user.save();
        res.clearCookie("refreshToken");
        return {
            id: userData.id,
            message: "User logged out succesfully!",
        };
    }

    async refreshTokenUser(refreshToken: string, res: Response) {
        const user = await this.userModel.findOne({ where: { refreshToken } });
        if (!user) {
            throw new ForbiddenException("User not verified!");
        }
        const tokens = await this.generateTokens(user)
        user.refreshToken = tokens.refreshToken;
        await user.save();

        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            maxAge: Number(process.env.COOKIE_TIME),
        })
        return {
            message: "User refreshed successfully!",
            id: user.id,
            accessToken: tokens.accessToken,
        }
    }

}