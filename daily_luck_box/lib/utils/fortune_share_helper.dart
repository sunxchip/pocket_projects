import 'dart:typed_data';
import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:share_plus/share_plus.dart';
import 'package:path_provider/path_provider.dart';
import 'dart:io';

class FortuneShareHelper {
  static final FortuneShareHelper _instance = FortuneShareHelper._internal();

  FortuneShareHelper._internal();

  factory FortuneShareHelper() {
    return _instance;
  }

  /// 카드를 이미지로 캡처
  Future<Uint8List?> captureCard(GlobalKey<State<StatefulWidget>> key) async {
    try {
      final RenderRepaintBoundary boundary =
          key.currentContext!.findRenderObject() as RenderRepaintBoundary;

      final ui.Image image = await boundary.toImage(pixelRatio: 3.0);
      final ByteData? byteData =
          await image.toByteData(format: ui.ImageByteFormat.png);

      if (byteData != null) {
        return byteData.buffer.asUint8List();
      }
    } catch (e) {
      print('Error capturing card: $e');
    }
    return null;
  }

  /// 이미지를 파일로 저장
  Future<File?> saveCardImage(Uint8List imageData) async {
    try {
      final directory = await getApplicationDocumentsDirectory();
      final fileName =
          'fortune_${DateTime.now().millisecondsSinceEpoch}.png';
      final file = File('${directory.path}/$fileName');

      await file.writeAsBytes(imageData);
      return file;
    } catch (e) {
      print('Error saving image: $e');
    }
    return null;
  }

  /// 운세를 이미지와 함께 공유
  Future<void> shareFortuneImage(
    Uint8List imageData,
    String fortuneText,
  ) async {
    try {
      final file = await saveCardImage(imageData);

      if (file != null) {
        await Share.shareXFiles(
          [XFile(file.path)],
          text: '오늘의 운세: $fortuneText\n\n#오늘의운세 #운세 #LuckyBox',
          subject: '오늘의 운세를 공유합니다! ✨',
        );
      }
    } catch (e) {
      print('Error sharing: $e');
    }
  }

  /// 운세 텍스트만 공유
  Future<void> shareFortuneText(String fortuneText) async {
    try {
      await Share.share(
        '오늘의 운세: $fortuneText\n\n#오늘의운세 #운세 #LuckyBox',
        subject: '오늘의 운세를 공유합니다! ✨',
      );
    } catch (e) {
      print('Error sharing text: $e');
    }
  }
}
