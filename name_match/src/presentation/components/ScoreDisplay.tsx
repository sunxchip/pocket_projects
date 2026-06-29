import { useCallback } from 'react';
import { useCountAnimation } from '../../shared/hooks/useCountAnimation';
import { fireHeartConfetti } from '../../shared/utils/confetti';

interface ScoreDisplayProps {
  score: number;
  hostName: string;
  playerName: string;
}

function getScoreMessage(score: number): { emoji: string; message: string } {
  if (score >= 90) return { emoji: '💘', message: '천생연분이에요!' };
  if (score >= 75) return { emoji: '💖', message: '엄청 잘 어울려요!' };
  if (score >= 60) return { emoji: '💕', message: '좋은 인연이에요!' };
  if (score >= 45) return { emoji: '🌸', message: '괜찮은 궁합이에요!' };
  return { emoji: '🌱', message: '조금 더 알아가 봐요!' };
}

export function ScoreDisplay({ score, hostName, playerName }: ScoreDisplayProps) {
  const onComplete = useCallback(() => {
    fireHeartConfetti();
  }, []);

  const animatedScore = useCountAnimation(score, 1800, onComplete);
  const { emoji, message } = getScoreMessage(score);

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <p className="text-gray-500 text-sm font-bold">
        <span className="text-pink-500">{hostName}</span> 💗{' '}
        <span className="text-yellow-500">{playerName}</span>
      </p>
      <div className="relative flex items-center justify-center w-36 h-36 rounded-full bg-gradient-to-br from-pink-100 to-yellow-100 shadow-inner">
        <span className="text-5xl font-black text-pink-500">{animatedScore}</span>
        <span className="absolute bottom-6 text-lg font-bold text-pink-400">점</span>
      </div>
      <div className="text-center">
        <p className="text-3xl">{emoji}</p>
        <p className="text-lg font-black text-pink-500 mt-1">{message}</p>
      </div>
    </div>
  );
}
