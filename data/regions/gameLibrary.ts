import type { GameRegion } from '@/types/game'

export const libraryRegion: GameRegion = {
  id: 1,
  title: '마법 도서관',
  description: '잃어버린 영어 단어들을 찾아 떠나는 모험',
  stages: [
    // 1-9단계: 일반 몬스터들
    {
      stage: 1,
      storyTitle: '도서관 입구',
      content: `옛날 옛적, 세상의 모든 영어 단어들이 보관된 마법 도서관이 있었습니다.\n하지만 어느 날 악마가 나타나 소중한 단어들을 훔쳐갔습니다.\n\n당신은 전설의 언어 마법사입니다.\n도서관 입구에서 첫 번째 정령을 만났습니다.`,
      enemy: { name: '작은 정령', hp: 25, maxHp: 25 },
      words: [
        { korean: '사과', english: 'apple', wrongAnswers: ['banana', 'orange'] },
        { korean: '고양이', english: 'cat', wrongAnswers: ['dog', 'bird'] }
      ]
    },
    {
      stage: 2,
      storyTitle: '도서관 1층',
      content: `도서관에 들어서니 먼지가 가득한 1층이 보입니다.\n책들이 어수선하게 흩어져 있고, 작은 그림자들이 움직이고 있습니다.\n\n그림자 정령이 당신을 막아섭니다.`,
      enemy: { name: '그림자 정령', hp: 30, maxHp: 30 },
      words: [
        { korean: '책', english: 'book', wrongAnswers: ['pen', 'paper'] },
        { korean: '의자', english: 'chair', wrongAnswers: ['table', 'bed'] }
      ]
    },
    {
      stage: 3,
      storyTitle: '고대 서고',
      content: `2층에는 고대의 서고가 있습니다.\n오래된 마법서들이 스스로 날아다니며 주문을 중얼거립니다.\n\n날개 달린 마법서가 당신에게 도전장을 내밉니다.`,
      enemy: { name: '날개 달린 마법서', hp: 35, maxHp: 35 },
      words: [
        { korean: '새', english: 'bird', wrongAnswers: ['fish', 'cat'] },
        { korean: '나무', english: 'tree', wrongAnswers: ['flower', 'grass'] }
      ]
    },
    {
      stage: 4,
      storyTitle: '마법의 연구실',
      content: `3층은 마법의 연구실입니다.\n이상한 물약들이 끓고 있고, 실험 도구들이 저절로 움직입니다.\n\n연금술사의 유령이 나타나 당신을 시험합니다.`,
      enemy: { name: '연금술사의 유령', hp: 40, maxHp: 40 },
      words: [
        { korean: '물', english: 'water', wrongAnswers: ['fire', 'earth'] },
        { korean: '불', english: 'fire', wrongAnswers: ['ice', 'wind'] }
      ]
    },
    {
      stage: 5,
      storyTitle: '언어의 정원',
      content: `4층에는 신비한 정원이 있습니다.\n단어들이 꽃처럼 피어나고 나무에 열매처럼 매달려 있습니다.\n\n정원의 수호자가 당신의 길을 막습니다.`,
      enemy: { name: '정원의 수호자', hp: 45, maxHp: 45 },
      words: [
        { korean: '꽃', english: 'flower', wrongAnswers: ['tree', 'grass'] },
        { korean: '태양', english: 'sun', wrongAnswers: ['moon', 'star'] }
      ]
    },
    {
      stage: 6,
      storyTitle: '기억의 미로',
      content: `5층은 복잡한 미로입니다.\n벽마다 사라진 기억들이 흘러다니고 있습니다.\n\n미로의 주인이 당신을 혼란스럽게 만들려 합니다.`,
      enemy: { name: '미로의 주인', hp: 50, maxHp: 50 },
      words: [
        { korean: '집', english: 'house', wrongAnswers: ['car', 'school'] },
        { korean: '문', english: 'door', wrongAnswers: ['window', 'wall'] }
      ]
    },
    {
      stage: 7,
      storyTitle: '시간의 회전목마',
      content: `6층에는 시간이 뒤틀린 공간이 있습니다.\n과거와 미래의 모습들이 회전목마처럼 돌아가고 있습니다.\n\n시간의 기사가 당신에게 도전합니다.`,
      enemy: { name: '시간의 기사', hp: 55, maxHp: 55 },
      words: [
        { korean: '시간', english: 'time', wrongAnswers: ['space', 'money'] },
        { korean: '과거', english: 'past', wrongAnswers: ['future', 'present'] }
      ]
    },
    {
      stage: 8,
      storyTitle: '지혜의 전당',
      content: `7층은 지혜의 전당입니다.\n현자들의 조각상이 늘어서 있고, 그들의 지혜가 공기 중에 떠다닙니다.\n\n고대 현자의 영혼이 당신을 시험합니다.`,
      enemy: { name: '고대 현자', hp: 60, maxHp: 60 },
      words: [
        { korean: '지혜', english: 'wisdom', wrongAnswers: ['knowledge', 'power'] },
        { korean: '마음', english: 'heart', wrongAnswers: ['soul', 'mind'] }
      ]
    },
    {
      stage: 9,
      storyTitle: '어둠의 계단',
      content: `최상층으로 올라가는 계단이 어둠에 싸여 있습니다.\n계단마다 어둠의 기운이 스며나오고 있습니다.\n\n어둠의 파수꾼이 마지막 관문을 지키고 있습니다.`,
      enemy: { name: '어둠의 파수꾼', hp: 65, maxHp: 65 },
      words: [
        { korean: '어둠', english: 'darkness', wrongAnswers: ['light', 'shadow'] },
        { korean: '용기', english: 'courage', wrongAnswers: ['fear', 'anger'] }
      ]
    },
    // 10단계: 보스
    {
      stage: 10,
      storyTitle: '최종 결전',
      content: `드디어 도서관의 최상층에 도달했습니다.\n여기에는 모든 단어를 훔쳐간 어둠의 악마가 기다리고 있습니다.\n\n"크크크... 언어 마법사라고? 이제 모든 단어는 내 것이다!"\n\n이것이 마지막 전투입니다. 모든 실력을 발휘하세요!`,
      enemy: { name: '어둠의 악마 (보스)', hp: 80, maxHp: 80 },
      words: [
        { korean: '희망', english: 'hope', wrongAnswers: ['despair', 'fear'] },
        { korean: '친구', english: 'friend', wrongAnswers: ['enemy', 'stranger'] },
        { korean: '사랑', english: 'love', wrongAnswers: ['hate', 'anger'] },
        { korean: '평화', english: 'peace', wrongAnswers: ['war', 'fight'] }
      ]
    }
  ]
} 