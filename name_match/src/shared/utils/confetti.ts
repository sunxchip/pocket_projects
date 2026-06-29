import confetti from 'canvas-confetti';

export function fireHeartConfetti() {
  const heart = confetti.shapeFromText({ text: '❤️', scalar: 2 });
  const star = confetti.shapeFromText({ text: '⭐', scalar: 2 });

  confetti({
    particleCount: 60,
    spread: 80,
    origin: { y: 0.6 },
    shapes: [heart, star],
    scalar: 2,
  });

  setTimeout(() => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { x: 0.2, y: 0.7 },
      shapes: [heart],
      scalar: 2,
    });
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { x: 0.8, y: 0.7 },
      shapes: [star],
      scalar: 2,
    });
  }, 300);
}
