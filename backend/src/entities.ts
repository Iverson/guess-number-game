export type PlayerDTO = {
  id: string;
  name: string;
  score: number;
};

export type ChatMessageDTO = {
  id: string;
  author: Pick<PlayerDTO, 'id' | 'name'>;
  message: string;
  date: string;
};

export type GameRoundDTO = {
  id: string;
  resultNumber: number;
};
