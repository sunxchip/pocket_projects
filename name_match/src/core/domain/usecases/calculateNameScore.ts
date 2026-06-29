// 한글 자음의 획수 (전통 이름점 방식)
const JAMO_STROKES: Record<string, number> = {
  ㄱ: 2, ㄴ: 2, ㄷ: 3, ㄹ: 5, ㅁ: 4, ㅂ: 4, ㅅ: 2, ㅇ: 1, ㅈ: 3,
  ㅊ: 4, ㅋ: 3, ㅌ: 4, ㅍ: 4, ㅎ: 3, ㄲ: 4, ㄸ: 6, ㅃ: 8, ㅆ: 4, ㅉ: 6,
  ㅏ: 2, ㅐ: 3, ㅑ: 3, ㅒ: 4, ㅓ: 2, ㅔ: 3, ㅕ: 3, ㅖ: 4, ㅗ: 2, ㅘ: 4,
  ㅙ: 5, ㅚ: 3, ㅛ: 3, ㅜ: 2, ㅝ: 4, ㅞ: 5, ㅟ: 3, ㅠ: 3, ㅡ: 1, ㅢ: 2, ㅣ: 1,
};

function decomposeHangul(char: string): string[] {
  const code = char.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return [char];

  const CHOSUNG = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
  const JUNGSUNG = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
  const JONGSUNG = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

  const cho = Math.floor(code / (21 * 28));
  const jung = Math.floor((code % (21 * 28)) / 28);
  const jong = code % 28;

  const result = [CHOSUNG[cho], JUNGSUNG[jung]];
  if (JONGSUNG[jong]) result.push(JONGSUNG[jong]);
  return result;
}

function getNameStrokes(name: string): number {
  return name
    .split('')
    .flatMap(decomposeHangul)
    .reduce((acc, jamo) => acc + (JAMO_STROKES[jamo] ?? 1), 0);
}

function reduceToTwoDigit(n: number): number {
  while (n >= 100) {
    n = Math.floor(n / 10) + (n % 10);
  }
  return n;
}

export function calculateNameScore(nameA: string, nameB: string): number {
  const strokesA = getNameStrokes(nameA);
  const strokesB = getNameStrokes(nameB);
  const combined = strokesA + strokesB;
  const score = reduceToTwoDigit(combined);
  // 최소 30점, 최대 99점 범위로 정규화 (너무 낮은 점수 방지)
  return Math.max(30, Math.min(99, score));
}
