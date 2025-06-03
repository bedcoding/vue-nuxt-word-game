import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    // 게임 진행 상태
    gamePhase: 'menu', // 'menu', 'story', 'battle', 'result'
    selectedRegion: null, // 선택된 지역
    currentStageNumber: 1, // 현재 진행 단계 (1-10) - getter와 이름 충돌 방지
    
    // 플레이어 상태
    player: {
      hp: 100,
      maxHp: 100,
      name: '용사'
    },
    
    // 적 상태 (현재 단계의 적)
    enemy: {
      hp: 80,
      maxHp: 80,
      name: '슬라임'
    },
    
    // 게임 상태
    isGameOver: false,
    isPlayerTurn: true,
    score: 0,
    level: 1,
    
    // 현재 문제
    currentQuestion: null,
    
    // 지역 데이터베이스 (각 지역마다 10단계)
    regionsDatabase: [
      {
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
      },
      {
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
      },
      {
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
    ],
    
    // 현재 사용할 단어들
    currentWords: []
  }),
  
  getters: {
    playerHpPercentage: (state) => (state.player.hp / state.player.maxHp) * 100,
    enemyHpPercentage: (state) => (state.enemy.hp / state.enemy.maxHp) * 100,
    isPlayerWin: (state) => state.enemy.hp <= 0,
    isPlayerLose: (state) => state.player.hp <= 0,
    currentChoices: (state) => {
      if (!state.currentQuestion) return []
      
      const choices = [
        state.currentQuestion.english,
        ...state.currentQuestion.wrongAnswers
      ]
      
      // 배열을 랜덤하게 섞기
      return choices.sort(() => Math.random() - 0.5)
    },
    availableRegions: (state) => state.regionsDatabase,
    currentRegion: (state) => {
      return state.regionsDatabase.find(region => region.id === state.selectedRegion)
    },
    currentStage: (state) => {
      const region = state.regionsDatabase.find(r => r.id === state.selectedRegion)
      return region ? region.stages.find(s => s.stage === state.currentStageNumber) : null
    },
    isBossStage: (state) => state.currentStageNumber === 10,
    progressPercentage: (state) => (state.currentStageNumber / 10) * 100
  },
  
  actions: {
    // 게임 페이즈 변경
    setGamePhase(phase) {
      this.gamePhase = phase
    },
    
    // 지역 선택
    selectRegion(regionId) {
      this.selectedRegion = regionId
      this.currentStageNumber = 1
      this.gamePhase = 'story'
      this.loadCurrentStage()
    },
    
    // 현재 단계 로드
    loadCurrentStage() {
      const region = this.regionsDatabase.find(r => r.id === this.selectedRegion)
      if (!region) return
      
      const stage = region.stages.find(s => s.stage === this.currentStageNumber)
      if (!stage) return
      
      this.currentWords = [...stage.words]
      this.enemy = { ...stage.enemy }
      
      // 플레이어 HP 회복 (보스전은 제외)
      if (this.currentStageNumber !== 10) {
        this.player.hp = Math.min(this.player.maxHp, this.player.hp + 20)
      }
    },
    
    // 다음 단계로 진행
    nextStage() {
      if (this.currentStageNumber < 10) {
        this.currentStageNumber++
        this.gamePhase = 'story'
        this.loadCurrentStage()
      } else {
        // 10단계 완료 시 승리 화면으로
        this.gamePhase = 'result'
      }
    },
    
    // 전투 시작
    startBattle() {
      this.gamePhase = 'battle'
      this.isGameOver = false
      this.isPlayerTurn = true
      this.generateNewQuestion()
    },
    
    // 메인 메뉴로 돌아가기
    goToMenu() {
      this.gamePhase = 'menu'
      this.selectedRegion = null
      this.currentStageNumber = 1
      this.isGameOver = false
      this.score = 0
      this.player.hp = this.player.maxHp
    },
    
    // 스토리로 돌아가기
    goToStory() {
      this.gamePhase = 'story'
    },
    
    // 새로운 문제 생성
    generateNewQuestion() {
      if (this.currentWords.length === 0) return
      const randomIndex = Math.floor(Math.random() * this.currentWords.length)
      this.currentQuestion = this.currentWords[randomIndex]
    },
    
    // 답안 선택 처리
    selectAnswer(selectedAnswer) {
      if (!this.isPlayerTurn || this.isGameOver) return
      
      const isCorrect = selectedAnswer === this.currentQuestion.english
      
      if (isCorrect) {
        // 정답: 적 공격
        this.attackEnemy()
        this.score += 10
      } else {
        // 오답: 플레이어가 공격받음
        this.attackPlayer()
      }
      
      // 게임 종료 체크
      this.checkGameOver()
      
      if (!this.isGameOver) {
        // 다음 문제 생성
        setTimeout(() => {
          this.generateNewQuestion()
          this.isPlayerTurn = true
        }, 1500)
      }
    },
    
    // 적 공격
    attackEnemy() {
      const damage = Math.floor(Math.random() * 25) + 15 // 15-40 랜덤 데미지
      this.enemy.hp = Math.max(0, this.enemy.hp - damage)
      this.isPlayerTurn = false
    },
    
    // 플레이어 공격받기
    attackPlayer() {
      const damage = Math.floor(Math.random() * 20) + 10 // 10-30 랜덤 데미지
      this.player.hp = Math.max(0, this.player.hp - damage)
      this.isPlayerTurn = false
    },
    
    // 게임 종료 체크
    checkGameOver() {
      if (this.player.hp <= 0) {
        this.isGameOver = true
        this.gamePhase = 'result'
      } else if (this.enemy.hp <= 0) {
        this.isGameOver = true
        if (this.currentStageNumber < 10) {
          // 다음 단계로 진행
          setTimeout(() => {
            this.nextStage()
          }, 2000)
        } else {
          // 10단계 완료 시 승리 화면
          this.gamePhase = 'result'
          this.score += 100 // 보스 클리어 보너스
        }
        this.score += 50 // 일반 승리 보너스
      }
    }
  }
}) 