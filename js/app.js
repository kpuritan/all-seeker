/**
 * SolvEdu (쏠에듀) - 교육 자료 오픈마켓 프론트엔드 메인 로직
 */

// ==========================================
// 전역 상태 (Global State)
// ==========================================
const appState = {
  currentPage: 'home', // 'home' | 'market' | 'product-detail' | 'seller-dashboard' | 'library'
  userMode: 'teacher', // 'teacher' | 'student'
  selectedProductId: 'prod_1',
  detailActiveTab: 'intro', // 'intro' | 'reviews' | 'copyright'
  previewCurrentPage: 1,
  
  // Market filters
  filters: {
    grades: [],       // ['중1', '중2', '중3', '고1']
    areas: [],        // ['개념노트', '기출문제', '수행평가']
    publishers: [],   // ['비상교육', '천재교육', '미래엔', '동아출판', 'EBS']
    sort: 'popular',  // 'popular' | 'latest' | 'price-asc' | 'rating'
    search: ''
  },

  // Shopping Cart & Purchases
  cart: [],
  purchasedProducts: ['prod_1'], // 기본 구매 샘플 보관함용
  
  // Carousel Banner Index
  currentBannerIndex: 0,
  bannerTimer: null,

  // Seller Dashboard Items
  sellerItems: [...MOCK_PRODUCTS],
  sellerActiveTab: 'stats' // 'stats' | 'upload' | 'manage'
};

// ==========================================
// 초기화 및 라우팅 (Init & Navigation)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  // 장바구니 로컬스토리지 불러오기 또는 기본값 설정
  updateCartBadge();
  navigateTo('home');
  lucide.createIcons();
}

function navigateTo(page, param = null) {
  appState.currentPage = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (page === 'product-detail' && param) {
    appState.selectedProductId = param;
    appState.previewCurrentPage = 1;
    appState.detailActiveTab = 'intro';
  }

  // Close dropdowns
  document.getElementById('categoryDropdown')?.classList.add('hidden');

  renderApp();
}

function renderApp() {
  const container = document.getElementById('appContainer');
  if (!container) return;

  switch (appState.currentPage) {
    case 'home':
      container.innerHTML = renderHomePage();
      initHomeCarousel();
      break;
    case 'market':
      container.innerHTML = renderMarketPage();
      break;
    case 'product-detail':
      container.innerHTML = renderProductDetailPage();
      break;
    case 'seller-dashboard':
      container.innerHTML = renderSellerDashboardPage();
      if (appState.sellerActiveTab === 'stats') {
        setTimeout(initSellerChart, 50);
      }
      break;
    case 'library':
      container.innerHTML = renderLibraryPage();
      break;
    default:
      container.innerHTML = renderHomePage();
  }

  // Lucide 아이콘 갱신
  setTimeout(() => {
    lucide.createIcons();
  }, 10);
}

// ==========================================
// 사용자 모드 전환 (Teacher vs Student Mode)
// ==========================================
function switchUserMode(mode) {
  appState.userMode = mode;
  const btnT = document.getElementById('btnTeacherMode');
  const btnS = document.getElementById('btnStudentMode');
  const descBadge = document.getElementById('modeDescriptionBadge');

  if (mode === 'teacher') {
    btnT.className = 'px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-teal text-white shadow transition-all flex items-center gap-1';
    btnS.className = 'px-2.5 py-0.5 rounded-full text-xs font-medium text-slate-400 hover:text-white transition-all flex items-center gap-1';
    if (descBadge) {
      descBadge.textContent = '수업용 HWP 한글파일 및 내신 변형 킬러문항 우선 노출 중';
      descBadge.className = 'hidden sm:inline-block ml-2 text-teal-400 bg-teal-950/60 border border-teal-800/80 px-2 py-0.5 rounded text-[11px]';
    }
    showToast('선생님 모드로 전환되었습니다. (수업/출제용 HWP 파일 큐레이션)', 'success');
  } else {
    btnS.className = 'px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-600 text-white shadow transition-all flex items-center gap-1';
    btnT.className = 'px-2.5 py-0.5 rounded-full text-xs font-medium text-slate-400 hover:text-white transition-all flex items-center gap-1';
    if (descBadge) {
      descBadge.textContent = '학생 자습용 벼락치기 핵심요약 및 수행평가 예시 답안 큐레이션 중';
      descBadge.className = 'hidden sm:inline-block ml-2 text-blue-400 bg-blue-950/60 border border-blue-800/80 px-2 py-0.5 rounded text-[11px]';
    }
    showToast('학생 모드로 전환되었습니다. (자습/시험대비 요약본 큐레이션)', 'info');
  }

  // 모드 변경에 따라 현재 화면 리렌더링
  if (appState.currentPage === 'home' || appState.currentPage === 'market') {
    renderApp();
  }
}

// ==========================================
// 카테고리 메뉴 및 글로벌 검색
// ==========================================
function toggleCategoryMenu() {
  const menu = document.getElementById('categoryDropdown');
  menu.classList.toggle('hidden');
}

function applyCategoryFilter(grade, subject) {
  appState.filters.grades = [grade];
  appState.filters.search = '';
  navigateTo('market');
}

function handleGlobalSearch(e) {
  e.preventDefault();
  const desktopInput = document.getElementById('globalSearchInput');
  const mobileInput = document.getElementById('mobileSearchInput');
  const query = (desktopInput?.value || mobileInput?.value || '').trim();

  appState.filters.search = query;
  navigateTo('market');
}

function focusMobileSearch() {
  const bar = document.getElementById('mobileSearchBar');
  bar.classList.toggle('hidden');
  const input = document.getElementById('mobileSearchInput');
  if (!bar.classList.contains('hidden')) {
    input.focus();
  }
}

