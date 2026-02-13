# 🔐 보안 요약 문서

## 📊 민감한 파일 분류

### **🔴 절대 공유 금지** (매우 높은 위험도)

| 파일/디렉토리 | 이유 | 위험도 |
|-------------|------|--------|
| `.env` | API 키, DB 비밀번호 | 🔴 매우 높음 |
| `local.properties` | 로컬 SDK 설정 | 🔴 매우 높음 |
| `*.key`, `*.pem` | 개인 인증서 | 🔴 매우 높음 |
| `*.keystore`, `*.jks` | Android 서명 키 | 🔴 매우 높음 |
| `firebase.json` | Firebase 서비스 계정 | 🔴 매우 높음 |
| `google-services.json` | Google 서비스 설정 | 🔴 매우 높음 |
| `GoogleService-Info.plist` | iOS Firebase 설정 | 🔴 매우 높음 |
| `credentials/`, `.aws/`, `.azure/` | 클라우드 자격증명 | 🔴 매우 높음 |

### **🟠 공유 금지** (높은 위험도)

| 파일/디렉토리 | 이유 | 위험도 |
|-------------|------|--------|
| `build/` | 빌드 아티팩트 | 🟠 높음 |
| `*.apk`, `*.aab` | Android 앱 바이너리 | 🟠 높음 |
| `*.ipa` | iOS 앱 바이너리 | 🟠 높음 |
| `*.db`, `*.sqlite` | 로컬 데이터베이스 | 🟠 높음 |
| `.gradle/`, `Pods/` | 의존성 캐시 | 🟠 높음 |

### **🟡 선택적** (중간 우선순위)

| 파일/디렉토리 | 설명 |
|-------------|------|
| `.idea/`, `.vscode/` | IDE 설정 (개인 설정) |
| `pubspec.lock` | 의존성 락 파일 (대규모 팀은 공유) |
| `logs/` | 로그 파일 |

### **✅ 공유 권장** (항상 포함)

| 파일/디렉토리 | 이유 |
|-------------|------|
| `lib/` | 모든 소스 코드 |
| `test/` | 테스트 코드 |
| `pubspec.yaml` | 의존성 정보 |
| `.gitignore` | Git 규칙 |
| `README.md` | 프로젝트 설명 |
| `.env.example` | 환경 변수 예제 |
| `local.properties.example` | 로컬 설정 예제 |

---

## 🛠️ 현재 프로젝트 상태

### **✅ 이미 설정됨**

```
.gitignore (업데이트됨)
├── 환경 변수 무시 ✓
├── 민감한 키 무시 ✓
├── 빌드 파일 무시 ✓
├── IDE 설정 무시 ✓
└── OS 파일 무시 ✓

예제 파일
├── .env.example ✓
└── local.properties.example ✓
```

### **📋 체크리스트**

- [x] `.gitignore` 생성 및 업데이트
- [x] 환경 변수 예제 파일 생성
- [x] 로컬 설정 예제 파일 생성
- [x] 보안 가이드 문서 작성
- [x] Git 설정 가이드 작성

---

## 🚀 신규 개발자를 위한 가이드

### **1단계: 저장소 클론**
```bash
git clone https://github.com/your-username/daily_luck_box.git
cd daily_luck_box
```

### **2단계: 환경 설정**
```bash
# 예제 파일로부터 실제 파일 생성
cp .env.example .env
cp local.properties.example android/local.properties

# 에디터로 열어서 값 입력
code .env
code android/local.properties
```

### **3단계: 패키지 설치 및 실행**
```bash
flutter pub get
flutter run
```

---

## ⚠️ 실수하기 쉬운 상황

### **상황 1: 로컬 설정을 코드에 하드코딩**

❌ **잘못된 예**:
```dart
// ❌ 절대 하지 말 것!
const String apiKey = "sk-proj-abc123...";
const String firebaseProjectId = "my-firebase-123";

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Firebase 초기화 (공개됨!)
    Firebase.initializeApp(
      options: FirebaseOptions(
        apiKey: apiKey,
        projectId: firebaseProjectId,
      ),
    );
  }
}
```

