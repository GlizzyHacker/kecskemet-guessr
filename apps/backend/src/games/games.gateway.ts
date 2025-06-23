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
    const name = client.handshake.auth.name;
    const player = await this.playersService.create({ name: name });
    this.playerToClient.set(player.id, client.id);
    //TODO: TURN INTO DTO
    this.gamesService.addPlayer(gameId, player);
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
    this.roundsService.addGuess(round.id, guess);
    const image = await this.imageService.findOne(round.imageId);
    if (round.guesses.length + 1 >= game.players.length) {
      for (let index = 0; index < game.players.length; index++) {
        const player = game.players[index];
        try {
          const socket = this.server.sockets.sockets.get(this.playerToClient.get(player.id));
          socket.emit('guess', image);
        } catch (e) {
          console.log(e);
        }
      }
    }
  }

  @SubscribeMessage('turn')
  async handleTurn(@MessageBody('gameId') gameId: number) {
    const game = await this.gamesService.nextRound(gameId);
    for (let index = 0; index < game.players.length; index++) {
      const player = game.players[index];
      try {
        const socket = this.server.sockets.sockets.get(this.playerToClient.get(player.id));
        socket.emit('turn', game.rounds[game.round - 1]);
      } catch (e) {
        console.log(e);
      }
    }
  }
}
