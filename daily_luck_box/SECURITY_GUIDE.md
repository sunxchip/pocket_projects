# 🔐 보안 & 민감한 파일 관리 가이드

## ⚠️ 절대로 공유하면 안 되는 파일들

### **1. 환경 변수 & 설정 파일**
```
.env           # API 키, 데이터베이스 비밀번호 등
.env.local     # 로컬 환경 설정
.env.*.local   # 환경별 로컬 설정
local.properties  # Android 로컬 설정
```
**위험도**: 🔴 **매우 높음** - 해킹의 직접적 대상

---

### **2. 보안 관련 파일**
```
*.key          # 개인 키
*.pem          # PEM 포맷 인증서
*.p12          # PKCS12 인증서
*.pfx          # PFX 포맷 인증서
*.keystore     # Android 서명 키
*.jks          # Java KeyStore
credentials/   # 자격증명 디렉토리
secrets.json   # 비밀 설정 파일
```
**위험도**: 🔴 **매우 높음** - 앱에 접근 권한 탈취

---

### **3. 클라우드 & API 설정**
```
firebase.json           # Firebase 설정
google-services.json    # Google 서비스 설정
GoogleService-Info.plist  # iOS Firebase 설정
.aws/                   # AWS 자격증명
.azure/                 # Azure 자격증명
```
**위험도**: 🔴 **매우 높음** - 클라우드 리소스 악용

---

### **4. 데이터베이스 파일 (프로덕션)**
```
*.db           # SQLite 데이터베이스 (실제 데이터 포함)
*.sqlite       # SQLite 데이터베이스
*.sqlite3      # SQLite3 데이터베이스
```
**위험도**: 🟠 **높음** - 사용자 데이터 노출

---

### **5. 생성된 바이너리 & 빌드 파일**
```
*.apk          # Android 앱 (서명됨)
*.aab          # Android App Bundle
*.ipa          # iOS 앱
*.app          # macOS 앱
*.exe          # Windows 실행 파일
build/         # 빌드 아티팩트
dist/          # 배포 파일
out/           # 출력 파일
```
**위험도**: 🟠 **중간** - 배포 자산이지만 공개 저장소에는 불필요

---

## ✅ 공유해도 괜찮은 파일들

### **1. 소스 코드**
```
lib/           # 모든 Dart 소스 코드 ✓
test/          # 테스트 코드 ✓
```

### **2. 프로젝트 설정**
```
pubspec.yaml   # 의존성 정보 ✓
analysis_options.yaml  # Lint 설정 ✓
```

### **3. 문서**
```
README.md      # 프로젝트 설명 ✓
*.md           # 마크다운 문서 ✓
```

### **4. 플랫폼 설정 (기본값)**
```
android/       # Android 프로젝트 (로컬.properties 제외) ✓
ios/           # iOS 프로젝트 (설정 파일 제외) ✓
```

---

## 📋 현재 .gitignore 에 포함된 항목

### **보안 우선순위별 정렬**

#### **🔴 매우 높은 우선순위 (반드시 무시)**
```
# 환경 변수
.env
.env.*
!.env.example
local.properties

# 개인 키 & 인증서
*.key
*.pem
*.p12
*.pfx
*.keystore
*.jks

# API 설정
firebase.json
google-services.json
GoogleService-Info.plist

# 자격증명
credentials/
.aws/
.azure/
```

#### **🟠 높은 우선순위**
```
# 빌드 아티팩트
*.apk
*.aab
*.ipa
*.app
build/
dist/
out/

# 로컬 데이터베이스
*.db
*.sqlite
*.sqlite3
```

#### **🟡 중간 우선순위**
```
# IDE 파일
.idea/
.vscode/
.netbeans/

# 로그 파일
logs/
*.log

# 임시 파일
temp/
tmp/
cache/
```

#### **🟢 낮은 우선순위**
```
# OS 파일
.DS_Store
Thumbs.db

# 일반 임시 파일
*.swp
*.swo
*~
```

---

## 🚀 올바른 사용 방법

### **1. 환경 변수 설정**

**절대하면 안 될 일** ❌
```dart
// ❌ 코드에 직접 포함
const String apiKey = "sk-abc123xyz...";
const String firebaseProjectId = "my-firebase-project";
```

