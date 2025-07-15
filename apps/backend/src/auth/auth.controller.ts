import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreatePlayerDto } from 'src/players/dto/create-player.dto';
import { AuthService } from './auth.service';
import { CurrentPlayer } from './current-player.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(AuthGuard('jwt'))
  @Get('login')
  login(@CurrentPlayer() player) {
    return this.authService.login(player);
  }

  @Post('register')
  async register(@Body() createPlayerDto: CreatePlayerDto) {
    const jwt = await this.authService.register(createPlayerDto);
    return {
      url: `${process.env.FRONTEND_URL}/auth/callback?jwt=${jwt}`,
    };
  }
}
