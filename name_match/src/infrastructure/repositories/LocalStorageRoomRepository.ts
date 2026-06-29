import type { Room } from '../../core/domain/entities/Room';
import type { IRoomRepository } from '../../core/ports/IRoomRepository';

const KEY_PREFIX = 'mallang_room_';

export class LocalStorageRoomRepository implements IRoomRepository {
  save(room: Room): void {
    localStorage.setItem(`${KEY_PREFIX}${room.id}`, JSON.stringify(room));
  }

  findById(id: string): Room | null {
    const raw = localStorage.getItem(`${KEY_PREFIX}${id}`);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Room;
    } catch {
      return null;
    }
  }

  delete(id: string): void {
    localStorage.removeItem(`${KEY_PREFIX}${id}`);
  }
}

export const roomRepository = new LocalStorageRoomRepository();
