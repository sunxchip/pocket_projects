import { useState } from 'react';
import { nanoid } from 'nanoid';
import type { Room } from '../../core/domain/entities/Room';
import { createRoom } from '../../core/domain/usecases/roomUsecases';
import { roomRepository } from '../../infrastructure/repositories/LocalStorageRoomRepository';

export function useRoomViewModel() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateRoom = (hostName: string): Room | null => {
    if (!hostName.trim()) {
      setError('이름을 입력해 주세요!');
      return null;
    }
    setIsLoading(true);
    setError(null);
    try {
      const roomId = nanoid(8);
      const room = createRoom(roomRepository, hostName.trim(), roomId);
      return room;
    } catch {
      setError('방 생성에 실패했어요. 다시 시도해 주세요.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { handleCreateRoom, isLoading, error, setError };
}
