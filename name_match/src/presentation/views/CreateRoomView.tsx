import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useRoomViewModel } from '../viewmodels/useRoomViewModel';

export function CreateRoomView() {
  const [hostName, setHostName] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { handleCreateRoom, isLoading, error, setError } = useRoomViewModel();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const room = handleCreateRoom(hostName);
    if (!room) return;
    const url = `${window.location.origin}/room/${room.id}`;
    setShareUrl(url);
  };

  const onCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onGoToRoom = () => {
    const roomId = shareUrl.split('/room/')[1];
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-yellow-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="text-center">
          <p className="text-4xl mb-2">🌸</p>
          <h1 className="text-2xl font-black text-pink-500">말랑이름점</h1>
          <p className="text-sm text-gray-400 mt-1">이름으로 보는 우리의 궁합은?</p>
        </div>

        <Card>
          {!shareUrl ? (
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <Input
                label="방장 이름"
                placeholder="이름을 입력해 주세요"
                value={hostName}
                onChange={(e) => { setHostName(e.target.value); setError(null); }}
                maxLength={10}
              />
              {error && <p className="text-sm text-red-400 text-center">{error}</p>}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? '방 만드는 중...' : '✨ 이름점 방 만들기'}
              </Button>
            </form>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="text-center">
                <p className="text-2xl">🎉</p>
                <p className="font-black text-pink-500 mt-1">방이 만들어졌어요!</p>
                <p className="text-sm text-gray-400 mt-1">링크를 친구들에게 공유해 보세요</p>
              </div>
              <div className="bg-pink-50 rounded-2xl p-3 break-all text-sm text-gray-500 text-center">
                {shareUrl}
              </div>
              <Button onClick={onCopy} variant="secondary">
                {copied ? '✅ 복사됐어요!' : '🔗 링크 복사하기'}
              </Button>
              <Button onClick={onGoToRoom}>
                🚪 내 방으로 가기
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
