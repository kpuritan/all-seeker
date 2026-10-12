/**
 * 모든 과목을 찾는 사람들 (All Subjects Seeker) Mock Data
 * 국어, 영어, 수학, 과학, 사회 전과목 오픈마켓 및 찾사패스 데이터
 */

const MOCK_CATEGORIES = [
  {
    id: 'english',
    name: '영어',
    sub: [
      { id: 'eng_m', name: '중등 영어 (내신/교과서별/기출)', grade: '중등', subject: '영어' },
      { id: 'eng_h_mock', name: '고등 영어 (9월·6월 모의고사 변형/HWP)', grade: '고등', subject: '영어' },
      { id: 'eng_h_csat', name: '수능 영어 (EBS 연계/어법/구문독해)', grade: '수능', subject: '영어' }
    ]
  },
  {
    id: 'korean',
    name: '국어',
    sub: [
      { id: 'kor_m', name: '중등 국어 (문법/문학/교과서별 족보)', grade: '중등', subject: '국어' },
      { id: 'kor_h', name: '고등 국어 (공통국어/문학/독서)', grade: '고등', subject: '국어' },
      { id: 'kor_csat', name: '수능 국어 (EBS 수능특강·수능완성 연계)', grade: '수능', subject: '국어' }
    ]
  },
  {
    id: 'math',
    name: '수학',
    sub: [
      { id: 'math_m', name: '중등 수학 (일차함수/도형/기출변형)', grade: '중등', subject: '수학' },
      { id: 'math_h_common', name: '고1 공통수학 (도형의 방정식/함수/킬러)', grade: '고1', subject: '수학' },
      { id: 'math_csat', name: '수능 수학 (수I/수II/미적분 고난도 킬러)', grade: '수능', subject: '수학' }
    ]
  },
  {
    id: 'science',
    name: '과학',
    sub: [
      { id: 'sci_m', name: '중등 과학 (중1~중3 내신/수행평가)', grade: '중등', subject: '과학' },
      { id: 'sci_h_common', name: '고1 통합과학 (개념완성/기출 킬러)', grade: '고1', subject: '과학' },
      { id: 'sci_csat', name: '수능 과탐 (물화생지 융합 변형/HWP)', grade: '수능', subject: '과학' }
    ]
  },
  {
    id: 'social',
    name: '사회',
    sub: [
      { id: 'soc_m', name: '중등 사회/역사 (내신 암기노트/수행평가)', grade: '중등', subject: '사회' },
      { id: 'soc_h_common', name: '고1 통합사회 (전단원 단권화/기출 80제)', grade: '고1', subject: '사회' },
      { id: 'soc_history', name: '한국사/사탐 (수능 필수/모의고사 변형)', grade: '수능', subject: '사회' }
    ]
  }
];

const MOCK_AUTHORS = [
  {
    id: 'author_eng',
    name: '제니퍼 강T',
    badge: '대치동 1타 영어연구소',
    role: '현직 대형어학원 원장',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    subject: '중·고등 영어 / 모의고사 변형',
    rating: 4.98,
    salesCount: 31200,
    intro: '출제 위원 시각의 지문 분석! 빈칸추론, 문장삽입, 어법 어휘 100% 적중 변형',
    topWork: '2025 고1 9월 모의고사 영어 완벽 변형 120제'
  },
  {
    id: 'author_math',
    name: '강민수T',
    badge: '수학 킬러 문항 제작소',
    role: '전직 수학교사 & 저자',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    subject: '고등 수학 / 수능 킬러',
    rating: 4.95,
    salesCount: 26800,
    intro: '복잡한 수식을 한눈에! 학교 내신 1등급 변별 문항 및 평가원 4점 킬러 변형',
    topWork: '고1 수학 2학기 중간고사 도형의 방정식&함수 킬러 60선'
  },
  {
    id: 'author_kor',
    name: '문학의 정석 LAB',
    badge: 'EBS 연계 전작품 올킬',
    role: '국어 교육 콘텐츠 기획팀',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    subject: '수능 국어 / 문학 / 독서',
    rating: 4.93,
    salesCount: 18500,
    intro: '시가·산문 전문 분석표와 갈래별 필수 개념 완벽 도식화',
    topWork: '2025 수능특강 국어 문학 전작품 핵심 총정리'
  },
  {
    id: 'author_1',
    name: '정원석T',
    badge: '대치동 12년차 과학전문',
    role: '현직 학원장',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    subject: '고등 통합과학 / 화학',
    rating: 4.96,
    salesCount: 14200,
    intro: '출제 원리를 꿰뚫는 직관적 개념 정리와 학교별 고난도 킬러 문항 집중 분석',
    topWork: '2025 고1 통합과학 1학기 중간고사 킬러대비 150제'
  },
  {
    id: 'author_2',
    name: '김사이언스',
    badge: 'EBS 연계 변형 전문',
    role: '전직 고교 교사',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    subject: '수능형 융합과학 / 물리',
    rating: 4.92,
    salesCount: 9800,
    intro: '수능 평가원 10개년 기출 재해석 및 신유형 융합/고난도 변형문제 전문 개발',
    topWork: '수능특강 완벽 변형! 과탐 고난도 융합 60선'
  },
  {
    id: 'author_3',
    name: '박에듀 LAB',
    badge: '중등 내신 1등급 메이커',
    role: '교재 연구원',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    subject: '중1~3 전과정 과학/사회',
    rating: 4.88,
    salesCount: 22400,
    intro: '교과서 5종(비상/미래엔/천재/동아/YBM) 완벽 단권화 핵심노트 및 직전대비 요약집',
    topWork: '중2 과학 1학기 기말고사 전단원 벼락치기 한권완성'
  }
];