// ==========================================
// 1. 메인 홈 화면 (Main Home)
// ==========================================
function renderHomePage() {
  const isTeacher = appState.userMode === 'teacher';
  
  // TOP 5 인기자료 필터링
  const top5Items = [...MOCK_PRODUCTS]
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 5);

  return `
    <!-- MAIN BANNER CAROUSEL -->
    <section class="relative bg-gradient-to-r from-[#1A365D] via-[#1E293B] to-[#0F172A] text-white overflow-hidden py-12 md:py-16">
      <!-- Background pattern -->
      <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <!-- Banner Left: Copy & CTA -->
          <div class="lg:col-span-7 space-y-6">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold">
              <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
              ${isTeacher ? '출판사 정식 제휴 라이선싱 교육자료' : '전국 1등급 선배들이 검증한 시크릿 족보'}
            </div>
            
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
              ${isTeacher 
                ? '내신 시험 출제와 수업 준비를<br><span class="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-sky-400">10분 만에 완성</span>하는 마켓플레이스' 
                : '중·고등 과학 내신 1등급 완성,<br><span class="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-sky-400">단원별 족보 & 개념노트</span> 다운로드'}
            </h1>

            <p class="text-slate-300 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
              ${isTeacher 
                ? '비상교육, 천재, 미래엔 5종 교과서 수록 변형 문항 및 한글(HWP) 원본 파일 탑재! 클릭 한 번으로 다운로드하고 즉시 편집하세요.' 
                : '대치동 1타 강사진과 현직 교사가 엄선한 킬러 문항과 직전 총정리! PDF로 태블릿과 스마트폰에서 바로 열람하세요.'}
            </p>

            <div class="flex flex-wrap items-center gap-3 pt-2">
              <button onclick="navigateTo('market')" class="px-6 py-3.5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-500/20 transition flex items-center gap-2 text-sm">
                <i data-lucide="compass" class="w-4 h-4"></i> 자료 마켓 둘러보기
              </button>
              <button onclick="navigateTo('seller-dashboard')" class="px-5 py-3.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold rounded-xl transition flex items-center gap-2 text-sm">
                <i data-lucide="upload" class="w-4 h-4 text-teal-400"></i> 내 자료 등록하고 수익내기
              </button>
            </div>

            <!-- Stats badges -->
            <div class="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 max-w-lg">
              <div>
                <div class="text-xl sm:text-2xl font-black text-white">45,000+</div>
                <div class="text-[11px] text-slate-400">등록된 검증 문항</div>
              </div>
              <div>
                <div class="text-xl sm:text-2xl font-black text-teal-400">98.8%</div>
                <div class="text-[11px] text-slate-400">선생님 만족도</div>
              </div>
              <div>
                <div class="text-xl sm:text-2xl font-black text-sky-400">100%</div>
                <div class="text-[11px] text-slate-400">합법 저작권 안심</div>
              </div>
            </div>
          </div>

          <!-- Banner Right: Interactive Carousel Card Frame -->
          <div class="lg:col-span-5">
            <div class="relative bg-slate-800/90 rounded-2xl p-5 border border-slate-700/80 shadow-2xl backdrop-blur-md">
              <div class="flex items-center justify-between pb-3 border-b border-slate-700 text-xs">
                <span class="flex items-center gap-1.5 text-teal-300 font-bold">
                  <span class="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
                  실시간 화제의 추천 교재
                </span>
                <span class="text-slate-400 text-[11px]" id="carouselCounter">1 / 3</span>
              </div>

              <!-- Carousel Slide Container -->
              <div id="carouselSlideContent" class="py-4">
                <!-- Slide rendered dynamically -->
              </div>

              <!-- Carousel Controls -->
              <div class="flex items-center justify-between pt-3 border-t border-slate-700">
                <div class="flex gap-1.5" id="carouselDots">
                  <span class="w-6 h-1.5 rounded-full bg-teal-500"></span>
                  <span class="w-2 h-1.5 rounded-full bg-slate-600"></span>
                  <span class="w-2 h-1.5 rounded-full bg-slate-600"></span>
                </div>
                <div class="flex gap-2">
                  <button onclick="prevBannerSlide()" class="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200">
                    <i data-lucide="chevron-left" class="w-4 h-4"></i>
                  </button>
                  <button onclick="nextBannerSlide()" class="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200">
                    <i data-lucide="chevron-right" class="w-4 h-4"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- QUICK CATEGORY CHIPS -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
      <div class="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button onclick="applyCategoryFilter('중1', '과학')" class="flex items-center gap-3 p-3 rounded-xl hover:bg-teal-50 transition border border-slate-100 hover:border-teal-200 group text-left">
          <div class="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm group-hover:scale-105 transition">중1</div>
          <div>
            <div class="text-xs font-bold text-slate-800">중1 과학</div>
            <div class="text-[11px] text-slate-400">내신 & 수행평가</div>
          </div>
        </button>
        <button onclick="applyCategoryFilter('중2', '과학')" class="flex items-center gap-3 p-3 rounded-xl hover:bg-teal-50 transition border border-slate-100 hover:border-teal-200 group text-left">
          <div class="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm group-hover:scale-105 transition">중2</div>
          <div>
            <div class="text-xs font-bold text-slate-800">중2 과학</div>
            <div class="text-[11px] text-slate-400">물질과 소화순환</div>
          </div>
        </button>
        <button onclick="applyCategoryFilter('중3', '과학')" class="flex items-center gap-3 p-3 rounded-xl hover:bg-teal-50 transition border border-slate-100 hover:border-teal-200 group text-left">
          <div class="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm group-hover:scale-105 transition">중3</div>
          <div>
            <div class="text-xs font-bold text-slate-800">중3 과학</div>
            <div class="text-[11px] text-slate-400">운동에너지 & 유전</div>
          </div>
        </button>
        <button onclick="applyCategoryFilter('고1', '통합과학')" class="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition border border-slate-100 hover:border-blue-200 group text-left">
          <div class="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm group-hover:scale-105 transition">고1</div>
          <div>
            <div class="text-xs font-bold text-slate-800">통합과학</div>
            <div class="text-[11px] text-slate-400">개념완성 족보</div>
          </div>
        </button>
        <button onclick="applyCategoryFilter('고등', '수능과학')" class="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 transition border border-slate-100 hover:border-purple-200 group text-left col-span-2 sm:col-span-1">
          <div class="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm group-hover:scale-105 transition">수능</div>
          <div>
            <div class="text-xs font-bold text-slate-800">융합/변형 문제</div>
            <div class="text-[11px] text-slate-400">HWP/PDF 고난도</div>
          </div>
        </button>
      </div>
    </section>

    <!-- SECTION: TOP 5 POPULAR MATERIALS (쏠북 스타일 랭킹 카드) -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div class="flex items-end justify-between mb-8">
        <div>
          <div class="flex items-center gap-2 text-xs font-bold text-teal-600 mb-1">
            <i data-lucide="flame" class="w-4 h-4 text-red-500"></i> 실시간 판매 랭킹
          </div>
          <h2 class="text-2xl font-black text-slate-900 tracking-tight">
            지금 가장 많이 찾는 인기 자료 TOP 5
          </h2>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">현직 교사와 학원 강사진이 가장 많이 다운로드한 베스트셀러</p>
        </div>
        <button onclick="navigateTo('market')" class="text-xs font-bold text-[#1A365D] hover:text-teal-600 flex items-center gap-1 transition">
          전체보기 <i data-lucide="chevron-right" class="w-4 h-4"></i>
        </button>
      </div>

      <!-- Top 5 Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        ${top5Items.map((item, idx) => renderTopProductCard(item, idx + 1)).join('')}
      </div>
    </section>

    <!-- SECTION: REAL-TIME BEST AUTHORS (저자 프로필 슬라이더) -->
    <section class="bg-slate-100/70 border-y border-slate-200/80 py-14">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-end justify-between mb-8">
          <div>
            <div class="flex items-center gap-2 text-xs font-bold text-teal-600 mb-1">
              <i data-lucide="award" class="w-4 h-4 text-amber-500"></i> PRO CREATORS
            </div>
            <h2 class="text-2xl font-black text-slate-900 tracking-tight">
              실시간 베스트 저자
            </h2>
            <p class="text-xs sm:text-sm text-slate-500 mt-1">수만 명의 교사와 학생에게 검증받은 믿을 수 있는 창작자들</p>
          </div>
          <button onclick="navigateTo('seller-dashboard')" class="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-teal-400 text-xs font-semibold text-slate-700 hover:text-teal-600 transition shadow-sm">
            저자 신청 가이드
          </button>
        </div>

        <!-- Authors Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          ${MOCK_AUTHORS.map(author => renderAuthorCard(author)).join('')}
        </div>
      </div>
    </section>

    <!-- SECTION: TEACHER/STUDENT SPECIAL CURATION -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div class="bg-gradient-to-r from-teal-900 to-[#1A365D] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
        <div class="relative z-10 max-w-2xl space-y-4">
          <span class="px-3 py-1 rounded-full bg-teal-400/20 text-teal-300 text-xs font-bold border border-teal-400/30">
            ${isTeacher ? '선생님 회원 특별 혜택' : '시험 기간 벼락치기 패키지'}
          </span>
          <h3 class="text-2xl sm:text-3xl font-extrabold leading-snug">
            ${isTeacher 
              ? '학교 시험 출제에 바로 쓰는<br>HWP 한글 원본 파일 & 교사용 정답 해설' 
              : '수행평가 보고서 양식부터<br>기출 오답 킬러 3일 완성 총정리'}
          </h3>
          <p class="text-slate-300 text-xs sm:text-sm leading-relaxed">
            ${isTeacher 
              ? '수식 입력, 표 편집 걱정 끝! 한글 2020 규격에 완벽 호환되는 원본 파일로 나만의 맞춤형 시험지를 손쉽게 완성하세요.' 
              : '시간 낭비 없는 핵심 빈출 문항만 쏙! 모바일과 태블릿으로 언제 어디서나 바로 공부하세요.'}
          </p>
          <div class="pt-2">
            <button onclick="navigateTo('market')" class="px-6 py-3 bg-white text-[#1A365D] hover:bg-slate-100 font-extrabold rounded-xl text-xs sm:text-sm transition shadow-md">
              지금 바로 자료 검색하기
            </button>
          </div>
        </div>
      </div>
    </section>
  `;
}

