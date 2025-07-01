import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreatePlayerDto } from 'src/players/dto/create-player.dto';
import { Player } from 'src/players/entities/player.entity';
import { PlayersService } from 'src/players/players.service';

@Injectable()
export class AuthService {
  constructor(
    private playersService: PlayersService,
    private jwtService: JwtService
  ) {}

  async login(player: Player) {
    return {
      access_token: this.jwtService.sign(player),
    };
  }

  async register(createPlayer: CreatePlayerDto) {
    const player = await this.playersService.create(createPlayer);
    return this.jwtService.sign(player);
  }
}
