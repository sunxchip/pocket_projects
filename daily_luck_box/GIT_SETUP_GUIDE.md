# 🔧 Git 설정 & 초기 세팅 가이드

## 🚀 프로젝트 클론 후 첫 실행

### **1단계: 저장소 클론**
```bash
git clone https://github.com/your-username/daily_luck_box.git
cd daily_luck_box
```

### **2단계: 예제 파일로부터 로컬 설정 파일 생성**
```bash
# 환경 변수 설정
cp .env.example .env
cp local.properties.example android/local.properties
```

### **3단계: 로컬 설정 파일 수정**
```bash
# 에디터로 열기
nano .env
# 또는
code .env
```

각 설정값을 자신의 환경에 맞게 수정하세요.

### **4단계: 패키지 설치**
```bash
flutter pub get
```

### **5단계: 앱 실행**
```bash
flutter run
```

---

## 📝 Git 관련 권장 설정

### **전역 설정** (모든 프로젝트에 적용)

```bash
# 정보 설정
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 줄바꿈 통일 (Windows/Mac/Linux 호환성)
git config --global core.autocrlf true

# 대소문자 구분 (macOS/Linux 필수)
git config --global core.ignorecase false

# Pull 전략
git config --global pull.rebase true
```

### **프로젝트별 설정** (현재 프로젝트만)

```bash
# 프로젝트 루트에서 실행
git config user.name "Your Name"
git config user.email "your.email@example.com"

# 이 프로젝트에서만 특정 파일 무시
git config core.safecrlf true
```

---

## ⚠️ .gitignore 검증

### **무시될 파일 확인**
```bash
# 특정 패턴이 무시되는지 확인
git check-ignore -v .env
git check-ignore -v local.properties
git check-ignore -v build/
```

### **실수로 추가된 파일 확인**
```bash
# 커밋할 파일 목록 확인
git status

# 추가 예정인 파일 상세 확인
git diff --cached --name-only
```

---

## 🔐 민감한 정보 보호

### **Git pre-commit hook 설정** (선택)

민감한 정보가 커밋되는 것을 자동으로 방지합니다.

**설치**:
```bash
# git-secrets 설치 (macOS)
brew install git-secrets

# 프로젝트에 설정
cd daily_luck_box
git secrets --install
git secrets --register-aws
```

**패턴 추가**:
```bash
# 커스텀 패턴 추가
git secrets --add '.env'
git secrets --add 'password='
git secrets --add 'api_key='
git secrets --add 'secret='
```

---

## 📦 커밋 전 체크리스트

```bash
#!/bin/bash
# commit-check.sh

echo "🔍 커밋 전 보안 검사..."

# 1. .gitignore 파일이 있는지 확인
if [ ! -f .gitignore ]; then
    echo "❌ .gitignore 파일이 없습니다"
    exit 1
fi

# 2. .env 파일이 스테이징되었는지 확인
if git diff --cached --name-only | grep -q "^\.env$"; then
    echo "❌ .env 파일이 커밋될 예정입니다! 취소합니다."
    exit 1
fi

# 3. *.key, *.pem 파일이 스테이징되었는지 확인
if git diff --cached --name-only | grep -qE "\.(key|pem|keystore|jks)$"; then
    echo "❌ 민감한 키 파일이 커밋될 예정입니다! 취소합니다."
    exit 1
fi

# 4. build/ 디렉토리가 스테이징되었는지 확인
if git diff --cached --name-only | grep -q "^build/"; then
    echo "❌ build/ 디렉토리가 커밋될 예정입니다! 취소합니다."
    exit 1
fi

echo "✅ 모든 보안 검사 통과!"
exit 0
```

**실행 권한 주기**:
```bash
chmod +x commit-check.sh
```

**Pre-commit hook으로 등록**:
```bash
cp commit-check.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

---

## 🌱 첫 커밋 예제

```bash
# 1. 상태 확인
git status

# 2. 전체 파일 추가
git add .

# 3. 커밋
git commit -m "Initial commit: Daily Lucky Box app

- Flutter 프로젝트 초기 설정
- SQLite 기반 운세 관리
- 3D 애니메이션 UI
- SNS 공유 기능
- 완벽한 .gitignore 설정"

# 4. 푸시
git push -u origin main
```

---

## 🔄 협업 시 주의사항

### **팀 멤버가 클론할 때**

```bash
# 1. 저장소 클론
git clone https://github.com/your-username/daily_luck_box.git

# 2. .env 파일 생성
cp .env.example .env

# 3. 로컬 설정 수정
# .env 파일을 열어 API 키 등을 입력

# 4. 패키지 설치
flutter pub get

# 5. 실행
flutter run
```

### **주의**: 절대하면 안 될 일 ❌
```bash
# ❌ 환경 설정 파일을 공유하면 안됨
git push .env

# ❌ 빌드 파일을 추가하면 안됨
git add build/
git add *.apk

# ❌ API 키를 코드에 하드코딩하면 안됨
const String apiKey = "sk-abc123...";
```

---

## 📋 Git 유용한 명령어

```bash
# 파일이 .gitignore로 무시되지 않는 이유 확인
git check-ignore -v <filename>

# 실수로 추가된 파일 스테이징 해제
git reset HEAD <filename>

# 스테이징된 모든 파일 보기
git diff --cached --name-only

# 커밋할 변경사항 미리보기
git diff --cached

# 마지막 커밋 취소 (파일은 유지)
git reset --soft HEAD~1

# 특정 파일만 이전 커밋 상태로 되돌리기
git checkout HEAD -- <filename>
```

---

## 🎯 권장 Git 워크플로우

```
main (메인 브랜치)
  ↓
feature/운세-기능 (기능 개발)
  ↓
feature/공유-기능 (다른 기능)
  ↓
Pull Request & Code Review
  ↓
main (병합)
```

### **브랜치 명명 규칙**
- `feature/기능-설명` - 새 기능
- `bugfix/버그-설명` - 버그 수정
- `docs/문서-설명` - 문서 작성
- `refactor/리팩토링-설명` - 코드 정리

---

## 🚨 문제 해결

### **문제**: `.gitignore` 적용이 안 됨

```bash
# 해결: Git 캐시 초기화
git rm -r --cached .
git add .
git commit -m "Fix: apply .gitignore"
```

### **문제**: 이미 커밋된 파일 제거

```bash
# Git에서만 제거 (로컬은 유지)
git rm --cached .env
git commit -m "Remove .env from git"

# .gitignore에 추가
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Add .env to .gitignore"
```

---

**최종 수정**: 2026년 2월 13일
