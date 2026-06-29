import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { ScoreDisplay } from '../components/ScoreDisplay';
import { RankingBoard } from '../components/RankingBoard';
import { useMatchViewModel } from '../viewmodels/useMatchViewModel';

export function MatchView() {
  const { roomId } = useParams<{ roomId: string }>();
  const [nickname, setNickname] = useState('');
  const [playerName, setPlayerName] = useState('');

  const vm = useMatchViewModel(roomId ?? '');

  if (!roomId || !vm.room) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-yellow-50 flex flex-col items-center py-8 px-4 gap-6">
      <div className="text-center">
        <p className="text-3xl mb-1">🌸</p>
        <h1 className="text-xl font-black text-pink-500">말랑이름점</h1>
        <p className="text-sm text-gray-400 mt-1">
          <span className="font-bold text-pink-400">{vm.room.hostName}</span> 님의 이름점 방
        </p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-4">
        {vm.step === 'form' ? (
          <Card>
            <form
              onSubmit={(e) => { e.preventDefault(); vm.handleSubmit(nickname, playerName); }}
              className="flex flex-col gap-4"
            >
              <Input
                label="닉네임 (랭킹에 표시)"
                placeholder="예: 핑크러버"
                value={nickname}
                onChange={(e) => { setNickname(e.target.value); vm.setError(null); }}
                maxLength={12}
              />
              <Input
                label="내 이름"
                placeholder="이름을 입력해 주세요"
                value={playerName}
                onChange={(e) => { setPlayerName(e.target.value); vm.setError(null); }}
                maxLength={10}
              />
              {vm.error && <p className="text-sm text-red-400 text-center">{vm.error}</p>}
              <Button type="submit">💖 이름점 보기</Button>
            </form>
          </Card>
        ) : (
          <Card>
            {vm.currentPlayer && (
              <ScoreDisplay
                score={vm.currentPlayer.score}
                hostName={vm.room.hostName}
                playerName={vm.currentPlayer.name}
              />
            )}
            <div className="mt-2">
              <Button variant="secondary" onClick={vm.handleReset}>
                🔄 다시 해보기
              </Button>
            </div>
          </Card>
        )}

        <Card>
          <h2 className="font-black text-pink-500 mb-3">🏆 이름점 랭킹</h2>
          <RankingBoard
            players={vm.ranking}
            currentPlayerId={vm.currentPlayer?.id}
          />
        </Card>
      </div>
    </div>
  );
}
