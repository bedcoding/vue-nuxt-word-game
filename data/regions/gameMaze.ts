import type { GameRegion } from '@/types/game'

export const mazeRegion: GameRegion = {
  id: 2,
  title: '시간의 미로',
  description: '시공간이 뒤틀린 미로에서 벌어지는 대결',
  stages: [
    {
      stage: 1,
      storyTitle: '미로 입구',
      content: `시간의 미로 앞에 서 있습니다.\n입구에서부터 시공간이 일그러져 보입니다.\n\n시간의 문지기가 당신을 막아섭니다.`,
      enemy: { name: '시간의 문지기', hp: 30, maxHp: 30 },
      words: [
        { korean: '시계', english: 'clock', wrongAnswers: ['watch', 'timer'] },
        { korean: '빠른', english: 'fast', wrongAnswers: ['slow', 'quick'] }
      ]
    },
    {
      stage: 2,
      storyTitle: '과거의 길',
      content: `미로 안으로 들어서니 과거의 풍경들이 펼쳐집니다.\n오래된 기억들이 안개처럼 떠다니고 있습니다.\n\n과거의 수호령이 나타납니다.`,
      enemy: { name: '과거의 수호령', hp: 35, maxHp: 35 },
      words: [
        { korean: '어제', english: 'yesterday', wrongAnswers: ['today', 'tomorrow'] },
        { korean: '기억', english: 'memory', wrongAnswers: ['dream', 'thought'] }
      ]
    },
    {
      stage: 3,
      storyTitle: '현재의 교차로',
      content: `미로의 중앙에 교차로가 있습니다.\n여러 갈래 길이 각각 다른 시간으로 이어져 있습니다.\n\n현재의 정령이 길을 안내하겠다고 나섭니다.`,
      enemy: { name: '현재의 정령', hp: 40, maxHp: 40 },
      words: [
        { korean: '지금', english: 'now', wrongAnswers: ['then', 'later'] },
        { korean: '순간', english: 'moment', wrongAnswers: ['hour', 'day'] }
      ]
    },
    {
      stage: 4,
      storyTitle: '미래의 통로',
      content: `앞으로 나아가니 미래의 모습들이 희미하게 보입니다.\n아직 일어나지 않은 일들이 그림자처럼 움직이고 있습니다.\n\n미래의 예언자가 당신을 시험합니다.`,
      enemy: { name: '미래의 예언자', hp: 45, maxHp: 45 },
      words: [
        { korean: '내일', english: 'tomorrow', wrongAnswers: ['yesterday', 'today'] },
        { korean: '꿈', english: 'dream', wrongAnswers: ['reality', 'nightmare'] }
      ]
    },
    {
      stage: 5,
      storyTitle: '시간의 소용돌이',
      content: `미로 깊숙한 곳에서 시간의 소용돌이를 발견했습니다.\n모든 시간이 하나로 뒤섞여 돌아가고 있습니다.\n\n소용돌이의 주인이 나타났습니다.`,
      enemy: { name: '소용돌이의 주인', hp: 50, maxHp: 50 },
      words: [
        { korean: '회전', english: 'rotation', wrongAnswers: ['movement', 'stillness'] },
        { korean: '변화', english: 'change', wrongAnswers: ['same', 'constant'] }
      ]
    },
    {
      stage: 6,
      storyTitle: '역사의 도서관',
      content: `미로 안에 작은 도서관이 있습니다.\n역사책들이 저절로 페이지를 넘기며 이야기를 들려줍니다.\n\n역사의 기록자가 당신에게 질문을 던집니다.`,
      enemy: { name: '역사의 기록자', hp: 55, maxHp: 55 },
      words: [
        { korean: '역사', english: 'history', wrongAnswers: ['story', 'tale'] },
        { korean: '전설', english: 'legend', wrongAnswers: ['myth', 'fact'] }
      ]
    },
    {
      stage: 7,
      storyTitle: '운명의 실',
      content: `천장에서 수많은 실들이 내려와 있습니다.\n각각의 실은 누군가의 운명을 나타내고 있습니다.\n\n운명의 여신이 당신의 실을 만지려 합니다.`,
      enemy: { name: '운명의 여신', hp: 60, maxHp: 60 },
      words: [
        { korean: '운명', english: 'destiny', wrongAnswers: ['luck', 'chance'] },
        { korean: '선택', english: 'choice', wrongAnswers: ['decision', 'option'] }
      ]
    },
    {
      stage: 8,
      storyTitle: '영원의 문',
      content: `미로의 끝에 거대한 문이 서 있습니다.\n문에는 "영원"이라는 글자가 새겨져 있습니다.\n\n영원의 수호자가 마지막 시험을 준비했습니다.`,
      enemy: { name: '영원의 수호자', hp: 65, maxHp: 65 },
      words: [
        { korean: '영원', english: 'eternity', wrongAnswers: ['moment', 'second'] },
        { korean: '무한', english: 'infinite', wrongAnswers: ['limited', 'finite'] }
      ]
    },
    {
      stage: 9,
      storyTitle: '시간의 심장',
      content: `문 너머에는 거대한 심장이 뛰고 있습니다.\n이것이 바로 모든 시간을 관장하는 시간의 심장입니다.\n\n심장의 파수꾼이 최후의 저항을 시작합니다.`,
      enemy: { name: '심장의 파수꾼', hp: 70, maxHp: 70 },
      words: [
        { korean: '심장', english: 'heart', wrongAnswers: ['brain', 'lung'] },
        { korean: '생명', english: 'life', wrongAnswers: ['death', 'soul'] }
      ]
    },
    {
      stage: 10,
      storyTitle: '시간의 주인',
      content: `드디어 시간의 진정한 주인과 마주했습니다.\n그는 모든 시간을 조종하는 절대적인 존재입니다.\n\n"시간을 이해하는 자만이 나를 이길 수 있다!"\n\n최후의 결전이 시작됩니다!`,
      enemy: { name: '시간의 주인 (보스)', hp: 90, maxHp: 90 },
      words: [
        { korean: '절대', english: 'absolute', wrongAnswers: ['relative', 'partial'] },
        { korean: '진리', english: 'truth', wrongAnswers: ['lie', 'false'] },
        { korean: '지배', english: 'control', wrongAnswers: ['freedom', 'chaos'] },
        { korean: '완전', english: 'perfect', wrongAnswers: ['broken', 'incomplete'] }
      ]
    }
  ]
} 