const MOCK_PRODUCTS = [
  // 1. 영어 (ENGLISH)
  {
    id: 'prod_eng_1',
    title: '[2025 고1 9월 모의고사] 영어 영역 실전 변형 120제 (빈칸추론·순서배열·어법선택) (HWP/PDF)',
    grade: '고1',
    subject: '영어',
    publisher: 'EBS',
    area: '기출문제',
    price: 9900,
    originalPrice: 15000,
    rating: 4.98,
    reviewCount: 382,
    authorId: 'author_eng',
    authorName: '제니퍼 강T',
    format: 'HWP',
    pages: 72,
    downloads: 4850,
    isPopular: true,
    isRecommended: true,
    thumbnail: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80',
    tags: ['영어', '9월모의고사', '고1영어', '변형문제', 'HWP제공', '내신대비'],
    description: `2025년 9월 고1 학력평가 영어 전 지문을 정밀 분석하여 학교 내신에 반드시 출제되는 3단 변형(어법/어휘, 빈칸추론, 문장삽입/순서) 문항을 제작했습니다. 선생님이 즉시 시험지로 활용 가능한 HWP 원본 파일이 포함되어 있습니다.`,
    tableOfContents: [
      'PART 1: 18번~24번 대의파악/주제/제목 변형 30문항',
      'PART 2: 29번~34번 어법/어휘 & 빈칸추론 킬러 40문항',
      'PART 3: 36번~40번 글의 순서 & 문장 삽입 고난도 30문항',
      'PART 4: 서술형 대비 핵심 구문 영작 및 조건 제시형 20문항',
      '정답 및 교사용 1:1 직독직해 해설지 (HWP/PDF)'
    ],
    samplePreview: [
      {
        page: 1,
        title: '[9월 학평 31번 빈칸추론 변형 예시]',
        text: `[Original Text Analysis]\n"The concept of sustainable consumption requires us to balance our present needs without compromising the ability of future generations..."\n\n【변형 01】다음 글의 빈칸 (A), (B)에 들어갈 말로 가장 적절한 것은?\nModern societies often prioritize immediate economic gains over long-term ecological stability. However, true prosperity is achieved when economic metrics incorporate environmental health into their fundamental calculus.\n\n선생님 한글(HWP) TIP: 문제마다 문제코드와 난이도가 태깅되어 있어 내신 시험지 출제 프로그램과 100% 호환됩니다.`
      },
      {
        page: 2,
        title: '[서술형 조건 영작 클리닉]',
        text: `【서술형 02】다음 우리말에 맞도록 <조건>의 단어만을 모두 활용하여 영작하시오.\n[조건] (1) 관계대명사 whatever 사용  (2) 7단어 이내로 작성할 것\n"네가 어떤 선택을 하든, 미래의 책임이 뒤따른다."\n\n[정답]: Whatever choice you make, responsibility follows.\n[채점 기준]: 어순 오류 시 -2점, 철자 오류 개당 -1점 감점.`
      }
    ]
  },
  {
    id: 'prod_eng_2',
    title: '[중2 영어] 비상(김진완) 2학기 전단원 본문 분석노트 & 서술형 족보 80제',
    grade: '중2',
    subject: '영어',
    publisher: '비상교육',
    area: '개념노트',
    price: 4900,
    originalPrice: 7000,
    rating: 4.92,
    reviewCount: 175,
    authorId: 'author_eng',
    authorName: '제니퍼 강T',
    format: 'PDF',
    pages: 48,
    downloads: 2410,
    isPopular: true,
    isRecommended: false,
    thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80',
    tags: ['중2영어', '비상김', '2학기중간고사', '본문분석', '서술형족보'],
    description: `중2 2학기 내신 만점을 위한 교과서 본문 문장 구조도 분석, 필수 숙어 및 관계대명사/수동태 문법 개념 총정리집입니다.`,
    tableOfContents: [
      'Lesson 5: 환경과 미래 (본문 구문해석 + 빈칸 암기표)',
      'Lesson 6: 세계의 문화 축제 (문법 포인트 & 실전 40제)',
      '중간고사 직전 벼락치기 기출 서술형 족보 40선',
      '단원별 핵심 단어/숙어 영영풀이 퀴즈'
    ],
    samplePreview: [
      {
        page: 1,
        title: 'Lesson 5 본문 한줄해석 및 구조분석',
        text: `[본문 01]\nPeople around the world are trying to reduce plastic waste.\n(전 세계 사람들이 플라스틱 쓰레기를 줄이기 위해 노력하고 있다.)\n- try + to부정사: ~하기 위해 노력하다 (vs try + -ing: 시험 삼아 해보다)`
      },
      {
        page: 2,
        title: '실전 서술형 킬러 대비 05번',
        text: `[질문] 주어진 접속사 'although'를 사용하여 두 문장을 한 문장으로 연결하시오.\nIt rained heavily. We enjoyed the outdoor concert.`
      }
    ]
  },

  // 2. 국어 (KOREAN)
  {
    id: 'prod_kor_1',
    title: '[2025 수능 국어] 9월 모평 연계 현대시·고전시가 전작품 1페이지 핵심 도식화 (PDF)',
    grade: '고등',
    subject: '국어',
    publisher: 'EBS',
    area: '개념노트',
    price: 7900,
    originalPrice: 11000,
    rating: 4.96,
    reviewCount: 220,
    authorId: 'author_kor',
    authorName: '문학의 정석 LAB',
    format: 'PDF',
    pages: 56,
    downloads: 3600,
    isPopular: true,
    isRecommended: true,
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
    tags: ['수능국어', '9월모의평가', '문학총정리', 'EBS연계', '현대시', '고전시가'],
    description: `9월 모의평가 및 수능 출제 유력 EBS 연계 문학 전작품(현대시 24편, 고전시가 18편)의 화자의 정서, 표현상 특징, 시어의 상징성을 1페이지 도식화로 완벽 정리했습니다.`,
    tableOfContents: [
      'PART 1: EBS 수능완성 수록 필수 현대시 24편 도식표',
      'PART 2: 고전시가 필수 어휘 및 가사·시조 분석 18편',
      'PART 3: 기출 선지 빈출 개념어 (공감각, 역설, 반어, 연쇄)',
      '실전 복합지문 훈련 20제 + 심층 오답해설'
    ],
    samplePreview: [
      {
        page: 1,
        title: '작품 01. 김수영 [어느 날 고궁을 나오면서] 분석',
        text: `■ 화자의 처지: 거대한 부조리(자유의 억압)에는 침묵하고, 사소한 일(50원짜리 갈비 기름덩어리)에만 분개함\n■ 정서 및 태도: 왜소하고 옹졸한 자신에 대한 자조(자책)와 반성\n■ 핵심 시어 대립: '왕궁의 음탕함' vs '조그마한 일, 50원'\n■ 출제 포인트: 반어적 자기반성을 통한 시대적 양심 회복`
      },
      {
        page: 2,
        title: '작품 02. 정철 [속미인곡] 화자 분석 매트릭스',
        text: `■ 갑녀 vs 을녀의 역할 대비:\n- 갑녀: 보조적 인물 (질문을 통해 을녀의 하소연을 유도)\n- 을녀: 중심 화자 (임에 대한 일편단심과 자책, 비극적 사랑 토로)\n■ 낙구: "각시님 달이야 믈론이거니와 구잔비나 되쇼셔" (소극적 '달'보다 적극적 '궂은비' 권유)`
      }
    ]
  },
  {
    id: 'prod_kor_2',
    title: '[중3 국어] 천재(박) 2학기 중간고사 국어 문법(음운 변동/문장 구조) 족보 100제',
    grade: '중3',
    subject: '국어',
    publisher: '천재교육',
    area: '기출문제',
    price: 4500,
    originalPrice: 6500,
    rating: 4.89,
    reviewCount: 94,
    authorId: 'author_kor',
    authorName: '문학의 정석 LAB',
    format: 'PDF',
    pages: 38,
    downloads: 1680,
    isPopular: false,
    isRecommended: true,
    thumbnail: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    tags: ['중3국어', '천재박', '음운의변동', '문법족보', '중간고사'],
    description: `학생들이 가장 어려워하는 교체, 탈락, 첨가, 축약 음운의 변동 원리를 쉬운 예시와 마인드맵으로 정리하고 빈출 100문항을 수록했습니다.`,
    tableOfContents: [
      '01단원: 음운의 변동 원리 (비음화, 유음화, 구개음화, 된소리되기)',
      '02단원: 자음군 단순화와 사잇소리 현상 완벽 구별법',
      '03단원: 문장의 짜임 (홑문장 vs 이어진문장 vs 안은문장)',
      '학교 기출 실전 모의고사 2회분 + 서술형 해설'
    ],
    samplePreview: [
      {
        page: 1,
        title: '음운 변동 4대 유형 총정리 표',
        text: `■ 교체: 음절의 끝소리 규칙, 비음화(국물->[궁물]), 유음화(칼날->[칼랄]), 구개음화(굳이->[구지])\n■ 탈락: 자음군 단순화(값->[갑]), 자음 탈락, 모음 탈락\n■ 첨가: ㄴ 첨가(맨입->[맨닙])\n■ 축약: 거센소리되기(좋고->[조코])`
      },
      {
        page: 2,
        title: '내신 빈출 킬러 04번',
        text: `[문제] 다음 단어 중 음운 변동의 횟수와 결과가 같은 것끼리 짝지어진 것은?\n(가) 굳히다   (나) 솜이불   (다) 읊고   (라) 칡즙`
      }
    ]
  },

  // 3. 수학 (MATHEMATICS)
  {
    id: 'prod_math_1',
    title: '[고1 공통수학] 2학기 중간고사 도형의 방정식 & 함수 킬러 변형 60선 (수식 HWP 제공)',
    grade: '고1',
    subject: '수학',
    publisher: '미래엔',
    area: '기출문제',
    price: 11000,
    originalPrice: 16000,
    rating: 4.97,
    reviewCount: 310,
    authorId: 'author_math',
    authorName: '강민수T',
    format: 'HWP',
    pages: 64,
    downloads: 4200,
    isPopular: true,
    isRecommended: true,
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80',
    tags: ['고1수학', '도형의방정식', '원과직선', '합성함수', 'HWP제공', '내신킬러'],
    description: `강남 8학군 및 전국 주요 자사고 1등급 변별 문항인 원의 접선의 방정식, 도형의 이동, 일대일 대응 및 역함수 킬러를 한글(HWP) 수식으로 완벽 제공합니다.`,
    tableOfContents: [
      'Theme 1: 평면좌표와 직선의 방정식 고난도 거리 계산 (15문항)',
      'Theme 2: 원의 방정식과 접선 & 최단거리 대칭이동 킬러 (20문항)',
      'Theme 3: 함수의 정의, 일대일대응 치역-공역 판별 (15문항)',
      'Theme 4: 합성함수 그래프 그리기 30초 스킬 & 역함수 (10문항)',
      '전 문항 한글 수식 원본 및 단계별 서술형 모범 답안'
    ],
    samplePreview: [
      {
        page: 1,
        title: '[HWP 수식 입력 완료] 원의 방정식 킬러 03번',
        text: `【문항 03】(배점 4.5점)\n좌표평면 위에 두 점 A(-3, 0), B(3, 0)과 원 C: x² + (y-4)² = 4 가 있다. 원 C 위의 점 P에 대하여 삼각형 PAB의 넓이가 최대가 될 때와 최소가 될 때 점 P의 좌표를 각각 구하시오.\n\n[해설 TIP]: 밑변 AB의 길이는 6으로 고정되어 있으므로 높이가 최대/최소가 되는 순간은 원의 중심에서 직선 AB까지의 거리 d에 반지름 r을 더하거나 뺄 때이다.`
      },
      {
        page: 2,
        title: '[합성함수 그래프 킬러 08번]',
        text: `【문항 08】(배점 5.0점)\n정의역이 [0, 2]인 두 함수 f(x), g(x)에 대하여 y=(g∘f)(x)의 그래프와 x축으로 둘러싸인 부분의 넓이를 구하시오.\n(한글 2020 이상 수식 및 그래프 벡터 클립아트 포함)`
      }
    ]
  },
  {
    id: 'prod_math_2',
    title: '[중2 수학] 일차함수와 일차방정식 고난도 서술형 50제 + 단계별 채점 기준표',
    grade: '중2',
    subject: '수학',
    publisher: '동아출판',
    area: '기출문제',
    price: 4900,
    originalPrice: 7000,
    rating: 4.90,
    reviewCount: 130,
    authorId: 'author_math',
    authorName: '강민수T',
    format: 'PDF',
    pages: 40,
    downloads: 2190,
    isPopular: false,
    isRecommended: true,
    thumbnail: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=600&q=80',
    tags: ['중2수학', '일차함수', '기울기', '서술형대비', '중간고사'],
    description: `기울기와 절편의 기하학적 의미, 일차함수의 활용(속력, 농도, 물통 채우기) 서술형 감점 방지 특강 자료집입니다.`,
    tableOfContents: [
      '제1장: 기울기와 절편의 기본 성질과 평행/일치 조건',
      '제2장: 두 직선의 교점과 연립일차방정식의 해의 관계',
      '제3장: 실생활 활용 문제(물 채우기, 양초 타기, 이동 거리)',
      '서술형 부분점수 기준표가 수록된 프리미엄 해설지'
    ],
    samplePreview: [
      {
        page: 1,
        title: '서술형 02번: 두 직선의 교점을 지나는 일차함수',
        text: `[문제] 두 직선 2x + y = 6, x - y = 0 의 교점을 지나고, 일차함수 y = -3x + 1 의 그래프와 평행한 일차함수의 식을 구하는 과정을 단계별로 서술하시오.\n\n[단계별 배점]\n1단계: 연립방정식을 풀어 교점 (2, 2)를 구한다. (2점)\n2단계: 평행하므로 기울기가 -3임을 명시한다. (1점)\n3단계: 점 (2, 2)를 대입하여 y절편 b=8을 구하고 식 y=-3x+8 완성 (2점)`
      },
      {
        page: 2,
        title: '활용 킬러: 물탱크 배수 문제 그래프 해석',
        text: `[문제] 100L의 물이 들어있는 물탱크에서 일정하게 물을 뺄 때, x분 후 남은 물의 양 yL 사이의 관계 그래프를 분석하시오.`
      }
    ]
  },

  // 4. 과학 (SCIENCE)
  {
    id: 'prod_1',
    title: '[2025 개정] 중1 과학 1학기 지권의 변화 & 생물의 다양성 핵심 총정리 + 족보 80제',
    grade: '중1',
    subject: '과학',
    publisher: '비상교육',
    area: '개념노트',
    price: 4900,
    originalPrice: 7000,
    rating: 4.9,
    reviewCount: 142,
    authorId: 'author_3',
    authorName: '박에듀 LAB',
    format: 'PDF',
    pages: 42,
    downloads: 1890,
    isPopular: true,
    isRecommended: true,
    thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
    tags: ['중1과학', '지권의변화', '비상교육', '핵심요약', '중간고사'],
    description: `중학교 1학년 학생들이 가장 헷갈려하는 [지권의 구조와 암석의 순환], [생물의 다양성과 분류] 단원을 5종 교과서 공통 성취기준에 맞춰 일목요연하게 표와 인포그래픽으로 정리한 필독 자료입니다.`,
    tableOfContents: [
      '제1장: 지구계와 지권의 층상 구조 (대륙이동설과 판구조론 기초)',
      '제2장: 암석의 생성과 순환 (화성암, 퇴적암, 변성암 핵심 암기법)',
      '제3장: 광물의 특성과 토양의 생성 과정',
      '제4장: 생물 다양성의 의미와 생물 분류 5계 체계',
      '제5장: [내신 빈출 실전 80제] 객관식 60문항 + 서술형 20문항',
      '부록: 정답 및 1타 강사 시크릿 오답 피하기 해설지'
    ],
    samplePreview: [
      {
        page: 1,
        title: 'PART 1. 지권의 층상 구조 및 시각화 요약',
        text: `[핵심 포인트] 지진파(P파, S파)의 속도 변화를 이용한 지구 내부 4개 층(지각-맨틀-외핵-내핵) 구분 기준!\n\n■ 지각: 대륙지각(화강암질, 평균 35km) vs 해양지각(현무암질, 평균 5km)\n■ 모호면: 지각과 맨틀의 경계면\n■ 맨틀: 전체 부피의 약 80% 차지, 감람암질 암석 고체 상태 유동성 존재\n■ 외핵: 액체 상태 (S파 통과 불가, 지구 자기장 근원)\n■ 내핵: 고체 상태 (가장 높은 온도와 압력, 철과 니켈)`
      },
      {
        page: 2,
        title: 'PART 2. 암석의 분류 및 순환 매트릭스',
        text: `■ 화성암(마그마가 식어 굳은 암석)\n- 화산암 (지표면 급냉, 세립질): 현무암(어두움), 안산암, 유문암(밝음)\n- 심성암 (지하 깊은곳 완냉, 조립질): 반려암(어두움), 섬록암, 화강암(밝음)\n\n★ 암기 꿀팁: "현안유 반섬화" (지표에서 깊은 곳으로!)`
      }
    ]
  },
  {
    id: 'prod_2',
    title: '[고1 통합과학] 1학기 중간고사 킬러단원(원소의 기원/화학결합/역학적시스템) 올킬 특강자료',
    grade: '고1',
    subject: '과학',
    publisher: '미래엔',
    area: '기출문제',
    price: 8900,
    originalPrice: 12000,
    rating: 5.0,
    reviewCount: 318,
    authorId: 'author_1',
    authorName: '정원석T',
    format: 'PDF',
    pages: 68,
    downloads: 3410,
    isPopular: true,
    isRecommended: true,
    thumbnail: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=600&q=80',
    tags: ['통합과학', '고1중간고사', '역학적시스템', '원소의주기성', '고난도'],
    description: `강남·서초·송파 주요 자사고 및 일반고 3개년 기출 1,200문항 전수 분석! 1등급을 가르는 [중력과 역학적 시스템 충격량-운동량 계산], [알칼리 금속과 할로젠의 반응성], [공유결합/이온결합 전기전도성 판별] 집중 트레이닝.`,
    tableOfContents: [
      '01단원: 우주의 시작과 원소의 생성 (빅뱅 우주론 증거 2가지)',
      '02단원: 지구와 생명체를 구성하는 원소의 규칙성 (주기율표 핵심 규칙)',
      '03단원: 화학 결합과 물질의 성질 (이온결합 vs 공유결합 실험 문항)',
      '04단원: 역학적 시스템과 중력 (자유낙하 운동 vs 수평으로 던진 물체의 운동)',
      '05단원: 운동량과 충격량 (F-t 그래프 분석 및 안전장치 원리)',
      '실전 킬러 문항 50선 + 풀이 시간 단축 솔루션 (Short-cut 비법)'
    ],
    samplePreview: [
      {
        page: 1,
        title: 'KEY CONCEPT 01. 빅뱅 우주론의 결정적 2대 증거 총정리',
        text: `1. 수소와 헬륨의 질량비 (약 3 : 1)\n- 빅뱅 후 약 3분경, 양성자와 중성자의 개수비가 약 7 : 1이 되었을 때 헬륨 원자핵 합성\n- 질량비 = 수소(12 x 1) : 헬륨(1 x 4) = 12 : 4 = 3 : 1\n\n2. 2.7K 우주 배경 복사\n- 빅뱅 후 약 38만 년, 원자 형성으로 빛이 직진 시작 (투명한 우주)\n- 펜지어스와 윌슨의 전파 망원경 관측으로 증명`
      },
      {
        page: 2,
        title: 'KILLER CLINIC. 수평으로 던진 물체의 포물선 운동 분석식',
        text: `■ 높이 h에서 수평 속도 v₀로 던진 물체의 2차원 분해 해석법\n- 수평 방향: 등속 직선 운동 (x = v₀ * t)\n- 연직 방향: 자유 낙하 운동 (y = 1/2 * g * t²)\n★ "발사 속도가 얼마든, 낙하 높이 h가 같다면 도달 시간 t는 동일하다!" (t = √(2h/g))`
      }
    ]
  },
  {
    id: 'prod_3',
    title: '[수능형 변형 고난도] 과탐 융합 신유형 40제 (HWP/PDF 동시제공)',
    grade: '고등',
    subject: '과학',
    publisher: 'EBS',
    area: '기출문제',
    price: 11000,
    originalPrice: 15000,
    rating: 4.95,
    reviewCount: 97,
    authorId: 'author_2',
    authorName: '김사이언스',
    format: 'HWP',
    pages: 54,
    downloads: 1420,
    isPopular: true,
    isRecommended: false,
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    tags: ['수능과탐', 'EBS변형', '신유형', 'HWP한글파일', '고난도킬러'],
    description: `선생님들이 수업 및 모의고사 출제에 바로 복사/편집해서 사용하실 수 있도록 HWP 원본 파일(수식 입력 완료)과 고해상도 PDF를 동시 제공합니다.`,
    tableOfContents: [
      '테마 1: 힘과 가속도 복합 도르래 역학적 에너지 보존 신유형 (10문항)',
      '테마 2: 산화-환원 반응식과 금속의 이온화 경향 미지수 추론 (10문항)',
      '테마 3: 세포 분열 DNA 상대량 매칭 및 가계도 유전 킬러 (10문항)',
      '테마 4: 엘니뇨/라니냐와 판 구조론 수능 연계형 자료 해석 (10문항)'
    ],
    samplePreview: [
      {
        page: 1,
        title: '[HWP 편집 가능 문항 예시] 물리 영역 킬러 01번',
        text: `【문항 01】(배점 3.5점)\n그림은 마찰이 없는 빗면에서 질량이 각각 2m, m인 물체 A, B가 실로 연결되어 정지해 있는 모습을 나타낸 것이다. 점 P에서 가만히 놓았을 때 B가 바닥에 도달하기 직전의 속력을 v라고 할 때...\n\n선생님 TIP: 한글 표준 수식 스크립트 작성 완료.`
      },
      {
        page: 2,
        title: '[HWP 편집 가능 문항 예시] 화학 영역 킬러 02번',
        text: `【문항 02】(배점 4.0점)\n세 가지 금속 A, B, C의 산화 환원 반응 실험.\n비커 I에 A²⁺ 수용액 100mL를 넣고 금속 B 막대를 넣었을 때 질량 변화 분석.`
      }
    ]
  },

  // 5. 사회 (SOCIAL STUDIES)
  {
    id: 'prod_soc_1',
    title: '[고1 통합사회] 2학기 전단원 핵심 단권화 요약노트 & 내신 기출 80제 (PDF)',
    grade: '고1',
    subject: '사회',
    publisher: '비상교육',
    area: '개념노트',
    price: 5900,
    originalPrice: 8500,
    rating: 4.93,
    reviewCount: 168,
    authorId: 'author_3',
    authorName: '박에듀 LAB',
    format: 'PDF',
    pages: 46,
    downloads: 2890,
    isPopular: true,
    isRecommended: true,
    thumbnail: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80',
    tags: ['통합사회', '고1내신', '정의관', '시장경제', '국제사회', '단권화'],
    description: `롤스의 정의론, 시장 실패와 정부 실패, 자본주의의 발전 과정 등 서술형 빈출 단원을 한눈에 파악할 수 있는 비교표와 실전 80제입니다.`,
    tableOfContents: [
      '단원 5: 시장 경제와 금융 (자산 관리와 생애 주기 설계)',
      '단원 6: 사회 정의와 불평등 (자유주의 vs 공동체주의, 롤스)',
      '단원 7: 문화와 다양성 (문화 상대주의 vs 극단적 상대주의)',
      '단원 8: 세계화와 평화 (국제 갈등과 협력 기구)',
      '내신 빈출 80제 + 서술형 모범 답안'
    ],
    samplePreview: [
      {
        page: 1,
        title: '롤스 vs 노직 vs 왈처 정의관 한눈에 비교',
        text: `■ 롤스(공정으로서의 정의): 원초적 입장, 무지의 베일, 제1원칙(평등한 자유), 제2원칙(기회 균등 & 차등의 원칙: 최소 수혜자에게 최대 이익)\n■ 노직(소유 권리로서의 정의): 취득과 양도의 정당성, 최소 국가론 (재분배 복지 반대)\n■ 왈처(복합 평등으로서의 정의): 영역별 고유한 가치 분배 기준 인정 (독점 방지)`
      },
      {
        page: 2,
        title: '실전 서술형 03번: 차등의 원칙 조건 분석',
        text: `[서술형 문항] 롤스의 '차등의 원칙'이 사회적·경제적 불평등을 정당화하는 조건을 두 가지 서술하시오.`
      }
    ]
  }
];

