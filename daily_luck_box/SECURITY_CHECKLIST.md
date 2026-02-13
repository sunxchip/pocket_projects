# 📋 보안 & Git 설정 최종 체크리스트

## ✅ 생성된 파일들

### **1. 보안 문서**

```
✓ SECURITY_GUIDE.md         - 상세한 보안 가이드 (필독)
✓ SECURITY_SUMMARY.md       - 보안 요약 (빠른 참조용)
✓ GIT_SETUP_GUIDE.md        - Git 설정 완전 가이드
✓ .gitignore               - 업데이트됨 (150줄+)
```

### **2. 예제 파일**

```
✓ .env.example             - 환경 변수 예제
✓ local.properties.example - Android 로컬 설정 예제
```

---

## 🔐 .gitignore 에 추가된 항목

### **보안 (🔴 최우선)**
```
.env, .env.*, local.properties
*.key, *.pem, *.p12, *.pfx, *.keystore, *.jks
firebase.json, google-services.json, GoogleService-Info.plist
credentials/, .aws/, .azure/
```

### **빌드 & 바이너리 (🟠 높음)**
```
build/, dist/, out/
*.apk, *.aab, *.ipa, *.app, *.exe
*.db, *.sqlite, *.sqlite3
```

### **캐시 & 임시 파일 (🟡 중간)**
```
.dart_tool/, .gradle/, Pods/
logs/, temp/, tmp/, cache/
```

### **IDE & OS (🟢 낮음)**
```
.idea/, .vscode/, .netbeans/
.DS_Store, Thumbs.db, *.swp
```

---

## 🚀 신규 개발자 온보딩 (3단계)

```bash
# 1️⃣ 저장소 클론
git clone https://github.com/your-username/daily_luck_box.git
cd daily_luck_box

# 2️⃣ 환경 설정
cp .env.example .env
cp local.properties.example android/local.properties
# 에디터로 열어 값 입력

# 3️⃣ 실행
flutter pub get
flutter run
```

---

## 📊 민감한 파일 분류

| 카테고리 | 위험도 | 파일/디렉토리 | 공유 |
|---------|--------|-------------|------|
| **환경 설정** | 🔴 매우 높음 | `.env`, `local.properties` | ❌ |
| **개인 키** | 🔴 매우 높음 | `*.key`, `*.pem`, `*.keystore` | ❌ |
| **클라우드 API** | 🔴 매우 높음 | `firebase.json`, `google-services.json` | ❌ |
| **빌드 파일** | 🟠 높음 | `build/`, `*.apk`, `*.ipa` | ❌ |
| **데이터베이스** | 🟠 높음 | `*.db`, `*.sqlite` | ❌ |
| **IDE 설정** | 🟡 중간 | `.idea/`, `.vscode/` | ❌ |
| **소스 코드** | ✅ | `lib/`, `test/` | ✅ |
| **문서** | ✅ | `*.md`, `pubspec.yaml` | ✅ |
| **예제** | ✅ | `.env.example` | ✅ |

---

## 🔍 커밋 전 최종 검사

```bash
# 1. 현재 상태 확인
git status

# 2. 스테이징될 파일 확인
git diff --cached --name-only

# 3. 민감한 파일이 포함되었는지 확인
# .env, *.key, firebase.json 등이 없어야 함

# 4. 대용량 파일 확인
# build/, *.apk 등이 없어야 함

# 5. 모두 확인되면 커밋
git commit -m "커밋 메시지"
git push
```

---

## 🎯 GitHub에 올릴 때 확인사항

### **체크리스트**

