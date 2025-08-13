import { Controller, Post, Body, UseGuards, Request, Get, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService, LoginDto, RegisterDto } from './auth.service';
import { SessionAuthGuard } from './session-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Request() req, @Res() res) {
    try {
        const user = await this.authService.login(loginDto);
        req.session.userId = user.id;
        req.session.userEmail = user.email;
        req.session.userName = user.name;
        req.session.teamId = user.teamId;
        res.status(200).json({success: true});
    } catch (error) {
        if (error instanceof UnauthorizedException) {
            throw error
        }
        res.status(500).json({error: 'Internal server error'});
    }
  }

  @Post('logout')
  @UseGuards(SessionAuthGuard)
  async logout(@Request() req, @Res() res) {
    try {
        req.session.destroy();
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({error: 'Internal server error'});
    }
  }

  @Get('me')
  @UseGuards(SessionAuthGuard)
  async getProfile(@Request() req) {
    return {
      userId: req.session.userId,
      email: req.session.userEmail,
      name: req.session.userName,
      teamId: req.session.teamId,
    };
  }
}