const MOCK_REVIEWS = [
  {
    id: 'rev_1',
    productId: 'prod_eng_1',
    authorName: '박*훈 선생님',
    role: '고등학교 영어교사',
    rating: 5,
    date: '2025-09-12',
    content: '9월 모의고사 끝나자마자 학교 시험지 출제해야 해서 막막했는데, HWP 원본 파일로 지문 변형 문제가 제공되어서 주말 동안 시험지 완벽하게 완성했습니다. 찾사패스로 받으니 가성비도 최고입니다!'
  },
  {
    id: 'rev_2',
    productId: 'prod_math_1',
    authorName: '이*수 강사',
    role: '대치동 수학 강사',
    rating: 5,
    date: '2025-09-08',
    content: '도형의 방정식 원의 접선 킬러 문항이 강남권 자사고 기출 트렌드를 정확하게 짚고 있습니다. 수식 편집도 깔끔해서 원생들 보충 프린트로 바로 인쇄해서 썼습니다.'
  },
  {
    id: 'rev_3',
    productId: 'prod_1',
    authorName: '김*현 선생님',
    role: '중학교 교사',
    rating: 5,
    date: '2025-04-02',
    content: '중1 아이들이 암석 분류할 때 화성암 심성암을 항상 어려워하는데, 여기에 실린 도표와 "현안유 반섬화" 암기법 덕분에 수업 시간에 반응이 너무 좋았습니다.'
  },
  {
    id: 'rev_4',
    productId: 'prod_kor_1',
    authorName: '최*민 학생',
    role: '수험생 (고3)',
    rating: 5,
    date: '2025-09-15',
    content: 'EBS 연계 현대시 도식화가 진짜 대박이에요. 수능 전날까지 이것만 달달 외우고 가려고요. 강추합니다!'
  }
];