**올바른 방법** ✅
```dart
// ✅ 환경 변수에서 로드
import 'dart:io';
final apiKey = Platform.environment['API_KEY'];
final firebaseProjectId = Platform.environment['FIREBASE_PROJECT_ID'];
```

### **2. 로컬 설정 파일**

```bash
# 로컬에만 존재하는 파일 생성
echo "local.properties" >> .gitignore

# 예제 파일은 공유 (다른 개발자가 참고용으로 사용)
touch local.properties.example
echo "# Firebase config
firebase_project_id=YOUR_PROJECT_ID" > local.properties.example
```

### **3. Firebase 설정**

**iOS 앱에 포함** (앱 번들링 필요)
```
GoogleService-Info.plist → iOS 프로젝트에 포함
```

**Android 앱에 포함** (앱 번들링 필요)
```
google-services.json → android/app/ 폴더에 포함
```

하지만 소스 코드 저장소에는 **절대 올리지 않음**

---

## 📁 권장 디렉토리 구조

```
daily_luck_box/
├── lib/                    ✅ Git에 포함
├── test/                   ✅ Git에 포함
├── pubspec.yaml            ✅ Git에 포함
├── .gitignore              ✅ Git에 포함
├── README.md               ✅ Git에 포함
│
├── .env.example            ✅ Git에 포함 (예제)
├── local.properties.example ✅ Git에 포함 (예제)
│
├── .env                    ❌ Git 무시
├── .env.local              ❌ Git 무시
├── local.properties        ❌ Git 무시
├── secrets.json            ❌ Git 무시
│
├── credentials/            ❌ Git 무시
├── .aws/                   ❌ Git 무시
├── .azure/                 ❌ Git 무시
│
└── build/                  ❌ Git 무시
    ├── *.apk               ❌ Git 무시
    ├── *.aab               ❌ Git 무시
    └── *.ipa               ❌ Git 무시
```

---

## 🔍 실수로 민감한 파일을 올렸다면?

### **1단계: 즉시 파일 제거**
```bash
# 로컬에서는 유지, Git에서만 제거
git rm --cached .env
git rm --cached secrets.json
git rm --cached *.key

# .gitignore에 추가
echo ".env" >> .gitignore
echo "secrets.json" >> .gitignore
echo "*.key" >> .gitignore

# 커밋
git add .gitignore
git commit -m "Remove sensitive files from Git history"
git push
```

### **2단계: 민감한 정보 변경**
- API 키 재발급
- 데이터베이스 비밀번호 변경
- 인증서 재발급

### **3단계: 히스토리 완전 삭제 (선택)**
```bash
# ⚠️ 매우 위험 - 팀과 상의 후 진행
git filter-branch --tree-filter 'rm -f .env' -- --all
git push origin --force --all
```

---

## ✨ 체크리스트

GitHub에 올리기 전에 확인하세요:

- [ ] `.env` 파일이 `.gitignore`에 있는가?
- [ ] `local.properties` 파일이 `.gitignore`에 있는가?
- [ ] `*.key`, `*.pem`, `*.keystore` 파일이 `.gitignore`에 있는가?
- [ ] `firebase.json`, `google-services.json` 파일이 `.gitignore`에 있는가?
- [ ] `build/`, `dist/` 디렉토리가 `.gitignore`에 있는가?
- [ ] 코드에 하드코딩된 API 키가 없는가?
- [ ] 코드에 하드코딩된 데이터베이스 비밀번호가 없는가?
- [ ] `.gitignore` 파일 자체는 커밋되었는가?

---

## 📚 참고 자료

### **좋은 예시**
- [GitHub gitignore 템플릿](https://github.com/github/gitignore)
- [Dart/Flutter 보안 가이드](https://flutter.dev/security)

### **보안 도구**
- `git-secrets`: 비밀번호 검증 자동화
- `truffleHog`: Git 히스토리에서 민감한 정보 검색
- `detect-secrets`: 코드에서 비밀 탐지

---

**마지막 업데이트**: 2026년 2월 13일
**중요도**: 🔴 **매우 높음**
