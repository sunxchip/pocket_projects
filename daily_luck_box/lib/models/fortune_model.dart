class Fortune {
  final int? id;
  final String emoji;
  final String message;

  Fortune({
    this.id,
    required this.emoji,
    required this.message,
  });

  /// JSON으로 변환
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'emoji': emoji,
      'message': message,
    };
  }

  /// JSON에서 객체로 변환
  factory Fortune.fromMap(Map<String, dynamic> map) {
    return Fortune(
      id: map['id'],
      emoji: map['emoji'] ?? '',
      message: map['message'] ?? '',
    );
  }

  /// 전체 운세 텍스트 (이모지 + 메시지)
  String get fullText => emoji.isEmpty ? message : '$emoji $message';
}