const MOCK_SELLER_STATS = {
  monthlyRevenue: 3420000,
  pendingSettlement: 2180000,
  totalSalesVolume: 512,
  registeredItems: 18,
  averageRating: 4.96,
  recentSales: [
    { date: '2025-09-14', title: '[2025 고1 9월 모평] 영어 실전 변형 120제', price: 9900, qty: 8, fee: 7920, net: 71280 },
    { date: '2025-09-13', title: '[고1 공통수학] 도형의 방정식 킬러 60선', price: 11000, qty: 5, fee: 5500, net: 49500 },
    { date: '2025-09-12', title: '[2025 수능 국어] 9월 모평 연계 현대시 총정리', price: 7900, qty: 6, fee: 4740, net: 42660 },
    { date: '2025-09-11', title: '[고1 통합사회] 2학기 핵심 단권화 요약노트', price: 5900, qty: 4, fee: 2360, net: 21240 },
    { date: '2025-09-10', title: '[고1 통합과학] 1학기 중간고사 킬러 올킬', price: 8900, qty: 3, fee: 2670, net: 24030 }
  ],
  monthlyChart: {
    labels: ['5월', '6월', '7월', '8월', '9월', '10월(현재)'],
    revenues: [1200000, 1850000, 2100000, 2750000, 3950000, 3420000]
  }
};
