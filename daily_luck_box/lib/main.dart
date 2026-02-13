import 'package:flutter/material.dart';
import 'screens/fortune_screen.dart';
import 'data/database_helper.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // 데이터베이스 초기화
  final dbHelper = DatabaseHelper();
  try {
    await dbHelper.database;
    await dbHelper.ensureInitialData();
    print('Database initialized successfully');
  } catch (e) {
    print('Error initializing database: $e');
  }
  
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '오늘의 운세',
      theme: ThemeData(
        useMaterial3: true,
        fontFamily: 'Pretendard',
      ),
      home: const FortuneScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}