// TOP 카드 렌더링
function renderTopProductCard(item, rank) {
  const discountRate = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
  return `
    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col group relative">
      <!-- Rank Badge -->
      <div class="absolute top-2.5 left-2.5 z-10 w-7 h-7 rounded-lg ${rank <= 3 ? 'bg-gradient-to-tr from-amber-500 to-amber-400 text-white shadow-md' : 'bg-slate-800/80 text-white'} flex items-center justify-center font-black text-xs">
        ${rank}
      </div>

      <!-- Format Tag -->
      <div class="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded text-[10px] font-extrabold ${item.format === 'HWP' ? 'bg-blue-600 text-white' : 'bg-red-500 text-white'} shadow-sm">
        ${item.format}
      </div>

      <!-- Thumbnail image wrapper -->
      <div class="relative h-44 overflow-hidden bg-slate-100 cursor-pointer" onclick="navigateTo('product-detail', '${item.id}')">
        <img src="${item.thumbnail}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3">
          <span class="text-white text-xs font-semibold flex items-center gap-1">
            <i data-lucide="eye" class="w-3.5 h-3.5"></i> 미리보기 샘플 열람
          </span>
        </div>
      </div>

      <!-- Body -->
      <div class="p-4 flex-1 flex flex-col justify-between">
        <div>
          <!-- Tags / Publisher -->
          <div class="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1.5">
            <span class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">${item.grade}</span>
            <span class="px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 font-semibold">${item.area}</span>
            <span class="text-slate-400">• ${item.publisher}</span>
          </div>

          <!-- Title -->
          <h3 onclick="navigateTo('product-detail', '${item.id}')" class="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-teal-600 transition cursor-pointer">
            ${item.title}
          </h3>

          <div class="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <i data-lucide="user-check" class="w-3 h-3 text-slate-400"></i> ${item.authorName}
          </div>
        </div>

        <!-- Rating & Price -->
        <div class="pt-3 mt-3 border-t border-slate-100">
          <div class="flex items-center justify-between text-xs mb-1.5">
            <div class="flex items-center text-amber-500 font-bold text-[11px]">
              <i data-lucide="star" class="w-3 h-3 fill-amber-400 mr-0.5"></i>
              ${item.rating}
              <span class="text-slate-400 font-normal ml-0.5">(${item.reviewCount})</span>
            </div>
            <div class="text-[11px] text-slate-400">
              다운 ${item.downloads.toLocaleString()}
            </div>
          </div>

          <div class="flex items-baseline justify-between">
            <div class="flex items-baseline gap-1.5">
              ${discountRate > 0 ? `<span class="text-red-500 font-black text-sm">${discountRate}%</span>` : ''}
              <span class="text-base font-black text-slate-900">${item.price.toLocaleString()}원</span>
            </div>
            <button onclick="addToCart('${item.id}', event)" title="장바구니 담기" class="p-1.5 rounded-lg bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-600 transition">
              <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
}

// 저자 카드 렌더링
function renderAuthorCard(author) {
  return `
    <div class="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition text-center flex flex-col items-center">
      <div class="relative mb-3">
        <img src="${author.avatar}" alt="${author.name}" class="w-20 h-20 rounded-full object-cover border-2 border-teal-500 p-0.5 shadow">
        <span class="absolute bottom-0 right-0 bg-teal-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">PRO</span>
      </div>

      <div class="flex items-center gap-1.5 mb-1">
        <h4 class="font-extrabold text-slate-900 text-sm">${author.name}</h4>
        <span class="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">${author.role}</span>
      </div>

      <p class="text-[11px] font-semibold text-teal-600 mb-2">${author.subject}</p>
      <p class="text-xs text-slate-500 line-clamp-2 px-2 leading-relaxed mb-4">${author.intro}</p>

      <div class="w-full pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs mb-4">
        <div>
          <span class="text-[10px] text-slate-400 block">누적 판매</span>
          <span class="font-bold text-slate-800">${author.salesCount.toLocaleString()}건</span>
        </div>
        <div>
          <span class="text-[10px] text-slate-400 block">회원 만족도</span>
          <span class="font-bold text-amber-500">★ ${author.rating}</span>
        </div>
      </div>

      <button onclick="filterByAuthor('${author.id}')" class="w-full py-2 bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-700 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1">
        <i data-lucide="book-open" class="w-3.5 h-3.5"></i> 대표 교재 보기
      </button>
    </div>
  `;
}

// 캐러셀 슬라이드 기능
const CAROUSEL_SLIDES = [
  {
    title: '[고1 통합과학] 1학기 중간고사 킬러대비 150제',
    author: '정원석T (대치동 12년차)',
    desc: '강남 3구 3개년 킬러 문항 전수 분석! 충격량/역학적 시스템 올킬 비법서',
    tag: '고1 통합과학',
    price: '8,900원',
    discount: '25% OFF',
    prodId: 'prod_2'
  },
  {
    title: '[수능형 변형 고난도] 6·9월 모평 기반 과탐 융합 40제',
    author: '김사이언스 (EBS 연계 변형)',
    desc: 'HWP 원본 한글 파일(수식 편집 완료) 즉시 제공! 시험 출제 시간 80% 단축',
    tag: '수능형 변형',
    price: '11,000원',
    discount: '26% OFF',
    prodId: 'prod_3'
  },
  {
    title: '[2025 개정] 중1 과학 지권의 변화 & 생물다양성 80제',
    author: '박에듀 LAB',
    desc: '5종 교과서 핵심 마인드맵 및 직전 3일 벼락치기 족보 세트',
    tag: '중등 내신',
    price: '4,900원',
    discount: '30% OFF',
    prodId: 'prod_1'
  }
];

function initHomeCarousel() {
  updateCarouselSlide();
  if (appState.bannerTimer) clearInterval(appState.bannerTimer);
  appState.bannerTimer = setInterval(() => {
    nextBannerSlide();
  }, 5000);
}

function updateCarouselSlide() {
  const container = document.getElementById('carouselSlideContent');
  const counter = document.getElementById('carouselCounter');
  const dots = document.getElementById('carouselDots');
  if (!container) return;

  const current = CAROUSEL_SLIDES[appState.currentBannerIndex];
  if (counter) counter.textContent = `${appState.currentBannerIndex + 1} / ${CAROUSEL_SLIDES.length}`;

  container.innerHTML = `
    <div class="fade-in space-y-3 cursor-pointer" onclick="navigateTo('product-detail', '${current.prodId}')">
      <div class="flex items-center gap-2">
        <span class="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[11px] font-bold">${current.tag}</span>
        <span class="text-xs text-slate-400">${current.author}</span>
      </div>
      <h3 class="text-lg sm:text-xl font-bold text-white hover:text-teal-300 transition leading-snug">
        ${current.title}
      </h3>
      <p class="text-xs text-slate-300 line-clamp-2 leading-relaxed">
        ${current.desc}
      </p>
      <div class="flex items-baseline justify-between pt-2">
        <div class="flex items-baseline gap-2">
          <span class="text-sm font-bold text-red-400">${current.discount}</span>
          <span class="text-xl font-black text-white">${current.price}</span>
        </div>
        <span class="text-xs font-semibold text-teal-400 flex items-center gap-1">
          자세히 보기 <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
        </span>
      </div>
    </div>
  `;

  if (dots) {
    dots.innerHTML = CAROUSEL_SLIDES.map((_, i) => 
      `<span class="w-${i === appState.currentBannerIndex ? '6' : '2'} h-1.5 rounded-full ${i === appState.currentBannerIndex ? 'bg-teal-500' : 'bg-slate-600'} transition-all"></span>`
    ).join('');
  }

  lucide.createIcons();
}

function nextBannerSlide() {
  appState.currentBannerIndex = (appState.currentBannerIndex + 1) % CAROUSEL_SLIDES.length;
  updateCarouselSlide();
}

function prevBannerSlide() {
  appState.currentBannerIndex = (appState.currentBannerIndex - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length;
  updateCarouselSlide();
}

function filterByAuthor(authorId) {
  const author = MOCK_AUTHORS.find(a => a.id === authorId);
  if (author) {
    appState.filters.search = author.name;
    navigateTo('market');
  }
}

// ==========================================
// 2. 자료 마켓 리스트 화면 (Market List View)
// ==========================================
function renderMarketPage() {
  // 필터링 적용 로직
  let filtered = [...MOCK_PRODUCTS];

  // 1) 학년 필터
  if (appState.filters.grades.length > 0) {
    filtered = filtered.filter(p => appState.filters.grades.includes(p.grade));
  }

  // 2) 영역 필터
  if (appState.filters.areas.length > 0) {
    filtered = filtered.filter(p => appState.filters.areas.includes(p.area));
  }

  // 3) 출판사 필터
  if (appState.filters.publishers.length > 0) {
    filtered = filtered.filter(p => appState.filters.publishers.includes(p.publisher));
  }

  // 4) 검색어 필터
  if (appState.filters.search.trim()) {
    const q = appState.filters.search.toLowerCase().trim();
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.publisher.toLowerCase().includes(q) ||
      p.subject.toLowerCase().includes(q) ||
      p.authorName.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  // 5) 정렬
  if (appState.filters.sort === 'popular') {
    filtered.sort((a, b) => b.downloads - a.downloads);
  } else if (appState.filters.sort === 'latest') {
    filtered.sort((a, b) => b.id.localeCompare(a.id));
  } else if (appState.filters.sort === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (appState.filters.sort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Breadcrumb & Header -->
      <div class="mb-6">
        <div class="flex items-center gap-2 text-xs text-slate-400 mb-2">
          <button onclick="navigateTo('home')" class="hover:text-slate-700">홈</button>
          <span>/</span>
          <span class="text-slate-800 font-semibold">자료 마켓</span>
        </div>
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 class="text-2xl font-black text-slate-900 tracking-tight">전체 교육자료 마켓</h1>
            <p class="text-xs sm:text-sm text-slate-500 mt-1">
              선생님과 학생을 위한 실시간 검증 교재 (총 <span class="font-bold text-teal-600">${filtered.length}</span>개 자료)
            </p>
          </div>

          <!-- Active Filter tags -->
          <div class="flex items-center gap-2">
            ${appState.filters.search ? `
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold">
                검색: "${appState.filters.search}"
                <button onclick="clearSearchFilter()"><i data-lucide="x" class="w-3 h-3"></i></button>
              </span>
            ` : ''}
            <button onclick="resetAllFilters()" class="text-xs text-slate-500 hover:text-slate-800 underline underline-offset-2">
              필터 전체 초기화
            </button>
          </div>
        </div>
      </div>

      <!-- Main Layout: Sidebar Filter + Product Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <!-- LEFT: FILTER BAR -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm sticky top-24 space-y-6">
            
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <span class="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                <i data-lucide="sliders-horizontal" class="w-4 h-4 text-teal-600"></i>
                상세 필터 검색
              </span>
              <button onclick="resetAllFilters()" class="text-[11px] text-teal-600 font-semibold hover:underline">
                초기화
              </button>
            </div>

            <!-- 1. 학년별 필터 -->
            <div>
              <label class="block text-xs font-bold text-slate-800 mb-2.5">학년별 과정</label>
              <div class="space-y-1.5 text-xs text-slate-700">
                ${['중1', '중2', '중3', '고1', '고등'].map(g => `
                  <label class="flex items-center gap-2 cursor-pointer hover:text-teal-600">
                    <input 
                      type="checkbox" 
                      value="${g}" 
                      ${appState.filters.grades.includes(g) ? 'checked' : ''} 
                      onchange="toggleFilter('grades', '${g}')"
                      class="rounded text-teal-600 focus:ring-teal-500"
                    >
                    <span>${g === '고등' ? '고등 수능형' : g + ' 과학'}</span>
                  </label>
                `).join('')}
              </div>
            </div>

            <!-- 2. 영역별 필터 -->
            <div class="pt-4 border-t border-slate-100">
              <label class="block text-xs font-bold text-slate-800 mb-2.5">자료 영역</label>
              <div class="space-y-1.5 text-xs text-slate-700">
                ${['개념노트', '기출문제', '수행평가'].map(a => `
                  <label class="flex items-center gap-2 cursor-pointer hover:text-teal-600">
                    <input 
                      type="checkbox" 
                      value="${a}" 
                      ${appState.filters.areas.includes(a) ? 'checked' : ''} 
                      onchange="toggleFilter('areas', '${a}')"
                      class="rounded text-teal-600 focus:ring-teal-500"
                    >
                    <span>${a}</span>
                  </label>
                `).join('')}
              </div>
            </div>

            <!-- 3. 출판사별 필터 -->
            <div class="pt-4 border-t border-slate-100">
              <label class="block text-xs font-bold text-slate-800 mb-2.5">출판사</label>
              <div class="space-y-1.5 text-xs text-slate-700">
                ${['비상교육', '천재교육', '미래엔', '동아출판', 'EBS'].map(pub => `
                  <label class="flex items-center gap-2 cursor-pointer hover:text-teal-600">
                    <input 
                      type="checkbox" 
                      value="${pub}" 
                      ${appState.filters.publishers.includes(pub) ? 'checked' : ''} 
                      onchange="toggleFilter('publishers', '${pub}')"
                      class="rounded text-teal-600 focus:ring-teal-500"
                    >
                    <span>${pub}</span>
                  </label>
                `).join('')}
              </div>
            </div>

            <!-- Information Banner in Filter -->
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500">
              <div class="font-bold text-slate-700 mb-1 flex items-center gap-1">
                <i data-lucide="info" class="w-3.5 h-3.5 text-teal-600"></i> 저작권 안심 보증
              </div>
              쏠에듀의 모든 자료는 교과서 출판사 제휴 협약 및 원저작자의 정식 등록 승인을 거쳐 제공됩니다.
            </div>

          </div>
        </div>

        <!-- RIGHT: PRODUCT GRID -->
        <div class="lg:col-span-3 space-y-4">
          
          <!-- Top Sort & View count -->
          <div class="bg-white rounded-xl border border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs">
            <span class="text-slate-600 font-medium">
              검색 결과: <strong class="text-slate-900">${filtered.length}</strong>개
            </span>

            <div class="flex items-center gap-2">
              <span class="text-slate-400">정렬:</span>
              <select 
                onchange="changeSort(this.value)" 
                class="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="popular" ${appState.filters.sort === 'popular' ? 'selected' : ''}>인기순 (다운로드 많은순)</option>
                <option value="latest" ${appState.filters.sort === 'latest' ? 'selected' : ''}>최신 등록순</option>
                <option value="price-asc" ${appState.filters.sort === 'price-asc' ? 'selected' : ''}>낮은 가격순</option>
                <option value="rating" ${appState.filters.sort === 'rating' ? 'selected' : ''}>평점 높은순</option>
              </select>
            </div>
          </div>

          <!-- Grid items -->
          ${filtered.length > 0 ? `
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              ${filtered.map(item => renderMarketProductCard(item)).join('')}
            </div>
          ` : `
            <div class="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <i data-lucide="search-x" class="w-6 h-6"></i>
              </div>
              <h3 class="font-bold text-slate-800 text-base">선택한 조건의 자료가 없습니다.</h3>
              <p class="text-xs text-slate-500">필터 조건을 재설정하거나 검색어를 변경해보세요.</p>
              <button onclick="resetAllFilters()" class="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold">
                필터 전체 해제하기
              </button>
            </div>
          `}

        </div>

      </div>

    </div>
  `;
}

