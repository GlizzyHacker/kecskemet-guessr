import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
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
  @WebSocketServer() server;

  constructor(
    private readonly gamesService: GamesService,
    private readonly guessService: GuessesService,
    private readonly roundsService: RoundsService,
    private readonly imageService: ImagesService,
    private readonly playersService: PlayersService
  ) {}

  playerToClient = new Map();

  async handleConnection(client) {
    const gameId = client.handshake.auth.game;
    const playerId = client.handshake.auth.playerId;
    const player = await this.playersService.findOne(playerId);
    this.playerToClient.set(player.id, client.id);
    //TODO: TURN INTO DTO
    const game = await this.gamesService.addPlayer(gameId, player);
    this.sendToAllInGame(game, 'turn', game);
  }

  handleDisconnect(client) {
    const arr = Array.from(this.playerToClient);
    for (let index = 0; index < arr.length; index++) {
      const element = arr[index];
      if (element[1] == client.id) {
        this.playerToClient.delete(element[0]);
        return;
      }
    }
  }

  @SubscribeMessage('guess')
  async handleGuess(@MessageBody('gameId') id: number, @MessageBody('guess') createGuessDto: CreateGuessDto) {
    const game = await this.gamesService.findOne(id);
    const round = await this.roundsService.findOne(game.rounds[game.round - 1].id);
    const guess = await this.guessService.create({ ...createGuessDto, roundId: round.id });
    const roundNew = await this.roundsService.addGuess(round.id, guess);
    if (roundNew.guesses.length >= game.players.length) {
      this.sendToAllInGame(game, 'guess', roundNew);
    }
  }

  @SubscribeMessage('turn')
  async handleTurn(@MessageBody('gameId') gameId: number) {
    const game = await this.gamesService.nextRound(gameId);
    this.sendToAllInGame(game, 'turn', game);
  }
  async sendToAllInGame(game, name: string, data) {
    for (let index = 0; index < game.players.length; index++) {
      const player = game.players[index];
      try {
        const socket = this.server.sockets.sockets.get(this.playerToClient.get(player.id));
        await socket.emit(name, data);
      } catch (e) {
        console.log(e);
      }
    }
  }
}
