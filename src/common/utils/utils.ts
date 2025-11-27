/**
 * JSON.stringify를 안전하게 수행하는 함수
 *
 * @param obj - JSON.stringify를 수행할 객체
 * @param space - JSON.stringify의 space 옵션
 * @returns JSON.stringify의 결과
 */
export function safeStringify(obj: unknown, space = 0) {
  const seen = new WeakSet()

  return JSON.stringify(
    obj,
    (_key, value: unknown) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) return '[Circular]'
        seen.add(value)
      }
      return value
    },
    space,
  )
}
