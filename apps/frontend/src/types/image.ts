export enum Difficulty {
  EASY = 'Normal',
  NORMAL = 'Hard',
  HARD = 'Impossible',
}

export type Image = {
  id: number;
  area: string | undefined;
};

export type ImageWithAnswer = {
  id: number;
  cordinates: string;
};

export type ImageWithMetadata = {
  id: number;
  cordinates: string;
  url: string;
  deleted: boolean;
  area: string;
  difficulty: Difficulty;
  score: number;
};
