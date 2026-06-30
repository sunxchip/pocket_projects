export default function HelpModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>HOW TO PLAY</h2>
          <button className="modal-close" onClick={onClose} aria-label="close help">✕</button>
        </div>

        <div className="modal-body">
          <section className="help-section">
            <h3>🎯 목표</h3>
            <p>
              위에서 떨어지는 숫자 블록을 비트 연산으로 정확히 <strong>0</strong>으로
              만들어서 터뜨리는 게임이다. 블록이 바닥에 닿기 전에 처치하자.
            </p>
          </section>

          <section className="help-section">
            <h3>① 타겟 고르기</h3>
            <p>화면에 떨어지는 블록 중 하나를 <strong>손가락으로 톡 터치</strong>하면 주황색 테두리로 표시되며 타겟이 된다.</p>
          </section>

          <section className="help-section">
            <h3>② 연산자 고르기</h3>
            <p>화면 하단 버튼에서 연산자 하나를 고른다.</p>
            <ul className="op-explain">
              <li><code>AND</code> — 두 수의 같은 자리 비트가 둘 다 1일 때만 1</li>
              <li><code>OR</code> — 둘 중 하나라도 1이면 1</li>
              <li><code>XOR</code> — 두 비트가 다르면 1, 같으면 0 (같은 수끼리 XOR 하면 항상 0!)</li>
              <li><code>NOT</code> — 모든 비트를 뒤집는다 (피연산자 입력 불필요)</li>
              <li><code>&lt;&lt;</code> — 왼쪽으로 N칸 이동(쉬프트), 빈 자리는 0</li>
              <li><code>&gt;&gt;</code> — 오른쪽으로 N칸 이동, 빈 자리는 0</li>
            </ul>
          </section>

          <section className="help-section">
            <h3>③ 내 값(My Operand) 입력</h3>
            <p>입력칸에 숫자를 적는다. 아래 세 가지 표기법을 모두 인식한다.</p>
            <ul className="op-explain">
              <li>2진수: <code>1011</code> (0과 1로만 구성)</li>
              <li>16진수: <code>0xB4</code> (반드시 0x로 시작)</li>
              <li>10진수: <code>42</code></li>
            </ul>
            <p>※ <code>NOT</code>은 입력칸이 비활성화된다. 연산자 자체만으로 계산되기 때문.</p>
          </section>

          <section className="help-section">
            <h3>④ 결과 확인 후 적용</h3>
            <p>
              화면 중간 가이드 라인에 <code>Target(타겟값) 연산자 My Operand(내값) = 결과</code> 형태로
              실시간 미리보기가 표시된다. 결과가 <strong>0</strong>이 될 것 같으면 하단의
              <strong> ⚡CRUSH!⚡ / APPLY</strong> 버튼을 눌러 확정한다.
            </p>
          </section>

          <section className="help-section">
            <h3>⑤ 결과에 따라</h3>
            <ul className="op-explain">
              <li>결과 = 0 → 블록 파괴! 점수 +150</li>
              <li>결과 ≠ 0 → 블록 값이 결과로 바뀐 채 계속 내려온다 (다시 도전 가능)</li>
            </ul>
          </section>

          <section className="help-section">
            <h3>💡 빠른 공략 팁</h3>
            <ul className="op-explain">
              <li>가장 쉬운 방법: 타겟과 <strong>똑같은 값</strong>을 입력하고 <code>XOR</code> → 항상 0!</li>
              <li><code>AND</code>에 <code>0</code>을 넣어도 항상 0이 된다.</li>
              <li>타겟 값은 블록 안에 10진수/16진수/2진수 중 하나로 표시되니, 모르겠으면 보조 숫자(작은 글씨, 2진수)를 참고하자.</li>
            </ul>
          </section>

          <section className="help-section">
            <h3>⚠️ 게임 오버 & 레벨업</h3>
            <p>
              블록이 빨간 바닥 라인에 닿으면 HP가 1 깎인다. HP가 모두 사라지면 GAME OVER.
              점수가 쌓일수록 레벨이 오르고, 블록 속도가 조금씩 빨라지며 더 큰 숫자(16비트)가 등장한다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