- [ ] `.gitignore` 파일이 커밋되었는가?
- [ ] `.env` 파일이 **커밋되지 않았는가?** ✅
- [ ] `*.key`, `*.pem` 파일이 **커밋되지 않았는가?** ✅
- [ ] `firebase.json`, `google-services.json` 파일이 **커밋되지 않았는가?** ✅
- [ ] `build/` 디렉토리가 **커밋되지 않았는가?** ✅
- [ ] `*.apk`, `*.aab`, `*.ipa` 파일이 **커밋되지 않았는가?** ✅
- [ ] 코드에 하드코딩된 API 키가 없는가? ✅
- [ ] README.md가 명확한가? ✅
- [ ] `.env.example` 파일이 포함되었는가? ✅

---

## 📚 참고 문서 위치

```
daily_luck_box/
├── SECURITY_GUIDE.md      ← 🔐 상세 보안 가이드
├── SECURITY_SUMMARY.md    ← 🔐 빠른 참조용
├── GIT_SETUP_GUIDE.md     ← 🔧 Git 설정
├── .gitignore             ← 🚫 Git 무시 규칙
├── .env.example           ← 📝 환경 변수 예제
├── local.properties.example ← 📝 로컬 설정 예제
└── README.md              ← 📖 프로젝트 설명
```

---

## 🚨 실수 방지 팁

### **❌ 절대 하면 안 될 일**

```dart
// ❌ API 키를 코드에 하드코딩
const String apiKey = "sk-proj-abc123...";

// ❌ 비밀번호를 코드에 하드코딩  
const String dbPassword = "password123";

// ❌ Firebase 설정을 코드에 하드코딩
const String firebaseProjectId = "my-firebase-123";
```

### **✅ 올바른 방법**

```dart
// ✅ 환경 변수에서 로드
import 'package:flutter_dotenv/flutter_dotenv.dart';

final apiKey = dotenv.env['API_KEY'];
final dbPassword = dotenv.env['DB_PASSWORD'];
final firebaseProjectId = dotenv.env['FIREBASE_PROJECT_ID'];
```

---

## 🔄 팀 협업 가이드

### **저장소 설정자**
1. `.gitignore` 확인
2. `.env.example`, `local.properties.example` 생성
3. GitHub에 푸시

### **신규 팀 멤버**
1. 저장소 클론
2. `cp .env.example .env` 실행
3. `.env` 파일에 값 입력
4. 시작!

### **모든 팀 멤버**
- `.env` 파일은 **절대 Git에 올리지 않기**
- 로컬에서만 작업
- 변경사항은 `.env.example`에 반영

---

## 📞 실수로 민감한 파일을 올렸다면?

### **빠른 대응**
```bash
# 1. 파일 즉시 제거
git rm --cached .env
git rm --cached *.key

# 2. 커밋
git commit -m "Remove sensitive files"

# 3. .gitignore에 추가
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Add .env to .gitignore"

# 4. 푸시
git push

# 5. 🔴 반드시 민감한 정보 변경!
# - API 키 재발급
# - 비밀번호 변경
# - 인증서 재발급
```

---

## 🎓 학습 리소스

### **필독 문서**
- `SECURITY_GUIDE.md` - 전체 보안 설명
- `GIT_SETUP_GUIDE.md` - Git 완전 가이드
- `SECURITY_SUMMARY.md` - 빠른 요약

### **참고 자료**
- [GitHub .gitignore 템플릿](https://github.com/github/gitignore)
- [Flutter 보안 모범 사례](https://flutter.dev/security)
- [OWASP 모바일 보안](https://owasp.org/www-project-mobile-security/)

---

## ✨ 요약

| 항목 | 설명 |
|-----|------|
| **생성 파일** | 4개 (문서 3 + 예제 2) |
| **보안 수준** | 🔴 매우 높음 |
| **팀 규모** | 1명 ~ 대규모 팀 모두 적용 가능 |
| **유지보수** | 거의 자동 (.gitignore) |
| **학습 난이도** | 쉬움 (예제 파일 기반) |

---

**설정 완료 날짜**: 2026년 2월 13일  
**최종 상태**: ✅ 프로덕션 준비 완료  
**중요도**: 🔴 **필수 - 팀원 모두 읽을 것**
