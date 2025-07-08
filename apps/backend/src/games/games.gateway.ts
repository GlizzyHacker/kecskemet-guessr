import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { GuessesService } from 'src/guesses/guesses.service';
import { MembersService } from 'src/members/members.service';
import { RoundsService } from 'src/rounds/rounds.service';
import { getDistance } from 'src/util';
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
    private readonly membersService: MembersService,
    private readonly jwtService: JwtService
  ) {}

  memberToClient = new Map();
  clientToMember = new Map();

  async handleConnection(client) {
    const gameId = client.handshake.auth.game;
    const game = await this.gamesService.findOne(gameId);
    const jwt = await this.jwtService.verify(client.handshake.headers.authorization?.split(' ')[1] ?? '', {
      secret: process.env.JWT_SECRET,
    });
    if (!jwt || !game || !game.active) {
      client.disconnect();
      return;
    }
    const member = await this.membersService.add({ gameId: gameId, playerId: jwt.id });
    this.memberToClient.set(member.id, client.id);
    this.clientToMember.set(client.id, member.id);
    await this.updateGameState(gameId);
  }

  async handleDisconnect(client) {
    const memberId = this.clientToMember.get(client.id);
    if (!memberId) {
      return;
    }
    const member = await this.membersService.removeAt(memberId);
    await this.updateGameState(member.gameId);

    //IF EVERYONE ELSE EXCEPT THE DISCONNECTED PLAYER GUESSED LET THE GAME CONTINUE
    await this.tryEndRound(member.gameId);

    this.memberToClient.delete(this.clientToMember.get(client.id));
    this.clientToMember.delete(client.id);
  }

  @SubscribeMessage('guess')
  async handleGuess(@ConnectedSocket() client, @MessageBody('gameId') id: number, @MessageBody('guess') input) {
    const game = await this.gamesService.findOne(id);
    if (game.round == 0) {
      return;
    }

    const roundId = game.rounds[game.round - 1].id;
    const member = game.members.find((e) => e.id == this.clientToMember.get(client.id));
    const round = await this.roundsService.findOne(roundId);
    if (round.guesses.some((guess) => guess.memberId == member.id)) {
      return;
    }

    const target = parseCordinates(round.image.cordinates);
    const cords = parseCordinates(input.cordinates);
    const distance = getDistance(target.lat, target.lng, cords.lat, cords.lng) * 1000;
    const score = Math.max(500 - distance, 0);

    await this.guessService.create({
      cordinates: input.cordinates,
      memberId: member.id,
      roundId: roundId,
      score: score,
    });

    await this.tryEndRound(id);
  }

  async tryEndRound(gameId: number) {
    const game = await this.gamesService.findOne(gameId);
    if (!game.rounds[game.round - 1]) {
      return;
    }

    const round = await this.roundsService.findOne(game.rounds[game.round - 1].id);

    //Update state to show who guessed
    await this.sendToAllInGame(game, 'turn', game);

    if (
      game.members.every(
        (member) =>
          member.guesses.some((guess) => guess.roundId == game.rounds[game.round - 1].id) || member.connected == false
      )
    ) {
      await this.sendToAllInGame(game, 'guess', round);
    }
  }

  @SubscribeMessage('turn')
  async handleTurn(@ConnectedSocket() client, @MessageBody('gameId') gameId: number) {
    const game = await this.gamesService.findOne(gameId);
    if (game.members.every((e) => e.id != this.clientToMember.get(client.id))) {
      return;
    }
    if (
      game.round != 0 &&
      game.members.some(
        (member) =>
          member.guesses.every((guess) => guess.roundId != game.rounds[game.round - 1]?.id) && member.connected
      )
    ) {
      return;
    }
    if (game.totalRounds <= game.round) {
      await this.gamesService.finish(gameId);
    } else {
      await this.gamesService.nextRound(gameId);
    }
    await this.updateGameState(gameId);
  }

  async updateGameState(gameId: number) {
    const game = await this.gamesService.findOne(gameId);
    await this.sendToAllInGame(game, 'turn', game);
  }

  async sendToAllInGame(game, name: string, data) {
    for (let index = 0; index < game.members.length; index++) {
      const member = game.members[index];
      this.sendTo(member.id, name, data);
    }
  }

  async sendTo(memberId: number, name: string, data) {
    try {
      const socket = this.server.sockets.sockets.get(this.memberToClient.get(memberId));
      await socket.emit(name, data);
    } catch (e) {
      console.log(e);
    }
  }
}

function parseCordinates(val: string) {
  const rawLatLng = val.split(',');
  const latLng = { lat: Number(rawLatLng[0]), lng: Number(rawLatLng[1]) };
  return latLng;
}
