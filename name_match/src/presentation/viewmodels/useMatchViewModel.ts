import { useState, useCallback } from 'react';
import { nanoid } from 'nanoid';
import type { Room, Player } from '../../core/domain/entities/Room';
import { joinRoom, getRanking } from '../../core/domain/usecases/roomUsecases';
import { roomRepository } from '../../infrastructure/repositories/LocalStorageRoomRepository';

type MatchStep = 'form' | 'result';

export function useMatchViewModel(roomId: string) {
  const [step, setStep] = useState<MatchStep>('form');
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [room, setRoom] = useState<Room | null>(() => roomRepository.findById(roomId));
  const [ranking, setRanking] = useState<Player[]>(() => getRanking(roomRepository, roomId));
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    (nickname: string, playerName: string) => {
      if (!nickname.trim() || !playerName.trim()) {
        setError('닉네임과 이름을 모두 입력해 주세요!');
        return;
      }
      setError(null);

      const result = joinRoom(roomRepository, roomId, nanoid(6), nickname.trim(), playerName.trim());
      if (!result) {
        setError('방을 찾을 수 없어요. 링크를 다시 확인해 주세요.');
        return;
      }

      setRoom(result.room);
      setCurrentPlayer(result.player);
      setRanking(getRanking(roomRepository, roomId));
      setStep('result');
    },
    [roomId]
  );

  const handleReset = useCallback(() => {
    setStep('form');
    setCurrentPlayer(null);
    setError(null);
  }, []);

  return { step, room, currentPlayer, ranking, error, setError, handleSubmit, handleReset };
}
