import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { CreateGuessDto } from 'src/guesses/dto/create-guess.dto';
import { GuessesService } from 'src/guesses/guesses.service';
import { ImagesService } from 'src/images/images.service';
import { PlayersService } from 'src/players/players.service';
import { RoundsService } from 'src/rounds/rounds.service';
import { GamesService } from './games.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GamesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly gamesService: GamesService,
    private readonly guessService: GuessesService,
    private readonly roundsService: RoundsService,
    private readonly imageService: ImagesService,
    private readonly playersService: PlayersService
  ) {}

  playerToClient = {};

  handleConnection(client, ...args) {
    const playerId = args[0];
    const gameId = args[1];
    const name = args[2];
    this.playerToClient[playerId] = client;
    this.playersService.create({ name: name });
    //TODO: TURN INTO DTO
    this.gamesService.addPlayer(gameId, playerId);
  }

  handleDisconnect(client) {
    throw new Error('Method not implemented.');
  }

  @SubscribeMessage('guess')
  async handleGuess(@MessageBody('gameId') id: number, @MessageBody('guess') createGuessDto: CreateGuessDto) {
    const game = await this.gamesService.findOne(id);
    const round = await this.roundsService.findOne(game.rounds[game.round].id);
    const guess = await this.guessService.create({ ...createGuessDto, roundId: round.id });
    this.roundsService.addGuess(round.id, guess);
    if (round.guesses.length >= game.players.length) {
      for (let index = 0; index < game.players.length; index++) {
        const playerId = game.players[index].id;
        const image = await this.imageService.findOne(round.imageId);
        this.playerToClient[playerId].emit('guess', image);
      }
    }
  }

  @SubscribeMessage('turn')
  async handleTurn(@MessageBody('gameId') gameId: number) {
    const game = await this.gamesService.nextRound(gameId);
    for (let index = 0; index < game.players.length; index++) {
      const player = game.players[index];
      this.playerToClient[player.id].emit('turn', game.rounds[game.round]);
    }
  }
}
