/**
 * 프론트엔드 funnelData의 ID를 Gemini용 설명 문구로 매핑
 */

export const PARTY_SIZE_MAP = {
  solo: '혼자 식사하는 1인 상황',
  duo: '둘이서 오붓하게 먹는 상황',
  group3p: '3인 이상의 단체 식사 상황',
};

export const TASTE_MAP = {
  hearty: '기운을 돋워주는 든든한 보양식 느낌',
  light: '산뜻하고 가벼운 리프레시 메뉴',
  spicy: '스트레스가 풀리는 맵고 자극적인 맛',
  sweet: '당 충전이 되는 달콤한 느낌의 음식',
  no_appetite: '입맛이 없어서 가볍게 먹기 좋은 아무 메뉴',
};

export const TEXTURE_MAP = {
  soft: '부드러운 국물이나 소스가 있어 넘김이 좋은 식감',
  chewy: '쫄깃쫄깃하고 씹는 맛이 있는 식감',
  crispy: '겉은 바삭하고 속은 촉촉한 식감',
  any: '어떤 식감이든 상관없음',
};

export const TEMPERATURE_MAP = {
  cold: '쨍하고 시원한 차가운 요리',
  warmPlate: '따끈하고 갓 만든 요리',
};

export const AVOID_MAP = {
  greasy: '튀김이나 볶음류처럼 기름진 음식',
  soupy: '국물이나 탕류 요리',
  wheat: '면이나 빵 같은 밀가루 음식',
  seafood: '회나 해산물 요리',
  salad: '채소 위주의 샐러드류',
  null: '특별히 기피하는 요소 없음',
};

export const AFTERMEAL_MAP = {
  back_to_work: '식사 후 바로 복귀해야 하는 빠른 일정',
  coffee_break: '식사 후 가벼운 커피 한 잔의 휴식 시간이 있음',
  long_chat: '수다와 산책을 즐길 수 있는 아주 여유로운 시간',
};

/**
 * 모든 맵을 하나로 묶어 관리 (Service에서 접근 용이)
 */
export const LUNCH_PROMPT_MAPS = {
  '1': PARTY_SIZE_MAP,
  '2': TASTE_MAP,
  '3': TEXTURE_MAP,
  '4': TEMPERATURE_MAP,
  '5': AVOID_MAP,
  '6': AFTERMEAL_MAP,
};