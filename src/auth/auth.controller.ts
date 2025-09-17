import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { Response } from 'express';
import { CookieGetter } from '../users/common/decorators/cookie-getter.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post("sign-in")
  async SignIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return  this.authService.signIn(signInDto, res)
  }

  @HttpCode(200)
  @Post("sign-out")
  async SignOut(
    @CookieGetter("refresh_token") refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return  this.authService.signOut(refreshToken, res)
  }

  @HttpCode(200)
  @Post("refresh-token")
  async RefreshToken(
    @CookieGetter("refresh_token") refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return  this.authService.refreshTokenUser(refreshToken, res)
  }
}
