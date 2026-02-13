# 📂 파일 구조 요약

```
lib/
│
├── main.dart
│   └── 앱 시작점 & DB 초기화
│       • WidgetsFlutterBinding.ensureInitialized()
│       • DatabaseHelper().database 초기화
│       • MyApp 클래스 정의
│       • 전역 테마 설정
│
├── models/
│   └── fortune_model.dart (20줄)
│       └── Fortune 클래스
│           • id: int? (DB 기본키)
│           • emoji: String
│           • message: String
│           • toMap() / fromMap() (DB 변환)
│           • fullText getter (이모지 + 메시지)
│
├── data/
│   ├── database_helper.dart (200줄)
│   │   └── DatabaseHelper (싱글톤)
│   │       • _initDatabase() → DB 경로 설정
│   │       • _onCreate() → 테이블 생성
│   │       • _insertInitialData() → 50개 운세 삽입
│   │       • getRandomFortune() ⭐ (무작위 운세 조회)
│   │       • getAllFortunes()
│   │       • insertFortune()
│   │       • deleteAllFortunes()
│   │
│   └── fortune_data.dart (미사용)
│       └── 이전 정적 데이터 (삭제 가능)
│
├── screens/
│   └── fortune_screen.dart (570줄)
│       └── FortuneScreen (StatefulWidget)
│           • 3가지 애니메이션 컨트롤러
│             - _flipController (카드 뒤집기, 800ms)
│             - _shakeController (흔들림, 400ms)
│             - _scaleController (튀어나오기, 600ms)
│           • _confettiController (축제 가루 효과)
│           • _getRandomFortune() (운세 뽑기 로직)
│           • _buildFlippingCard() (3D 카드 렌더링)
│           • _buildButtonRow() (버튼 UI)
│           • _showShareOptions() (공유 옵션 모달)
│           • _shareWithImage() / _shareTextOnly()
│
└── utils/
    └── fortune_share_helper.dart (70줄)
        └── FortuneShareHelper (싱글톤)
            • captureCard() → 카드를 PNG로 캡처
            • saveCardImage() → 로컬에 저장
            • shareFortuneImage() → 이미지 공유
            • shareFortuneText() → 텍스트 공유
```

---

## 🔑 각 파일의 핵심 기능

### 1️⃣ **main.dart** (15줄)
```
역할: 앱 시작
├─ WidgetsFlutterBinding.ensureInitialized()
├─ DatabaseHelper 초기화
├─ runApp()
└─ MyApp 설정
```

### 2️⃣ **fortune_model.dart** (30줄)
```
역할: 데이터 구조 정의
└─ Fortune 클래스
   ├─ id (DB 기본키)
   ├─ emoji (🍀, ✨ 등)
   ├─ message ("평범함 속에 행복이..." 등)
   └─ DB 변환 메서드
```

### 3️⃣ **database_helper.dart** (200줄) ⭐ 가장 중요
```
역할: 운세 데이터 관리
├─ DB 테이블 생성
├─ 50개 운세 자동 삽입
├─ getRandomFortune() ← 가장 자주 사용
├─ 모든 운세 조회
└─ 새 운세 추가 기능
```

### 4️⃣ **fortune_screen.dart** (570줄) ⭐ 가장 복잡
```
역할: 메인 UI + 애니메이션
├─ 3가지 애니메이션
│  ├─ 카드 뒤집기 (3D 효과)
│  ├─ 좌우 흔들림
│  └─ 튀어나오기
├─ 축제 가루 효과
├─ 운세 뽑기 로직
└─ 공유 기능
```

### 5️⃣ **fortune_share_helper.dart** (70줄)
```
역할: SNS 공유 기능
├─ 카드 이미지 캡처
├─ 로컬 저장
├─ SNS 공유 (카톡, 인스타그램 등)
└─ 자동 해시태그 추가
```

---

## 🎯 데이터 흐름

```
앱 시작 (main.dart)
        ↓
DatabaseHelper 초기화 (database_helper.dart)
- fortunes 테이블 생성
- 50개 운세 자동 삽입
        ↓
FortuneScreen 렌더링 (fortune_screen.dart)
- UI 표시: "복채를 던져보세요"
        ↓
사용자 클릭: "운세 뽑기 버튼"
        ↓
_getRandomFortune() 실행
- 애니메이션 시작
- DatabaseHelper.getRandomFortune() 호출
- Fortune 모델 반환
- currentFortune 업데이트
- 애니메이션 완료
- Confetti 효과 재생
        ↓
공유 버튼 표시
        ↓
사용자 클릭: "공유"
        ↓
FortuneShareHelper.shareFortuneText() 호출
- SNS 공유 (카톡, 인스타그램 등)
```

---

## 🐛 버그 수정 내용

### **문제**
운세를 뽑을 때마다 같은 운세가 나옴

### **원인 분석**
1. 애니메이션 컨트롤러가 완전히 초기화되지 않음
2. `_flipController.forward()` 중복 호출
3. 상태 관리 오류

### **해결 방법**
```dart
// 수정 전 (문제 있음)
Future<void> _getRandomFortune() async {
  _flipController.forward();
  // ...
  await _flipController.forward();  // 중복!
  // ...
  _flipController.reset();  // 너무 늦음
}

// 수정 후 (정상)
Future<void> _getRandomFortune() async {
  // 1. 먼저 모든 애니메이션 초기화
  _flipController.reset();
  _shakeController.reset();
  _scaleController.reset();
  
  // 2. 애니메이션 시작 (한 번만)
  _flipController.forward();
  
  // 3. DB에서 데이터 로드
  final fortune = await _dbHelper.getRandomFortune();
  
  // 4. 결과 표시 후 추가 애니메이션
  _scaleController.forward();
}
```

---

## 📊 파일별 코드 라인 수

| 파일 | 라인 수 | 용도 |
|-----|--------|------|
| main.dart | ~20 | 앱 시작점 |
| fortune_model.dart | ~30 | 데이터 모델 |
| database_helper.dart | ~200 | DB 관리 |
| fortune_screen.dart | ~570 | 메인 UI |
| fortune_share_helper.dart | ~70 | 공유 기능 |
| **합계** | **~890** | **전체** |

---

## 🚀 빠른 참조

### 운세를 뽑으려면?
```dart
final fortune = await DatabaseHelper().getRandomFortune();
print(fortune.fullText); // "✨ 대박! 오늘은 뭘 해도 되는 날"
```

### 새 운세를 추가하려면?
```dart
final newFortune = Fortune(emoji: '🌟', message: '새로운 운세');
await DatabaseHelper().insertFortune(newFortune);
```

### 운세를 공유하려면?
```dart
await FortuneShareHelper().shareFortuneText(fortuneText);
```

### 모든 운세를 보려면?
```dart
final allFortunes = await DatabaseHelper().getAllFortunes();
for (var fortune in allFortunes) {
  print(fortune.fullText);
}
```

---

**최종 업데이트**: 2026년 2월 13일
