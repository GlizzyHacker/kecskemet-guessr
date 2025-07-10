export enum Difficulty {
  EASY = 'Normal',
  NORMAL = 'Hard',
  HARD = 'Impossible',
}

export type Game = {
  id: number;
  active: boolean;
  round: number;
  totalRounds: number;
  guesses: number;
  difficulty: Difficulty;
  area: string;
  members: Array<Member>;
  rounds: Array<Round>;
};

export type Round = {
  id: number;
  image: Image;
  guesses: Array<Guess>;
};

export type RoundWithAnswer = {
  id: number;
  image: ImageWithAnswer;
  guesses: Array<Guess>;
};

export type Image = {
  id: number;
  area: string | undefined;
};

export type ImageWithAnswer = {
  id: number;
  cordinates: string;
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
