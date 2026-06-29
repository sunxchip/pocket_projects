export interface Player {
  id: string;
  nickname: string;
  name: string;
  score: number;
  createdAt: number;
}

export interface Room {
  id: string;
  hostName: string;
  players: Player[];
  createdAt: number;
}
