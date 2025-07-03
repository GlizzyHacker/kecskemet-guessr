export type Game = {
  id: number;
  active: boolean;
  round: number;
  members: Array<Member>;
  rounds: Array<Round>;
};

export type Round = {
  id: number;
  imageId: number;
  guesses: Array<Guess>;
};

export type RoundWithImage = {
  id: number;
  image: Image;
  guesses: Array<GuessWithCordinates>;
};

export type Image = {
  id: number;
  cordinates: string;
};

export type Guess = {
  id: number;
  score: number;
  roundId: number;
  memberId: number;
};

export type GuessWithCordinates = {
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