// 마켓 상품 카드
function renderMarketProductCard(item) {
  const discountRate = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);

  return `
    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col group">
      
      <!-- Thumbnail wrapper -->
      <div class="relative h-44 overflow-hidden bg-slate-100 cursor-pointer" onclick="navigateTo('product-detail', '${item.id}')">
        <img src="${item.thumbnail}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
        
        <!-- Format Badge -->
        <span class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-extrabold ${item.format === 'HWP' ? 'bg-blue-600 text-white' : 'bg-red-500 text-white'} shadow-sm">
          ${item.format}
        </span>

        <!-- Preview Sample Hover Tag -->
        <div class="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          <span class="px-3 py-1.5 rounded-full bg-white text-slate-900 text-xs font-bold shadow-lg flex items-center gap-1.5">
            <i data-lucide="file-search" class="w-3.5 h-3.5 text-teal-600"></i> 미리보기 샘플 확인
          </span>
        </div>
      </div>

      <!-- Info -->
      <div class="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1.5">
            <span class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">${item.grade}</span>
            <span class="px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 font-semibold">${item.area}</span>
            <span class="text-slate-400">• ${item.publisher}</span>
          </div>

          <h3 onclick="navigateTo('product-detail', '${item.id}')" class="font-bold text-slate-900 text-sm line-clamp-2 leading-snug group-hover:text-teal-600 transition cursor-pointer">
            ${item.title}
          </h3>

          <div class="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
            <i data-lucide="user-check" class="w-3 h-3 text-slate-400"></i> ${item.authorName}
          </div>
        </div>

        <div class="pt-3 mt-3 border-t border-slate-100">
          <div class="flex items-center justify-between text-xs mb-1.5">
            <div class="flex items-center text-amber-500 font-bold text-[11px]">
              <i data-lucide="star" class="w-3 h-3 fill-amber-400 mr-0.5"></i>
              ${item.rating}
              <span class="text-slate-400 font-normal ml-0.5">(${item.reviewCount})</span>
            </div>
            <div class="text-[11px] text-slate-400">
              다운 ${item.downloads.toLocaleString()}
            </div>
          </div>

          <div class="flex items-baseline justify-between">
            <div class="flex items-baseline gap-1.5">
              ${discountRate > 0 ? `<span class="text-red-500 font-black text-sm">${discountRate}%</span>` : ''}
              <span class="text-base font-black text-slate-900">${item.price.toLocaleString()}원</span>
            </div>
            <button onclick="addToCart('${item.id}', event)" title="장바구니 담기" class="p-2 rounded-lg bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-600 transition">
              <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
}

// 필터 토글 핸들러
function toggleFilter(type, value) {
  const arr = appState.filters[type];
  const idx = arr.indexOf(value);
  if (idx > -1) {
    arr.splice(idx, 1);
  } else {
    arr.push(value);
  }
  renderApp();
}

function changeSort(sortVal) {
  appState.filters.sort = sortVal;
  renderApp();
}

function clearSearchFilter() {
  appState.filters.search = '';
  renderApp();
}

function resetAllFilters() {
  appState.filters.grades = [];
  appState.filters.areas = [];
  appState.filters.publishers = [];
  appState.filters.search = '';
  appState.filters.sort = 'popular';
  renderApp();
}

// ==========================================
// 3. 상품 상세 페이지 (Product Detail)
// ==========================================
function renderProductDetailPage() {
  const prod = MOCK_PRODUCTS.find(p => p.id === appState.selectedProductId) || MOCK_PRODUCTS[0];
  const author = MOCK_AUTHORS.find(a => a.id === prod.authorId) || MOCK_AUTHORS[0];
  const reviews = MOCK_REVIEWS.filter(r => r.productId === prod.id);
  const discountRate = Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100);

  const samplePageData = prod.samplePreview.find(s => s.page === appState.previewCurrentPage) || prod.samplePreview[0];

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Breadcrumb -->
      <div class="flex items-center gap-2 text-xs text-slate-400 mb-6">
        <button onclick="navigateTo('home')" class="hover:text-slate-700">홈</button>
        <span>/</span>
        <button onclick="navigateTo('market')" class="hover:text-slate-700">자료 마켓</button>
        <span>/</span>
        <span class="text-slate-800 font-semibold truncate max-w-sm">${prod.title}</span>
      </div>

      <!-- TOP SECTION: Viewer Frame (Left) + Purchase Info (Right) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        
        <!-- LEFT: PDF 1~2 PAGE SAMPLE PREVIEW VIEWER -->
        <div class="lg:col-span-7">
          <div class="bg-white rounded-2xl border border-slate-300 shadow-lg overflow-hidden flex flex-col h-full">
            
            <!-- Viewer Toolbar -->
            <div class="bg-slate-900 text-white px-4 py-3 flex items-center justify-between text-xs">
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded bg-teal-500 font-bold text-[11px] text-white">미리보기</span>
                <span class="text-slate-300 font-medium truncate max-w-xs">${prod.title}</span>
              </div>
              
              <!-- Page Controls -->
              <div class="flex items-center gap-2">
                <span class="text-slate-400 text-[11px]">샘플 페이지:</span>
                <button 
                  onclick="setPreviewPage(1)" 
                  class="px-2.5 py-1 rounded text-xs font-bold transition ${appState.previewCurrentPage === 1 ? 'bg-teal-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}"
                >
                  1 p
                </button>
                <button 
                  onclick="setPreviewPage(2)" 
                  class="px-2.5 py-1 rounded text-xs font-bold transition ${appState.previewCurrentPage === 2 ? 'bg-teal-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}"
                >
                  2 p
                </button>
                <button onclick="openFullPreviewModal('${prod.id}')" title="전체화면 크게보기" class="ml-2 p-1 text-slate-400 hover:text-white">
                  <i data-lucide="maximize-2" class="w-4 h-4"></i>
                </button>
              </div>
            </div>

            <!-- Viewer Paper Surface (Watermarked) -->
            <div class="p-6 md:p-8 bg-slate-100 flex-1 flex flex-col justify-center items-center">
              <div class="w-full max-w-xl bg-white shadow-xl rounded-lg border border-slate-200 p-6 md:p-8 min-h-[460px] sample-watermark relative flex flex-col justify-between select-none">
                
                <!-- Document Header -->
                <div>
                  <div class="flex justify-between items-center border-b pb-2 mb-4 text-[11px] text-slate-400 font-mono">
                    <span>SOLVEDU STUDY PAPER • [${prod.grade}] ${prod.subject}</span>
                    <span>PAGE 0${samplePageData.page} / 0${prod.samplePreview.length} (샘플본)</span>
                  </div>

                  <h4 class="text-base font-extrabold text-[#1A365D] mb-4 pb-2 border-b-2 border-teal-500/30">
                    ${samplePageData.title}
                  </h4>

                  <!-- Document Text Body -->
                  <div class="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans whitespace-pre-line space-y-3">
                    ${samplePageData.text}
                  </div>
                </div>

                <!-- Document Footer in Preview -->
                <div class="mt-8 pt-3 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-400">
                  <span>저작권 등록: SolvEdu License Verified</span>
                  <span class="text-red-500 font-semibold">※ 3페이지부터는 구매 후 전체 열람 및 다운로드가 가능합니다.</span>
                </div>

              </div>
            </div>

            <!-- Viewer Bottom Notice -->
            <div class="bg-slate-50 border-t border-slate-200 px-4 py-2.5 text-xs text-slate-500 flex items-center justify-between">
              <span class="flex items-center gap-1.5">
                <i data-lucide="lock" class="w-3.5 h-3.5 text-slate-400"></i>
                전체 ${prod.pages}페이지 중 샘플 2페이지만 무료로 열람 가능합니다.
              </span>
              <button onclick="setPreviewPage(${appState.previewCurrentPage === 1 ? 2 : 1})" class="text-teal-600 font-bold hover:underline">
                다음 샘플 페이지 보기 &rarr;
              </button>
            </div>

          </div>
        </div>

        <!-- RIGHT: PRODUCT PURCHASE INFO -->
        <div class="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            
            <!-- Metadata badges -->
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-2 py-0.5 rounded bg-teal-50 text-teal-700 font-bold text-xs">${prod.grade}</span>
              <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-xs">${prod.subject}</span>
              <span class="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-xs">${prod.publisher}</span>
              <span class="px-2 py-0.5 rounded ${prod.format === 'HWP' ? 'bg-blue-600 text-white' : 'bg-red-500 text-white'} font-black text-xs">
                ${prod.format} 포맷
              </span>
            </div>

            <!-- Title -->
            <h1 class="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              ${prod.title}
            </h1>

            <!-- Author Card Brief -->
            <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <img src="${author.avatar}" alt="${author.name}" class="w-12 h-12 rounded-full object-cover border border-teal-400">
              <div class="flex-1">
                <div class="flex items-center gap-1.5">
                  <span class="font-bold text-slate-900 text-sm">${author.name}</span>
                  <span class="text-[10px] bg-teal-600 text-white px-1.5 py-0.5 rounded font-bold">${author.badge}</span>
                </div>
                <p class="text-xs text-slate-500">${author.intro}</p>
              </div>
            </div>

            <!-- Details Table -->
            <div class="grid grid-cols-2 gap-3 text-xs bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
              <div>
                <span class="text-slate-400 block mb-0.5">총 분량</span>
                <span class="font-bold text-slate-800">${prod.pages} 페이지</span>
              </div>
              <div>
                <span class="text-slate-400 block mb-0.5">파일 형식</span>
                <span class="font-bold text-slate-800">${prod.format} 전자문서</span>
              </div>
              <div>
                <span class="text-slate-400 block mb-0.5">다운로드 허용 횟수</span>
                <span class="font-bold text-slate-800">구매일로부터 무제한</span>
              </div>
              <div>
                <span class="text-slate-400 block mb-0.5">누적 다운로드</span>
                <span class="font-bold text-teal-600">${prod.downloads.toLocaleString()}회</span>
              </div>
            </div>

            <!-- Pricing Section -->
            <div class="pt-2 border-t border-slate-100">
              <div class="flex items-center gap-2 text-xs text-slate-400 line-through">
                정상가 ${prod.originalPrice.toLocaleString()}원
              </div>
              <div class="flex items-baseline gap-2 mt-1">
                <span class="text-2xl font-black text-red-500">${discountRate}%</span>
                <span class="text-3xl font-black text-slate-900">${prod.price.toLocaleString()}</span>
                <span class="text-lg font-bold text-slate-800">원</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="grid grid-cols-2 gap-3 pt-2">
              <button onclick="addToCart('${prod.id}')" class="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition text-sm flex items-center justify-center gap-1.5 border border-slate-200">
                <i data-lucide="shopping-cart" class="w-4 h-4"></i>
                장바구니 담기
              </button>
              <button onclick="buyNow('${prod.id}')" class="w-full py-3.5 bg-[#1A365D] hover:bg-[#132a4a] text-white font-extrabold rounded-xl transition text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-blue-950/20">
                <i data-lucide="zap" class="w-4 h-4 text-teal-300"></i>
                바로 구매하기
              </button>
            </div>

            <!-- Legal / Trust Notice -->
            <div class="flex items-center gap-2 text-[11px] text-slate-500 justify-center pt-1">
              <i data-lucide="shield-check" class="w-4 h-4 text-teal-600"></i>
              쏠북 합법 저작권 라이선싱 보증 (출판사 정식 계약)
            </div>

          </div>
        </div>

      </div>

      <!-- BOTTOM TABS: Description / Reviews / Copyright Notice -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        <!-- Tab Navigation Buttons -->
        <div class="flex border-b border-slate-200 bg-slate-50 text-sm font-bold">
          <button 
            onclick="setDetailTab('intro')" 
            class="flex-1 py-4 text-center border-b-2 transition ${appState.detailActiveTab === 'intro' ? 'border-teal-600 text-teal-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'}"
          >
            자료 소개 및 목차
          </button>
          <button 
            onclick="setDetailTab('reviews')" 
            class="flex-1 py-4 text-center border-b-2 transition ${appState.detailActiveTab === 'reviews' ? 'border-teal-600 text-teal-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'}"
          >
            사용자 리뷰 (${reviews.length})
          </button>
          <button 
            onclick="setDetailTab('copyright')" 
            class="flex-1 py-4 text-center border-b-2 transition ${appState.detailActiveTab === 'copyright' ? 'border-teal-600 text-teal-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'}"
          >
            저작권 안내 및 환불 규정
          </button>
        </div>

        <!-- Tab Body -->
        <div class="p-6 md:p-8">
          ${renderDetailTabContent(prod, reviews)}
        </div>

      </div>

    </div>
  `;
}

