import type { Room, Player } from '../entities/Room';
import type { IRoomRepository } from '../../ports/IRoomRepository';
import { calculateNameScore } from './calculateNameScore';

export function createRoom(repo: IRoomRepository, hostName: string, roomId: string): Room {
  const room: Room = {
    id: roomId,
    hostName,
    players: [],
    createdAt: Date.now(),
  };
  repo.save(room);
  return room;
}

export function joinRoom(
  repo: IRoomRepository,
  roomId: string,
  playerId: string,
  nickname: string,
  playerName: string
): { room: Room; player: Player } | null {
  const room = repo.findById(roomId);
  if (!room) return null;

  const score = calculateNameScore(room.hostName, playerName);
  const player: Player = {
    id: playerId,
    nickname,
    name: playerName,
    score,
    createdAt: Date.now(),
  };

  const updatedRoom: Room = {
    ...room,
    players: [...room.players.filter(p => p.id !== playerId), player],
  };

  repo.save(updatedRoom);
  return { room: updatedRoom, player };
}

export function getRanking(repo: IRoomRepository, roomId: string): Player[] {
  const room = repo.findById(roomId);
  if (!room) return [];
  return [...room.players].sort((a, b) => b.score - a.score);
}
