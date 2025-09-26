import { Difficulty, Image, ImageWithAnswer } from './image';

export enum GamePhase {
  START,
  GUESSING,
  GUESSED,
  REVEAL,
  END,
  DISCONNECTED,
}

export type Game = {
  id: number;
  joinCode: string;
  active: boolean;
  round: number;
  totalRounds: number;
  difficulty: Difficulty;
  area: string;
  members: Array<Member>;
  rounds: Array<Round>;
  timer: number;
  messages?: Message[];
  hint?: boolean;
};

export type Message = {
  id: number;
  createdAt: string;
  content: string;
  memberId: number;
};

export type Round = {
  id: number;
  createdAt: string;
  image: Image;
  guesses: Array<Guess>;
};

export type RoundWithAnswer = {
  id: number;
  image: ImageWithAnswer;
  guesses: Array<Guess>;
};

export type Guess = {
  id: number;
  cordinates: string;
  score: number;
  roundId: number;
  memberId: number;
};

export type GuessWithPlayer = {
  score: number;
  player: Player;
  latLng: ParsedCordinates;
};

export type Member = {
  id: number;
  connected: boolean;
  isOwner: boolean;
  player: Player;
  guesses: Array<Guess>;
};

export type Player = {
  id: number;
  name: string;
};

export type ParsedCordinates = {
  lat: number;
  lng: number;
};