✅ **올바른 예**:
```dart
// ✅ 환경 변수 또는 설정 파일에서 로드
import 'package:flutter_dotenv/flutter_dotenv.dart';

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // 환경 변수에서 로드 (Git에 공개되지 않음)
    final apiKey = dotenv.env['API_KEY'];
    final firebaseProjectId = dotenv.env['FIREBASE_PROJECT_ID'];
    
    Firebase.initializeApp(
      options: FirebaseOptions(
        apiKey: apiKey,
        projectId: firebaseProjectId,
      ),
    );
  }
}
```

### **상황 2: build/ 디렉토리 커밋**

❌ **잘못된 예**:
```bash
# ❌ 너무 큼 (수백 MB)
git add build/
git commit -m "Add build files"
git push
```

✅ **올바른 예**:
```bash
# ✅ .gitignore가 자동으로 무시함
git status
# build/ 폴더가 나타나지 않음
```

### **상황 3: 빌드된 APK 업로드**

❌ **잘못된 예**:
```bash
git add *.apk
git add *.aab
git commit -m "Build release app"
git push
```

✅ **올바른 예**:
```bash
# ✅ 바이너리는 Release 탭에서 직접 업로드
# GitHub Releases에 업로드하거나
# Play Store, App Store에 배포
```

---

## 🔍 보안 검사 명령어

### **커밋 전에 실행**

```bash
#!/bin/bash
# 보안 검사 스크립트

echo "🔐 보안 검사 시작..."

# 1. .env 파일 확인
if git diff --cached --name-only | grep -q "\.env$"; then
    echo "❌ .env 파일이 포함되어 있습니다!"
    exit 1
fi

# 2. 민감한 키 파일 확인
if git diff --cached --name-only | grep -qE "\.(key|pem|keystore|jks)$"; then
    echo "❌ 민감한 키 파일이 포함되어 있습니다!"
    exit 1
fi

# 3. Firebase 파일 확인
if git diff --cached --name-only | grep -qE "firebase\.json|google-services\.json|GoogleService-Info\.plist"; then
    echo "❌ Firebase 파일이 포함되어 있습니다!"
    exit 1
fi

# 4. Build 디렉토리 확인
if git diff --cached --name-only | grep -q "^build/"; then
    echo "❌ build/ 디렉토리가 포함되어 있습니다!"
    exit 1
fi

# 5. 바이너리 파일 확인
if git diff --cached --name-only | grep -qE "\.(apk|aab|ipa)$"; then
    echo "❌ 바이너리 파일이 포함되어 있습니다!"
    exit 1
fi

echo "✅ 모든 보안 검사 통과!"
exit 0
```

---

## 📚 관련 문서

| 문서 | 설명 |
|-----|------|
| **SECURITY_GUIDE.md** | 상세한 보안 가이드 |
| **GIT_SETUP_GUIDE.md** | Git 설정 및 초기화 |
| **.gitignore** | Git 무시 규칙 (현재 적용됨) |
| **.env.example** | 환경 변수 예제 |
| **local.properties.example** | 로컬 설정 예제 |

---

## 💡 주요 포인트

### **3줄 요약**

1. 🔴 `.env`, `*.key`, `firebase.json` **절대 공유 금지**
2. 🟠 `build/`, `*.apk` **자동으로 무시됨**
3. ✅ `lib/`, `pubspec.yaml`, `README.md` **항상 포함**

### **기억할 것**

- 💻 **로컬에서만 필요한 파일** → `.gitignore`에 추가
- 📝 **예제 파일이 필요** → `*.example` 파일로 공유
- 🔐 **민감한 정보** → 환경 변수에서 로드
- ✅ **커밋 전** → `git status` 확인

---

**마지막 업데이트**: 2026년 2월 13일  
**중요도**: 🔴 **매우 높음 - 필수 읽음**
