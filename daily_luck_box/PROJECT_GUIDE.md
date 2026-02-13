# 🎴 Daily Lucky Box - 프로젝트 구조 가이드

## 📂 프로젝트 파일 구조 및 용도

### **🔧 핵심 파일들**

#### **1. lib/main.dart** 
**용도**: 앱의 진입점 및 설정
- Flutter 앱 시작점
- 데이터베이스 초기화 (`DatabaseHelper().database`)
- 전역 테마 설정
- MyApp 클래스에서 FortuneScreen을 home으로 설정

**코드 길이**: ~20줄

---

#### **2. lib/models/fortune_model.dart**
**용도**: 운세 데이터 모델 정의
- `Fortune` 클래스: id, emoji, message 필드 정의
- `toMap()`: Fortune 객체를 Map으로 변환 (DB 저장용)
- `fromMap()`: Map을 Fortune 객체로 변환 (DB 로드용)
- `fullText` getter: "이모지 + 메시지" 형태로 결합

**사용처**: database_helper.dart, fortune_screen.dart

---

#### **3. lib/data/database_helper.dart**
**용도**: SQLite 데이터베이스 관리 (운세 저장/조회)
- 싱글톤 패턴으로 DB 인스턴스 관리
- `_onCreate()`: 앱 첫 실행 시 DB 테이블 생성
- `_insertInitialData()`: 기본 운세 50개 자동 삽입
- `getRandomFortune()`: 무작위 운세 1개 조회 (핵심 기능)
- `getAllFortunes()`: 모든 운세 조회
- `insertFortune()`: 새 운세 추가
- `deleteAllFortunes()`: DB 초기화 (테스트용)

**사용처**: main.dart (초기화), fortune_screen.dart (운세 조회)

---

#### **4. lib/screens/fortune_screen.dart**
**용도**: 메인 UI 및 사용자 인터랙션
- 상태 관리: 운세 텍스트, 로딩 상태, 공유 버튼 표시 여부
- **3가지 애니메이션 컨트롤러**:
  - `_flipController`: 카드 뒤집기 (800ms)
  - `_shakeController`: 좌우 흔들림 (400ms)
  - `_scaleController`: 튀어나오는 효과 (600ms)
- `_confettiController`: 축제 같은 가루 효과
- `_getRandomFortune()`: 운세 뽑기 로직 (애니메이션 + DB 조회)
- `_shareCurrentFortune()`: 공유 기능 연결

**주요 메서드**:
- `_buildFlippingCard()`: 3D 뒤집기 효과가 있는 카드 렌더링
- `_buildButtonRow()`: 운세 뽑기 + 공유 버튼
- `_buildFrontSide()`: 카드 기본 상태
- `_buildBackSide()`: 운세 표시
- `_showShareOptions()`: 공유 방식 선택 모달

---

#### **5. lib/utils/fortune_share_helper.dart**
**용도**: SNS 공유 기능 담당
- 싱글톤 패턴으로 공유 기능 관리
- `captureCard()`: GlobalKey를 사용해 카드를 PNG 이미지로 캡처
- `saveCardImage()`: 캡처한 이미지를 로컬 저장소에 저장
- `shareFortuneImage()`: 이미지 + 텍스트와 함께 공유
- `shareFortuneText()`: 텍스트만 공유
- 자동으로 해시태그 추가: `#오늘의운세 #운세 #LuckyBox`

**지원 플랫폼**: 카카오톡, 인스타그램, 메일, 메시지 등

---

#### **6. lib/data/fortune_data.dart**
**용도**: 초기 운세 데이터 (현재 미사용)
- 이전 버전에서 사용했던 정적 데이터
- 현재는 database_helper.dart의 `_insertInitialData()`가 대신함
- 필요 시 삭제 가능

---

### **⚙️ 설정 파일들**

#### **pubspec.yaml**
**주요 의존성**:
```yaml
sqflite: ^2.3.0           # SQLite 데이터베이스
path: ^1.8.3              # 파일 경로 관리
confetti: ^0.7.0          # 축제 가루 효과
share_plus: ^7.2.0        # SNS 공유
path_provider: ^2.1.0     # 로컬 파일 저장 경로
```

#### **ios/Runner/Info.plist**
사진 라이브러리 접근 권한 설정:
- `NSPhotoLibraryUsageDescription`
- `NSPhotoLibraryAddOnlyUsageDescription`

#### **android/app/src/main/AndroidManifest.xml**
파일 저장/공유 권한 설정:
- `READ_EXTERNAL_STORAGE`
- `WRITE_EXTERNAL_STORAGE`
- `MANAGE_EXTERNAL_STORAGE`

---

## 🔄 데이터 흐름

```
main.dart (시작)
    ↓
DatabaseHelper 초기화 (DB 생성, 50개 운세 삽입)
    ↓
FortuneScreen 렌더링
    ↓
사용자가 "운세 뽑기" 클릭
    ↓
1. 애니메이션 시작 (_flipController, _shakeController)
2. DB에서 getRandomFortune() 호출
3. Fortune 모델 데이터 받음
4. currentFortune 업데이트 (fortune.fullText)
5. 스케일 애니메이션 + Confetti 효과
6. 공유 버튼 표시
    ↓
사용자가 "공유" 클릭 (선택)
    ↓
FortuneShareHelper를 통해 SNS 공유
```

---

## 🎬 애니메이션 타이밍

| 시간(ms) | 이벤트 | 컨트롤러 |
|---------|-------|---------|
| 0 | "운세 뽑기" 버튼 클릭 | - |
| 0 | 카드 뒤집기 시작 | _flipController.forward() |
| 200 | 흔들림 애니메이션 시작 | _shakeController.forward() |
| 600 | DB 쿼리 시작 | - |
| 800 | 카드 완전히 뒤집혀서 운세 표시 | - |
| 800 | 튀어나오는 효과 시작 | _scaleController.forward() |
| 1400 | 축제 가루 효과 시작 | _confettiController.play() |
| 3400 | 축제 가루 효과 종료 | - |

---

## 🐛 최근 수정사항

### **문제**: 운세 뽑을 때마다 같은 운세가 나옴
### **원인**: 
1. 애니메이션이 완전히 초기화되지 않음
2. `_flipController.forward()` 중복 호출

### **해결**:
1. `_getRandomFortune()` 시작 시 모든 애니메이션 컨트롤러 `reset()` 호출
2. `_flipController.forward()` 중복 제거
3. 타이밍 조정으로 각 단계가 정확하게 실행되도록 수정

---

## 💡 주요 기술 스택

| 기술 | 용도 |
|-----|------|
| **Flutter** | UI 프레임워크 |
| **SQLite** | 운세 데이터 저장 |
| **Animation APIs** | 3D 뒤집기, 흔들림, 스케일 효과 |
| **Confetti** | 축제 효과 |
| **share_plus** | SNS 공유 |
| **path_provider** | 파일 저장 경로 관리 |

---

## 🚀 앱 실행

```bash
flutter pub get
flutter run
```

---

## 📝 코드 스타일

- **싱글톤 패턴**: DatabaseHelper, FortuneShareHelper
- **상태 관리**: StatefulWidget with TickerProviderStateMixin
- **비동기 처리**: async/await
- **UI 컴포넌트**: 프라이빗 메서드 `_build*()` 형태로 분리

---

**마지막 수정**: 2026년 2월 13일
**앱 버전**: 1.0.0
