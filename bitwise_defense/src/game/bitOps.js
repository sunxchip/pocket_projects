// Bit operation helpers shared by the game engine and the UI guide line.

export const OPS = {
  AND: { symbol: 'AND', unary: false },
  OR: { symbol: 'OR', unary: false },
  XOR: { symbol: 'XOR', unary: false },
  NOT: { symbol: 'NOT', unary: true },
  SHL: { symbol: '<<', unary: false },
  SHR: { symbol: '>>', unary: false },
};

// Mask to the bit width so NOT / shifts behave like fixed-width registers
// instead of producing JS's signed 32-bit two's complement surprises.
export function maskToBits(value, bits) {
  const mask = bits >= 32 ? 0xffffffff : (1 << bits) - 1;
  return value & mask;
}

export function applyOp(op, target, operand, bits) {
  switch (op) {
    case 'AND':
      return maskToBits(target & operand, bits);
    case 'OR':
      return maskToBits(target | operand, bits);
    case 'XOR':
      return maskToBits(target ^ operand, bits);
    case 'NOT':
      return maskToBits(~target, bits);
    case 'SHL':
      return maskToBits(target << operand, bits);
    case 'SHR':
      return maskToBits(target >>> operand, bits);
    default:
      return target;
  }
}

export function toBinary(value, bits) {
  return maskToBits(value, bits).toString(2).padStart(bits, '0');
}

export function toHex(value, bits) {
  const hexDigits = Math.ceil(bits / 4);
  return '0x' + maskToBits(value, bits).toString(16).toUpperCase().padStart(hexDigits, '0');
}

// Parses a user-entered operand string as binary if it only contains 0/1,
// hex if prefixed with 0x, otherwise decimal.
export function parseOperand(input) {
  const trimmed = input.trim();
  if (trimmed === '') return null;
  if (/^0x[0-9a-fA-F]+$/.test(trimmed)) return parseInt(trimmed, 16);
  if (/^[01]+$/.test(trimmed)) return parseInt(trimmed, 2);
  if (/^\d+$/.test(trimmed)) return parseInt(trimmed, 10);
  return null;
}
