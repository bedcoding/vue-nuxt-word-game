import type { GameRegion } from '@/types/game'

export const castleRegion: GameRegion = {
  id: 3,
  title: '어둠의 성',
  description: '어둠에 잠긴 성에서 최종 보스와의 대결',
  stages: [
    {
      stage: 1,
      storyTitle: '성 앞 다리',
      content: `어둠의 성 앞에 낡은 다리가 걸려 있습니다.\n다리 아래로는 깊은 절벽이 보입니다.\n\n다리지기 트롤이 당신을 막아섭니다.`,
      enemy: { name: '다리지기 트롤', hp: 35, maxHp: 35 },
      words: [
        { korean: '다리', english: 'bridge', wrongAnswers: ['road', 'path'] },
        { korean: '강', english: 'river', wrongAnswers: ['lake', 'sea'] }
      ]
    },
    {
      stage: 2,
      storyTitle: '성문 앞마당',
      content: `성의 앞마당에 도착했습니다.\n거대한 철문이 굳게 닫혀 있고, 주변에는 석상들이 늘어서 있습니다.\n\n석상들이 갑자기 살아나 움직입니다.`,
      enemy: { name: '돌 수호병', hp: 40, maxHp: 40 },
      words: [
        { korean: '돌', english: 'stone', wrongAnswers: ['rock', 'brick'] },
        { korean: '문', english: 'gate', wrongAnswers: ['door', 'wall'] }
      ]
    },
    {
      stage: 3,
      storyTitle: '지하 감옥',
      content: `성 안으로 들어가니 지하 감옥이 나타납니다.\n축축한 바닥과 녹슨 철창이 으스스한 분위기를 만듭니다.\n\n감옥지기가 열쇠 뭉치를 흔들며 나타납니다.`,
      enemy: { name: '감옥지기', hp: 45, maxHp: 45 },
      words: [
        { korean: '감옥', english: 'prison', wrongAnswers: ['house', 'palace'] },
        { korean: '열쇠', english: 'key', wrongAnswers: ['lock', 'chain'] }
      ]
    },
    {
      stage: 4,
      storyTitle: '병기고',
      content: `1층에는 무기들이 가득한 병기고가 있습니다.\n검, 활, 방패 등이 벽에 걸려 있습니다.\n\n무기의 정령이 당신에게 도전장을 내밉니다.`,
      enemy: { name: '무기의 정령', hp: 50, maxHp: 50 },
      words: [
        { korean: '검', english: 'sword', wrongAnswers: ['knife', 'axe'] },
        { korean: '방패', english: 'shield', wrongAnswers: ['armor', 'helmet'] }
      ]
    },
    {
      stage: 5,
      storyTitle: '연회장',
      content: `2층의 연회장에 들어서니 유령들이 춤을 추고 있습니다.\n오래된 샹들리에가 흔들리며 으스스한 빛을 내고 있습니다.\n\n유령 귀족이 당신에게 예의를 차리라고 합니다.`,
      enemy: { name: '유령 귀족', hp: 55, maxHp: 55 },
      words: [
        { korean: '유령', english: 'ghost', wrongAnswers: ['spirit', 'soul'] },
        { korean: '춤', english: 'dance', wrongAnswers: ['music', 'song'] }
      ]
    },
    {
      stage: 6,
      storyTitle: '마법사의 탑',
      content: `성의 한쪽에 높은 탑이 있습니다.\n탑 안에는 마법 실험의 흔적들이 가득합니다.\n\n미치광이 마법사가 이상한 웃음을 지으며 나타납니다.`,
      enemy: { name: '미치광이 마법사', hp: 60, maxHp: 60 },
      words: [
        { korean: '마법', english: 'magic', wrongAnswers: ['science', 'art'] },
        { korean: '탑', english: 'tower', wrongAnswers: ['building', 'house'] }
      ]
    },
    {
      stage: 7,
      storyTitle: '왕의 침실',
      content: `3층에는 화려했던 왕의 침실이 있습니다.\n이제는 먼지와 거미줄로 뒤덮여 있습니다.\n\n죽은 왕의 영혼이 왕관을 쓴 채 나타납니다.`,
      enemy: { name: '죽은 왕의 영혼', hp: 65, maxHp: 65 },
      words: [
        { korean: '왕', english: 'king', wrongAnswers: ['queen', 'prince'] },
        { korean: '왕관', english: 'crown', wrongAnswers: ['hat', 'helmet'] }
      ]
    },
    {
      stage: 8,
      storyTitle: '어둠의 제단',
      content: `성의 꼭대기에 어둠의 제단이 있습니다.\n검은 촛불들이 역시 타오르고 있습니다.\n\n어둠의 사제가 사악한 의식을 진행하고 있습니다.`,
      enemy: { name: '어둠의 사제', hp: 70, maxHp: 70 },
      words: [
        { korean: '제단', english: 'altar', wrongAnswers: ['table', 'desk'] },
        { korean: '의식', english: 'ritual', wrongAnswers: ['ceremony', 'party'] }
      ]
    },
    {
      stage: 9,
      storyTitle: '악마의 문',
      content: `제단 뒤에 거대한 문이 열려 있습니다.\n문 너머로는 끝없는 어둠이 보입니다.\n\n문지기 악마가 마지막 관문을 지키고 있습니다.`,
      enemy: { name: '문지기 악마', hp: 75, maxHp: 75 },
      words: [
        { korean: '악마', english: 'demon', wrongAnswers: ['angel', 'spirit'] },
        { korean: '어둠', english: 'darkness', wrongAnswers: ['light', 'shadow'] }
      ]
    },
    {
      stage: 10,
      storyTitle: '어둠의 군주',
      content: `드디어 어둠의 진정한 주인과 만났습니다.\n그는 모든 어둠을 다스리는 절대적인 악의 존재입니다.\n\n"빛은 언제나 어둠에 삼켜진다!"\n\n최후의 결전이 시작됩니다!`,
      enemy: { name: '어둠의 군주 (보스)', hp: 100, maxHp: 100 },
      words: [
        { korean: '군주', english: 'lord', wrongAnswers: ['servant', 'slave'] },
        { korean: '절망', english: 'despair', wrongAnswers: ['hope', 'joy'] },
        { korean: '공포', english: 'fear', wrongAnswers: ['courage', 'brave'] },
        { korean: '파멸', english: 'destruction', wrongAnswers: ['creation', 'birth'] },
        { korean: '영원', english: 'eternal', wrongAnswers: ['temporary', 'short'] }
      ]
    }
  ]
} 