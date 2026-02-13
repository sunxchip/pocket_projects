import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import '../models/fortune_model.dart';

class DatabaseHelper {
  static const _databaseName = 'fortune_box.db';
  static const _databaseVersion = 1;
  static const _tableName = 'fortunes';

  static final DatabaseHelper _instance = DatabaseHelper._internal();

  Database? _database;

  DatabaseHelper._internal();

  factory DatabaseHelper() {
    return _instance;
  }

  Future<Database> get database async {
    _database ??= await _initDatabase();
    return _database!;
  }

  Future<Database> _initDatabase() async {
    final databasesPath = await getDatabasesPath();
    final path = join(databasesPath, _databaseName);

    return await openDatabase(
      path,
      version: _databaseVersion,
      onCreate: _onCreate,
      onUpgrade: (db, oldVersion, newVersion) async {
        // 업그레이드 시에도 데이터 확인
        await _ensureInitialData(db);
      },
    );
  }

  Future<void> _onCreate(Database db, int version) async {
    await db.execute('''
      CREATE TABLE $_tableName (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        emoji TEXT NOT NULL,
        message TEXT NOT NULL
      )
    ''');

    // 기본 운세 데이터 50개 삽입
    await _insertInitialData(db);
  }

  Future<void> ensureInitialData() async {
    final db = await database;
    // 테이블에 데이터가 없으면 초기 데이터 삽입
    final count = Sqflite.firstIntValue(
      await db.rawQuery('SELECT COUNT(*) FROM $_tableName'),
    );
    
    if (count == null || count == 0) {
      print('No fortunes found, inserting initial data...');
      await _insertInitialData(db);
    }
  }

  Future<void> _ensureInitialData(Database db) async {
    // 테이블에 데이터가 없으면 초기 데이터 삽입
    final count = Sqflite.firstIntValue(
      await db.rawQuery('SELECT COUNT(*) FROM $_tableName'),
    );
    
    if (count == null || count == 0) {
      await _insertInitialData(db);
    }
  }

  Future<void> _insertInitialData(Database db) async {
    final initialFortunes = [
      ('✨', '대박! 오늘은 뭘 해도 되는 날'),
      ('🍀', '평범함 속에 행복이 있는 날'),
      ('💰', '지갑 조심! 지출이 많을 수 있어요'),
      ('❤️', '사랑이 찾아오는 날'),
      ('🎯', '목표 달성에 딱 좋은 날'),
      ('😴', '쉬어가도 좋은 날'),
      ('🚀', '새로운 시작의 날'),
      ('🌈', '행운이 함께하는 날'),
      ('💎', '귀한 것을 얻는 날'),
      ('🔥', '열정이 타오르는 날'),
      ('🌙', '차분함이 필요한 날'),
      ('🎁', '선물이 기다리는 날'),
      ('🎪', '즐거운 일이 생기는 날'),
      ('🌟', '반짝반짝한 기운이 흐르는 날'),
      ('🎨', '창의력이 넘치는 날'),
      ('🎭', '변화가 시작되는 날'),
      ('🎼', '조화롭고 평온한 날'),
      ('🎸', '자유로운 영혼의 날'),
      ('🎬', '드라마틱한 일이 벌어질 날'),
      ('🎤', '당신의 목소리가 필요한 날'),
      ('🏆', '승리의 기운이 감도는 날'),
      ('⚡', '에너지가 폭발하는 날'),
      ('🌊', '파도같은 변화를 맞이할 날'),
      ('🌸', '아름다움이 피어나는 날'),
      ('🍀', '행운의 바람이 부는 날'),
      ('☀️', '밝고 따뜻한 하루'),
      ('⭐', '별처럼 빛나는 하루'),
      ('🦋', '변화와 성장의 날'),
      ('🌺', '우아함이 배어나는 날'),
      ('🎊', '축제 같은 기분의 날'),
      ('💫', '꿈꾸는 마음으로 가득한 날'),
      ('🌻', '긍정 에너지가 넘치는 날'),
      ('🎀', '우아하고 신비로운 날'),
      ('👑', '당신이 주인공인 날'),
      ('🌙', '조용한 아름다움의 날'),
      ('🔮', '신비로운 일이 일어날 날'),
      ('💝', '사랑과 감사로 가득한 날'),
      ('🎯', '집중력이 최고조인 날'),
      ('🌟', '빛나는 가능성이 있는 날'),
      ('🍀', '행운의 연쇄 반응이 시작되는 날'),
      ('🎪', '신나는 일들이 펼쳐질 날'),
      ('💰', '풍요로움이 들어오는 날'),
      ('🏖️', '휴식과 치유의 날'),
      ('🎨', '창조의 열정이 불타오르는 날'),
      ('🚀', '날아오를 준비가 된 날'),
      ('🌈', '무지개 같은 희망의 날'),
      ('⚡', '폭발적인 성장의 날'),
      ('🎭', '자신감이 넘치는 날'),
      ('💎', '귀한 순간들을 맞이할 날'),
      ('🌸', '새로운 시작의 봄날'),
      ('✨', '마법 같은 일이 일어날 날'),
    ];

    for (var fortune in initialFortunes) {
      try {
        await db.insert(
          _tableName,
          {'emoji': fortune.$1, 'message': fortune.$2},
          conflictAlgorithm: ConflictAlgorithm.replace,
        );
      } catch (e) {
        print('Error inserting fortune: $e');
      }
    }
    print('Initial data insertion completed. Total: ${initialFortunes.length}');
  }

  /// 모든 운세 조회
  Future<List<Fortune>> getAllFortunes() async {
    final db = await database;
    final maps = await db.query(_tableName);
    return List.generate(maps.length, (i) => Fortune.fromMap(maps[i]));
  }

  /// 무작위 운세 하나 조회
  Future<Fortune?> getRandomFortune() async {
    final db = await database;
    final maps = await db.rawQuery(
      'SELECT * FROM $_tableName ORDER BY RANDOM() LIMIT 1',
    );

    if (maps.isNotEmpty) {
      return Fortune.fromMap(maps.first);
    }
    return null;
  }

  /// 새로운 운세 추가
  Future<int> insertFortune(Fortune fortune) async {
    final db = await database;
    return await db.insert(_tableName, fortune.toMap());
  }

  /// 데이터베이스 초기화 (테스트용)
  Future<void> deleteAllFortunes() async {
    final db = await database;
    await db.delete(_tableName);
  }

  /// 데이터베이스 닫기
  Future<void> close() async {
    if (_database != null) {
      await _database!.close();
    }
  }
}
