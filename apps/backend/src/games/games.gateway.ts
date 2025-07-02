import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { GuessesService } from 'src/guesses/guesses.service';
import { MembersService } from 'src/members/members.service';
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
    private readonly playersService: PlayersService,
    private readonly membersService: MembersService
  ) {}

  memberToClient = new Map();

  async handleConnection(client) {
    const gameId = client.handshake.auth.game;
    const playerId = client.handshake.auth.playerId;
    const member = await this.membersService.add({ gameId: gameId, playerId: playerId });
    this.memberToClient.set(member.id, client.id);
    await this.updateGameState(gameId);
  }

  async handleDisconnect(client) {
    const arr = Array.from(this.memberToClient);
    for (let index = 0; index < arr.length; index++) {
      const element = arr[index];
      if (element[1] == client.id) {
        const member = await this.membersService.removeAt(element[0]);
        this.memberToClient.delete(element[0]);
        await this.updateGameState(member.gameId);
        //IF EVERYONE ELSE EXCEPT THE DISCONNECTED PLAYER GUESSED LET THE GAME CONTINUE
        await this.tryEndRound(member.gameId);
      }
    }
  }

  @SubscribeMessage('guess')
  async handleGuess(@MessageBody('gameId') id: number, @MessageBody('guess') input) {
    const game = await this.gamesService.findOne(id);
    const roundId = game.rounds[game.round - 1].id;
    const member = game.members.find((e) => e.playerId == input.playerId);
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
  async handleTurn(@MessageBody('gameId') gameId: number) {
    await this.gamesService.nextRound(gameId);
    await this.updateGameState(gameId);
  }

  async updateGameState(gameId: number) {
    const game = await this.gamesService.findOne(gameId);
    await this.sendToAllInGame(game, 'turn', game);
  }

  async sendToAllInGame(game, name: string, data) {
    for (let index = 0; index < game.members.length; index++) {
      const member = game.members[index];
      try {
        const socket = this.server.sockets.sockets.get(this.memberToClient.get(member.id));
        await socket.emit(name, data);
      } catch (e) {
        console.log(e);
      }
    }
  }
}

function parseCordinates(val: string) {
  const rawLatLng = val.split(',');
  const latLng = { lat: Number(rawLatLng[0]), lng: Number(rawLatLng[1]) };
  return latLng;
}
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
