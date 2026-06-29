import type { Room } from '../domain/entities/Room';

export interface IRoomRepository {
  save(room: Room): void;
  findById(id: string): Room | null;
  delete(id: string): void;
}
