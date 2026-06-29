import type { Player } from '../../core/domain/entities/Room';

interface RankingBoardProps {
  players: Player[];
  currentPlayerId?: string;
}

const RANK_COLORS = ['bg-yellow-100 border-yellow-300', 'bg-gray-100 border-gray-300', 'bg-orange-50 border-orange-200'];

export function RankingBoard({ players, currentPlayerId }: RankingBoardProps) {
  if (players.length === 0) {
    return (
      <p className="text-center text-pink-300 text-sm py-4">아직 아무도 없어요 🌸</p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {players.map((player, index) => {
        const isTop = index === 0;
        const isCurrent = player.id === currentPlayerId;
        const colorClass = RANK_COLORS[index] ?? 'bg-pink-50 border-pink-100';

        return (
          <div
            key={player.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all ${colorClass} ${
              isCurrent ? 'ring-2 ring-pink-400 ring-offset-1' : ''
            }`}
          >
            <span className="text-xl w-8 text-center">
              {isTop ? '👑' : `${index + 1}`}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-700 truncate">
                {player.nickname}
                {isCurrent && (
                  <span className="ml-1.5 text-xs text-pink-400 font-bold">나</span>
                )}
              </p>
              <p className="text-xs text-gray-400">{player.name}</p>
            </div>
            <span className="font-black text-pink-500 text-lg">{player.score}점</span>
          </div>
        );
      })}
    </div>
  );
}
