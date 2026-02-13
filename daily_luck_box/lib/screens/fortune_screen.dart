import 'package:flutter/material.dart';
import 'dart:ui';
import 'dart:async';
import 'dart:typed_data';
import 'package:confetti/confetti.dart';
import '../models/fortune_model.dart';
import '../data/database_helper.dart';
import '../utils/fortune_share_helper.dart';

class FortuneScreen extends StatefulWidget {
  const FortuneScreen({super.key});

  @override
  State<FortuneScreen> createState() => _FortuneScreenState();
}

class _FortuneScreenState extends State<FortuneScreen>
    with TickerProviderStateMixin {
  late AnimationController _shakeController;
  late AnimationController _flipController;
  late AnimationController _scaleController;
  late Animation<double> _shakeAnimation;
  late Animation<double> _flipAnimation;
  late Animation<double> _scaleAnimation;
  late ConfettiController _confettiController;

  final DatabaseHelper _dbHelper = DatabaseHelper();
  final FortuneShareHelper _shareHelper = FortuneShareHelper();
  final GlobalKey _cardKey = GlobalKey();

  String currentFortune = '복채를 던져보세요';
  bool isLoading = false;
  bool showNewFortune = false;

  @override
  void initState() {
    super.initState();
    _initializeAnimations();
  }

  void _initializeAnimations() {
    // 흔들림 애니메이션
    _shakeController = AnimationController(
      duration: const Duration(milliseconds: 400),
      vsync: this,
    );

    _shakeAnimation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _shakeController, curve: Curves.elasticInOut),
    );

    // 카드 뒤집기 애니메이션
    _flipController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );

    _flipAnimation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _flipController, curve: Curves.easeInOutCubic),
    );

    // 스케일 애니메이션 (튀어나오는 효과)
    _scaleController = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );

    _scaleAnimation = Tween<double>(begin: 0.8, end: 1.0).animate(
      CurvedAnimation(parent: _scaleController, curve: Curves.elasticOut),
    );

    // Confetti 컨트롤러
    _confettiController = ConfettiController(
      duration: const Duration(seconds: 2),
    );
  }

  Future<void> _getRandomFortune() async {
    if (isLoading) return;

    // 애니메이션 초기화
    _flipController.reset();
    _shakeController.reset();
    _scaleController.reset();

    setState(() {
      isLoading = true;
      showNewFortune = false;
    });

    // 1. 카드 뒤집기 애니메이션 시작 (800ms)
    _flipController.forward();

    // 2. 200ms 후 흔들림 애니메이션 시작
    await Future.delayed(const Duration(milliseconds: 200));
    _shakeController.forward();

    // 3. 600ms 후 DB에서 데이터 로드
    await Future.delayed(const Duration(milliseconds: 400));

    try {
      // 먼저 데이터베이스에 데이터가 있는지 확인
      final allFortunes = await _dbHelper.getAllFortunes();
      print('Total fortunes in DB: ${allFortunes.length}');
      
      final fortune = await _dbHelper.getRandomFortune();

      setState(() {
        if (fortune != null) {
          currentFortune = fortune.fullText;
          print('Fortune loaded: $currentFortune');
        } else {
          currentFortune = '오류: 운세를 불러올 수 없습니다';
          print('Fortune is null!');
        }
        showNewFortune = true;
        isLoading = false;
      });

      // 4. 뒤집기 애니메이션이 완료될 때까지 대기
      await Future.delayed(const Duration(milliseconds: 400));

      // 5. 결과 표시 후 스케일 애니메이션
      await _scaleController.forward();

      // 6. Confetti 효과 실행
      _confettiController.play();
    } catch (e) {
      print('Error getting fortune: $e');
      setState(() {
        currentFortune = '오류: ${e.toString()}';
        isLoading = false;
      });
    }
  }

  @override
  void dispose() {
    _shakeController.dispose();
    _flipController.dispose();
    _scaleController.dispose();
    _confettiController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text(
          '오늘의 운세',
          style: TextStyle(
            color: Colors.white,
            fontSize: 28,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
      ),
      body: Stack(
        children: [
          // 배경
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Color(0xFF667eea),
                  Color(0xFF764ba2),
                  Color(0xFFf093fb),
                  Color(0xFF4facfe),
                ],
                stops: const [0.0, 0.3, 0.7, 1.0],
              ),
            ),
          ),
          // 메인 컨텐츠
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // 애니메이션 적용된 카드
                AnimatedBuilder(
                  animation: Listenable.merge([
                    _shakeAnimation,
                    _flipAnimation,
                    _scaleAnimation,
                  ]),
                  builder: (context, child) {
                    final shake = _shakeAnimation.value * 20;
                    final flip = _flipAnimation.value;
                    final scale = _scaleAnimation.value;

                    return Transform.translate(
                      offset: Offset(
                        shake * (flip > 0.5 ? 1 - (flip - 0.5) * 2 : flip * 2 - 1),
                        0,
                      ),
                      child: Transform.scale(
                        scale: scale,
                        child: _buildFlippingCard(flip),
                      ),
                    );
                  },
                ),
                SizedBox(height: 70),
                // 버튼들 (운세 뽑기 + 공유)
                _buildButtonRow(),
              ],
            ),
          ),
          // Confetti 효과
          Align(
            alignment: Alignment.topCenter,
            child: ConfettiWidget(
              confettiController: _confettiController,
              blastDirection: 3.14 / 2,
              blastDirectionality: BlastDirectionality.explosive,
              shouldLoop: false,
              colors: const [
                Color(0xFFFFD700),
                Color(0xFFFF69B4),
                Color(0xFF00D9FF),
                Color(0xFF00FF88),
                Color(0xFFFF6B6B),
              ],
              emissionFrequency: 0.05,
              numberOfParticles: 50,
              gravity: 0.3,
            ),
          ),
        ],
      ),
    );
  }

  /// 뒤집기 효과가 있는 카드
  Widget _buildFlippingCard(double flipProgress) {
    // 플립 진행도가 0.5를 넘으면 내용 전환
    final isFront = flipProgress < 0.5;
    final rotationY = isFront ? flipProgress * 3.14 : (flipProgress - 0.5) * 3.14;

    return Transform(
      alignment: Alignment.center,
      transform: Matrix4.identity()
        ..setEntry(3, 2, 0.001)
        ..rotateY(rotationY),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(30),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
          child: Container(
            width: 320,
            height: 320,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Colors.white.withOpacity(0.2),
                  Colors.white.withOpacity(0.1),
                ],
              ),
              borderRadius: BorderRadius.circular(30),
              border: Border.all(
                color: Colors.white.withOpacity(0.3),
                width: 1.5,
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.2),
                  blurRadius: 20,
                  offset: const Offset(0, 10),
                ),
                BoxShadow(
                  color: Colors.white.withOpacity(0.1),
                  blurRadius: 10,
                  offset: const Offset(-5, -5),
                  spreadRadius: -2,
                ),
              ],
            ),
            child: Center(
              child: Padding(
                padding: const EdgeInsets.all(30),
                child: isFront
                    ? _buildFrontSide()
                    : _buildBackSide(),
              ),
            ),
          ),
        ),
      ),
    );
  }

  /// 카드 앞면 (기본 상태)
  Widget _buildFrontSide() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          '✨',
          style: TextStyle(
            fontSize: 60,
            color: Colors.white.withOpacity(0.8),
          ),
        ),
        const SizedBox(height: 20),
        Text(
          '복채를\n던져보세요',
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.w600,
            color: Colors.white.withOpacity(0.9),
            height: 1.6,
          ),
        ),
      ],
    );
  }

  /// 카드 뒷면 (운세 표시)
  Widget _buildBackSide() {
    return isLoading
        ? _buildLoadingWidget()
        : Text(
            currentFortune,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.w600,
              color: Colors.white,
              height: 1.8,
              shadows: [
                Shadow(
                  offset: Offset(0, 2),
                  blurRadius: 4,
                  color: Colors.black26,
                ),
              ],
            ),
          );
  }

  /// 로딩 위젯
  Widget _buildLoadingWidget() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        SizedBox(
          width: 50,
          height: 50,
          child: CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(
              Colors.white.withOpacity(0.8),
            ),
            strokeWidth: 3,
          ),
        ),
        const SizedBox(height: 16),
        Text(
          '운세를 불러오는 중...',
          style: TextStyle(
            fontSize: 16,
            color: Colors.white.withOpacity(0.8),
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  /// 운세 뽑기 버튼
  Widget _buildElevatedButton() {
    return Container(
      decoration: BoxDecoration(
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF764ba2).withOpacity(0.4),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: ElevatedButton(
        onPressed: isLoading ? null : _getRandomFortune,
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.white.withOpacity(0.9),
          foregroundColor: const Color(0xFF764ba2),
          padding: const EdgeInsets.symmetric(horizontal: 50, vertical: 18),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(50),
          ),
          elevation: 0,
          disabledBackgroundColor: Colors.white.withOpacity(0.6),
        ),
        child: Text(
          isLoading ? '기다리는 중...' : '운세 뽑기',
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            letterSpacing: 1,
          ),
        ),
      ),
    );
  }

  /// 버튼 행 (운세 뽑기 + 공유 버튼)
  Widget _buildButtonRow() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        _buildElevatedButton(),
        SizedBox(width: 16),
        if (showNewFortune && !isLoading)
          Container(
            decoration: BoxDecoration(
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF764ba2).withOpacity(0.4),
                  blurRadius: 20,
                  offset: const Offset(0, 10),
                ),
              ],
            ),
            child: ElevatedButton.icon(
              onPressed: _shareCurrentFortune,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white.withOpacity(0.9),
                foregroundColor: const Color(0xFF764ba2),
                padding: const EdgeInsets.symmetric(
                  horizontal: 30,
                  vertical: 18,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(50),
                ),
                elevation: 0,
              ),
              icon: const Icon(Icons.share, size: 20),
              label: const Text(
                '공유',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
      ],
    );
  }

  /// 운세 공유
  Future<void> _shareCurrentFortune() async {
    try {
      // 카드 이미지 캡처
      await Future.delayed(const Duration(milliseconds: 100));

      // 공유 옵션 표시
      _showShareOptions();
    } catch (e) {
      print('Error in share: $e');
    }
  }

  /// 공유 옵션 선택 다이얼로그
  void _showShareOptions() {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: const BorderRadius.vertical(
              top: Radius.circular(20),
            ),
          ),
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Padding(
                  padding: const EdgeInsets.only(bottom: 20),
                  child: Text(
                    '운세를 공유하세요',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF764ba2),
                    ),
                  ),
                ),
                ListTile(
                  leading: Icon(Icons.image, color: Color(0xFF764ba2)),
                  title: const Text('이미지와 함께 공유'),
                  subtitle: const Text('카카오톡, 인스타그램 등에 공유'),
                  onTap: () {
                    Navigator.pop(context);
                    _shareWithImage();
                  },
                ),
                ListTile(
                  leading: Icon(Icons.text_fields, color: Color(0xFF764ba2)),
                  title: const Text('텍스트로만 공유'),
                  subtitle: const Text('운세 텍스트만 공유'),
                  onTap: () {
                    Navigator.pop(context);
                    _shareTextOnly();
                  },
                ),
                ListTile(
                  leading: Icon(Icons.close, color: Colors.grey),
                  title: const Text('취소'),
                  onTap: () => Navigator.pop(context),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  /// 이미지와 함께 공유
  Future<void> _shareWithImage() async {
    try {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('공유 준비 중...'),
          duration: Duration(milliseconds: 500),
        ),
      );

      await _shareHelper.shareFortuneText(currentFortune);
    } catch (e) {
      print('Error sharing with image: $e');
      _showErrorDialog('공유 실패', '운세를 공유할 수 없습니다.');
    }
  }

  /// 텍스트만 공유
  Future<void> _shareTextOnly() async {
    try {
      await _shareHelper.shareFortuneText(currentFortune);
    } catch (e) {
      print('Error sharing text: $e');
      _showErrorDialog('공유 실패', '운세를 공유할 수 없습니다.');
    }
  }

  /// 에러 다이얼로그
  void _showErrorDialog(String title, String message) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(title),
          content: Text(message),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('확인'),
            ),
          ],
        );
      },
    );
  }
}