// 탭 콘텐츠 렌더링
function renderDetailTabContent(prod, reviews) {
  if (appState.detailActiveTab === 'intro') {
    return `
      <div class="space-y-8 max-w-4xl">
        <!-- Introduction -->
        <div>
          <h3 class="text-base font-extrabold text-slate-900 mb-3 flex items-center gap-2">
            <i data-lucide="file-text" class="w-5 h-5 text-teal-600"></i> 자료 상세 안내
          </h3>
          <p class="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-5 rounded-xl border border-slate-100">
            ${prod.description}
          </p>
        </div>

        <!-- Table of Contents -->
        <div>
          <h3 class="text-base font-extrabold text-slate-900 mb-3 flex items-center gap-2">
            <i data-lucide="list-ordered" class="w-5 h-5 text-teal-600"></i> 상세 목차 및 구성
          </h3>
          <div class="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            ${prod.tableOfContents.map((toc, i) => `
              <div class="p-3.5 bg-white flex items-center gap-3 text-xs sm:text-sm text-slate-700 hover:bg-slate-50">
                <span class="w-6 h-6 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center text-xs">${i + 1}</span>
                <span>${toc}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Recommended Targets -->
        <div>
          <h3 class="text-base font-extrabold text-slate-900 mb-3 flex items-center gap-2">
            <i data-lucide="target" class="w-5 h-5 text-teal-600"></i> 이런 분들께 추천합니다
          </h3>
          <ul class="space-y-2 text-xs sm:text-sm text-slate-600">
            <li class="flex items-center gap-2">
              <i data-lucide="check-circle-2" class="w-4 h-4 text-teal-500"></i>
              학교 시험 직전 핵심 개념만 빠르게 단권화하고 싶은 중·고등학생
            </li>
            <li class="flex items-center gap-2">
              <i data-lucide="check-circle-2" class="w-4 h-4 text-teal-500"></i>
              수업 보충 프린트 및 모의고사 출제 시간을 획기적으로 줄이고 싶은 학교/학원 교사
            </li>
            <li class="flex items-center gap-2">
              <i data-lucide="check-circle-2" class="w-4 h-4 text-teal-500"></i>
              합법적이고 저작권 분쟁 없는 안전한 고품질 교육 콘텐츠가 필요한 모든 분
            </li>
          </ul>
        </div>
      </div>
    `;
  }

  if (appState.detailActiveTab === 'reviews') {
    return `
      <div class="space-y-6 max-w-4xl">
        <!-- Review Rating Summary -->
        <div class="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col sm:flex-row items-center gap-6">
          <div class="text-center sm:text-left">
            <div class="text-4xl font-black text-slate-900">${prod.rating}</div>
            <div class="flex text-amber-400 justify-center sm:justify-start my-1">
              ★★★★★
            </div>
            <div class="text-xs text-slate-400">총 ${reviews.length}개의 실제 구매 후기</div>
          </div>
          <div class="flex-1 w-full space-y-1.5 text-xs text-slate-600">
            <div class="flex items-center gap-2">
              <span>5점</span>
              <div class="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                <div class="bg-amber-400 h-full w-[90%]"></div>
              </div>
              <span>90%</span>
            </div>
            <div class="flex items-center gap-2">
              <span>4점</span>
              <div class="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                <div class="bg-amber-400 h-full w-[10%]"></div>
              </div>
              <span>10%</span>
            </div>
          </div>
          <div>
            <button onclick="openReviewModal('${prod.id}')" class="px-4 py-2.5 bg-[#1A365D] text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition">
              리뷰 작성하기
            </button>
          </div>
        </div>

        <!-- Review List -->
        <div class="space-y-4 pt-2">
          ${reviews.map(rev => `
            <div class="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <div class="flex items-center justify-between text-xs">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-slate-800">${rev.authorName}</span>
                  <span class="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">${rev.role}</span>
                  <span class="text-amber-500 font-bold">★ ${rev.rating}</span>
                </div>
                <span class="text-slate-400 text-[11px]">${rev.date}</span>
              </div>
              <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">
                ${rev.content}
              </p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (appState.detailActiveTab === 'copyright') {
    return `
      <div class="space-y-6 max-w-4xl text-xs sm:text-sm text-slate-700 leading-relaxed">
        <!-- 쏠북 벤치마킹 저작권 가이드 -->
        <div class="p-5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-950 space-y-2">
          <h4 class="font-extrabold text-teal-900 flex items-center gap-2 text-sm">
            <i data-lucide="shield-check" class="w-5 h-5 text-teal-600"></i>
            쏠북(Solvook) 모델 기반의 합법적 교육 저작권 이용 안내
          </h4>
          <p>
            본 플랫폼 'SolvEdu'에 등록된 교육 콘텐츠는 교과서 출판사 및 원저작자와의 정식 디지털 라이선스 협약에 따라 판매됩니다.
            구매자는 구매한 자료를 <strong>개인 학습용(학생)</strong> 또는 <strong>소속 학급/강좌의 수업 보충 지도용(교사/강사)</strong>으로 합법적으로 활용하실 수 있습니다.
          </p>
        </div>

        <div class="space-y-4 pt-2">
          <div class="border-b pb-3">
            <h5 class="font-bold text-slate-900 mb-1">1. 저작권 침해 금지 조항</h5>
            <p class="text-slate-600 text-xs">
              구매한 파일(PDF, HWP)을 온라인 커뮤니티, 카페, P2P 사이트, SNS 등에 무단 유포하거나 제3자에게 유상 재판매하는 행위는 저작권법 제136조에 따라 최대 5년 이하의 징역 또는 5천만 원 이하의 벌금에 처해질 수 있습니다.
            </p>
          </div>

          <div class="border-b pb-3">
            <h5 class="font-bold text-slate-900 mb-1">2. 취소 및 환불 정책 (디지털 콘텐츠 규정)</h5>
            <p class="text-slate-600 text-xs">
              전자상거래 등에서의 소비자보호에 관한 법률 제17조 제2항에 따라, 결제 완료 후 <strong>파일을 다운로드(열람)한 즉시 콘텐츠 제공이 개시</strong>되므로 원칙적으로 단순 변심에 의한 환불이 불가합니다. 단, 파일에 기술적 오류가 있거나 설명과 중대한 차이가 있는 경우 7일 이내 고객센터 문의 시 환불 가능합니다.
            </p>
          </div>

          <div>
            <h5 class="font-bold text-slate-900 mb-1">3. 파일 다운로드 및 유효 기간</h5>
            <p class="text-slate-600 text-xs">
              구매 완료된 자료는 상단 메뉴의 [자료 보관함]에서 기간 제한 없이 언제든지 다시 다운로드하실 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    `;
  }
}

function setPreviewPage(p) {
  appState.previewCurrentPage = p;
  renderApp();
}

function setDetailTab(tab) {
  appState.detailActiveTab = tab;
  renderApp();
}

// ==========================================
// 4. 창작자 전용 시스템 (Seller/Author Dashboard)
// ==========================================
function renderSellerDashboardPage() {
  const stats = MOCK_SELLER_STATS;

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Dashboard Top Header -->
      <div class="bg-gradient-to-r from-[#1A365D] to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" class="w-16 h-16 rounded-2xl object-cover border-2 border-teal-400 p-0.5">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xl sm:text-2xl font-black">정원석T 창작자 스튜디오</span>
                <span class="bg-teal-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">공인 저자</span>
              </div>
              <p class="text-xs text-slate-300 mt-1">대치동 과학전문 연구팀 • 마이 쏠북 파트너</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="setSellerTab('upload')" class="px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md">
              <i data-lucide="plus-circle" class="w-4 h-4"></i> 신규 자료 등록
            </button>
            <button onclick="alert('이번 달 정산금 지급 신청이 접수되었습니다. (영업일 기준 2일 내 입금)')" class="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition">
              정산금 출금 신청
            </button>
          </div>
        </div>

        <!-- 4 Summary KPI Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-700/80">
          <div class="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50">
            <span class="text-xs text-slate-400 block mb-1">이번 달 누적 판매액</span>
            <span class="text-xl sm:text-2xl font-black text-white">${stats.monthlyRevenue.toLocaleString()}원</span>
          </div>
          <div class="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50">
            <span class="text-xs text-slate-400 block mb-1">정산 예정 잔액 (수수료 제외)</span>
            <span class="text-xl sm:text-2xl font-black text-teal-400">${stats.pendingSettlement.toLocaleString()}원</span>
          </div>
          <div class="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50">
            <span class="text-xs text-slate-400 block mb-1">누적 판매 건수</span>
            <span class="text-xl sm:text-2xl font-black text-white">${stats.totalSalesVolume} 부</span>
          </div>
          <div class="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50">
            <span class="text-xs text-slate-400 block mb-1">등록 자료 수 / 평점</span>
            <span class="text-xl sm:text-2xl font-black text-amber-400">${appState.sellerItems.length}개 / ★ ${stats.averageRating}</span>
          </div>
        </div>
      </div>

      <!-- Dashboard Navigation Tabs -->
      <div class="flex border-b border-slate-200 mb-6 text-sm font-bold">
        <button 
          onclick="setSellerTab('stats')" 
          class="pb-3 px-4 border-b-2 transition flex items-center gap-1.5 ${appState.sellerActiveTab === 'stats' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-800'}"
        >
          <i data-lucide="bar-chart-3" class="w-4 h-4"></i>
          판매 대금 정산 내역 및 통계
        </button>
        <button 
          onclick="setSellerTab('upload')" 
          class="pb-3 px-4 border-b-2 transition flex items-center gap-1.5 ${appState.sellerActiveTab === 'upload' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-800'}"
        >
          <i data-lucide="file-up" class="w-4 h-4"></i>
          자료 업로드 (PDF/HWP)
        </button>
        <button 
          onclick="setSellerTab('manage')" 
          class="pb-3 px-4 border-b-2 transition flex items-center gap-1.5 ${appState.sellerActiveTab === 'manage' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-800'}"
        >
          <i data-lucide="folder-cog" class="w-4 h-4"></i>
          내 자료 관리 및 가격 수정
        </button>
      </div>

      <!-- Dashboard Tab Content -->
      <div>
        ${renderSellerDashboardTabContent()}
      </div>

    </div>
  `;
}

function setSellerTab(tab) {
  appState.sellerActiveTab = tab;
  renderApp();
}

function renderSellerDashboardTabContent() {
  const stats = MOCK_SELLER_STATS;

  if (appState.sellerActiveTab === 'stats') {
    return `
      <div class="space-y-8">
        
        <!-- Chart Canvas Frame -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-base font-bold text-slate-900">최근 6개월 판매 매출 추이 (원)</h3>
              <p class="text-xs text-slate-400">쏠북 판매자 정산 시스템 실시간 연동</p>
            </div>
            <span class="text-xs font-semibold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">
              전월 대비 +18.4% 상승
            </span>
          </div>

          <div class="h-64 sm:h-72 w-full">
            <canvas id="sellerRevenueChart"></canvas>
          </div>
        </div>

        <!-- Recent Settlements Table -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-bold text-slate-900">실시간 주문 & 정산 내역</h3>
            <span class="text-xs text-slate-400">플랫폼 중개 수수료 10% 제외 후 정산</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-500 font-semibold border-y border-slate-100">
                <tr>
                  <th class="py-3 px-3">결제일시</th>
                  <th class="py-3 px-3">상품명</th>
                  <th class="py-3 px-3">단가</th>
                  <th class="py-3 px-3">수량</th>
                  <th class="py-3 px-3">수수료(10%)</th>
                  <th class="py-3 px-3 font-bold text-slate-700">실 정산금</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-700">
                ${stats.recentSales.map(sale => `
                  <tr class="hover:bg-slate-50">
                    <td class="py-3 px-3 text-slate-400">${sale.date}</td>
                    <td class="py-3 px-3 font-medium text-slate-900">${sale.title}</td>
                    <td class="py-3 px-3">${sale.price.toLocaleString()}원</td>
                    <td class="py-3 px-3">${sale.qty}건</td>
                    <td class="py-3 px-3 text-red-500">-${sale.fee.toLocaleString()}원</td>
                    <td class="py-3 px-3 font-black text-teal-600">+${sale.net.toLocaleString()}원</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  }

  if (appState.sellerActiveTab === 'upload') {
    return `
      <div class="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm max-w-3xl space-y-6">
        <div>
          <h3 class="text-lg font-black text-slate-900">새 교육 자료 업로드</h3>
          <p class="text-xs text-slate-500 mt-1">
            PDF 또는 HWP 한글 원본 파일을 첨부하고 자료 정보를 입력하세요. (등록 즉시 마켓 판매 개시)
          </p>
        </div>

        <form onsubmit="handleUploadSubmit(event)" class="space-y-5 text-xs sm:text-sm">
          
          <!-- File Dropzone -->
          <div>
            <label class="block font-bold text-slate-800 mb-2">원문 파일 첨부 (PDF / HWP)</label>
            <div 
              id="fileDropzone"
              class="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-2xl p-6 text-center bg-slate-50 hover:bg-teal-50/30 transition cursor-pointer"
              onclick="document.getElementById('fileUploadInput').click()"
            >
              <i data-lucide="upload-cloud" class="w-8 h-8 text-teal-600 mx-auto mb-2"></i>
              <div class="font-bold text-slate-700" id="uploadFileName">파일을 드래그하거나 클릭하여 업로드하세요</div>
              <p class="text-slate-400 text-xs mt-1">PDF, HWP, HWPX 파일 지원 (최대 100MB)</p>
              <input type="file" id="fileUploadInput" class="hidden" accept=".pdf,.hwp,.hwpx" onchange="handleFileSelected(this)">
            </div>
          </div>

          <!-- Title -->
          <div>
            <label class="block font-bold text-slate-800 mb-1">자료 제목</label>
            <input 
              type="text" 
              id="uploadTitle" 
              required 
              placeholder="예: [2025 중간고사] 고1 통합과학 역학 시스템 킬러 80제 (한글 원본)"
              class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 text-xs sm:text-sm"
            >
          </div>

          <!-- Category Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block font-bold text-slate-800 mb-1">대상 학년</label>
              <select id="uploadGrade" class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm">
                <option value="중1">중1</option>
                <option value="중2">중2</option>
                <option value="중3">중3</option>
                <option value="고1" selected>고1</option>
                <option value="고등">고등(수능)</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-800 mb-1">영역</label>
              <select id="uploadArea" class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm">
                <option value="기출문제">기출문제</option>
                <option value="개념노트">개념노트</option>
                <option value="수행평가">수행평가</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-800 mb-1">출판사</label>
              <select id="uploadPublisher" class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm">
                <option value="비상교육">비상교육</option>
                <option value="천재교육">천재교육</option>
                <option value="미래엔">미래엔</option>
                <option value="동아출판">동아출판</option>
                <option value="EBS">EBS</option>
              </select>
            </div>
          </div>

          <!-- Price & Format -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-800 mb-1">판매 희망 가격 (원)</label>
              <input 
                type="number" 
                id="uploadPrice" 
                required 
                value="5900" 
                step="100"
                class="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm"
              >
            </div>
            <div>
              <label class="block font-bold text-slate-800 mb-1">파일 포맷</label>
              <select id="uploadFormat" class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm">
                <option value="PDF">PDF 전용 (열람/인쇄)</option>
                <option value="HWP">HWP 한글 원본 (수정 가능)</option>
              </select>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block font-bold text-slate-800 mb-1">자료 상세 설명</label>
            <textarea 
              id="uploadDesc" 
              rows="3" 
              required
              placeholder="자료의 특징, 적중률, 출제 의도, 교사용 활용 팁을 상세히 적어주세요."
              class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 text-xs sm:text-sm"
            ></textarea>
          </div>

          <!-- Submit -->
          <button type="submit" class="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl transition shadow-md flex items-center justify-center gap-2">
            <i data-lucide="check" class="w-4 h-4"></i> 자료 등록 및 판매 승인 신청
          </button>
        </form>
      </div>
    `;
  }

  if (appState.sellerActiveTab === 'manage') {
    return `
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 class="text-base font-bold text-slate-900">등록 자료 관리 및 실시간 가격 수정</h3>
            <p class="text-xs text-slate-400">판매 가격을 직접 수정하면 마켓플레이스에 즉시 반영됩니다.</p>
          </div>
          <span class="text-xs text-slate-500">총 ${appState.sellerItems.length}개 등록됨</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th class="py-3 px-3">포맷</th>
                <th class="py-3 px-3">자료 제목</th>
                <th class="py-3 px-3">과정/영역</th>
                <th class="py-3 px-3">판매가 (직접 수정)</th>
                <th class="py-3 px-3">다운로드</th>
                <th class="py-3 px-3 text-center">관리</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              ${appState.sellerItems.map(item => `
                <tr class="hover:bg-slate-50">
                  <td class="py-3 px-3">
                    <span class="px-1.5 py-0.5 rounded text-[10px] font-bold ${item.format === 'HWP' ? 'bg-blue-600 text-white' : 'bg-red-500 text-white'}">
                      ${item.format}
                    </span>
                  </td>
                  <td class="py-3 px-3 font-medium text-slate-900 max-w-xs truncate">
                    ${item.title}
                  </td>
                  <td class="py-3 px-3 text-slate-500">
                    ${item.grade} • ${item.area}
                  </td>
                  <td class="py-3 px-3">
                    <div class="flex items-center gap-1">
                      <input 
                        type="number" 
                        value="${item.price}" 
                        id="price_input_${item.id}"
                        class="w-20 px-2 py-1 border border-slate-300 rounded text-xs font-bold"
                      >
                      <button onclick="updateItemPrice('${item.id}')" class="px-2 py-1 bg-teal-600 text-white rounded text-[11px] font-semibold hover:bg-teal-700">
                        저장
                      </button>
                    </div>
                  </td>
                  <td class="py-3 px-3 text-slate-500">
                    ${item.downloads.toLocaleString()}회
                  </td>
                  <td class="py-3 px-3 text-center">
                    <button onclick="deleteSellerItem('${item.id}')" class="text-red-500 hover:text-red-700 text-xs font-semibold">
                      삭제
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
}

// Chart.js 초기화
function initSellerChart() {
  const ctx = document.getElementById('sellerRevenueChart');
  if (!ctx) return;

  const chartData = MOCK_SELLER_STATS.monthlyChart;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.labels,
      datasets: [{
        label: '월별 정산 매출액 (원)',
        data: chartData.revenues,
        borderColor: '#0D9488',
        backgroundColor: 'rgba(13, 148, 136, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#1A365D',
        pointRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          ticks: {
            callback: value => (value / 10000).toLocaleString() + '만 원'
          },
          grid: { color: '#f1f5f9' }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
}

function handleFileSelected(input) {
  if (input.files && input.files[0]) {
    document.getElementById('uploadFileName').textContent = `선택된 파일: ${input.files[0].name} (${(input.files[0].size / 1024 / 1024).toFixed(1)}MB)`;
  }
}

function handleUploadSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('uploadTitle').value;
  const grade = document.getElementById('uploadGrade').value;
  const area = document.getElementById('uploadArea').value;
  const publisher = document.getElementById('uploadPublisher').value;
  const price = parseInt(document.getElementById('uploadPrice').value, 10);
  const format = document.getElementById('uploadFormat').value;
  const desc = document.getElementById('uploadDesc').value;

  const newItem = {
    id: 'prod_' + (Date.now()),
    title: title,
    grade: grade,
    subject: grade.startsWith('중') ? '과학' : '통합과학',
    publisher: publisher,
    area: area,
    price: price,
    originalPrice: Math.round(price * 1.3),
    rating: 5.0,
    reviewCount: 0,
    authorId: 'author_1',
    authorName: '정원석T',
    format: format,
    pages: 35,
    downloads: 1,
    isPopular: false,
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
    tags: [grade, area, publisher],
    description: desc,
    tableOfContents: ['1장: 핵심 단원 총정리', '2장: 실전 대비 문항 50선', '3장: 정답 및 해설'],
    samplePreview: [
      { page: 1, title: '등록 자료 1페이지 샘플', text: '방금 업로드된 ' + title + ' 미리보기 본문입니다.' },
      { page: 2, title: '등록 자료 2페이지 샘플', text: '정답 및 상세 해설 문항이 포함되어 있습니다.' }
    ]
  };

  MOCK_PRODUCTS.unshift(newItem);
  appState.sellerItems.unshift(newItem);

  showToast('신규 자료가 성공적으로 등록되었습니다!', 'success');
  setSellerTab('manage');
}

function updateItemPrice(id) {
  const input = document.getElementById(`price_input_${id}`);
  const newPrice = parseInt(input.value, 10);
  const item = MOCK_PRODUCTS.find(p => p.id === id);
  if (item) {
    item.price = newPrice;
    showToast(`"${item.title.substring(0, 15)}..." 가격이 ${newPrice.toLocaleString()}원으로 변경되었습니다.`, 'success');
    renderApp();
  }
}

function deleteSellerItem(id) {
  if (confirm('정말로 이 자료를 마켓에서 삭제하시겠습니까?')) {
    const idx = MOCK_PRODUCTS.findIndex(p => p.id === id);
    if (idx > -1) MOCK_PRODUCTS.splice(idx, 1);
    appState.sellerItems = appState.sellerItems.filter(i => i.id !== id);
    showToast('자료가 삭제되었습니다.', 'info');
    renderApp();
  }
}

// ==========================================
// 5. 자료 보관함 화면 (Purchased Library)
// ==========================================
function renderLibraryPage() {
  const purchased = MOCK_PRODUCTS.filter(p => appState.purchasedProducts.includes(p.id));

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div class="mb-6">
        <h1 class="text-2xl font-black text-slate-900">내 자료 보관함</h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          구매 완료된 교육 자료는 언제든지 열람 및 무제한 다운로드가 가능합니다.
        </p>
      </div>

      ${purchased.length > 0 ? `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${purchased.map(item => `
            <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between text-xs mb-2">
                  <span class="px-2 py-0.5 rounded font-bold ${item.format === 'HWP' ? 'bg-blue-600 text-white' : 'bg-red-500 text-white'}">
                    ${item.format}
                  </span>
                  <span class="text-teal-600 font-semibold flex items-center gap-1">
                    <i data-lucide="check-circle" class="w-3.5 h-3.5"></i> 평생 소장
                  </span>
                </div>
                <h3 class="font-bold text-slate-900 text-sm leading-snug line-clamp-2">${item.title}</h3>
                <p class="text-xs text-slate-400 mt-1">${item.authorName} • 총 ${item.pages}페이지</p>
              </div>

              <div class="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button onclick="downloadMaterialFile('${item.id}', '${item.format}')" class="flex-1 py-2.5 bg-[#1A365D] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow">
                  <i data-lucide="download" class="w-4 h-4"></i> 다운로드 (${item.format})
                </button>
                <button onclick="navigateTo('product-detail', '${item.id}')" class="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition" title="자료 상세 보기">
                  <i data-lucide="eye" class="w-4 h-4"></i>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      ` : `
        <div class="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <i data-lucide="folder-open" class="w-12 h-12 text-slate-300 mx-auto"></i>
          <h3 class="font-bold text-slate-800 text-base">보관함에 보관된 자료가 없습니다.</h3>
          <p class="text-xs text-slate-500">마켓에서 필요한 자료를 구매하시면 여기에 보관됩니다.</p>
          <button onclick="navigateTo('market')" class="px-5 py-2.5 bg-[#1A365D] text-white rounded-xl text-xs font-bold">
            자료 마켓 둘러보기
          </button>
        </div>
      `}

    </div>
  `;
}

function downloadMaterialFile(id, format) {
  const item = MOCK_PRODUCTS.find(p => p.id === id);
  showToast(`[다운로드 완료] ${item?.title.substring(0, 20)}... (${format}) 파일이 다운로드되었습니다.`, 'success');
}

// ==========================================
// 장바구니 & 모달 인터랙션 (Cart & Checkout)
// ==========================================
function addToCart(prodId, event) {
  if (event) event.stopPropagation();

  const prod = MOCK_PRODUCTS.find(p => p.id === prodId);
  if (!prod) return;

  const existing = appState.cart.find(c => c.id === prodId);
  if (existing) {
    showToast('이미 장바구니에 담긴 자료입니다.', 'info');
  } else {
    appState.cart.push({ ...prod, qty: 1 });
    showToast(`"${prod.title.substring(0, 18)}..." 장바구니에 담겼습니다.`, 'success');
  }

  updateCartBadge();
  renderCartDrawer();
}

function buyNow(prodId) {
  addToCart(prodId);
  toggleCartDrawer(true);
}

function updateCartBadge() {
  const badge = document.getElementById('cartCountBadge');
  const count = appState.cart.length;
  if (badge) {
    badge.textContent = count;
    badge.className = count > 0 
      ? 'absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow'
      : 'hidden';
  }
}

function toggleCartDrawer(show) {
  const drawer = document.getElementById('cartDrawer');
  if (show) {
    drawer.classList.remove('opacity-0', 'pointer-events-none');
    renderCartDrawer();
  } else {
    drawer.classList.add('opacity-0', 'pointer-events-none');
  }
}

function renderCartDrawer() {
  const container = document.getElementById('cartItemList');
  const countSpan = document.getElementById('cartDrawerCount');
  const subtotalEl = document.getElementById('cartSubtotal');
  const discountEl = document.getElementById('cartDiscount');
  const totalEl = document.getElementById('cartTotal');

  if (countSpan) countSpan.textContent = appState.cart.length;

  if (appState.cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 space-y-3">
        <i data-lucide="shopping-bag" class="w-12 h-12 text-slate-300 mx-auto"></i>
        <p class="text-xs text-slate-500">장바구니가 비어 있습니다.</p>
        <button onclick="toggleCartDrawer(false); navigateTo('market')" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700">
          인기 자료 구경하러 가기
        </button>
      </div>
    `;
    subtotalEl.textContent = '0원';
    discountEl.textContent = '-0원';
    totalEl.textContent = '0원';
    lucide.createIcons();
    return;
  }

  let totalOriginal = 0;
  let totalFinal = 0;

  container.innerHTML = appState.cart.map(item => {
    totalOriginal += item.originalPrice;
    totalFinal += item.price;
    return `
      <div class="flex gap-3 pb-3 border-b border-slate-100 items-start">
        <div class="w-14 h-14 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
          <img src="${item.thumbnail}" class="w-full h-full object-cover">
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="text-xs font-bold text-slate-900 truncate">${item.title}</h4>
          <div class="text-[11px] text-slate-400 mt-0.5">${item.grade} • ${item.format}</div>
          <div class="flex items-baseline justify-between mt-1">
            <span class="text-xs font-extrabold text-teal-700">${item.price.toLocaleString()}원</span>
            <button onclick="removeFromCart('${item.id}')" class="text-[11px] text-red-500 hover:underline">삭제</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  subtotalEl.textContent = totalOriginal.toLocaleString() + '원';
  discountEl.textContent = '-' + (totalOriginal - totalFinal).toLocaleString() + '원';
  totalEl.textContent = totalFinal.toLocaleString() + '원';

  lucide.createIcons();
}

function removeFromCart(id) {
  appState.cart = appState.cart.filter(c => c.id !== id);
  updateCartBadge();
  renderCartDrawer();
}

function checkoutCart() {
  if (appState.cart.length === 0) {
    alert('장바구니가 비어 있습니다.');
    return;
  }

  // 구매 완료 처리
  appState.cart.forEach(item => {
    if (!appState.purchasedProducts.includes(item.id)) {
      appState.purchasedProducts.push(item.id);
    }
  });

  const boughtCount = appState.cart.length;
  appState.cart = [];
  updateCartBadge();
  toggleCartDrawer(false);

  showToast(`결제가 성공적으로 완료되었습니다! (${boughtCount}건 구매 완료)`, 'success');
  navigateTo('library');
}

// ==========================================
// 모달 & 토스트 유틸리티 (Modals & Toast)
// ==========================================
function toggleAuthModal(show) {
  const modal = document.getElementById('authModal');
  if (show) modal.classList.remove('hidden');
  else modal.classList.add('hidden');
}

function simulateLogin(type = '이메일') {
  toggleAuthModal(false);
  document.getElementById('userLoginText').textContent = '김선생님 (내정보)';
  showToast(`${type} 계정으로 로그인되었습니다.`, 'success');
}

function openFullPreviewModal(prodId) {
  const prod = MOCK_PRODUCTS.find(p => p.id === prodId);
  alert(`[전체화면 뷰어] "${prod.title}"\n워터마크가 적용된 고해상도 PDF 뷰어가 실행되었습니다.`);
}

function openReviewModal(prodId) {
  const content = prompt('자료에 대한 솔직한 후기를 남겨주세요:');
  if (content && content.trim()) {
    MOCK_REVIEWS.unshift({
      id: 'rev_' + Date.now(),
      productId: prodId,
      authorName: '김선생님',
      role: appState.userMode === 'teacher' ? '선생님' : '학생',
      rating: 5,
      date: '2025-04-12',
      content: content.trim()
    });
    showToast('소중한 후기가 등록되었습니다!', 'success');
    renderApp();
  }
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  const bgClass = type === 'success' ? 'bg-teal-700' : (type === 'error' ? 'bg-red-600' : 'bg-slate-900');
  
  toast.className = `${bgClass} text-white px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 slide-up pointer-events-auto`;
  toast.innerHTML = `
    <i data-lucide="${type === 'success' ? 'check-circle' : 'info'}" class="w-4 h-4 text-teal-300"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
