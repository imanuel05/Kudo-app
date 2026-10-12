const app = document.querySelector('#app');
const ASSETS = {
  kudo: "assets/kudo-image-fd1f7571713332b5.png",
  google: "assets/kudo-image-7adf88cb9368f985.png",
  facebook: "assets/kudo-image-6e9c5d77f0d1300d.png",
  navHome: "assets/kudo-image-2736f3d02207b33a.png",
  navChest: "assets/kudo-image-25e039da1571cec8.png",
  navFocus: "assets/kudo-image-69d73a5bbca28d94.png",
  navShop: "assets/kudo-image-16b28ce3e1995b16.png",
  navProfile: "assets/kudo-image-1fb9464debf6610f.png",
  ticket: "assets/kudo-image-16678d2166e4afaf.png",
  diamondItem: "assets/kudo-image-2af03c55f26ca16b.png",
  hourglass: "assets/kudo-image-68cbb379aec24bc7.png",
  artDaily: "assets/kudo-image-73889fc73cf3182c.png",
  artBoss: "assets/kudo-image-4cd17bbbd753eb38.png",
  bossPaper: "assets/kudo-image-e792c9fe9bf116bb.jpg",
  artFocus: "assets/kudo-image-53729b94e5148453.png",
  focusMode: "assets/kudo-image-7585e18f44686642.png",
  focusShortage: "assets/kudo-image-042e9be18954cb08.png",
  animeEpisodeThumb: "assets/kudo-image-4e272acaa5cf7d73.png",
  frierenEpisodeThumb: "assets/kudo-image-caa57c9f95fb5e13.png",
  noiseRain: "assets/kudo-image-5acbea76108e6ab2.png",
  noiseOcean: "assets/kudo-image-24df66dac83f4356.png",
  noiseForest: "assets/kudo-image-5aab1f576fa5e17f.png",
  rainTrack: "./assets/rain-track.mp3",
  oceanTrack: "./assets/ocean-waves.mp3",
  forestTrack: "./assets/forest-track.mp3",
  watchHero: "assets/kudo-image-90cbf950c11b9484.png",
  shopShortage: "assets/kudo-image-042e9be18954cb08.png",
  shopFeature: "assets/kudo-image-137cea0ef9b5b77f.png",
  posterDungeon: "assets/kudo-image-e30f7cd62c4f98ab.png",
  posterFrieren: "assets/kudo-image-4e3411277d7e170c.png",
  posterPuzzles: "assets/kudo-image-ca3035939482e467.png",
  posterTeach: "assets/kudo-image-ef3a63cfaa06f906.png",
  chestLocked: "assets/kudo-image-f617bc9a596edb79.png",
  chestReady: "assets/kudo-image-ee28f0f4112afc1a.png",
  shopFreeChestArt: "assets/kudo-image-042e9be18954cb08.png",
  chestOpen: "assets/kudo-image-63bbf52c2a72264c.png",
  missionCelebration: "assets/kudo-image-66b6d2327b41e6bb.png",
  rewardDiamonds: "assets/kudo-image-b5a54ac5d00f6aba.png",
  profileAvatar: "assets/kudo-image-ffaf02da2bd45468.png",
  profileAvatarFemale: "assets/kudo-image-34a1cf76c3d0db54.png",
  profileInfoArt: "assets/kudo-image-af5f4e4eb1854473.png",
};
const KDRAMA_EPISODE_POSTER_OVERRIDES = Object.freeze({
  'nine puzzle': 'assets/nine-puzzle-episode-poster.png',
  'teach you a lesson': 'assets/teach-you-a-lesson-episode-poster.png',
});

function kdramaEpisodePoster(title, fallback = '') {
  return KDRAMA_EPISODE_POSTER_OVERRIDES[normalizeShowTitle(title)] || fallback;
}

function builtInEpisodePoster(title) {
  const normalizedTitle = normalizeShowTitle(title);
  if (normalizedTitle === 'delicious in dungeon') return 'assets/dungeon-meshi-episode-poster.png';
  if (normalizedTitle === "frieren: beyond journey's end") return 'assets/frieren-episode-poster.png';
  if (normalizedTitle === 'nine puzzle') return 'assets/nine-puzzle-episode-poster.png';
  if (normalizedTitle === 'teach you a lesson') return 'assets/teach-you-a-lesson-episode-poster.png';
  return '';
}

const ANIME_VIDEO_ASSETS = Object.freeze({
  'delicious-in-dungeon-episode-1': {
    title: 'Delicious in Dungeon - Episode 1',
    showTitle: 'Delicious in Dungeon',
    episodeNumber: 1,
    fallbackSrc: 'assets/video/delicious-in-dungeon-episode-1.mp4',
  },
  'frieren-episode-1': {
    title: "Frieren: Beyond Journey's End - Episode 1",
    showTitle: "Frieren: Beyond Journey's End",
    episodeNumber: 1,
    fallbackSrc: 'assets/video/frieren-episode-1.mp4',
  },
});
const DEFAULT_ANIME_VIDEO_ASSETS = Object.freeze({
  'Delicious in Dungeon': 'delicious-in-dungeon-episode-1',
  "Frieren: Beyond Journey's End": 'frieren-episode-1',
});

const STORAGE_KEY = 'kudo-prototype-state-v1';
const ACCOUNTS_STORAGE_KEY = 'kudo-local-accounts-v1';
const ACTIVE_ACCOUNT_STORAGE_KEY = 'kudo-active-account-v1';
const GOOGLE_AUTH_REDIRECT_PENDING_KEY = 'kudo-google-auth-redirect-pending-v1';
const SUPABASE_URL = 'https://uipmsrfepoghoshqlfzy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpcG1zcmZlcG9naG9zaHFsZnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwMDIzNDksImV4cCI6MjEwNjU3ODM0OX0._-mdl4w4QHTQy-9cFfAWr8PRMmu0VJYrBXJ3MLzil_Y';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const INVENTORY_RESET_KEY = 'kudo-inventory-zero-v1';
const PROFILE_DIAMOND_GRANT_KEY = 'kudo-profile-diamonds-500-v1';
const PROFILE_DIAMOND_BONUS_KEY = 'kudo-profile-diamond-bonus-500-v1';
const FOCUS_HOURGLASS_GRANT_KEY = 'kudo-focus-hourglass-grant-10-v1';
const SHOP_HOURGLASS_GRANT_KEY = 'kudo-shop-hourglass-grant-10-v1';
const CHECKIN_ROLLBACK_KEY = 'kudo-checkin-rollback-v1';
const TICKET_CHECKIN_GRANT_KEY = 'kudo-ticket-checkin-grant-10-v1';
const FIRST_VISIT_CHECKIN_KEY = 'kudo-first-visit-checkin-v1';
const CHECKIN_FIRST_COMPLETED_KEY = 'kudo-first-checkin-completed-v1';
const SHOP_INVENTORY_BALANCE_KEY = 'kudo-shop-inventory-balance-v3';

const BOSS_AVATARS = {
  'paper-task': {
    name: 'Paper Task',
    image: 'assets/paper-task-boss.png',
    alt: 'Tumpukan tugas yang menjadi boss',
  },
  'error-code': {
    name: 'Error Code',
    image: 'assets/error-code-boss.png',
    alt: 'Boss Error Code berbentuk laptop',
  },
};

const STARTER_STATE = {
  crystals: 2000,
  hourglasses: 10,
  chests: 10,
  username: '',
  tasks: [],
  messages: [],
  moodLog: [],
  chestClaimedOn: '',
  dailyMissionDay: '',
  dailyCheckIn: '',
  dailyMissionOpened: {},
  chestSession: null,
  bossHealth: 100,
  bossAvatar: 'paper-task',
  animeVideoAssets: {},
  strictMode: false
};

function createEmptyAccountState(username = '') {
  return {
    ...structuredClone(STARTER_STATE),
    crystals: 0,
    hourglasses: 0,
    chests: 0,
    username,
    tasks: [],
    moodLog: [],
    dailyMissionDay: localDayKey(),
    dailyCheckIn: localDayKey(),
  };
}

let state = loadState();
let legacyAccounts = loadAccounts();
let currentAccount = null;
let cloudSaveTimer = null;

let modal = null;
let toast = '';
let focusTicker = null;
let dailyMissionRefreshTimer = null;
let taskDeadlineRefreshTimer = null;
let performanceHistoryPage = 0;
let messagePage = 0;
let taskListPages = { daily: 0, boss: 0 };
let selectedBossAvatar = null;
let analysisToken = 0;
let taskPhotoData = '';
let audioContext = null;
let noiseSource = null;
let focusTrackAudio = null;
let noiseNodes = [];
let focusMiniPlayerAvailable = false;

const FOCUS_AUDIO_SOURCES = {
  Forest: 'assets/audio/focus-forest.mp3',
  Rain: 'assets/audio/focus-rain.mp3',
  'Ocean Waves': 'assets/audio/focus-ocean.mp3'
};

function focusTrackSource(name) {
  return FOCUS_AUDIO_SOURCES[name] || '';
}

function stopWhiteNoise() {
  noiseNodes.forEach((node) => {
    try { node.stop?.(); } catch {}
    try { node.disconnect?.(); } catch {}
  });
  noiseNodes = [];
  noiseSource = null;
  focusTrackAudio?.pause?.();
  focusTrackAudio = null;
}

function startWhiteNoise(name, { startPaused = false } = {}) {
  stopWhiteNoise();
  const sourceUrl = focusTrackSource(name);
  if (sourceUrl) {
    try {
      const audio = new Audio(sourceUrl);
      audio.preload = 'metadata';
      audio.loop = true;
      focusTrackAudio = audio;
      audio.addEventListener('loadedmetadata', () => {
        const session = state.activeFocus;
        if (focusTrackAudio !== audio || !session || session.noise !== name || !Number.isFinite(audio.duration)) return;
        if (startPaused || session.paused) {
          session.paused = true;
          session.remaining ??= Math.max(0, session.endsAt - Date.now());
          audio.pause();
        } else {
          audio.play().catch(() => {});
          if (currentPage() === 'focus-session') startFocusTicker();
        }
        persist();
      }, { once: true });
      audio.addEventListener('error', () => {
        if (focusTrackAudio !== audio) return;
        console.warn(`Could not load focus track: ${sourceUrl}`);
        focusTrackAudio = null;
        startProceduralNoise(name, { startPaused });
      }, { once: true });
      if (!startPaused) audio.play().catch(() => {});
      return true;
    } catch (error) {
      console.warn('Focus audio is unavailable; using generated ambience.', error);
    }
  }
  return startProceduralNoise(name, { startPaused });
}

function startProceduralNoise(name, { startPaused = false } = {}) {
  stopWhiteNoise();
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return false;

  try {
    audioContext ||= new AudioContextClass();
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, sampleRate * 3, sampleRate);
    const samples = buffer.getChannelData(0);
    let filtered = 0;
    for (let i = 0; i < samples.length; i += 1) {
      const white = Math.random() * 2 - 1;
      filtered = name === 'Ocean Waves'
        ? filtered * 0.985 + white * 0.015
        : name === 'Forest'
          ? filtered * 0.72 + white * 0.28
          : filtered * 0.9 + white * 0.1;
      samples[i] = filtered;
    }

    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = audioContext.createBiquadFilter();
    const gain = audioContext.createGain();
    filter.type = name === 'Ocean Waves' ? 'lowpass' : name === 'Forest' ? 'bandpass' : 'lowpass';
    filter.frequency.value = name === 'Ocean Waves' ? 520 : name === 'Forest' ? 2100 : 5200;
    filter.Q.value = name === 'Forest' ? 0.7 : 0.5;
    gain.gain.value = name === 'Ocean Waves' ? 0.62 : name === 'Forest' ? 0.2 : 0.42;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);
    source.start();
    noiseSource = source;
    noiseNodes = [source, filter, gain];

    if (name === 'Ocean Waves') {
      const lfo = audioContext.createOscillator();
      const depth = audioContext.createGain();
      lfo.frequency.value = 0.08;
      depth.gain.value = 0.18;
      lfo.connect(depth);
      depth.connect(gain.gain);
      lfo.start();
      noiseNodes.push(lfo, depth);
    }

    if (!startPaused) audioContext.resume().catch(() => {});
    return true;
  } catch (error) {
    console.warn('White noise could not be started.', error);
    stopWhiteNoise();
    return false;
  }
}

function formatTime(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startFocusTicker() {
  clearInterval(focusTicker);
  const update = () => {
    const session = state.activeFocus;
    if (!session || session.paused) {
      clearInterval(focusTicker);
      return;
    }
    const remaining = Math.max(0, Math.ceil((session.endsAt - Date.now()) / 1000));
    const elapsed = Math.min(100, Math.max(0, (((session.duration || 3600000) / 1000 - remaining) / ((session.duration || 3600000) / 1000)) * 100));
    const timer = document.getElementById('focus-timer');
    const progress = document.getElementById('focus-progress');
    const miniProgress = document.getElementById('focus-mini-progress');
    if (timer) timer.textContent = formatTime(remaining);
    if (progress) progress.style.width = `${elapsed}%`;
    if (miniProgress) miniProgress.style.width = `${elapsed}%`;
    if (remaining <= 0) {
      clearInterval(focusTicker);
      stopWhiteNoise();
      state.activeFocus = null;
      focusMiniPlayerAvailable = false;
      persist();
      if (currentPage() === 'focus-session') navigate('focus-mode');
      else render();
    }
  };
  focusTicker = setInterval(update, 1000);
  update();
}

let watchFilters = {
  anime: { genre: 'Semuanya', type: 'Semuanya' },
  kdrama: { genre: 'Semuanya', type: 'Semuanya' },
};

let watchSearch = '';
let watchCatalogPage = { anime: 1, kdrama: 1 };
let selectedAnime = 'Delicious in Dungeon';
let animeStreamTab = 'episode';
let selectedAnimeCatalogVideoId = '';
let animeControlsTimer = null;
let animeAutoplayRequested = false;
let animeVideoElement = null;
let animeTrailerFrame = null;
let animePiPWindow = null;
let mediaVideoElement = null;
let mediaPiPWindow = null;
let mediaAutoplayRequested = false;
let animePiPControlsTimer = null;
let mediaPiPControlsTimer = null;
const animeVideoListeners = new WeakSet();
const mediaVideoListeners = new WeakSet();
let accountActionPending = false;
let diamondPaymentPollTimer = null;
let diamondPaymentPollInFlight = false;
let diamondProofFile = null;
let diamondProofPreviewUrl = '';
let diamondProofError = '';
let diamondPaymentSubmitting = false;
let purchaseHistory = [];
let purchaseHistoryPage = 0;
let purchaseHistoryExpiryTimer = null;
let purchaseHistoryLoading = false;
let purchaseHistoryError = '';
let purchaseHistoryLoaded = false;
let lastRenderedPage = '';
const messageEmailAttempts = new Set();
const messageEmailRetryTimers = new Map();
let catalogVideos = [];
let catalogVideosLoaded = false;
let catalogVideosLoading = false;
let currentMediaVideo = null;
let mediaStreamTab = 'episode';
let isAdminUser = null;
let adminCheckedForUserId = '';
let adminAccessLoading = false;
let adminOrders = [];
let adminOrdersPage = 0;
let adminVerifiedOrders = [];
let adminVerifiedOrdersPage = 0;
let adminVideos = [];
let adminVideosPage = 0;
let adminPanelLoaded = false;
let adminPanelAttempted = false;
let adminPanelLoading = false;
let adminPanelError = '';
let adminPanelMessage = '';
let adminActionInProgress = false;

let pendingDiamondOrder = (() => {
  try {
    return JSON.parse(
      localStorage.getItem('kudo-pending-diamond-order-v1') || 'null'
    );
  } catch {
    return null;
  }
})();

const icons = {
  eyeOpen: '<img class="password-eye-icon" src="assets/password-eye-open.png" alt="" />',
  eyeClosed: '<img class="password-eye-icon" src="assets/password-eye-closed.png" alt="" />',

  home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7v10H5V10m5 10v-6h4v6"/></svg>',

  chest: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5V9M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Zm0 4h6v3h6v-3h6"/></svg>',

  focus: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9 5 3-5 3V9Z"/></svg>',

  shop: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v10h16V10M3 9l2-5h14l2 5a2.5 2.5 0 0 1-4.5 1.5A2.5 2.5 0 0 1 12 10a2.5 2.5 0 0 1-4.5.5A2.5 2.5 0 0 1 3 9Zm6 11v-5h6v5"/></svg>',

  profile: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',

  plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',

  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',

  trash: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16m-10 4v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3"/></svg>',

  clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6M12 2v3"/></svg>',

  diamond: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8 6.5 4h11L21 8l-9 12L3 8Zm0 0h18M6.5 4 9 8l3 12 3-12 2.5-4"/></svg>',
};

function loadState() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || 'null'
    );

    if (!localStorage.getItem(INVENTORY_RESET_KEY)) {
      if (saved) {
        saved.crystals = 0;
        saved.hourglasses = 0;
        saved.chests = 0;

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(saved)
        );
      }

      localStorage.setItem(INVENTORY_RESET_KEY, '1');
    }

    if (!localStorage.getItem(PROFILE_DIAMOND_GRANT_KEY)) {
      if (saved) {
        saved.crystals = 500;

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(saved)
        );
      }

      localStorage.setItem(PROFILE_DIAMOND_GRANT_KEY, '1');
    }

    if (!localStorage.getItem(PROFILE_DIAMOND_BONUS_KEY)) {
      if (saved) {
        saved.crystals =
          Number(saved.crystals || 0) + 500;

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(saved)
        );
      }

      localStorage.setItem(
        PROFILE_DIAMOND_BONUS_KEY,
        '1'
      );
    }

    if (!localStorage.getItem(FOCUS_HOURGLASS_GRANT_KEY)) {
      if (saved) {
        saved.hourglasses =
          Number(saved.hourglasses || 0) + 10;

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(saved)
        );
      } else {
        STARTER_STATE.hourglasses = 10;

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(STARTER_STATE)
        );
      }

      localStorage.setItem(
        FOCUS_HOURGLASS_GRANT_KEY,
        '1'
      );
    }

    if (!localStorage.getItem(SHOP_HOURGLASS_GRANT_KEY)) {
      if (saved) {
        saved.hourglasses = 10;

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(saved)
        );
      } else {
        STARTER_STATE.hourglasses = 10;

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(STARTER_STATE)
        );
      }

      localStorage.setItem(
        SHOP_HOURGLASS_GRANT_KEY,
        '1'
      );
    }

    if (!localStorage.getItem(CHECKIN_ROLLBACK_KEY)) {
      if (saved) {
        saved.dailyMissionDay = localDayKey();
        saved.dailyCheckIn = '';

        saved.dailyMissionOpened = {
          ...(saved.dailyMissionOpened || {}),
          checkin: false
        };

        if (
          saved.chestSession?.missionKey ===
          'checkin'
        ) {
          saved.chestSession = null;
        }

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(saved)
        );
      } else {
        STARTER_STATE.dailyMissionDay =
          localDayKey();

        STARTER_STATE.dailyCheckIn = '';
      }

      localStorage.setItem(
        CHECKIN_ROLLBACK_KEY,
        '1'
      );
    }

    if (!localStorage.getItem(TICKET_CHECKIN_GRANT_KEY)) {
      const today = localDayKey();

      if (saved) {
        saved.chests =
          Number(saved.chests || 0) + 10;

        saved.dailyMissionDay = today;
        saved.dailyCheckIn = today;

        saved.dailyMissionOpened = {
          ...(saved.dailyMissionOpened || {}),
          checkin: false
        };

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(saved)
        );
      } else {
        STARTER_STATE.chests = 10;
        STARTER_STATE.dailyMissionDay = today;
        STARTER_STATE.dailyCheckIn = today;

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(STARTER_STATE)
        );
      }

      localStorage.setItem(
        TICKET_CHECKIN_GRANT_KEY,
        '1'
      );
    }

    if (!localStorage.getItem(FIRST_VISIT_CHECKIN_KEY)) {
      const today = localDayKey();

      if (saved) {
        saved.dailyMissionDay = today;
        saved.dailyCheckIn = today;

        saved.dailyMissionOpened = {
          ...(saved.dailyMissionOpened || {}),
          checkin: false
        };

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(saved)
        );
      } else {
        STARTER_STATE.dailyMissionDay = today;
        STARTER_STATE.dailyCheckIn = today;

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(STARTER_STATE)
        );
      }

      localStorage.setItem(
        FIRST_VISIT_CHECKIN_KEY,
        '1'
      );
    }

    if (!localStorage.getItem(CHECKIN_FIRST_COMPLETED_KEY)) {
      const today = localDayKey();

      if (saved) {
        saved.dailyMissionDay = today;
        saved.dailyCheckIn = today;

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(saved)
        );
      } else {
        STARTER_STATE.dailyMissionDay = today;
        STARTER_STATE.dailyCheckIn = today;

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(STARTER_STATE)
        );
      }

      localStorage.setItem(
        CHECKIN_FIRST_COMPLETED_KEY,
        '1'
      );
    }

    if (!localStorage.getItem(SHOP_INVENTORY_BALANCE_KEY)) {
      if (saved) {
        saved.crystals = 2000;
        saved.hourglasses = 10;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      } else {
        STARTER_STATE.crystals = 2000;
        STARTER_STATE.hourglasses = 10;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(STARTER_STATE));
      }
      localStorage.setItem(SHOP_INVENTORY_BALANCE_KEY, '1');
    }

    return saved
      ? {
          ...structuredClone(STARTER_STATE),
          ...saved,
          ...(typeof saved.bossHealth === 'number'
            ? {}
            : { bossHealth: Math.max(0, 100 - (saved.tasks || []).filter((task) => task.difficulty === 'hard' && task.done).length * 25) })
        }
      : structuredClone(STARTER_STATE);
  } catch {
    return structuredClone(STARTER_STATE);
  }
}

function persist() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state)
  );
  if (!currentAccount) return;

  window.clearTimeout(cloudSaveTimer);
  cloudSaveTimer = window.setTimeout(() => {
    saveCloudAccount(currentAccount, state).catch((error) => {
      console.error('Progres gagal disinkronkan ke Supabase:', error);
    });
  }, 500);
}

function loadAccounts() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(
        ACCOUNTS_STORAGE_KEY
      ) || '[]'
    );

    return Array.isArray(saved)
      ? saved
      : [];
  } catch {
    return [];
  }
}

function persistAccounts() {
  localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(legacyAccounts));

  if (currentAccount?.id) {
    saveCloudAccount(currentAccount, state).catch((error) => {
      console.error('Profil gagal disinkronkan ke Supabase:', error);
    });
  }
}

function cloudProfile(account) {
  return {
    name: account.name || '',
    avatarChoice: account.avatarChoice || 'male',
    avatarData: account.avatarData || '',
  };
}

function resetAccountScopedPages() {
  clearTimeout(taskDeadlineRefreshTimer);
  taskDeadlineRefreshTimer = null;
  messagePage = 0;
  window.clearTimeout(purchaseHistoryExpiryTimer);
  purchaseHistoryExpiryTimer = null;
  purchaseHistory = [];
  purchaseHistoryPage = 0;
  purchaseHistoryLoading = false;
  purchaseHistoryError = '';
  purchaseHistoryLoaded = false;
  adminOrders = [];
  adminOrdersPage = 0;
  adminVerifiedOrders = [];
  adminVerifiedOrdersPage = 0;
  adminVideos = [];
  adminVideosPage = 0;
  adminPanelLoaded = false;
  adminPanelAttempted = false;
  adminPanelLoading = false;
  adminPanelError = '';
  adminPanelMessage = '';
  isAdminUser = null;
  adminCheckedForUserId = '';
}

async function saveCloudAccount(account, accountState) {
  const { error } = await supabaseClient
    .from('user_data')
    .upsert({
      user_id: account.id,
      profile: cloudProfile(account),
      app_state: structuredClone(accountState),
      updated_at: new Date().toISOString(),
    });

  if (error) throw error;
}

async function syncSupabaseSession() {
  try {
    const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
    if (sessionError) throw sessionError;
    if (!session?.user) {
      if (currentAccount?.id) resetAccountScopedPages();
      currentAccount = null;
      return false;
    }

    const user = session.user;
    if (currentAccount?.id && currentAccount.id !== user.id) resetAccountScopedPages();
    const { data, error } = await supabaseClient
      .from('user_data')
      .select('profile, app_state')
      .eq('user_id', user.id)
      .maybeSingle();
    if (error) throw error;

    const legacyAccount = legacyAccounts.find(
      (account) => account.email?.toLowerCase() === user.email?.toLowerCase()
    );
    const profile = data?.profile || {};
    const name = profile.name
      || user.user_metadata?.full_name
      || user.user_metadata?.name
      || legacyAccount?.name
      || user.email?.split('@')[0]
      || '';

    const isGoogleAccount = user.app_metadata?.provider === 'google'
      || user.app_metadata?.providers?.includes('google');
    currentAccount = {
      id: user.id,
      email: user.email || '',
      name,
      avatarChoice: profile.avatarChoice || legacyAccount?.avatarChoice || 'male',
      avatarData: isGoogleAccount ? '' : profile.avatarData || legacyAccount?.avatarData || '',
    };

    if (data) {
      state = {
        ...structuredClone(STARTER_STATE),
        ...(data.app_state && typeof data.app_state === 'object' ? data.app_state : {}),
      };
    } else {
      state = legacyAccount?.progress && typeof legacyAccount.progress === 'object'
        ? { ...structuredClone(STARTER_STATE), ...structuredClone(legacyAccount.progress) }
        : createEmptyAccountState(name);
      await saveCloudAccount(currentAccount, state);

      if (legacyAccount) {
        legacyAccounts = legacyAccounts.filter((account) => account !== legacyAccount);
        localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(legacyAccounts));
      }
    }

    state.username = currentAccount.name || state.username;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (error) {
    console.warn('Sesi Supabase tidak dapat disinkronkan:', error);
    throw error;
  }
}

function escapeHtml(value = '') {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      })[char]
  );
}

function localDayKey(
  value = new Date()
) {
  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (
    Number.isNaN(date.getTime())
  ) {
    return '';
  }

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;
}

function taskDaysUntilDeadline(deadline) {
  const dueDate = new Date(`${deadline}T00:00:00`);
  if (Number.isNaN(dueDate.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((dueDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
}

function pruneExpiredCompletedTasks() {
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const taskCount = (state.tasks || []).length;
  const moodCount = (state.moodLog || []).length;
  state.tasks = (state.tasks || []).filter((task) => {
    if (!task.done || !task.completedAt) return true;
    const completedAt = new Date(task.completedAt).getTime();
    return !Number.isFinite(completedAt) || completedAt >= cutoff;
  });
  state.moodLog = (state.moodLog || []).filter((entry) => {
    const recordedAt = new Date(entry.at).getTime();
    return !Number.isFinite(recordedAt) || recordedAt >= cutoff;
  });
  const removed = state.tasks.length !== taskCount || state.moodLog.length !== moodCount;
  if (removed) persist();
  return removed;
}

function processTaskDeadlineMessages() {
  if (!Array.isArray(state.messages)) state.messages = [];
  let changed = false;
  const now = Date.now();
  const messageCutoff = now - 30 * 24 * 60 * 60 * 1000;
  const originalMessageCount = state.messages.length;
  state.messages = state.messages.filter((message) => {
    const receivedAt = Date.parse(message.createdAt);
    return !Number.isFinite(receivedAt) || receivedAt > messageCutoff;
  });
  changed = state.messages.length !== originalMessageCount;

  for (const message of state.messages) {
    if (!['task-moved', 'task-deadline'].includes(message.type)) continue;
    if (!message.emailDeliveryStatus || message.emailDeliveryStatus === 'not-applicable') {
      message.emailDeliveryStatus = 'pending';
      changed = true;
    }
  }

  const addMessage = (id, type, title, body, task) => {
    if (state.messages.some((message) => message.id === id)) return;
    state.messages.unshift({
      id,
      type,
      title,
      body,
      taskId: task.id,
      createdAt: new Date(now).toISOString(),
      readAt: '',
      emailDeliveryStatus: currentAccount?.id ? 'pending' : 'not-applicable',
    });
    changed = true;
  };

  for (const task of state.tasks || []) {
    if (task.done || !task.deadline || !task.id) continue;
    const daysUntilDeadline = taskDaysUntilDeadline(task.deadline);
    if (daysUntilDeadline === null) continue;

    if (task.difficulty !== 'hard' && daysUntilDeadline < 7) {
      task.difficulty = 'hard';
      addMessage(
        `task-moved-${task.id}`,
        'task-moved',
        'Tugas dipindahkan ke Boss Fight',
        `“${task.title}” dipindahkan karena belum dikerjakan dan tenggatnya kurang dari 7 hari lagi.`,
        task
      );
      changed = true;
    }

    if (task.difficulty === 'hard' && daysUntilDeadline < 3) {
      addMessage(
        `task-deadline-${task.id}`,
        'task-deadline',
        'Tenggat tugas hampir tiba',
        `Tenggat “${task.title}” kurang dari 3 hari lagi. Segera kerjakan tugasmu.`,
        task
      );
    }
  }

  if (changed) persist();
  sendPendingMessageEmails();
  return changed;
}

function sendPendingMessageEmails() {
  if (!currentAccount?.id) return;
  const requestedUserId = currentAccount.id;
  for (const message of state.messages || []) {
    const requestKey = `${requestedUserId}:${message.id}`;
    if (
      message.emailDeliveryStatus !== 'pending'
      || messageEmailAttempts.has(requestKey)
      || messageEmailRetryTimers.has(requestKey)
    ) continue;
    messageEmailAttempts.add(requestKey);
    void authenticatedRequest('/api/notifications/email', {
      method: 'POST',
      body: JSON.stringify({
        id: message.id,
        title: message.title,
        body: message.body,
        createdAt: message.createdAt,
      }),
    }).then(() => {
      if (currentAccount?.id !== requestedUserId) {
        messageEmailAttempts.delete(requestKey);
        return;
      }
      message.emailDeliveryStatus = 'sent';
      message.emailSentAt = new Date().toISOString();
      persist();
    }).catch((error) => {
      console.error('Email notifikasi gagal dikirim:', error);
      if (currentAccount?.id !== requestedUserId) {
        messageEmailAttempts.delete(requestKey);
        return;
      }
      const retryTimer = window.setTimeout(() => {
        messageEmailAttempts.delete(requestKey);
        messageEmailRetryTimers.delete(requestKey);
        sendPendingMessageEmails();
      }, 60 * 1000);
      messageEmailRetryTimers.set(requestKey, retryTimer);
    });
  }
}

function scheduleTaskDeadlineRefresh() {
  clearTimeout(taskDeadlineRefreshTimer);
  const now = Date.now();
  const nextTaskRefresh = (state.tasks || []).reduce((earliest, task) => {
    if (task.done || !task.deadline) return earliest;
    const daysUntilDeadline = taskDaysUntilDeadline(task.deadline);
    if (daysUntilDeadline === null) return earliest;
    const threshold = new Date(`${task.deadline}T00:00:00`);
    threshold.setDate(threshold.getDate() - (task.difficulty === 'hard' ? 2 : 6));
    const thresholdAt = threshold.getTime();
    return daysUntilDeadline >= (task.difficulty === 'hard' ? 3 : 7) && thresholdAt > now
      ? Math.min(earliest, thresholdAt)
      : earliest;
  }, Infinity);
  const nextMessageExpiry = (state.messages || []).reduce((earliest, message) => {
    const receivedAt = Date.parse(message.createdAt);
    const expiresAt = Number.isFinite(receivedAt) ? receivedAt + 30 * 24 * 60 * 60 * 1000 : Infinity;
    return expiresAt > now ? Math.min(earliest, expiresAt) : earliest;
  }, Infinity);
  const nextRefresh = Math.min(nextTaskRefresh, nextMessageExpiry);

  if (!Number.isFinite(nextRefresh)) return;
  taskDeadlineRefreshTimer = setTimeout(() => {
    const changed = processTaskDeadlineMessages();
    const isStreamingPage = ['anime-stream', 'media-stream', 'anime-episodes', 'kdrama-episodes'].includes(currentPage());
    if (changed && !isStreamingPage) render();
    else scheduleTaskDeadlineRefresh();
  }, Math.max(1000, nextRefresh - now));
}

function completeDailyCheckIn() {
  const today = localDayKey();
  let changed = false;

  if (state.dailyMissionDay !== today) {
    state.dailyMissionDay = today;
    state.dailyMissionOpened = {};
    changed = true;
  }

  if (state.dailyCheckIn !== today) {
    state.dailyCheckIn = today;
    changed = true;
  }

  if (changed) persist();
}

function scheduleDailyMissionRefresh() {
  clearTimeout(dailyMissionRefreshTimer);
  const nextMidnight = new Date();
  nextMidnight.setHours(24, 0, 0, 25);
  const nextTaskExpiry = (state.tasks || []).reduce((earliest, task) => {
    if (!task.done || !task.completedAt) return earliest;
    const completedAt = new Date(task.completedAt).getTime();
    const expiresAt = Number.isFinite(completedAt) ? completedAt + 30 * 24 * 60 * 60 * 1000 + 1 : Infinity;
    return Math.min(earliest, expiresAt);
  }, Infinity);
  const refreshAt = Math.min(nextMidnight.getTime(), nextTaskExpiry);
  dailyMissionRefreshTimer = setTimeout(() => {
    const previousDay = state.dailyMissionDay;
    completeDailyCheckIn();
    const removedExpiredTasks = pruneExpiredCompletedTasks();
    if ((previousDay !== state.dailyMissionDay || removedExpiredTasks) && ['rewards', 'daily', 'boss', 'performance'].includes(currentPage())) render();
    scheduleDailyMissionRefresh();
  }, Math.max(1000, refreshAt - Date.now()));
}

function refreshDailyMissionsIfDateChanged() {
  const previousDay = state.dailyMissionDay;
  completeDailyCheckIn();
  const removedExpiredTasks = pruneExpiredCompletedTasks();
  const taskDeadlinesChanged = processTaskDeadlineMessages();
  const isStreamingPage = ['anime-stream', 'media-stream', 'anime-episodes', 'kdrama-episodes'].includes(currentPage());
  if ((previousDay !== state.dailyMissionDay || removedExpiredTasks) && ['rewards', 'daily', 'boss', 'performance'].includes(currentPage())) render();
  else if (taskDeadlinesChanged && !isStreamingPage) render();
  scheduleTaskDeadlineRefresh();
  scheduleDailyMissionRefresh();
}

function dailyMissions() {
  completeDailyCheckIn();
  const today = localDayKey();

  return [
    {
      key: 'checkin',
      title: 'Checkin harian',
      done:
        state.dailyCheckIn === today
    },
    {
      key: 'complete-task',
      title:
        'Kerjakan 1 tugas hari ini',
      done: state.tasks.some(
        (task) =>
          task.completedAt &&
          localDayKey(
            task.completedAt
          ) === today
      )
    },
    {
      key: 'add-task',
      title:
        'Tambah 1 tugas',
      done: state.tasks.some(
        (task) =>
          task.createdAt &&
          localDayKey(
            task.createdAt
          ) === today
      )
    }
  ].map((mission) => ({
    ...mission,
    opened: Boolean(
      state.dailyMissionOpened?.[
        mission.key
      ]
    )
  }));
}

function navigate(page) {
  if (currentPage() === 'boss-select' && page !== 'boss-select') {
    selectedBossAvatar = null;
  }
  modal = null;
  toast = '';
  if (page === 'profile' && currentPage() !== 'profile') {
    purchaseHistoryLoaded = false;
    purchaseHistoryError = '';
  }
  if (currentPage() === 'purchase-history' && page !== 'purchase-history') {
    window.clearTimeout(purchaseHistoryExpiryTimer);
    purchaseHistoryExpiryTimer = null;
  }

  if (
    location.hash === `#${page}`
  ) {
    render();
  } else {
    location.hash = page;
  }
}

function resetWatchFiltersOnReturn(fromPage, toPage) {
  const kind = fromPage === 'anime-episodes' && toPage === 'watch-anime'
    ? 'anime'
    : fromPage === 'kdrama-episodes' && toPage === 'watch-kdrama'
      ? 'kdrama'
      : '';
  if (!kind) return;
  watchFilters[kind] = { genre: 'Semuanya', type: 'Semuanya' };
  watchCatalogPage[kind] = 1;
}

function currentPage() {
  return (
    location.hash.slice(1) ||
    'welcome'
  );
}

function isAdminPage(page = currentPage()) {
  return page === 'admin' || page.startsWith('admin-');
}

function inventoryBar() {
  return `<div class="inventory-bar" aria-label="Inventori">
    <button class="inventory-item" type="button" data-nav="shop" aria-label="Tiket: ${state.chests}">
      <span class="item-token token-chest">
        <img src="${ASSETS.ticket}" alt="" />
      </span>
      <span>${state.chests}</span>
    </button>

    <button class="inventory-item" type="button" data-nav="shop" aria-label="Jam: ${state.hourglasses}">
      <span class="item-token token-hourglass">
        <img src="${ASSETS.hourglass}" alt="" />
      </span>
      <span>${state.hourglasses}</span>
    </button>

    <button class="inventory-item" type="button" data-nav="shop" aria-label="Berlian: ${state.crystals}">
      <span class="item-token token-crystal">
        <img src="${ASSETS.diamondItem}" alt="" />
      </span>
      <span>${state.crystals}</span>
    </button>
  </div>`;
}

function bottomNav(page) {
  const unreadCount = unreadMessagesCount() + unreadVerifiedPurchaseCount();
  const profileBadgeCount = unreadCount + (isAdminUser === true ? adminOrders.length : 0);
  const readyMissionChestCount = dailyMissions().filter((mission) => mission.done && !mission.opened).length;
  const links = [
    ['home', ASSETS.navHome, 'Beranda'],
    ['rewards', ASSETS.navChest, 'Peti'],
    ['focus', ASSETS.navFocus, 'Fokus'],
    ['shop', ASSETS.navShop, 'Toko'],
    ['profile', ASSETS.navProfile, 'Profil'],
  ];

  return `<nav class="bottom-nav" aria-label="Navigasi utama">${links.map(
    ([key, icon, label]) =>
      `<button class="nav-button ${
        page === key
          ? 'is-current'
          : ''
      }${key === 'profile' && profileBadgeCount ? ' has-unread-messages' : ''}${key === 'rewards' && readyMissionChestCount ? ' has-pending-reward' : ''}" type="button" data-nav="${key      }" aria-label="${label}${key === 'profile' && profileBadgeCount ? `, ${profileBadgeCount} notifikasi` : ''}${key === 'rewards' && readyMissionChestCount ? `, ${readyMissionChestCount} peti misi siap dibuka` : ''}" aria-current="${
        page === key
          ? 'page'
          : 'false'
      }">
        <img src="${icon}" alt="" />
        ${key === 'profile' && profileBadgeCount ? `<span class="nav-pending-count" aria-hidden="true">${messageCountBadge(profileBadgeCount)}</span>` : ''}
        ${key === 'rewards' && readyMissionChestCount ? `<span class="nav-pending-count" aria-label="${readyMissionChestCount} peti misi siap dibuka">${messageCountBadge(readyMissionChestCount)}</span>` : ''}
      </button>`
  ).join('')}</nav>`;
}

function unreadMessagesCount() {
  return (state.messages || []).filter((message) => !message.readAt).length;
}

function messageCountBadge(count) {
  return count > 99 ? '99+' : String(count);
}

function purchaseHistoryReadAt() {
  if (!currentAccount?.id) return 0;
  const value = Number(localStorage.getItem(`kudo-purchase-history-read-${currentAccount.id}`));
  return Number.isFinite(value) ? value : 0;
}

function unreadVerifiedPurchaseCount() {
  if (!purchaseHistoryLoaded) return 0;
  const readAt = purchaseHistoryReadAt();
  return purchaseHistory.filter((order) => {
    if (!['paid', 'rejected'].includes(order.status)) return false;
    const verifiedAt = Date.parse(order.verifiedAt);
    return Number.isFinite(verifiedAt) && verifiedAt > readAt;
  }).length;
}

function markPurchaseHistoryRead() {
  if (!currentAccount?.id) return;
  localStorage.setItem(`kudo-purchase-history-read-${currentAccount.id}`, String(Date.now()));
}

function appFrame(
  page,
  content
) {
  const navPage =
    page.startsWith('watch-') || page === 'media-stream' || page === 'anime-episodes' || page === 'kdrama-episodes'
      ? 'focus'
      : page === 'boss-select'
        ? 'home'
      : page === 'performance' || page === 'messages'
        ? 'profile'
        : page === 'purchase-history' || isAdminPage(page)
          ? 'profile'
        : page === 'transaction'
          ? 'shop'
          : page;

  const focusModeHeader =
    page === 'focus-mode' ||
    page === 'focus-session';

  const dailyPageHeader =
    page === 'daily';

  const bossPageHeader =
    page === 'boss';
  const bossAvatarPageHeader =
    page === 'boss-select';

  const watchCatalogHeader =
    page.startsWith('watch-');

  const performancePageHeader =
    page === 'performance';

  const transactionPageHeader =
    page === 'transaction';
  const profileToolPageHeader = page === 'purchase-history' || page === 'messages' || isAdminPage(page);
  const mediaStreamPageHeader = page === 'media-stream';
  const animeEpisodesPageHeader = page === 'anime-episodes';
  const kdramaEpisodesPageHeader = page === 'kdrama-episodes';
  const showEpisodesPageHeader = animeEpisodesPageHeader || kdramaEpisodesPageHeader;

  const modePageHeader =
    focusModeHeader ||
    dailyPageHeader ||
    bossPageHeader ||
    bossAvatarPageHeader ||
    watchCatalogHeader ||
    performancePageHeader ||
    transactionPageHeader ||
    profileToolPageHeader ||
    mediaStreamPageHeader ||
    showEpisodesPageHeader;
  const title = showEpisodesPageHeader
    ? 'Episode'
    : page === 'watch-anime'
      ? 'Anime season ini'
    : page === 'watch-kdrama'
      ? 'K-drama season ini'
      : page === 'home'
        ? 'Beranda'
        : page === 'daily'
          ? 'Daily Quest'
          : page === 'boss'
            ? 'Boss Fight'
          : page === 'boss-select'
            ? 'Boss'
            : page === 'focus'
              ? 'Nonton'
              : page === 'focus-mode'
                ? 'Mode Fokus'
                : page === 'focus-session'
                  ? 'White Noise'
                  : page === 'shop'
                    ? 'Toko'
                    : page === 'rewards'
                      ? 'Hadiah'
                      : page === 'performance'
                        ? 'Performa'
                        : page === 'transaction'
                          ? 'Transaksi'
                          : page === 'purchase-history'
                            ? 'Histori pembelian'
                          : page === 'messages'
                            ? 'Pesan'
                            : isAdminPage(page)
                              ? page === 'admin' ? 'Panel admin' : ({
                                'admin-verification': 'Verifikasi pembelian',
                                'admin-history': 'Histori verifikasi',
                                'admin-add-video': 'Tambah video',
                                'admin-latest-videos': 'Video terbaru',
                              }[page] || 'Panel admin')
                            : page === 'media-stream'
                              ? 'Nonton'
                            : 'Profil';

  const heading = modePageHeader
    ? `<div class="mode-page-heading"><button class="catalog-back" type="button" data-nav="${
        page === 'focus-session'
          ? 'focus-mode'
          : bossAvatarPageHeader
            ? 'boss'
          : watchCatalogHeader
            ? 'focus'
            : showEpisodesPageHeader
              ? animeEpisodesPageHeader ? 'watch-anime' : 'watch-kdrama'
            : performancePageHeader
              ? 'profile'
              : profileToolPageHeader
                ? 'profile'
                : mediaStreamPageHeader
                  ? (currentMediaVideo?.category === 'kdrama' ? 'kdrama-episodes' : 'anime-episodes')
              : transactionPageHeader
                ? 'shop'
                : 'home'
      }" aria-label="Kembali"></button><h1>${title}</h1></div>`
    : `<span class="${
        page === 'home' ||
        page === 'rewards' ||
        page === 'focus' ||
        page === 'shop' ||
        page.startsWith('watch-')
          ? 'home-page-title'
          : ''
      }">${title}</span>`;

  return `<section class="product-screen ${
    dailyPageHeader ? 'daily-screen' : ''
  } ${
    bossPageHeader ? 'boss-screen' : ''
  }">
    <header class="product-header ${
      modePageHeader
        ? 'focus-product-header'
        : ''
    }">
      ${heading}
      ${inventoryBar()}
    </header>

    <main class="page-content">
      ${content}
    </main>

    ${bottomNav(navPage)}
  </section>`;
}

function renderWelcome() {
  app.innerHTML = `<section class="phone-screen welcome-screen" aria-label="Splash screen Kudo">
    <div class="screen-content welcome-content">
      <div class="brand-lockup" aria-label="Kudo">
        <img class="brand-logo" src="assets/kudo-login-logo.png" alt="Kudo" />
        <p>Apresiasi untuk setiap tugasmu</p>
      </div>

      <div class="welcome-actions">
        <button class="button button-primary" data-go="signup">
          Ayo mulai
        </button>

        <button class="button button-secondary" data-go="login">
          Sudah memiliki akun
        </button>
      </div>
    </div>
  </section>`;
}

function renderAuth(mode) {
  const signup = mode === 'signup';
  const title = signup
    ? 'Buat akun Kudo'
    : 'Login';

  const action = signup
    ? 'Daftar'
    : 'Masuk';

  app.innerHTML = `<section class="phone-screen auth-screen" aria-label="${
    signup ? 'Daftar' : 'Masuk'
  } ke Kudo">

    <div class="screen-content auth-content">

      <form class="auth-form"
        data-form="${mode}"
        ${signup ? '' : 'novalidate'}>

        <h1>${title}</h1>

        ${
          signup
            ? '<label class="field-label" for="name">Nama pengguna</label><input id="name" name="name" autocomplete="name" placeholder="Nama pengguna" required />'
            : ''
        }

        <label class="field-label" for="email">
          ${signup ? 'Email' : 'Nama pengguna atau email'}
        </label>

        <input
          id="email"
          name="email"
          type="${signup ? 'email' : 'text'}"
          autocomplete="username"
          placeholder="${signup ? 'Email' : 'Nama pengguna atau email'}"
          required
        />

        <label class="field-label" for="password">
          Password
        </label>

        <div class="password-wrap">
          <input
            id="password"
            name="password"
            type="password"
            autocomplete="${
              signup
                ? 'new-password'
                : 'current-password'
            }"
            placeholder="Password"
            minlength="6"
            required
          />

          <button
            class="password-toggle"
            type="button"
            aria-label="Tampilkan password"
            aria-pressed="false">
            ${icons.eyeClosed}
          </button>
        </div>

        ${
          signup
            ? '<p class="form-message signup-form-message" role="status"></p>'
            : ''
        }

        ${
          signup
            ? ''
            : '<button class="forgot-link" type="button" data-go="forgot">Lupa kata sandi</button><p class="form-message login-form-message" role="status"></p>'
        }

        <button
          class="button button-primary submit-button"
          type="submit">
          ${action}
        </button>

        <div class="social-actions">
          <button
            class="social-button auth-google-button"
            type="button"
            data-social="Google">
            <img
              class="social-mark"
              src="${ASSETS.google}"
              alt=""
            />
            Google
          </button>
        </div>

      </form>

      <p class="switch-copy">
        ${
          signup
            ? 'Sudah memiliki akun?'
            : 'Belum memiliki akun?'
        }

        <button
          type="button"
          data-go="${
            signup
              ? 'login'
              : 'signup'
          }">
          ${
            signup
              ? 'Masuk'
              : 'Daftar'
          }
        </button>
      </p>

      <p class="legal-copy">
        Dengan ${
          signup
            ? 'mendaftar'
            : 'masuk'
        } ke Kudo, kamu menyetujui<br />
        <strong>Ketentuan</strong> dan
        <strong>Kebijakan Privasi</strong> kami.
      </p>

    </div>
  </section>`;
}

function renderForgot() {
  app.innerHTML = `<section class="phone-screen auth-screen" aria-label="Reset password Kudo">
    <div class="screen-content auth-content">

      <form class="auth-form" data-form="forgot">

        <h1>Atur ulang kata sandi</h1>

        <p class="helper-copy">
          Masukkan email yang kamu gunakan untuk akun Kudo.
        </p>

        <label class="field-label" for="reset-email">
          Email
        </label>

        <input
          id="reset-email"
          name="email"
          type="email"
          autocomplete="email"
          placeholder="Email"
          required
        />

        <p class="form-message" role="status"></p>

        <div class="forgot-actions">
          <button
            class="button button-primary submit-button"
            type="submit">
            Kirim tautan
          </button>

          <button
            class="back-link"
            type="button"
            data-go="login">
            Kembali ke masuk
          </button>
        </div>

      </form>

    </div>
  </section>`;
}

function taskCard(task) {
  const date = task.deadline
    ? new Date(task.deadline).toLocaleDateString(
        'id-ID',
        {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }
      )
    : 'Tanpa tenggat';

  return `<article class="task-row ${task.done ? 'is-done' : ''}">
    <div class="task-row-main">
      <div class="task-copy"><strong>${escapeHtml(task.title)}</strong><span>${date}</span></div>
      <button class="task-check ${task.done ? 'checked' : ''}" type="button" data-complete="${task.id}" aria-label="${task.done ? 'Selesai' : 'Selesaikan'}: ${escapeHtml(task.title)}">${task.done ? '✓' : ''}</button>
      <button class="task-delete" type="button" data-delete="${task.id}" aria-label="Hapus ${escapeHtml(task.title)}"><img src="assets/trash-icon.png" alt="" /></button>
    </div>
    ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}
    ${task.photo ? `<button class="task-photo-preview" type="button" data-action="view-task-photo" data-photo="${task.photo}" aria-label="Perbesar lampiran ${escapeHtml(task.title)}"><img src="${task.photo}" alt="Lampiran tugas: ${escapeHtml(task.title)}" /></button>` : ''}
  </article>`;
}

function renderPasswordReset() {
  app.innerHTML = `<section class="phone-screen auth-screen" aria-label="Buat kata sandi baru">
    <div class="screen-content auth-content">
      <form class="auth-form" data-form="password-reset">
        <h1>Buat kata sandi baru</h1>
        <label class="field-label" for="reset-new-password">Password baru</label>
        <input id="reset-new-password" name="password" type="password" autocomplete="new-password" minlength="6" required />
        <p class="form-message" role="status"></p>
        <button class="button button-primary submit-button" type="submit">Simpan password</button>
      </form>
    </div>
  </section>`;
}

function renderHome() {
  const content = `
    <section class="add-task-card">
      <div>
        <h1>Tambah tugasmu</h1>
        <p>
          Tambah tugas baru untuk mulai mengerjakan
          bersama Kudo.
        </p>
      </div>

      <button
        class="add-task-button"
        type="button"
        data-action="add-task"
        aria-label="Tambah tugas">
        ${icons.plus}
      </button>
    </section>

    <button
      class="feature-card feature-easy"
      type="button"
      data-nav="daily">

      <div class="feature-art">
        <img
          src="${ASSETS.artDaily}"
          alt="Dua anak belajar bersama kucing"
        />
      </div>

      <span class="feature-cta">
        Daily Quest
      </span>

    </button>

    <button
      class="feature-card feature-hard"
      type="button"
      data-nav="boss">

      <div class="feature-art">
        <img
          src="${ASSETS.artBoss}"
          alt="Anak-anak menghadapi tumpukan tugas"
        />
      </div>

      <span class="feature-cta">
        Boss Fight
      </span>

    </button>

    <button
      class="feature-card feature-focus"
      type="button"
      data-nav="focus-mode">

      <div class="feature-art">
        <img
          src="${ASSETS.artFocus}"
          alt="Anak-anak dan kucing belajar dengan semangat"
        />
      </div>

      <span class="feature-cta">
        Mode Fokus
      </span>

    </button>`;

  app.innerHTML =
    appFrame(
      'home',
      content
    );
}

function renderTaskCreate() {
  taskPhotoData = '';

  const today =
    new Date()
      .toISOString()
      .slice(0, 10);

  app.innerHTML = `
    <section class="task-create-screen">

      <header class="product-header focus-product-header task-create-inventory">

        <div class="mode-page-heading">
          <button
            class="catalog-back"
            type="button"
            data-nav="home"
            aria-label="Kembali">
          </button>

          <h1>Tambah Tugas</h1>
        </div>

        ${inventoryBar()}

      </header>

      <main class="task-create-content">

        <div class="task-create-hero">
          <img
            src="${ASSETS.artDaily}"
            alt="Kudo belajar bersama"
          />
        </div>

        <form
          class="task-create-form"
          data-form="task-add">

          <label for="task-title">
            Nama tugas
          </label>

          <input
            id="task-title"
            name="title"
            placeholder="Contoh: Kerjakan laporan"
            maxlength="90"
            required
          />

          <label for="task-deadline">
            Tenggat waktu
          </label>

          <input
            id="task-deadline"
            name="deadline"
            type="date"
            min="${today}"
            required
          />

          <label
            class="upload-title"
          for="task-photo-input">
            Lampiran
          </label>

          <div class="upload-box">
            <label
              class="upload-area"
              for="task-photo-input">

              <strong>
                Lampirkan gambar tugas
              </strong>

              <img
                class="upload-preview"
                alt="Pratinjau foto tugas"
                hidden
              />

            </label>

            <small class="upload-status" role="status" hidden></small>
            <button
              class="upload-remove"
              type="button"
              data-action="remove-task-photo"
              aria-label="Hapus gambar lampiran"
              hidden>×</button>
          </div>

          <input
            id="task-photo-input"
            name="photo"
            type="file"
            accept="image/*"
            hidden
          />

          <label for="task-description">
            Deskripsi (opsional)
          </label>

          <textarea
            id="task-description"
            name="description"
            maxlength="500"
            rows="3"
            placeholder="Tambahkan detail tugas"
          ></textarea>

          <button
            class="button button-primary task-create-submit"
            type="submit">
            Tambahkan
          </button>

        </form>

      </main>

    </section>`;
}

function renderTaskPage(kind) {
  pruneExpiredCompletedTasks();
  const hard = kind === 'hard';
  const page = hard
    ? 'boss'
    : 'daily';

  const all = state.tasks.filter(
    (task) =>
      task.difficulty ===
      (hard
        ? 'hard'
        : 'easy')
  );

  const done = all.filter(
    (task) => task.done
  ).length;

  const visibleTasks = all.filter((task) => !task.done);
  const taskPageSize = 3;
  const taskPageCount = Math.max(1, Math.ceil(visibleTasks.length / taskPageSize));
  taskListPages[page] = Math.min(taskListPages[page] || 0, taskPageCount - 1);
  const pageTasks = visibleTasks.slice(taskListPages[page] * taskPageSize, (taskListPages[page] + 1) * taskPageSize);
  const trackedTaskCount = visibleTasks.length + done;
  const percent = trackedTaskCount
    ? Math.round(
        (done / trackedTaskCount) * 100
      )
    : 0;

  const hp = Math.max(0, Math.min(100, Number(state.bossHealth ?? 100)));
  const activeBoss = BOSS_AVATARS[state.bossAvatar] || BOSS_AVATARS['paper-task'];

  const content = `
    ${
      hard
        ? `
          <h2 class="boss-subtitle">
            ${escapeHtml(activeBoss.name)}
          </h2>

          <div class="boss-health">
            <div class="boss-health-track">
              <span style="width:${hp}%"></span>
            </div>

            <strong>
              ${hp} / 100
            </strong>
          </div>
        `
        : ''
    }

    ${
      hard
        ? `<div class="quest-illustration quest-boss"><div class="quest-boss-panel"></div><button class="quest-boss-avatar" type="button" data-nav="boss-select" aria-label="Pilih boss: ${escapeHtml(activeBoss.name)}"><img src="${activeBoss.image}" alt="${escapeHtml(activeBoss.alt)}" /></button></div>`
        : `<div class="quest-illustration quest-daily"><img src="${ASSETS.artDaily}" alt="Dua anak belajar bersama kucing" /></div>`
    }

    <section class="quest-stats ${
      hard
        ? 'boss-stats'
        : ''
    }">

      <div>
        <span>Total tugas</span>
        <strong>${visibleTasks.length}</strong>
      </div>

      <div>
        <span>Selesai</span>
        <strong>${done}</strong>
      </div>

    </section>

    ${
      hard
        ? ''
        : `
          <div class="progress-track">
            <span style="width:${percent}%"></span>
          </div>

          <p class="progress-label">
            ${percent}% selesai
          </p>
        `
    }

    <div class="task-list">

      ${
        visibleTasks.length
          ? `${pageTasks
              .map(taskCard)
              .join('')}${taskPageCount > 1 ? `<nav class="task-list-pagination" aria-label="Navigasi daftar tugas"><button type="button" data-action="task-list-page" data-kind="${page}" data-page="${taskListPages[page] - 1}" aria-label="Halaman sebelumnya" ${taskListPages[page] === 0 ? 'disabled' : ''}></button><span>Halaman ${taskListPages[page] + 1} dari ${taskPageCount}</span><button type="button" data-action="task-list-page" data-kind="${page}" data-page="${taskListPages[page] + 1}" aria-label="Halaman berikutnya" ${taskListPages[page] >= taskPageCount - 1 ? 'disabled' : ''}></button></nav>` : ''}`
          : `
            <div class="empty-state">

              <strong>
                Belum ada tugas ${hard ? 'sulit' : 'mudah'}
              </strong>

              <p>
                Tambah tugas baru untuk mulai mengerjakan bersama Kudo.
              </p>

              <button
                class="button button-primary"
                type="button"
                data-action="add-task">
                Tambah tugas
              </button>

            </div>
          `
      }

    </div>`;

  app.innerHTML =
    appFrame(
      page,
      content
    );
}

function renderBossAvatarSelection() {
  if (!Object.hasOwn(BOSS_AVATARS, selectedBossAvatar)) {
    selectedBossAvatar = Object.hasOwn(BOSS_AVATARS, state.bossAvatar) ? state.bossAvatar : 'paper-task';
  }
  const choices = Object.entries(BOSS_AVATARS).map(([id, boss]) => (
    `<button class="boss-avatar-choice ${selectedBossAvatar === id ? 'is-selected' : ''}" type="button" data-action="select-boss-avatar" data-boss-avatar="${id}" aria-label="${escapeHtml(boss.name)}" aria-pressed="${selectedBossAvatar === id}"><img src="${boss.image}" alt="" /></button>`
  )).join('');
  const content = `<section class="boss-avatar-page"><h2>Pilih boss yang ingin kamu lawan</h2><p>Avatar boss bisa diganti kapan saja.</p><div class="boss-avatar-grid">${choices}</div><button class="button button-primary boss-avatar-confirm" type="button" data-action="confirm-boss-avatar">Konfirmasi</button></section>`;
  app.innerHTML = appFrame('boss-select', content);
}

function normalizeShowTitle(title) {
  const normalizedTitle = String(title || '').trim().toLocaleLowerCase();
  if (normalizedTitle === 'frieren') return "frieren: beyond journey's end";
  if (/^teach\s+(?:you|your)\s+(?:a\s+)?lesson$/.test(normalizedTitle)) return 'teach you a lesson';
  return normalizedTitle;
}

function renderFocus() {
  const groups = [
    {
      title: 'Anime season ini',
      key: 'anime',
      shows: [
        [
          'Delicious in Dungeon',
          ASSETS.posterDungeon
        ],
        [
          "Frieren: Beyond Journey's End",
          ASSETS.posterFrieren
        ]
      ]
    },
    {
      title: 'K-drama season ini',
      key: 'kdrama',
      shows: [
        [
          'Nine Puzzle',
          ASSETS.posterPuzzles
        ],
        [
          'Teach You a Lesson',
          ASSETS.posterTeach
        ]
      ]
    }
  ];
  for (const group of groups) {
    const videosByShow = new Map();
    catalogVideos.filter((video) => video.category === group.key).forEach((video) => {
      const normalizedTitle = normalizeShowTitle(video.show_title);
      if (!videosByShow.has(normalizedTitle)) videosByShow.set(normalizedTitle, video);
    });
    const builtIns = group.shows;
    group.shows = [...videosByShow.entries()]
      .sort(([firstTitle], [secondTitle]) => firstTitle.localeCompare(secondTitle))
      .map(([, video]) => {
        const existing = builtIns.find(([title]) => normalizeShowTitle(title) === normalizeShowTitle(video.show_title));
        return [
          video.show_title,
          catalogPosterUrl(video) || existing?.[1] || (group.key === 'anime' ? ASSETS.posterDungeon : ASSETS.posterPuzzles),
          video.id,
        ];
      });
    builtIns.forEach((show) => {
      if (!videosByShow.has(normalizeShowTitle(show[0]))) group.shows.push(show);
    });
    group.shows = group.shows.slice(0, 2);
  }

  const content = `
    <section class="watch-hero">

      <div class="watch-hero-copy">

        <h1>
          Tonton tayangan<br />
          kesukaan mu
        </h1>

        <p>
          Hilangkan rasa penatmu
          dengan tayangan yang menghibur.
        </p>

      </div>

      <img
        src="${ASSETS.watchHero}"
        alt="Kudo menonton tayangan bersama"
      />

    </section>

    ${groups
      .map(
        (group) => `
          <section class="watch-category">

            <h2>
              ${group.title}
            </h2>

            <div class="episode-panel">

              <div class="episode-panel-heading">

                <h3>
                  Episode terbaru
                </h3>

                <button
                  type="button"
                  data-action="show-watch-all"
                  data-nav="watch-${group.key}"
                  data-category="${group.key}">
                  Lihat semuanya
                </button>

              </div>

              <div class="poster-row">

                ${group.shows
                  .map(
                    ([name, poster, videoId]) => `
                      <button
                        class="watch-poster"
                        type="button"
                        data-action="watch-show"
                        data-show="${escapeHtml(name)}"
                        data-category="${group.key}"
                        ${videoId ? `data-video-id="${escapeHtml(videoId)}"` : ''}
                        aria-label="Tonton ${escapeHtml(name)}">

                        <img
                          src="${poster}"
                          alt="Poster ${escapeHtml(name)}"
                        />

                      </button>
                    `
                  )
                  .join('')}

              </div>

            </div>

          </section>
        `
      )
      .join('')}

    ${
      toast
        ? `<p class="watch-notice" role="status">
            ${escapeHtml(toast)}
          </p>`
        : ''
    }`;

  app.innerHTML =
    appFrame(
      'focus',
      content
    );
  if (!catalogVideosLoaded) void refreshCatalogVideos();
}

function renderWatchCatalog(kind) {
  const anime = kind === 'anime';
  const filters = watchFilters[kind];
  const content = `<section class="watch-catalog-page">
    <label class="catalog-search"><span aria-hidden="true">⌕</span><input type="search" data-watch-search placeholder="Cari ${anime ? 'anime' : 'K-drama'}..." value="${escapeHtml(watchSearch)}" aria-label="Cari ${anime ? 'anime' : 'K-drama'}" /></label>
    <div class="catalog-filters" aria-label="Filter tayangan">
      <button class="catalog-filter-button" type="button" data-action="open-watch-filter" data-filter-key="genre"><span>${filters.genre === 'Semuanya' ? 'Genre' : escapeHtml(filters.genre)}</span><i aria-hidden="true"></i></button>
      <button class="catalog-filter-button" type="button" data-action="open-watch-filter" data-filter-key="type"><span>${filters.type === 'Semuanya' ? 'Jenis' : escapeHtml(filters.type)}</span><i aria-hidden="true"></i></button>
    </div>
    <div class="catalog-grid">${renderWatchCatalogResults(kind)}</div>
  </section>`;
  app.innerHTML = appFrame(anime ? 'watch-anime' : 'watch-kdrama', content);
  if (!catalogVideosLoaded) void refreshCatalogVideos();
}

function renderWatchCatalogResults(kind) {
  const filters = watchFilters[kind];
  const catalogShows = new Map();
  catalogVideos
    .filter((video) => video.category === kind)
    .forEach((video) => {
      const key = normalizeShowTitle(video.show_title);
      const series = catalogShows.get(key);
      if (!series) catalogShows.set(key, video);
    });
  const shows = kind === 'anime'
    ? [
        {
          title: 'Delicious in Dungeon',
          poster: ASSETS.posterDungeon,
          genres: ['Petualangan', 'Fantasi', 'Memasak', 'Komedi'],
          type: 'Series',
        },
        {
          title: "Frieren: Beyond Journey's End",
          poster: ASSETS.posterFrieren,
          genres: ['Petualangan', 'Fantasi', 'Drama'],
          type: 'Series',
        },
      ]
    : [
        {
          title: 'Nine Puzzle',
          poster: ASSETS.posterPuzzles,
          genres: ['Aksi', 'Thriller', 'Komedi', 'Drama', 'Sekolah'],
          type: 'Series',
        },
        {
          title: 'Teach You a Lesson',
          poster: ASSETS.posterTeach,
          genres: ['Misteri', 'Kejahatan', 'Thriller', 'Psikologi', 'Drama'],
          type: 'Series',
        },
      ];
  const additionalShows = [];
  catalogShows.forEach((video, normalizedTitle) => {
    const existingShow = shows.find((show) => normalizeShowTitle(show.title) === normalizedTitle);
    if (existingShow) {
      existingShow.videoId = video.id;
      existingShow.episodeTitle = video.episode_title;
      existingShow.episodeNumber = video.episode_number;
      existingShow.poster = catalogPosterUrl(video) || existingShow.poster;
      existingShow.genres = Array.isArray(video.genres) && video.genres.length
        ? video.genres
        : existingShow.genres;
      existingShow.type = video.show_type || existingShow.type;
      existingShow.description = video.show_description || existingShow.description || '';
    } else {
      additionalShows.push({
        title: video.show_title,
        poster: catalogPosterUrl(video) || (kind === 'anime' ? ASSETS.posterDungeon : ASSETS.posterPuzzles),
        genres: Array.isArray(video.genres) ? video.genres : [],
        type: video.show_type || 'Series',
        description: video.show_description || '',
        videoId: video.id,
        episodeTitle: video.episode_title,
        episodeNumber: video.episode_number,
      });
    }
  });
  additionalShows.sort((first, second) => normalizeShowTitle(first.title).localeCompare(normalizeShowTitle(second.title)));
  shows.push(...additionalShows);
  const filtered = shows.filter((show) => {
    const genreMatches = filters.genre === 'Semuanya' || show.genres.includes(filters.genre);
    const typeMatches = filters.type === 'Semuanya' || show.type === filters.type;
    const searchableText = `${show.title} ${show.episodeTitle || ''} ${show.genres.join(' ')} ${show.type}`.toLocaleLowerCase();
    const searchMatches = !watchSearch || searchableText.includes(watchSearch.toLocaleLowerCase());
    return genreMatches && typeMatches && searchMatches;
  });
  const pageSize = 6;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  watchCatalogPage[kind] = Math.min(watchCatalogPage[kind], pageCount);
  const page = watchCatalogPage[kind];
  const pageShows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const catalogItems = pageShows.map((show) => `<article class="catalog-show">
      <button class="catalog-poster" type="button" data-action="watch-show" data-show="${escapeHtml(show.title)}" data-category="${kind}" ${show.videoId ? `data-video-id="${escapeHtml(show.videoId)}"` : ''} aria-label="Tonton ${escapeHtml(show.title)}"><img src="${show.poster}" alt="Poster ${escapeHtml(show.title)}" /></button>
      <button class="catalog-title-button" type="button" data-action="watch-show" data-show="${escapeHtml(show.title)}" data-category="${kind}" ${show.videoId ? `data-video-id="${escapeHtml(show.videoId)}"` : ''}>${escapeHtml(show.title)}</button>
      <div class="catalog-genres">${show.genres.map((genre) => `<span>${escapeHtml(genre)}</span>`).join('')}</div>
    </article>`).join('');
  if (!filtered.length) return '<p class="catalog-empty">Tidak ada tayangan yang cocok dengan filter.</p>';
  if (pageCount > 1) {
    return `${catalogItems}<nav class="catalog-pagination" aria-label="Pagination katalog">
      <button type="button" data-action="watch-catalog-page" data-kind="${kind}" data-page="${page - 1}" aria-label="Halaman sebelumnya" ${page === 1 ? 'disabled' : ''}></button>
      <span>Halaman ${page} dari ${pageCount}</span>
      <button type="button" data-action="watch-catalog-page" data-kind="${kind}" data-page="${page + 1}" aria-label="Halaman berikutnya" ${page === pageCount ? 'disabled' : ''}></button>
    </nav>`;
  }
  return catalogItems;
}

function renderFocusMode() {
  const sounds = [
    [
      'Rain',
      'White noise',
      ASSETS.noiseRain
    ],
    [
      'Ocean Waves',
      'White noise',
      ASSETS.noiseOcean
    ],
    [
      'Forest',
      'White noise',
      ASSETS.noiseForest
    ]
  ];

  const content = `
    <section class="focus-mode-hero">
      <img
        src="${ASSETS.artFocus}"
        alt="Kudo belajar bersama"
      />
    </section>

    <section class="noise-section">

      <h2>
        White Noise
      </h2>

      <div class="noise-list">

        ${sounds
          .map(
            ([name, description, image]) => `
              <button
                class="noise-option"
                type="button"
                data-noise="${name}">

                <img
                  class="noise-icon"
                  src="${image}"
                  alt=""
                />

                <span>
                  <strong>${name}</strong>
                  <small>${description}</small>
                </span>

              </button>
            `
          )
          .join('')}

      </div>

    </section>`;

  app.innerHTML =
    appFrame(
      'focus-mode',
      content
    );
}

function renderFocusSession() {
  const session =
    state.activeFocus;

  if (!session) {
    app.innerHTML =
      appFrame(
        'focus-mode',
        '<p class="empty-state">Pilih white noise untuk memulai sesi.</p>'
      );

    return;
  }

  const sounds = [
    ['Rain', ASSETS.noiseRain],
    [
      'Ocean Waves',
      ASSETS.noiseOcean
    ],
    [
      'Forest',
      ASSETS.noiseForest
    ]
  ];

  const selected =
    sounds.find(
      ([name]) =>
        name === session.noise
    ) || sounds[0];

  const duration =
    (session.duration || 3600000) /
    1000;

  const remaining =
    session.paused
      ? Math.ceil(
          (session.remaining || 0) /
            1000
        )
      : Math.max(
          0,
          Math.ceil(
            (session.endsAt -
              Date.now()) /
              1000
          )
        );

  const elapsed = Math.min(
    100,
    Math.max(
      0,
      ((duration - remaining) /
        duration) *
        100
    )
  );

  const skipPrevious =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h2v14H6zM19 6v12L9 12z" /></svg>';

  const skipNext =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 5h2v14h-2zM5 6v12l10-6z" /></svg>';

  const playerIcon =
    session.paused
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM14 5h4v14h-4z" /></svg>';

  const content = `
    <section class="focus-session-page">

      <img
        class="focus-session-art"
        src="${selected[1]}"
        alt="Suasana ${selected[0]}"
      />

      <h2>
        ${selected[0]}
      </h2>

      <p class="focus-session-subtitle">
        White noise
      </p>

      <div class="focus-session-track">
        <span
          id="focus-progress"
          style="width:${elapsed}%">
        </span>
      </div>

      <div
        class="focus-session-time"
        id="focus-timer">
        ${formatTime(remaining)}
      </div>

      <div class="player-controls">

        <button
          class="session-skip"
          type="button"
          data-action="switch-focus-sound"
          data-direction="previous"
          aria-label="Suara sebelumnya">
          ${skipPrevious}
        </button>

        <button
          class="round-control session-play"
          type="button"
          data-action="toggle-focus-player"
          aria-label="${
            session.paused
              ? 'Putar'
              : 'Jeda'
          }">
          ${playerIcon}
        </button>

        <button
          class="session-skip"
          type="button"
          data-action="switch-focus-sound"
          data-direction="next"
          aria-label="Suara berikutnya">
          ${skipNext}
        </button>

      </div>

      <section class="focus-recommendations">

        <h3>
          Rekomendasi
        </h3>

        <div>
          ${sounds
            .filter(
              ([name]) =>
                name !==
                session.noise
            )
            .map(
              ([name, image]) => `
                <button
                  type="button"
                  data-action="switch-focus-sound"
                  data-noise="${name}">

                  <img
                    src="${image}"
                    alt=""
                  />

                  <span class="focus-recommendation-copy">
                    <strong>${name}</strong>
                    <small>White noise</small>
                  </span>

                </button>
              `
            )
            .join('')}
        </div>

      </section>

    </section>`;

  app.innerHTML =
    appFrame(
      'focus-session',
      content
    );
}
function renderShop() {
  const content = `<section class="shop-feature-banner"><div class="shop-feature-copy"><h1>Fitur-fitur untuk membantumu</h1><p>Jelajahi fitur untuk mendapatkan item yang dapat membantumu.</p></div><img src="${ASSETS.shopFeature}" alt="Kudo membawa berlian dan penambah waktu" /></section>
    <section class="shop-section"><h2>Berlian</h2><div class="diamond-pack-grid"><button class="diamond-pack-card" type="button" data-action="buy-diamond-pack" data-amount="1200"><img src="${ASSETS.rewardDiamonds}" alt="" /><strong>1.200</strong><span>Rp 10.000</span></button><button class="diamond-pack-card" type="button" data-action="buy-diamond-pack" data-amount="2000"><img src="${ASSETS.rewardDiamonds}" alt="" /><strong>2.000</strong><span>Rp 15.000</span></button></div></section>
    <section class="shop-section"><h2>Penambah waktu</h2><article class="shop-product-card"><img class="shop-product-art" src="${ASSETS.hourglass}" alt="" /><div class="shop-product-copy"><h3>Penambah waktu</h3><p>Tambahkan waktu mu dan taklukan tugasmu</p><button type="button" data-action="buy-hourglass" data-cost="50"><img src="${ASSETS.diamondItem}" alt="" /> 50</button></div></article></section>
    <section class="shop-section"><h2>Tiket nonton</h2><article class="shop-product-card"><img class="shop-product-art shop-ticket-art" src="${ASSETS.ticket}" alt="" /><div class="shop-product-copy"><h3>Tiket nonton</h3><p>Nikmati waktu istirahat dengan menonton yang menarik</p><button type="button" data-action="buy-chest" data-cost="100"><img src="${ASSETS.diamondItem}" alt="" /> 100</button></div></article></section>
    ${toast ? `<p class="inline-notice" role="status">${escapeHtml(toast)}</p>` : ''}`;
  app.innerHTML = appFrame('shop', content);
}

function formatVideoTime(seconds) {
  const value = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const remainder = value % 60;
  return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}` : `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
}

function animeSimilarMarkup() {
  const suggestions = selectedAnime === 'Delicious in Dungeon'
    ? [{ title: "Frieren: Beyond Journey's End", poster: ASSETS.posterFrieren }]
    : [{ title: 'Delicious in Dungeon', poster: ASSETS.posterDungeon }];
  return `<div class="anime-similar-grid">${suggestions.map((show) => `<article class="anime-similar-item"><button class="anime-similar-card" type="button" data-action="watch-show" data-show="${escapeHtml(show.title)}" aria-label="Tonton ${escapeHtml(show.title)}"><img src="${show.poster}" alt="Poster ${escapeHtml(show.title)}" /></button><strong>${escapeHtml(show.title)}</strong></article>`).join('')}</div>`;
}

function animeEpisodeThumbnailPath(episodeNumber, isDungeon, catalogThumbnail = '') {
  if (catalogThumbnail) return catalogThumbnail;
  if (isDungeon) {
    if (episodeNumber === 2) return 'assets/dungeon-meshi-episode-2-thumbnail.png';
    if (episodeNumber === 3) return 'assets/dungeon-meshi-episode-3-thumbnail.png';
    return 'assets/dungeon-meshi-episode-thumbnail.png';
  }
  if (episodeNumber === 2) return 'assets/frieren-episode-2-thumbnail.png';
  if (episodeNumber === 3) return 'assets/frieren-episode-3-thumbnail.png';
  return 'assets/frieren-episode-thumbnail.png';
}

function renderAnimeTabContent() {
  const defaults = builtInShowMetadata(selectedAnime);
  const series = catalogVideos.find((video) => (
    video.category === 'anime'
    && normalizeShowTitle(video.show_title) === normalizeShowTitle(selectedAnime)
    && (video.show_description || video.episode_description || video.thumbnail_url)
  ));
  if (animeStreamTab === 'description') {
    return `<p class="anime-description">${escapeHtml(series?.show_description || series?.episode_description || defaults?.description || '')}</p>`;
  }
  if (animeStreamTab === 'similar') return animeSimilarMarkup();
  return renderAnimeEpisodeList();
}

function renderAnimeEpisodeList() {
  const isDungeon = normalizeShowTitle(selectedAnime) === normalizeShowTitle('Delicious in Dungeon');
  const isFrieren = normalizeShowTitle(selectedAnime) === normalizeShowTitle("Frieren: Beyond Journey's End");
  const selectedAsset = getSelectedAnimeVideoAsset();
  const episodes = getAnimeCatalogEpisodes(selectedAnime);
  if (episodes.length) {
    const selectedVideoId = selectedAsset?.id;
    const listedEpisodes = [...episodes];
    if (isFrieren) {
      [2, 3].forEach((episodeNumber) => {
        if (!listedEpisodes.some((episode) => episode.episodeNumber === episodeNumber)) {
          listedEpisodes.push({
            id: `unavailable-frieren-episode-${episodeNumber}`,
            showTitle: selectedAnime,
            episodeNumber,
            unavailable: true,
          });
        }
      });
    }
    listedEpisodes.sort((first, second) => first.episodeNumber - second.episodeNumber);
    return `<div class="anime-episode-list">${listedEpisodes.map((episode) => {
      const thumbnailPath = animeEpisodeThumbnailPath(
        episode.episodeNumber,
        isDungeon,
        episode.thumbnail_url,
      );
      const thumbnail = `<img class="anime-episode-thumbnail" src="${escapeHtml(thumbnailPath)}" alt="" />`;
      if (episode.unavailable) {
        return `<article class="anime-episode-card anime-episode-unavailable">${thumbnail}<span><strong>Episode ${episode.episodeNumber} - ${escapeHtml(selectedAnime)}</strong><small>Video belum tersedia</small></span></article>`;
      }
      const isSelected = episode.id === selectedVideoId;
      return `<button class="anime-episode-card${isSelected ? ' is-active' : ''}" type="button" data-action="select-anime-catalog-episode" data-video-id="${escapeHtml(episode.id)}" aria-pressed="${isSelected}">${thumbnail}<span><strong>${escapeHtml(animeEpisodeTitle(episode))}</strong><small class="${isSelected ? 'anime-episode-duration' : ''}">${isSelected ? 'Memuat durasi...' : 'Pilih untuk memutar'}</small></span></button>`;
    }).join('')}</div>`;
  }
  if (!isDungeon && !isFrieren) return '<p class="anime-episode-empty">Episode belum tersedia.</p>';
  const thumbnail = `<img class="anime-episode-thumbnail" src="${animeEpisodeThumbnailPath(1, isDungeon)}" alt="" />`;
  return `<div class="anime-episode-list">${[1, 2, 3].map((episodeNumber) => (
    episodeNumber === 1
      ? `<button class="anime-episode-card" type="button" data-action="select-anime-catalog-episode" data-video-id="${escapeHtml(selectedAsset?.id || '')}">${thumbnail}<span><strong>${escapeHtml(animeEpisodeTitle(selectedAsset))}</strong><small>Pilih untuk memutar</small></span></button>`
      : `<article class="anime-episode-card anime-episode-unavailable"><img class="anime-episode-thumbnail" src="${escapeHtml(animeEpisodeThumbnailPath(episodeNumber, isDungeon))}" alt="" /><span><strong>Episode ${episodeNumber} - ${escapeHtml(selectedAnime)}</strong><small>Video belum tersedia</small></span></article>`
  )).join('')}</div>`;
}

function requestStreamTicket(category, videoId, showTitle) {
  modal = {
    type: 'anime-ticket-gate',
    category,
    videoId,
    showTitle,
  };
  render();
}

function renderAnimeEpisodes() {
  const showTitle = normalizeShowTitle(selectedAnime) === normalizeShowTitle("Frieren: Beyond Journey's End")
    ? "Frieren: Beyond Journey's End"
    : selectedAnime;
  const isDungeon = normalizeShowTitle(selectedAnime) === normalizeShowTitle('Delicious in Dungeon');
  const poster = builtInEpisodePoster(showTitle)
    || catalogShowEpisodePoster(showTitle, 'anime')
    || builtInShowMetadata(showTitle)?.episodePoster
    || (isDungeon ? 'assets/dungeon-meshi-episode-poster.png' : 'assets/frieren-episode-poster.png');
  const content = `<section class="anime-episodes-page"><img class="anime-episodes-poster" src="${poster}" alt="Poster ${escapeHtml(showTitle)}" /><h1 class="anime-stream-title">${escapeHtml(showTitle)}</h1>${toast ? `<p class="watch-notice" role="status">${escapeHtml(toast)}</p>` : ''}<div class="anime-stream-tab-content">${renderAnimeEpisodeList()}</div></section>`;
  app.innerHTML = appFrame('anime-episodes', content);
  if (!catalogVideosLoaded) void refreshCatalogVideos();
}

function renderKdramaEpisodes() {
  const showTitle = currentMediaVideo?.show_title || '';
  const metadata = builtInShowMetadata(showTitle);
  const seriesVideos = catalogVideos
    .filter((video) => (
      video.category === 'kdrama'
      && normalizeShowTitle(video.show_title) === normalizeShowTitle(showTitle)
    ))
    .sort((first, second) => Number(first.episode_number) - Number(second.episode_number));
  const poster = builtInEpisodePoster(showTitle)
    || catalogShowEpisodePoster(showTitle, 'kdrama')
    || kdramaEpisodePoster(showTitle, metadata?.episodePoster)
    || currentMediaVideo?.poster_url || metadata?.poster || '';
  const episodes = seriesVideos.filter((video) => (
    Number.isFinite(Number(video.episode_number)) && Number(video.episode_number) > 0
  ));
  const episodeMarkup = episodes.length
    ? episodes.map((video) => {
      const episodeNumber = Number(video.episode_number);
      const thumbnail = kdramaEpisodeThumbnail(
        showTitle,
        episodeNumber,
        video.thumbnail_url || catalogPosterUrl(video, true) || kdramaEpisodePoster(video.show_title, catalogPosterUrl(video) || poster),
      );
      const title = kdramaEpisodeLabel(showTitle, episodeNumber);
      return `<button class="anime-episode-card" type="button" data-action="open-kdrama-episode" data-video-id="${escapeHtml(video.id)}"><img class="anime-episode-thumbnail" src="${escapeHtml(thumbnail)}" alt="" /><span><strong>${escapeHtml(title)}</strong><small>Pilih untuk memutar</small></span></button>`;
    }).join('')
    : [1, 2].map((episodeNumber) => {
      const thumbnail = kdramaEpisodeThumbnail(showTitle, episodeNumber, poster);
      const title = kdramaEpisodeLabel(showTitle, episodeNumber);
      return `<article class="anime-episode-card anime-episode-unavailable"><img class="anime-episode-thumbnail" src="${escapeHtml(thumbnail)}" alt="" /><span><strong>${escapeHtml(title)}</strong><small>Video belum tersedia</small></span></article>`;
    }).join('');
  const content = `<section class="anime-episodes-page"><img class="anime-episodes-poster" src="${escapeHtml(poster)}" alt="Poster ${escapeHtml(showTitle)}" /><h1 class="anime-stream-title">${escapeHtml(showTitle)}</h1>${toast ? `<p class="watch-notice" role="status">${escapeHtml(toast)}</p>` : ''}<div class="anime-episode-list">${episodeMarkup}</div></section>`;
  app.innerHTML = appFrame('kdrama-episodes', content);
  if (!catalogVideosLoaded) void refreshCatalogVideos();
}

function selectAnimeEpisodeTab() {
  animeStreamTab = 'episode';
  app.querySelectorAll('[data-anime-tab]').forEach((tab) => {
    tab.classList.toggle('is-active', tab.dataset.animeTab === 'episode');
  });
  const tabContent = app.querySelector('.anime-stream-tab-content');
  if (tabContent) tabContent.innerHTML = renderAnimeTabContent();
  updateAnimeVideoUi(animeVideoElement);
}

function animeEpisodeTitle(asset) {
  const episodeNumber = Number(asset?.episodeNumber) || 1;
  const showTitle = normalizeShowTitle(asset?.showTitle || selectedAnime);
  const displayTitle = showTitle === normalizeShowTitle("Frieren: Beyond Journey's End")
    ? "Frieren: Beyond Journey's End"
    : asset?.showTitle || selectedAnime;
  return `Episode ${episodeNumber} - ${displayTitle}`;
}

function getSelectedAnimeVideoAssetId() {
  const savedAssetId = state.animeVideoAssets?.[selectedAnime];
  return ANIME_VIDEO_ASSETS[savedAssetId]?.showTitle.toLocaleLowerCase() === selectedAnime.toLocaleLowerCase()
    ? savedAssetId
    : DEFAULT_ANIME_VIDEO_ASSETS[selectedAnime];
}

function getAnimeVideoAsset(assetId) {
  const asset = ANIME_VIDEO_ASSETS[assetId];
  if (!asset) return null;
  const catalogVideo = catalogVideos.find((video) => (
    video.category === 'anime'
    && video.show_title.toLocaleLowerCase() === asset.showTitle.toLocaleLowerCase()
    && Number(video.episode_number) === asset.episodeNumber
  ));
  return { ...asset, src: catalogVideo ? catalogVideoUrl(catalogVideo) : asset.fallbackSrc || '' };
}

function getAnimeCatalogEpisodes(showTitle) {
  const requestedTitle = normalizeShowTitle(showTitle);
  const episodes = catalogVideos
    .filter((video) => (
      video.category === 'anime'
      && normalizeShowTitle(video.show_title) === requestedTitle
    ))
    .map((video) => ({
      ...video,
      id: video.id,
      showTitle,
      episodeNumber: Number(video.episode_number),
      src: catalogVideoUrl(video),
    }))
    .filter((video) => Number.isInteger(video.episodeNumber) && video.episodeNumber > 0 && video.src)
    .sort((first, second) => first.episodeNumber - second.episodeNumber);
  const fallbackAssetId = Object.entries(DEFAULT_ANIME_VIDEO_ASSETS)
    .find(([title]) => normalizeShowTitle(title) === requestedTitle)?.[1];
  const fallbackAsset = ANIME_VIDEO_ASSETS[fallbackAssetId];
  if (
    fallbackAsset?.fallbackSrc
    && !episodes.some((episode) => episode.episodeNumber === fallbackAsset.episodeNumber)
  ) {
    episodes.push({
      ...fallbackAsset,
      id: fallbackAssetId,
      showTitle,
      episodeNumber: fallbackAsset.episodeNumber,
      src: fallbackAsset.fallbackSrc,
    });
    episodes.sort((first, second) => first.episodeNumber - second.episodeNumber);
  }
  return episodes;
}

function getSelectedAnimeVideoAsset() {
  const episodes = getAnimeCatalogEpisodes(selectedAnime);
  const selectedEpisode = episodes.find((episode) => episode.id === selectedAnimeCatalogVideoId);
  if (selectedEpisode) return selectedEpisode;
  const defaultEpisodeNumber = ANIME_VIDEO_ASSETS[getSelectedAnimeVideoAssetId()]?.episodeNumber || 1;
  return episodes.find((episode) => episode.episodeNumber === defaultEpisodeNumber)
    || getAnimeVideoAsset(getSelectedAnimeVideoAssetId());
}

function showAnimeControls() {
  const shell = app.querySelector('.anime-video-shell');
  if (!shell) return;
  shell.classList.remove('anime-controls-hidden');
  clearTimeout(animeControlsTimer);
  animeControlsTimer = setTimeout(() => shell.classList.add('anime-controls-hidden'), 5000);
}

async function toggleStreamFullscreen(video) {
  const stage = video?.closest('.anime-video-stage');
  if (!video || !stage) return;
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else if (stage.requestFullscreen) {
      await stage.requestFullscreen();
    } else if (video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen();
    } else {
      throw new Error('Fullscreen API tidak didukung browser ini.');
    }
  } catch (error) {
    console.error('Mode layar penuh gagal dibuka:', error);
    const status = stage.querySelector('.stream-fullscreen-status');
    if (status) {
      status.textContent = 'Mode layar penuh tidak dapat dibuka.';
      status.hidden = false;
    }
  }
}

function revealAnimePiPControls() {
  if (!animePiPWindow) return;
  animePiPWindow.classList.remove('anime-pip-controls-hidden');
  clearTimeout(animePiPControlsTimer);
  animePiPControlsTimer = setTimeout(
    () => animePiPWindow?.classList.add('anime-pip-controls-hidden'),
    5000
  );
}

function enablePiPDragging(pipWindow) {
  const dragHandle = document.createElement('div');
  dragHandle.className = 'anime-pip-drag-handle';
  dragHandle.setAttribute('aria-hidden', 'true');
  pipWindow.append(dragHandle);

  let dragStart = null;
  let dragged = false;
  let dragEndedAt = 0;

  pipWindow.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || event.target.closest('button, .anime-pip-controls')) return;
    const bounds = pipWindow.getBoundingClientRect();
    dragStart = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      left: bounds.left,
      top: bounds.top,
    };
    dragged = false;
    pipWindow.setPointerCapture(event.pointerId);
  });
  pipWindow.addEventListener('pointermove', (event) => {
    if (!dragStart || event.pointerId !== dragStart.pointerId) return;
    const deltaX = event.clientX - dragStart.x;
    const deltaY = event.clientY - dragStart.y;
    if (!dragged && Math.hypot(deltaX, deltaY) < 5) return;
    dragged = true;
    pipWindow.classList.add('is-dragging');
    pipWindow.style.left = `${Math.max(0, Math.min(window.innerWidth - pipWindow.offsetWidth, dragStart.left + deltaX))}px`;
    pipWindow.style.top = `${Math.max(0, Math.min(window.innerHeight - pipWindow.offsetHeight, dragStart.top + deltaY))}px`;
    pipWindow.style.right = 'auto';
    pipWindow.style.bottom = 'auto';
    event.preventDefault();
  });
  const finishDrag = (event) => {
    if (!dragStart || event.pointerId !== dragStart.pointerId) return;
    if (dragged) {
      dragEndedAt = Date.now();
      pipWindow.classList.remove('is-dragging');
    }
    dragStart = null;
  };
  pipWindow.addEventListener('pointerup', finishDrag);
  pipWindow.addEventListener('pointercancel', finishDrag);
  pipWindow.addEventListener('click', (event) => {
    if (Date.now() - dragEndedAt < 400) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
}

function showAnimePiP() {
  if (currentPage() === 'anime-stream') return;
  const player = animeVideoElement || animeTrailerFrame;
  if (!player) return;
  if (animeVideoElement) animeVideoElement.controls = false;
  if (!animePiPWindow) {
    animePiPWindow = document.createElement('aside');
    animePiPWindow.className = 'anime-pip';
    animePiPWindow.tabIndex = 0;
    animePiPWindow.setAttribute('role', 'group');
    animePiPWindow.setAttribute('aria-label', `Kembali menonton ${selectedAnime}`);
    enablePiPDragging(animePiPWindow);
    const closeButton = document.createElement('button');
    closeButton.className = 'anime-pip-close';
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', 'Tutup pemutar');
    closeButton.textContent = '×';
    const controls = animeVideoElement ? document.createElement('div') : null;
    if (controls) {
      controls.className = 'anime-pip-controls';
      controls.innerHTML = `<button type="button" data-pip-action="toggle-playback" aria-label="Putar video"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4v16l13-8z"/></svg></button>`;
    }
    animePiPWindow.addEventListener('click', (event) => {
      if (event.target.closest('.anime-pip-close')) {
        event.preventDefault();
        event.stopPropagation();
        closeAnimePiP();
        return;
      }
      const control = event.target.closest('[data-pip-action]');
      if (control) {
        event.preventDefault();
        event.stopPropagation();
        const video = animeVideoElement;
        if (!video) return;
        if (control.dataset.pipAction === 'toggle-playback') {
          if (video.paused) video.play().catch((error) => console.error('Video gagal diputar:', error));
          else video.pause();
        }
        return;
      }
      if (event.target.closest('.anime-pip-drag-handle')) return;
      navigate('anime-stream');
    });
    animePiPWindow.addEventListener('keydown', (event) => {
      if (event.target !== animePiPWindow) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        navigate('anime-stream');
      }
    });
    animePiPWindow.addEventListener('pointerdown', revealAnimePiPControls);
    animePiPWindow.addEventListener('pointermove', revealAnimePiPControls);
    animePiPWindow.addEventListener('pointerenter', revealAnimePiPControls);
    document.body.append(animePiPWindow);
    revealAnimePiPControls();
    animePiPWindow.append(player);
    if (controls) animePiPWindow.append(controls);
    animePiPWindow.append(closeButton);
    updateAnimeVideoUi(animeVideoElement);
    return;
  }
  animePiPWindow.setAttribute('aria-label', `Kembali menonton ${selectedAnime}`);
  if (player.parentElement !== animePiPWindow) {
    const closeButton = animePiPWindow.querySelector('.anime-pip-close');
    animePiPWindow.insertBefore(player, closeButton);
  }
}

function updateAnimeVideoUi(video) {
  if (!video) return;
  const duration = Number.isFinite(video.duration) ? video.duration : 0;
  const progress = duration > 0 ? Math.min(1000, Math.max(0, video.currentTime / duration * 1000)) : 0;
  const stage = video.closest('.anime-video-stage');
  const seek = stage?.querySelector('#anime-video-seek');
  if (seek) {
    seek.value = String(progress);
    seek.style.setProperty('--seek-progress', `${progress / 10}%`);
  }
  const durationLabel = app.querySelector('.anime-episode-duration');
  if (durationLabel) {
    if (video.error) durationLabel.textContent = 'Video gagal dimuat.';
    else if (duration > 0) durationLabel.textContent = `${formatVideoTime(duration).replaceAll(':', '.')} menit`;
    else if (!video.currentSrc && !video.hasAttribute('src')) durationLabel.textContent = 'Video belum tersedia.';
    else durationLabel.textContent = 'Memuat durasi...';
  }

  const playButton = stage?.querySelector('[data-action="toggle-anime-playback"]');
  const pipPlayButton = animePiPWindow?.querySelector('[data-pip-action="toggle-playback"]');
  [playButton, pipPlayButton].filter(Boolean).forEach((button) => {
    button.setAttribute('aria-label', video.paused ? 'Putar video' : 'Jeda video');
    button.innerHTML = video.paused
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4v16l13-8z"/></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h4v16H7zm7 0h4v16h-4z"/></svg>';
  });
}

function bindAnimeVideoUi(video) {
  if (!video || animeVideoListeners.has(video)) return;
  animeVideoListeners.add(video);
  ['loadstart', 'durationchange', 'loadedmetadata', 'timeupdate', 'seeked', 'play', 'pause', 'ended'].forEach((eventName) => {
    video.addEventListener(eventName, () => updateAnimeVideoUi(video));
  });
  video.addEventListener('error', () => {
    console.error('Video anime gagal dimuat.', {
      code: video.error?.code,
      message: video.error?.message || '',
    });
    updateAnimeVideoUi(video);
  });
  updateAnimeVideoUi(video);
}

function updateMediaVideoUi(video) {
  if (!video) return;
  const duration = Number.isFinite(video.duration) ? video.duration : 0;
  const progress = duration > 0 ? Math.min(1000, Math.max(0, video.currentTime / duration * 1000)) : 0;
  const seek = video.closest('.anime-video-stage')?.querySelector('#media-video-seek');
  if (seek) {
    seek.value = String(progress);
    seek.style.setProperty('--seek-progress', `${progress / 10}%`);
  }
  const durationLabel = app.querySelector('.anime-episode-card.is-active .anime-episode-duration');
  if (durationLabel) {
    if (video.error) durationLabel.textContent = 'Video gagal dimuat.';
    else if (duration > 0) durationLabel.textContent = `${formatVideoTime(duration).replaceAll(':', '.')} menit`;
    else if (!video.currentSrc && !video.hasAttribute('src')) durationLabel.textContent = 'Video belum tersedia.';
    else durationLabel.textContent = 'Memuat durasi...';
  }
  const playButton = video.closest('.anime-video-stage')?.querySelector('[data-action="toggle-media-video-playback"]')
    || mediaPiPWindow?.querySelector('[data-pip-action="toggle-playback"]');
  if (playButton) {
    playButton.setAttribute('aria-label', video.paused ? 'Putar video' : 'Jeda video');
    playButton.innerHTML = video.paused
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4v16l13-8z"/></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h4v16H7zm7 0h4v16h-4z"/></svg>';
  }
}

function bindMediaVideoUi(video) {
  if (!video || mediaVideoListeners.has(video)) return;
  mediaVideoListeners.add(video);
  ['loadstart', 'durationchange', 'loadedmetadata', 'timeupdate', 'seeked', 'play', 'pause', 'ended'].forEach((eventName) => {
    video.addEventListener(eventName, () => updateMediaVideoUi(video));
  });
  video.addEventListener('error', () => {
    console.error('Video tayangan gagal dimuat.', {
      code: video.error?.code,
      message: video.error?.message || '',
    });
    updateMediaVideoUi(video);
  });
  updateMediaVideoUi(video);
}

function closeAnimePiP() {
  clearTimeout(animePiPControlsTimer);
  animeVideoElement?.pause();
  animeVideoElement?.remove();
  animeVideoElement = null;
  animeTrailerFrame?.remove();
  animeTrailerFrame = null;
  animePiPWindow?.remove();
  animePiPWindow = null;
}

function showMediaPiP() {
  if (currentPage() === 'media-stream' || !mediaVideoElement) return;
  if (!mediaPiPWindow) {
    mediaPiPWindow = document.createElement('aside');
    mediaPiPWindow.className = 'anime-pip';
    mediaPiPWindow.tabIndex = 0;
    mediaPiPWindow.setAttribute('role', 'group');
    mediaPiPWindow.setAttribute('aria-label', `Kembali menonton ${currentMediaVideo?.show_title || 'K-drama'}`);
    enablePiPDragging(mediaPiPWindow);
    const closeButton = document.createElement('button');
    closeButton.className = 'anime-pip-close';
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', 'Tutup pemutar');
    closeButton.textContent = '×';
    const controls = document.createElement('div');
    controls.className = 'anime-pip-controls';
    controls.innerHTML = '<button type="button" data-pip-action="toggle-playback" aria-label="Putar video"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4v16l13-8z"/></svg></button>';
    mediaPiPWindow.append(mediaVideoElement, controls, closeButton);
    mediaPiPWindow.addEventListener('click', (event) => {
      if (event.target.closest('.anime-pip-close')) {
        event.preventDefault();
        event.stopPropagation();
        closeMediaPiP();
        return;
      }
      if (event.target.closest('[data-pip-action="toggle-playback"]')) {
        event.preventDefault();
        event.stopPropagation();
        if (mediaVideoElement?.paused) {
          mediaVideoElement.play().catch((error) => console.error('Video gagal diputar:', error));
        } else {
          mediaVideoElement?.pause();
        }
        return;
      }
      if (event.target.closest('.anime-pip-drag-handle')) return;
      navigate('media-stream');
    });
    mediaPiPWindow.addEventListener('pointerdown', revealMediaPiPControls);
    mediaPiPWindow.addEventListener('pointermove', revealMediaPiPControls);
    mediaPiPWindow.addEventListener('pointerenter', revealMediaPiPControls);
    document.body.append(mediaPiPWindow);
  } else if (mediaVideoElement.parentElement !== mediaPiPWindow) {
    mediaPiPWindow.insertBefore(mediaVideoElement, mediaPiPWindow.querySelector('.anime-pip-controls'));
  }
  mediaVideoElement.controls = false;
  revealMediaPiPControls();
  updateMediaVideoUi(mediaVideoElement);
}

function revealMediaPiPControls() {
  if (!mediaPiPWindow) return;
  mediaPiPWindow.classList.remove('anime-pip-controls-hidden');
  clearTimeout(mediaPiPControlsTimer);
  mediaPiPControlsTimer = setTimeout(
    () => mediaPiPWindow?.classList.add('anime-pip-controls-hidden'),
    5000,
  );
}

function closeMediaPiP() {
  clearTimeout(mediaPiPControlsTimer);
  mediaVideoElement?.pause();
  mediaVideoElement?.remove();
  mediaVideoElement = null;
  mediaPiPWindow?.remove();
  mediaPiPWindow = null;
}

function renderAnimeStream() {
  clearTimeout(animeControlsTimer);
  const existingStreamPage = app.querySelector('.anime-stream-page');
  const streamScrollTop = existingStreamPage?.scrollTop || 0;
  const returningFromMiniPlayer = Boolean(
    animeVideoElement && animePiPWindow?.contains(animeVideoElement)
  );
  const defaultMetadata = builtInShowMetadata(selectedAnime);
  const videoAsset = getSelectedAnimeVideoAsset();
  const seriesMetadata = catalogVideos.find((video) => (
    video.category === 'anime'
    && normalizeShowTitle(video.show_title) === normalizeShowTitle(selectedAnime)
    && (Array.isArray(video.genres) || video.show_description)
  ));
  const genres = seriesMetadata?.genres?.length ? seriesMetadata.genres : defaultMetadata?.genres || [];
  const streamTitle = escapeHtml(animeEpisodeTitle(videoAsset));
  const videoContent = `<div class="anime-video-stage"><video id="anime-video" playsinline preload="metadata" disablepictureinpicture ${videoAsset?.src ? `src="${escapeHtml(videoAsset.src)}"` : ''} aria-label="${streamTitle}"></video><button class="anime-back-control" type="button" data-nav="anime-episodes" aria-label="Kembali ke daftar episode anime"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg></button><div class="anime-video-controls"><button class="anime-play-control" type="button" data-action="toggle-anime-playback" aria-label="Putar video"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4v16l13-8z"/></svg></button><button class="anime-fullscreen-control" type="button" data-action="toggle-stream-fullscreen" aria-label="Layar penuh"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m13-5v3a2 2 0 0 1-2 2h-3"/></svg></button><p class="stream-fullscreen-status" role="status" hidden></p><input id="anime-video-seek" class="anime-video-seek" type="range" min="0" max="1000" step="1" value="0" aria-label="Posisi video" /></div></div>`;
  const videoToPreserve = animeVideoElement
    && (animePiPWindow?.contains(animeVideoElement) || app.contains(animeVideoElement))
    ? {
        element: animeVideoElement,
        currentTime: animeVideoElement.currentTime,
        wasPlaying: !animeVideoElement.paused && !animeVideoElement.ended,
        src: animeVideoElement.getAttribute('src') || '',
      }
    : null;
  if (animeTrailerFrame) {
    animeTrailerFrame.remove();
    animeTrailerFrame = null;
  }
  app.innerHTML = `<section class="anime-stream-page"><div class="anime-video-shell">${videoContent}</div><h1 class="anime-stream-title">${streamTitle}</h1><div class="anime-stream-genres">${genres.map((genre) => `<span>${escapeHtml(genre)}</span>`).join('')}</div><nav class="anime-stream-tabs" aria-label="Informasi anime"><button type="button" data-anime-tab="episode" class="${animeStreamTab === 'episode' ? 'is-active' : ''}">Episode</button><button type="button" data-anime-tab="description" class="${animeStreamTab === 'description' ? 'is-active' : ''}">Deskripsi</button><button type="button" data-anime-tab="similar" class="${animeStreamTab === 'similar' ? 'is-active' : ''}">Serupa</button></nav><div class="anime-stream-tab-content">${renderAnimeTabContent()}</div></section>`;
  const newVideoElement = app.querySelector('#anime-video');
  if (videoToPreserve) {
    const video = videoToPreserve.element;
    const sourceChanged = videoToPreserve.src !== (videoAsset?.src || '');
    if (sourceChanged) {
      if (videoAsset?.src) video.setAttribute('src', videoAsset.src);
      else video.removeAttribute('src');
      video.load();
    }
    video.setAttribute('aria-label', streamTitle);
    newVideoElement.replaceWith(video);
    animeVideoElement = video;
    if (!sourceChanged) {
      const restorePlayback = () => {
        if (video.currentTime !== videoToPreserve.currentTime && Number.isFinite(videoToPreserve.currentTime)) {
          video.currentTime = videoToPreserve.currentTime;
        }
        if (videoToPreserve.wasPlaying) {
          video.play().catch((error) => console.error('Video gagal dilanjutkan:', error));
        }
      };
      if (video.readyState >= HTMLMediaElement.HAVE_METADATA) restorePlayback();
      else if (videoToPreserve.wasPlaying || videoToPreserve.currentTime > 0) {
        video.addEventListener('loadedmetadata', restorePlayback, { once: true });
      }
    }
  } else {
    animeVideoElement = newVideoElement;
  }
  animeVideoElement.controls = false;
  animeVideoElement.disablePictureInPicture = true;
  bindAnimeVideoUi(animeVideoElement);
  const streamPage = app.querySelector('.anime-stream-page');
  if (streamPage) {
    streamPage.scrollTop = returningFromMiniPlayer ? 0 : streamScrollTop;
  }
  showAnimeControls();
  clearTimeout(animePiPControlsTimer);
  animePiPWindow?.remove();
  animePiPWindow = null;
  if (animeAutoplayRequested && animeVideoElement?.hasAttribute('src')) {
    animeVideoElement.play().catch((error) => console.error('Video gagal diputar:', error));
    animeAutoplayRequested = false;
  }
  if (!catalogVideosLoaded) void refreshCatalogVideos();
}

function renderPerformance() {
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const originalTaskCount = (state.tasks || []).length;
  const originalMoodCount = (state.moodLog || []).length;
  state.tasks = (state.tasks || []).filter((task) => {
    if (!task.done || !task.completedAt) return true;
    const completedAt = new Date(task.completedAt).getTime();
    return !Number.isFinite(completedAt) || completedAt >= thirtyDaysAgo;
  });
  state.moodLog = (state.moodLog || []).filter((entry) => {
    const recordedAt = new Date(entry.at).getTime();
    return !Number.isFinite(recordedAt) || recordedAt >= thirtyDaysAgo;
  });
  if (state.tasks.length !== originalTaskCount || state.moodLog.length !== originalMoodCount) persist();

  const history = state.tasks.filter((task) => task.done && task.completedAt).sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  if (!history.length) {
    const content = `<section class="performance-empty-state"><div class="performance-empty-illustration"><img src="${ASSETS.artDaily}" alt="Dua anak belajar bersama kucing" /></div><div class="empty-state"><strong>Belum ada tugas</strong><p>Tambah tugas baru untuk mulai mengerjakan bersama Kudo.</p><button class="button button-primary" type="button" data-action="add-task">Tambah tugas</button></div></section>`;
    app.innerHTML = appFrame('performance', content);
    return;
  }

  const moodScores = { ceria: 5, tenang: 4, biasa: 3, lelah: 2, sulit: 1 };
  const today = new Date();
  const chartDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6 + index);
    const key = localDayKey(date);
    const tasksDone = state.tasks.filter((task) => task.done && task.completedAt && localDayKey(task.completedAt) === key).length;
    const scores = state.moodLog.filter((entry) => localDayKey(entry.at) === key && moodScores[entry.mood]).map((entry) => moodScores[entry.mood]);
    return { key, label: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][date.getDay()], tasksDone, mood: scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : null };
  });
  const maxTasks = Math.max(1, ...chartDays.map((day) => day.tasksDone));
  const weeklyAverage = chartDays.reduce((sum, day) => sum + day.tasksDone, 0) / chartDays.length;
  const chartBase = 130;
  const chartPoints = chartDays.map((day, index) => day.mood == null ? null : {
    x: 25 + index * 41,
    y: chartBase - 14 - ((day.mood - 1) / 4) * 76
  });
  const moodSegments = [];
  let moodSegment = [];
  chartPoints.forEach((point) => {
    if (point) moodSegment.push(`${point.x},${point.y}`);
    else if (moodSegment.length) { if (moodSegment.length > 1) moodSegments.push(moodSegment.join(' ')); moodSegment = []; }
  });
  if (moodSegment.length > 1) moodSegments.push(moodSegment.join(' '));
  const barsAndLabels = chartDays.map((day, index) => {
    const x = 25 + index * 41;
    const height = day.tasksDone ? Math.max(5, day.tasksDone / maxTasks * 84) : 3;
    const y = chartBase - height;
    const barColor = day.tasksDone > weeklyAverage + 2 ? '#2EE659' : day.tasksDone >= weeklyAverage ? '#FECB7E' : '#F36565';
    return `<rect class="performance-chart-bar" x="${x - 12}" y="${y}" width="24" height="${height}" rx="3" style="fill:${barColor}" /><text class="performance-chart-count" x="${x}" y="${Math.max(14, y - 5)}">${day.tasksDone}</text><text class="performance-chart-days" x="${x}" y="150">${day.label}</text>`;
  }).join('');
  const moodLines = moodSegments.map((points) => `<polyline class="performance-chart-mood" points="${points}" />`).join('');
  const moodDots = chartPoints.filter(Boolean).map((point) => `<circle class="performance-chart-dot" cx="${point.x}" cy="${point.y}" r="3" />`).join('');
  const chartSvg = `<svg class="performance-chart" viewBox="0 0 300 160" role="img" aria-label="Grafik jumlah tugas selesai dan rata-rata mood selama tujuh hari"><line class="performance-chart-baseline" x1="8" y1="${chartBase}" x2="292" y2="${chartBase}" />${barsAndLabels}${moodLines}${moodDots}${chartDays.every((day) => day.tasksDone === 0) ? '<text class="performance-chart-empty" x="150" y="80">Belum ada tugas selesai minggu ini</text>' : ''}</svg>`;
  const pageSize = 5;
  const pageCount = Math.max(1, Math.ceil(history.length / pageSize));
  performanceHistoryPage = Math.min(performanceHistoryPage, pageCount - 1);
  const pageHistory = history.slice(performanceHistoryPage * pageSize, (performanceHistoryPage + 1) * pageSize);
  const historyMarkup = history.length
    ? `<div class="performance-history-list">${pageHistory.map((task) => {
      const completedDate = new Date(task.completedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        const taskMood = task.mood || state.moodLog.find((entry) => entry.taskId === task.id)?.mood;
        const moodImage = { ceria: 'mood-ceria.png', tenang: 'mood-tenang.png', biasa: 'mood-biasa.png', lelah: 'mood-lelah.png', sulit: 'mood-sulit.png' }[taskMood];
        return `<article class="performance-history-row">${task.photo ? `<button class="performance-history-photo" type="button" data-action="view-task-photo" data-photo="${task.photo}" aria-label="Lihat lampiran ${escapeHtml(task.title)}"><img src="${task.photo}" alt="Lampiran tugas: ${escapeHtml(task.title)}" /></button>` : '<span class="performance-history-photo" aria-hidden="true"></span>'}<div class="performance-history-copy"><strong>${escapeHtml(task.title)}</strong><small>${task.difficulty === 'hard' ? 'Boss Fight' : 'Daily Quest'} · ${completedDate}</small>${task.description ? `<span class="performance-history-description">${escapeHtml(task.description)}</span>` : ''}</div>${moodImage ? `<img class="performance-history-mood" src="assets/${moodImage}" alt="Mood ${escapeHtml(taskMood)}" />` : ''}</article>`;
      }).join('')}</div>${pageCount > 1 ? `<nav class="performance-history-pagination" aria-label="Navigasi histori tugas"><button type="button" data-action="performance-history-page" data-page="${performanceHistoryPage - 1}" aria-label="Halaman sebelumnya" ${performanceHistoryPage === 0 ? 'disabled' : ''}></button><span>Halaman ${performanceHistoryPage + 1} dari ${pageCount}</span><button type="button" data-action="performance-history-page" data-page="${performanceHistoryPage + 1}" aria-label="Halaman berikutnya" ${performanceHistoryPage >= pageCount - 1 ? 'disabled' : ''}></button></nav>` : ''}`
    : '<div class="performance-history-empty">Belum ada tugas selesai dalam 30 hari terakhir.</div>';
  const content = `<section class="performance-page"><h2>Grafik</h2><div class="performance-chart-card"><p class="performance-chart-caption">Produktivitas vs Mood</p>${chartSvg}<div class="performance-chart-legend"><span><i class="performance-legend-bar"></i>Tugas selesai</span><span><i class="performance-legend-line"></i>Mood rata-rata</span></div></div><section class="performance-history"><h3>Histori tugas</h3>${historyMarkup}</section></section>`;
  app.innerHTML = appFrame('performance', content);
}

function renderTransaction() {
  if (!pendingDiamondOrder) return navigate('shop');
  const { amount, price } = pendingDiamondOrder;
  const paid = pendingDiamondOrder.status === 'paid';
  const statusText = paid
    ? `${Number(amount).toLocaleString('id-ID')} berlian telah ditambahkan ke akunmu.`
    : ['failed', 'expired', 'cancelled'].includes(pendingDiamondOrder.status)
      ? 'Pembayaran sebelumnya tidak berhasil. Kamu dapat mencoba kembali.'
      : pendingDiamondOrder.status === 'awaiting_verification'
        ? 'Bukti pembayaran sudah dikirim. Berlian akan ditambahkan setelah pembayaran diverifikasi.'
        : '';
  const showTransactionStatus = paid || pendingDiamondOrder.status === 'awaiting_verification'
    || ['failed', 'expired', 'cancelled'].includes(pendingDiamondOrder.status);
  const transactionStatus = showTransactionStatus
    ? `<aside class="transaction-status ${paid ? 'is-paid' : ''}" role="status"><span>${paid ? '✓' : '◷'}</span><strong>${statusText}</strong></aside>`
    : '';
  const paymentAction = paid
    ? ''
    : `<button class="button button-primary transaction-pay" type="button" data-action="pay-diamond-order" ${pendingDiamondOrder.status === 'awaiting_verification' || diamondPaymentSubmitting ? 'disabled' : ''}>${diamondPaymentSubmitting ? 'Sedang memproses...' : pendingDiamondOrder.status === 'awaiting_verification' ? 'Menunggu verifikasi' : 'Bayar'}</button>`;
  const paymentInstructions = paid || pendingDiamondOrder.status === 'awaiting_verification'
    ? ''
    : `<article class="transaction-payment transaction-qris-payment"><h2>Bayar dengan QRIS</h2><img class="transaction-qris" src="assets/qris-payment.png" alt="Kode QRIS pembayaran" /><p>Scan QRIS di atas dan bayar sesuai total pesanan. Pastikan pembayaran berhasil sebelum mengirim bukti.</p></article><article class="transaction-payment transaction-proof-payment"><div class="transaction-proof-box"><input class="transaction-proof-input" id="diamond-proof-input" type="file" accept="image/png,image/jpeg,image/webp" ${pendingDiamondOrder.status === 'awaiting_verification' || diamondPaymentSubmitting ? 'disabled' : ''} /><label class="transaction-proof-area${diamondProofFile ? ' has-photo' : ''}" for="diamond-proof-input"><strong>${diamondProofFile ? '' : 'Lampiran gambar bukti pembayaran'}</strong><img class="transaction-proof-preview" ${diamondProofFile ? `src="${diamondProofPreviewUrl}"` : 'hidden'} alt="${diamondProofFile ? `Pratinjau lampiran ${escapeHtml(diamondProofFile.name)}` : ''}" /></label>${diamondProofError ? `<small class="transaction-proof-status has-error" role="status">${escapeHtml(diamondProofError)}</small>` : ''}<button class="transaction-proof-remove" type="button" data-action="remove-diamond-proof" aria-label="Hapus gambar lampiran" ${diamondProofFile && !diamondPaymentSubmitting ? '' : 'hidden'}>×</button></div></article>`;
  const content = `<section class="transaction-page">${transactionStatus}<article class="transaction-order"><h2>Rincian pesanan</h2><div><span>Nomor transaksi</span><strong>${escapeHtml(pendingDiamondOrder.invoiceNumber || 'Dibuat saat pembayaran')}</strong></div><div><span>Paket berlian</span><strong>${Number(amount).toLocaleString('id-ID')} berlian</strong></div><div><span>Total pembayaran</span><strong>Rp ${Number(price).toLocaleString('id-ID')}</strong></div></article>${paymentInstructions}${paymentAction}<button class="button button-secondary transaction-cancel" type="button" data-action="cancel-diamond-transaction">Kembali ke toko</button></section>`;
  app.innerHTML = appFrame('transaction', content);
  clearTimeout(diamondPaymentPollTimer);
  if (pendingDiamondOrder.invoiceNumber && !paid) {
    diamondPaymentPollTimer = setTimeout(pollDiamondPaymentStatus, 4000);
  }
}

async function pollDiamondPaymentStatus() {
  diamondPaymentPollTimer = null;
  if (
    diamondPaymentPollInFlight
    || currentPage() !== 'transaction'
    || !pendingDiamondOrder?.invoiceNumber
    || pendingDiamondOrder.status === 'paid'
  ) return;

  diamondPaymentPollInFlight = true;
  try {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    if (!session?.access_token) throw new Error('Silakan masuk kembali untuk memeriksa pembayaran.');

    const query = new URLSearchParams({ invoice: pendingDiamondOrder.invoiceNumber });
    const response = await fetch(`/api/payments/status?${query}`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Status pembayaran tidak dapat dimuat.');

    pendingDiamondOrder.status = result.status;
    localStorage.setItem('kudo-pending-diamond-order-v1', JSON.stringify(pendingDiamondOrder));
    if (result.status === 'paid') {
      clearTimeout(diamondPaymentPollTimer);
      if (!await syncSupabaseSession()) {
        throw new Error('Pembayaran berhasil, tetapi data akun belum dapat dimuat.');
      }
    }
    render();
  } catch (error) {
    console.error('Status pembayaran berlian gagal diperiksa:', error);
  } finally {
    diamondPaymentPollInFlight = false;
    if (
      currentPage() === 'transaction'
      && pendingDiamondOrder?.invoiceNumber
      && pendingDiamondOrder.status === 'pending'
    ) {
      diamondPaymentPollTimer = setTimeout(pollDiamondPaymentStatus, 5000);
    }
  }
}

function renderRewards() {
  const missions = dailyMissions();
  const completed = missions.filter((mission) => mission.done).length;
  const content = `<section class="mission-hero"><div class="mission-hero-copy"><h1>Misi</h1><p>Selesaikan misi untuk mendapatkan hadiah!</p></div><div class="mission-hero-art"><img class="mission-hero-kids" src="${ASSETS.missionCelebration}" alt="Kudo merayakan misi" /></div></section>
    <h2 class="daily-missions-title">Misi harian</h2><div class="mission-summary">${completed}/${missions.length} misi selesai</div>
    <section class="mission-list" aria-label="Daftar misi harian">${missions.map((mission) => {
      const chest = mission.opened ? ASSETS.chestOpen : mission.done ? ASSETS.chestReady : ASSETS.chestLocked;
      const status = mission.opened ? 'Hadiah sudah dibuka' : mission.key === 'checkin' ? 'Check-in untuk membuka peti' : mission.done ? 'Sentuh peti untuk membuka hadiah' : 'Selesaikan misi untuk membuka peti';
      return `<article class="mission-row ${mission.done && !mission.opened ? 'mission-complete' : ''} ${mission.opened ? 'mission-opened' : ''}"><div class="mission-copy"><h3>${mission.title}</h3><div class="mission-progress ${mission.done ? 'is-done' : ''}"><span style="width:${mission.done ? 100 : 0}%"></span><strong>${mission.done ? 1 : 0}/1</strong></div><small>${status}</small></div><button class="mission-chest ${mission.done && !mission.opened ? 'is-ready' : ''}" type="button" data-action="open-mission-chest" data-mission="${mission.key}" aria-label="${mission.done && !mission.opened ? 'Buka hadiah: ' : ''}${mission.title}" ${!mission.done || mission.opened ? 'disabled' : ''}><img src="${chest}" alt="" /></button></article>`;
    }).join('')}</section>`;
  app.innerHTML = appFrame('rewards', content);
}

function renderChestOpening() {
  const session = state.chestSession;
  if (!session) return navigate('rewards');
  const isOpen = session.stage === 'open';
  app.innerHTML = `<section class="chest-opening-page"><h1 class="chest-opening-title">${isOpen ? 'Petimu terbuka!' : 'Tekan untuk membuka'}</h1><button class="chest-opening-trigger ${isOpen ? 'is-open' : ''}" type="button" data-action="${isOpen ? 'show-chest-reward' : 'open-chest-session'}" aria-label="${isOpen ? 'Lihat hadiah' : 'Buka peti'}"><img src="${isOpen ? ASSETS.chestOpen : ASSETS.chestReady}" alt="${isOpen ? 'Peti terbuka' : 'Peti tertutup'}" /></button><span class="chest-opening-shadow ${isOpen ? 'is-open' : ''}" aria-hidden="true"></span></section>`;
}

function renderChestReward() {
  const session = state.chestSession;
  if (!session?.reward) return navigate('rewards');
  const reward = session.reward;
  const image = reward.type === 'ticket' ? ASSETS.ticket : reward.type === 'diamond' ? ASSETS.rewardDiamonds : ASSETS.hourglass;
  const label = reward.type === 'ticket' ? 'Tiket nonton' : reward.type === 'diamond' ? 'Berlian' : 'Jam fokus';
  app.innerHTML = `<section class="chest-reward-page"><div class="chest-reward-card"><h1 class="chest-reward-amount">+${Number(reward.amount).toLocaleString('id-ID')} ${label}</h1><img class="chest-reward-art" src="${image}" alt="${label}" /><p>Kamu mendapatkan hadiah dari peti. Gunakan berlianmu untuk membuka lebih banyak fitur!</p><button class="button button-primary" type="button" data-action="finish-chest">Lanjutkan</button></div></section>`;
}

function renderProfile() {
  const done = state.tasks.filter((task) => task.done).length;
  const unreadCount = unreadMessagesCount();
  const unreadPurchaseCount = unreadVerifiedPurchaseCount();
  const username = escapeHtml(currentAccount?.name || state.username || 'Tayaki');
  const adminProfileLinks = [
    ['admin-verification', 'Verifikasi pembelian'],
    ['admin-history', 'Histori verifikasi'],
    ['admin-add-video', 'Tambah video'],
    ['admin-latest-videos', 'Video terbaru'],
  ];
  app.innerHTML = `<section class="product-screen profile-screen"><header class="profile-banner"><h1>${username}</h1><div class="profile-avatar-window"><img src="${getAccountAvatarSource()}" alt="Foto profil ${username}" /></div></header><main class="profile-settings">
    <section class="profile-settings-section"><h2>Akun</h2><div class="profile-settings-card"><button type="button" data-nav="account"><span>Profil</span><b>›</b></button><button type="button" data-action="profile-performance"><span>Performa</span><b>›</b></button></div></section>
    <section class="profile-settings-section"><h2>Notifikasi</h2><div class="profile-settings-card"><button class="message-entry ${unreadCount ? 'has-unread-messages' : ''}" type="button" data-nav="messages"><span>Pesan</span>${unreadCount ? `<span class="message-count-badge" aria-label="${unreadCount} pesan belum dibaca">${messageCountBadge(unreadCount)}</span>` : ''}<b>›</b></button><button class="message-entry ${unreadPurchaseCount ? 'has-unread-messages' : ''}" type="button" data-nav="purchase-history"><span>Histori pembelian</span>${unreadPurchaseCount ? `<span class="message-count-badge" aria-label="${unreadPurchaseCount} transaksi belum dibaca">${messageCountBadge(unreadPurchaseCount)}</span>` : ''}<b>›</b></button></div>${purchaseHistoryError ? `<p class="purchase-history-error" role="alert">${escapeHtml(purchaseHistoryError)} <button type="button" data-action="retry-profile-purchase-history">Coba lagi</button></p>` : ''}</section>
    <section class="profile-settings-section"><h2>Dukungan</h2><div class="profile-settings-card"><button type="button" data-action="profile-info" data-title="Pusat bantuan" data-message="Butuh bantuan menggunakan Kudo? Di sini kamu bisa mengatur tugas, memakai mode fokus, dan membuka hadiah. Untuk bantuan lebih lanjut, hubungi bantuan@kudo_task_management_app"><span>Pusat bantuan</span><b>›</b></button><button type="button" data-action="open-suggestions"><span>Saran</span><b>›</b></button></div></section>
    ${isAdminUser ? `<section class="profile-settings-section"><h2>Panel admin</h2>${adminPanelError ? `<p class="admin-panel-error" role="alert">${escapeHtml(adminPanelError)} <button type="button" data-action="retry-admin-panel">Coba lagi</button></p>` : ''}<div class="profile-settings-card">${adminProfileLinks.map(([page, label]) => `<button type="button" data-nav="${page}"><span>${label}</span><span class="admin-menu-trailing">${page === 'admin-verification' && adminOrders.length ? `<span class="admin-menu-pending-count" aria-label="${adminOrders.length} transaksi menunggu verifikasi">${adminOrders.length}</span>` : ''}<b>›</b></span></button>`).join('')}</div></section>` : ''}
    <button class="profile-logout" type="button" data-action="logout">Keluar</button><div class="profile-legal"><button type="button" data-action="profile-info" data-title="Ketentuan" data-message="Dengan menggunakan Kudo, kamu setuju memakai fitur aplikasi secara wajar, menjaga keamanan akun, dan bertanggung jawab atas tugas serta konten yang kamu tambahkan. Fitur pada aplikasi ini disediakan untuk membantu mengatur kebiasaan belajar.">Ketentuan</button><button type="button" data-action="profile-info" data-title="Kebijakan Privasi" data-message="Aplikasi Kudo menyimpan nama pengguna, tugas, dan preferensi secara aman untuk kenyamanan pengguna.">Kebijakan Privasi</button><button type="button" data-action="profile-info" data-title="Ucapan terima kasih" data-message="Terima kasih telah menggunakan Kudo dan meluangkan waktu untuk menyelesaikan setiap tugas. Semoga Kudo membuat proses belajar dan beristirahat terasa lebih menyenangkan.">Ucapan terima kasih</button></div>
    </main>
    ${bottomNav('profile')}</section>`;
  if (currentAccount?.id && adminCheckedForUserId !== currentAccount.id && !adminAccessLoading) {
    void checkAdminAccess();
  }
  if (isAdminUser === true && !adminPanelAttempted && !adminPanelLoading) {
    void loadAdminPanel();
  }
  if (currentAccount?.id && !purchaseHistoryLoaded && !purchaseHistoryLoading && !purchaseHistoryError) {
    void loadPurchaseHistory();
  }
}

function renderMessages() {
  if (!Array.isArray(state.messages)) state.messages = [];
  processTaskDeadlineMessages();
  const pageSize = 6;
  const pageCount = Math.max(1, Math.ceil(state.messages.length / pageSize));
  messagePage = Math.min(messagePage, pageCount - 1);
  const pageMessages = state.messages.slice(messagePage * pageSize, (messagePage + 1) * pageSize);
  const list = pageMessages.length
    ? `<div class="message-list">${pageMessages.map((message) => `<article class="message-card"><img class="message-card-icon" src="assets/message-icon.png" alt="" /><div><h2>${escapeHtml(message.title)}</h2><p>${escapeHtml(message.body)}</p><time datetime="${escapeHtml(message.createdAt)}">${new Date(message.createdAt).toLocaleString('id-ID')}</time></div></article>`).join('')}</div>${pageCount > 1 ? `<nav class="message-pagination" aria-label="Navigasi pesan"><button type="button" data-action="message-page" data-page="${messagePage - 1}" aria-label="Pesan sebelumnya" ${messagePage === 0 ? 'disabled' : ''}></button><span>Halaman ${messagePage + 1} dari ${pageCount}</span><button type="button" data-action="message-page" data-page="${messagePage + 1}" aria-label="Pesan berikutnya" ${messagePage >= pageCount - 1 ? 'disabled' : ''}></button></nav>` : ''}`
    : `<div class="messages-empty-state"><img src="${ASSETS.focusShortage}" alt="" /><p>Belum ada pesan masuk</p></div>`;

  let markedRead = false;
  for (const message of state.messages) {
    if (message.readAt) continue;
    message.readAt = new Date().toISOString();
    markedRead = true;
  }
  if (markedRead) persist();
  app.innerHTML = appFrame('messages', `<section class="messages-page">${list}</section>`);
}

function renderPurchaseHistory() {
  if (!currentAccount?.id) return navigate('login');
  const retentionMs = 30 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const retentionCutoff = now - retentionMs;
  const visiblePurchaseHistory = purchaseHistory.filter((order) => {
    const createdAt = Date.parse(order.createdAt);
    return Number.isFinite(createdAt) && createdAt >= retentionCutoff;
  });
  const pageSize = 6;
  const pageCount = Math.max(1, Math.ceil(visiblePurchaseHistory.length / pageSize));
  purchaseHistoryPage = Math.min(purchaseHistoryPage, pageCount - 1);
  const pageOrders = visiblePurchaseHistory.slice(
    purchaseHistoryPage * pageSize,
    (purchaseHistoryPage + 1) * pageSize
  );
  const statusLabels = {
    pending: 'Menunggu pembayaran',
    awaiting_verification: 'Diproses',
    paid: 'Berhasil',
    rejected: 'Ditolak',
    failed: 'Gagal',
    expired: 'Kedaluwarsa',
    cancelled: 'Dibatalkan',
  };
  const orders = visiblePurchaseHistory.length
    ? `<div class="purchase-history-list">${pageOrders.map((order) => `<article class="purchase-history-item"><div class="purchase-history-proof">${order.proofUrl ? `<a href="${escapeHtml(order.proofUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Lihat bukti pembayaran ${escapeHtml(order.invoiceNumber)}"><img src="${escapeHtml(order.proofUrl)}" alt="Bukti pembayaran" /></a>` : '<span>Tidak ada bukti</span>'}</div><div class="purchase-history-details"><strong>${Number(order.diamonds).toLocaleString('id-ID')} berlian</strong><small>${new Date(order.createdAt).toLocaleString('id-ID')}</small><small class="purchase-invoice">${escapeHtml(order.invoiceNumber)}</small></div><div class="purchase-history-amount"><strong>Rp ${Number(order.amount).toLocaleString('id-ID')}</strong><span class="purchase-status purchase-status-${escapeHtml(order.status)}">${statusLabels[order.status] || 'Status tidak diketahui'}</span></div></article>`).join('')}</div>${pageCount > 1 ? `<nav class="purchase-history-pagination" aria-label="Navigasi histori pembelian"><button type="button" data-action="purchase-history-page" data-page="${purchaseHistoryPage - 1}" aria-label="Halaman sebelumnya" ${purchaseHistoryPage === 0 ? 'disabled' : ''}></button><span>Halaman ${purchaseHistoryPage + 1} dari ${pageCount}</span><button type="button" data-action="purchase-history-page" data-page="${purchaseHistoryPage + 1}" aria-label="Halaman berikutnya" ${purchaseHistoryPage >= pageCount - 1 ? 'disabled' : ''}></button></nav>` : ''}`
    : purchaseHistoryLoading || (!purchaseHistoryLoaded && !purchaseHistoryError)
      ? '<p class="purchase-history-message" role="status">Memuat histori pembelian...</p>'
      : purchaseHistoryError
        ? ''
        : `<section class="purchase-history-empty"><div class="purchase-history-illustration"><img src="${ASSETS.focusShortage}" alt="Kudo meminta tambahan berlian" /></div><div class="empty-state"><strong>Belum ada histori pembayaran</strong><p>Tambah berlian mu untuk membuka fitur menarik</p><button class="button button-primary" type="button" data-nav="shop">Tambah berlian</button></div></section>`;
  const errorMarkup = purchaseHistoryError
    ? `<p class="purchase-history-error" role="alert">${escapeHtml(purchaseHistoryError)} <button type="button" data-action="retry-purchase-history">Coba lagi</button></p>`
    : '';
  app.innerHTML = appFrame('purchase-history', `<section class="purchase-history-page">${errorMarkup}${orders}</section>`);
  window.clearTimeout(purchaseHistoryExpiryTimer);
  const nextExpiry = visiblePurchaseHistory.reduce((expiry, order) => {
    const createdAt = Date.parse(order.createdAt);
    const orderExpiry = createdAt + retentionMs;
    return orderExpiry > now ? Math.min(expiry, orderExpiry) : expiry;
  }, Infinity);
  if (Number.isFinite(nextExpiry)) {
    purchaseHistoryExpiryTimer = window.setTimeout(
      () => {
        purchaseHistoryExpiryTimer = null;
        if (currentPage() === 'purchase-history') renderPurchaseHistory();
      },
      Math.min(nextExpiry - now, 2147483647)
    );
  }
  if (!purchaseHistoryLoaded && !purchaseHistoryLoading && !purchaseHistoryError) void loadPurchaseHistory();
}

async function loadPurchaseHistory() {
  if (!currentAccount?.id || purchaseHistoryLoading) return;
  const requestedUserId = currentAccount.id;
  purchaseHistoryLoading = true;
  purchaseHistoryError = '';
  try {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    if (!session?.access_token || session.user.id !== requestedUserId) throw new Error('Silakan masuk kembali untuk melihat histori pembelian.');
    const response = await fetch('/api/payments/history', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Histori pembelian tidak dapat dimuat.');
    if (!Array.isArray(result.orders)) throw new Error('Data histori pembelian tidak valid.');
    if (currentAccount?.id !== requestedUserId) return;
    purchaseHistory = result.orders;
    purchaseHistoryLoaded = true;
  } catch (error) {
    console.error('Histori pembelian gagal dimuat:', error);
    if (currentAccount?.id === requestedUserId) {
      purchaseHistoryError = error.message || 'Histori pembelian tidak dapat dimuat.';
    }
  } finally {
    purchaseHistoryLoading = false;
    if (currentAccount?.id === requestedUserId && currentPage() === 'purchase-history') renderPurchaseHistory();
    else if (currentAccount?.id === requestedUserId && currentPage() === 'profile') renderProfile();
  }
}

async function authenticatedRequest(path, options = {}) {
  const { data: { session }, error } = await supabaseClient.auth.getSession();
  if (error) throw error;
  if (!session?.access_token) throw new Error('Silakan masuk kembali.');
  const response = await fetch(path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${session.access_token}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    },
  });
  const result = await response.json();
  return { response, result, session };
}

async function checkAdminAccess() {
  if (!currentAccount?.id || adminAccessLoading) return;
  adminAccessLoading = true;
  const checkedUserId = currentAccount.id;
  try {
    const { response } = await authenticatedRequest('/api/admin/access');
    if (currentAccount?.id !== checkedUserId) return;
    isAdminUser = response.ok;
    adminCheckedForUserId = checkedUserId;
  } catch (error) {
    console.error('Akses admin tidak dapat diperiksa:', error);
    if (currentAccount?.id !== checkedUserId) return;
    isAdminUser = false;
    adminCheckedForUserId = checkedUserId;
  } finally {
    adminAccessLoading = false;
    if (currentPage() === 'profile') renderProfile();
    else if (isAdminPage()) renderAdminPanel();
  }
}

function catalogFolderSlug(title) {
  return String(title || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'series';
}

function builtInShowMetadata(title) {
  const normalizedTitle = normalizeShowTitle(title);
  if (normalizedTitle === 'delicious in dungeon') {
    return {
      poster: ASSETS.posterDungeon,
      episodePoster: builtInEpisodePoster(title),
      description: 'Menceritakan tentang sekelompok petualang yang kehabisan perbekalan setelah anggota tim mereka, Falin, dimakan oleh Naga Merah. Agar tidak kelaparan saat kembali masuk ke dalam dungeon untuk menyelamatkannya, pemimpin kelompok bernama Laios memutuskan untuk bertahan hidup dengan berburu dan memasak monster-monster yang mereka temui.',
      genres: ['Petualangan', 'Fantasi', 'Memasak', 'Komedi'],
      type: 'Series',
    };
  }
  if (normalizedTitle === "frieren: beyond journey's end") {
    return {
      poster: ASSETS.posterFrieren,
      episodePoster: builtInEpisodePoster(title),
      description: 'Menceritakan kisah seorang penyihir elf bernama Frieren yang, setelah sukses mengalahkan Raja Iblis bersama kelompok pahlawannya, memulai perjalanan baru yang reflektif. Dihadapkan pada kenyataan bahwa ia hidup jauh lebih lama daripada teman-teman manusianya, Frieren melakukan perjalanan tanpa tujuan untuk mengenang masa lalu dan lebih memahami arti ikatan persahabatan.',
      genres: ['Petualangan', 'Fantasi', 'Drama'],
      type: 'Series',
    };
  }
  if (normalizedTitle === 'nine puzzle') {
    return {
      poster: ASSETS.posterPuzzles,
      episodePoster: builtInEpisodePoster(title),
      description: 'Ena yang menyaksikan pembunuhan paman tercintanya. Tragisnya, ia justru menjadi tersangka utama di mata detektif Han Saem. Sepuluh tahun berlalu, Ena kini tumbuh menjadi seorang profiler kriminal ulung yang bergabung dengan tim analisis kepolisian. Takdir mempertemukan mereka kembali, memaksa mereka untuk bekerja sama memecahkan kasus-kasus berantai yang ternyata terhubung dengan puzzle pembunuhan di masa lalu mereka.',
      genres: ['Aksi', 'Thriller', 'Komedi', 'Drama', 'Sekolah'],
      type: 'Series',
    };
  }
  if (normalizedTitle === 'teach you a lesson') {
    return {
      poster: ASSETS.posterTeach,
      episodePoster: builtInEpisodePoster(title),
      description: 'ketika kasus kekerasan sekolah terus meningkat. Pada saat yang sama, banyak guru dianggap kehilangan wibawa untuk mendisiplinkan siswa yang nakalnya kebangetan. Sudah tidak ada yang patuh pada mereka. Situasi tersebut mendorong pemerintah membentuk lembaga khusus bernama Educational Rights Protection Bureau (ERPB). Berisi tim independen, mereka berwenang mengembalikan ketertiban dalam lingkungan pendidikan. ERPA bertugas menangani berbagai persoalan yang tidak bisa diselesaikan melalui pendekatan biasa. Lembaga tersebut juga diberi kewenangan hukum untuk melakukan investigasi terhadap berbagai kasus yang terjadi di sekolah.',
      genres: ['Misteri', 'Kejahatan', 'Thriller', 'Psikologi', 'Drama'],
      type: 'Series',
    };
  }
  return null;
}

function adminSeriesForCategory(category) {
  const seriesByFolder = new Map();
  adminVideos
    .filter((video) => video.category === category)
    .forEach((video) => {
      const key = video.folder_name || `legacy:${normalizeShowTitle(video.show_title)}`;
      if (!seriesByFolder.has(key)) seriesByFolder.set(key, video);
    });
  return [...seriesByFolder.values()];
}

function adminSeriesOptions(category) {
  return `<option value="__new__">Buat folder baru</option>${adminSeriesForCategory(category)
    .map((video) => {
      const key = video.folder_name || `legacy:${normalizeShowTitle(video.show_title)}`;
      return `<option value="${escapeHtml(key)}">${escapeHtml(video.show_title)}</option>`;
    })
    .join('')}`;
}

function adminSeriesForFolder(category, folderKey) {
  return adminSeriesForCategory(category).find((video) => (
    (video.folder_name || `legacy:${normalizeShowTitle(video.show_title)}`) === folderKey
  ));
}

function renderAdminVideoForm() {
  return `<form class="admin-video-form" data-form="admin-video">
    <div class="admin-video-step" data-admin-step="1">
      <label for="admin-video-folder">Folder</label>
      <span class="admin-select-wrap"><select id="admin-video-folder" name="folder" data-admin-folder required>${adminSeriesOptions('anime')}</select></span>
      <div class="admin-new-folder-field" data-admin-new-folder-field hidden>
        <label for="admin-video-folder-name">Tambah folder</label>
        <input id="admin-video-folder-name" name="folderName" maxlength="100" />
      </div>
      <label for="admin-video-category">Kategori</label>
      <span class="admin-select-wrap"><select id="admin-video-category" name="category" required><option value="anime">Anime</option><option value="kdrama">K-drama</option></select></span>
      <label for="admin-video-show">Judul</label>
      <input id="admin-video-show" name="showTitle" maxlength="100" required />
      <label for="admin-video-poster">Poster vertikal</label>
      <div class="admin-upload-box">
        <label class="admin-upload-area" for="admin-video-poster"><strong data-empty-label="Pilih gambar poster vertikal">Pilih gambar poster vertikal</strong><img class="admin-upload-preview" alt="" hidden /></label>
        <button class="admin-upload-remove" type="button" data-action="remove-admin-upload" data-input-id="admin-video-poster" aria-label="Hapus poster vertikal" hidden>×</button>
      </div>
      <input id="admin-video-poster" class="admin-file-input" name="poster" type="file" accept="image/png,image/jpeg,image/webp" />
      <small class="admin-upload-status" data-upload-status="admin-video-poster" role="status" hidden></small>
    </div>
    <div class="admin-video-step" data-admin-step="2" hidden>
      <label for="admin-video-episode-poster">Poster horizontal</label>
      <div class="admin-upload-box">
        <label class="admin-upload-area" for="admin-video-episode-poster"><strong data-empty-label="Pilih poster horizontal">Pilih poster horizontal</strong><img class="admin-upload-preview" alt="" hidden /></label>
        <button class="admin-upload-remove" type="button" data-action="remove-admin-upload" data-input-id="admin-video-episode-poster" aria-label="Hapus poster horizontal" hidden>×</button>
      </div>
      <input id="admin-video-episode-poster" class="admin-file-input" name="episodePoster" type="file" accept="image/png,image/jpeg,image/webp" />
      <small class="admin-upload-status" data-upload-status="admin-video-episode-poster" role="status" hidden></small>
      <label for="admin-video-description">Deskripsi</label>
      <textarea id="admin-video-description" name="showDescription" maxlength="5000" rows="4" required></textarea>
      <label for="admin-video-genres">Genre (pisahkan dengan koma)</label>
      <input id="admin-video-genres" name="genres" placeholder="Contoh: Fantasi, Petualangan" required />
      <label for="admin-video-type">Jenis</label>
      <span class="admin-select-wrap"><select id="admin-video-type" name="showType" required><option value="Series">Series</option><option value="Movie">Movie</option></select></span>
    </div>
    <div class="admin-video-step" data-admin-step="3" hidden>
      <label for="admin-video-episode">Judul episode</label>
      <input id="admin-video-episode" name="episodeTitle" maxlength="120" required />
      <label for="admin-video-number">Nomor episode</label>
      <input id="admin-video-number" name="episodeNumber" type="number" min="1" max="9999" value="1" required />
      <label for="admin-video-thumbnail">Thumbnail episode</label>
      <div class="admin-upload-box">
        <label class="admin-upload-area" for="admin-video-thumbnail"><strong data-empty-label="Pilih gambar thumbnail">Pilih gambar thumbnail</strong><img class="admin-upload-preview" alt="" hidden /></label>
        <button class="admin-upload-remove" type="button" data-action="remove-admin-upload" data-input-id="admin-video-thumbnail" aria-label="Hapus gambar thumbnail" hidden>×</button>
      </div>
      <input id="admin-video-thumbnail" class="admin-file-input" name="thumbnail" type="file" accept="image/png,image/jpeg,image/webp" required />
      <small class="admin-upload-status" data-upload-status="admin-video-thumbnail" role="status" hidden></small>
      <label for="admin-video-file">Upload video</label>
      <div class="admin-upload-box">
        <label class="admin-upload-area admin-video-file-area" for="admin-video-file"><strong data-empty-label="Pilih file video (maksimal 50 MB)">Pilih file video (maksimal 50 MB)</strong><span class="admin-selected-file" hidden></span></label>
        <button class="admin-upload-remove" type="button" data-action="remove-admin-upload" data-input-id="admin-video-file" aria-label="Hapus video" hidden>×</button>
      </div>
      <input id="admin-video-file" class="admin-file-input" name="video" type="file" accept="video/mp4,video/webm" required />
      <small class="admin-upload-status" data-upload-status="admin-video-file" role="status" hidden></small>
      <small class="admin-video-rights-note">Unggah hanya video yang kamu miliki atau berhak distribusikan.</small>
    </div>
    <div class="admin-video-step-actions">
      <button class="admin-video-page-arrow" type="button" data-action="admin-video-previous" aria-label="Halaman sebelumnya" disabled></button>
      <span data-admin-step-indicator>Halaman 1 dari 3</span>
      <button class="admin-video-page-arrow" type="button" data-action="admin-video-next" aria-label="Halaman berikutnya"></button>
    </div>
    <button class="button button-primary admin-video-submit" type="button" data-action="admin-add-video" hidden ${adminActionInProgress ? 'disabled' : ''}>${adminActionInProgress ? 'Memproses...' : 'Unggah video'}</button>
  </form>`;
}

function clearAdminUploadSelection(input) {
  if (!input) return;
  const uploadBox = input.previousElementSibling;
  const preview = uploadBox?.querySelector('.admin-upload-preview');
  if (preview?.src.startsWith('blob:')) URL.revokeObjectURL(preview.src);
  input.value = '';
  if (preview) {
    preview.removeAttribute('src');
    preview.hidden = true;
  }
  const prompt = uploadBox?.querySelector('strong');
  if (prompt) {
    prompt.textContent = prompt.dataset.emptyLabel || '';
    prompt.hidden = false;
  }
  const selected = uploadBox?.querySelector('.admin-selected-file');
  if (selected) {
    selected.textContent = '';
    selected.hidden = true;
  }
  const removeButton = uploadBox?.querySelector('.admin-upload-remove');
  if (removeButton) removeButton.hidden = true;
  const status = input.form?.querySelector(`[data-upload-status="${input.id}"]`);
  if (status) {
    status.textContent = '';
    status.hidden = true;
  }
}

function setAdminVideoStep(form, step) {
  const boundedStep = Math.max(1, Math.min(3, step));
  form.dataset.currentStep = String(boundedStep);
  form.querySelectorAll('[data-admin-step]').forEach((section) => {
    section.hidden = Number(section.dataset.adminStep) !== boundedStep;
  });
  const previous = form.querySelector('[data-action="admin-video-previous"]');
  const next = form.querySelector('[data-action="admin-video-next"]');
  const submit = form.querySelector('[data-action="admin-add-video"]');
  const indicator = form.querySelector('[data-admin-step-indicator]');
  if (previous) previous.disabled = boundedStep === 1;
  if (next) next.disabled = boundedStep === 3;
  if (submit) submit.hidden = boundedStep !== 3;
  if (indicator) indicator.textContent = `Halaman ${boundedStep} dari 3`;
}

function validateAdminVideoWizard(form) {
  for (let step = 1; step <= 3; step += 1) {
    const section = form.querySelector(`[data-admin-step="${step}"]`);
    const invalidControl = [...section.querySelectorAll('input, select, textarea')]
      .find((control) => !control.checkValidity());
    if (invalidControl) {
      setAdminVideoStep(form, step);
      invalidControl.reportValidity();
      return false;
    }
  }
  return true;
}

function syncAdminVideoSeriesFields(form, resetEpisodeNumber = false) {
  const category = form.querySelector('#admin-video-category')?.value;
  const folderSelect = form.querySelector('#admin-video-folder');
  const folderKey = folderSelect?.value;
  const isNewShow = folderKey === '__new__';
  const existingShow = isNewShow ? null : adminSeriesForFolder(category, folderKey);
  const defaults = builtInShowMetadata(existingShow?.show_title);
  const newFolderField = form.querySelector('[data-admin-new-folder-field]');
  if (newFolderField) newFolderField.hidden = !isNewShow;
  const folderName = form.querySelector('#admin-video-folder-name');
  if (folderName) folderName.required = isNewShow;
  const showTitle = form.querySelector('#admin-video-show');
  if (showTitle && existingShow) {
    showTitle.value = existingShow.show_title;
  } else if (showTitle) {
    showTitle.value = '';
  }
  if (showTitle) showTitle.readOnly = Boolean(existingShow);
  const setImagePreview = (inputId, url, required) => {
    const input = form.querySelector(inputId);
    const box = input?.previousElementSibling;
    const preview = box?.querySelector('.admin-upload-preview');
    const prompt = box?.querySelector('strong');
    const remove = box?.querySelector('.admin-upload-remove');
    if (input) input.required = required;
    if (preview) {
      if (url) preview.src = url;
      else preview.removeAttribute('src');
      preview.hidden = !url;
    }
    if (prompt) prompt.hidden = Boolean(url || input?.files?.length);
    if (remove) remove.hidden = !input?.files?.length;
  };
  const posterUrl = catalogPosterUrl(existingShow) || defaults?.poster || '';
  const episodePosterUrl = defaults?.episodePoster || catalogPosterUrl(existingShow, true) || '';
  setImagePreview('#admin-video-poster', posterUrl, !existingShow?.poster_path && !defaults?.poster);
  setImagePreview('#admin-video-episode-poster', episodePosterUrl, !existingShow?.episode_poster_path && !defaults?.episodePoster);
  const description = form.querySelector('#admin-video-description');
  const genres = form.querySelector('#admin-video-genres');
  const type = form.querySelector('#admin-video-type');
  if (description) description.value = existingShow?.show_description || defaults?.description || '';
  if (genres) {
    const savedGenres = Array.isArray(existingShow?.genres) ? existingShow.genres : [];
    genres.value = (savedGenres.length ? savedGenres : defaults?.genres || []).join(', ');
  }
  if (type) type.value = existingShow?.show_type || defaults?.type || 'Series';
  if (description) description.required = !description.value;
  if (genres) genres.required = !genres.value;
  if (type) type.required = !type.value;
  if (!isNewShow && resetEpisodeNumber && category && existingShow) {
    const nextEpisode = adminVideos
      .filter((video) => video.category === category && (
        existingShow.folder_name
          ? video.folder_name === existingShow.folder_name
          : normalizeShowTitle(video.show_title) === normalizeShowTitle(existingShow.show_title)
      ))
      .reduce((maximum, video) => Math.max(maximum, Number(video.episode_number) || 0), 0) + 1;
    const episodeNumber = form.querySelector('#admin-video-number');
    if (episodeNumber) episodeNumber.value = String(Math.min(nextEpisode, 9999));
  } else if (isNewShow && resetEpisodeNumber) {
    const episodeNumber = form.querySelector('#admin-video-number');
    if (episodeNumber) episodeNumber.value = '1';
  }
}

function renderAdminPanel() {
  if (!currentAccount?.id) return navigate('login');
  if (isAdminUser !== true) {
    const page = currentPage();
    app.innerHTML = appFrame(page, `<section class="admin-panel"><p class="purchase-history-message" role="status">${isAdminUser === false ? 'Akses khusus admin.' : 'Memeriksa akses admin...'}</p></section>`);
    if (adminCheckedForUserId !== currentAccount.id && !adminAccessLoading) void checkAdminAccess();
    return;
  }

  const page = currentPage();
  const orderPageSize = 1;
  const orderPageCount = Math.max(1, Math.ceil(adminOrders.length / orderPageSize));
  adminOrdersPage = Math.min(adminOrdersPage, orderPageCount - 1);
  const pageOrders = adminOrders.slice(
    adminOrdersPage * orderPageSize,
    (adminOrdersPage + 1) * orderPageSize
  );
  const orderMarkup = adminOrders.length
    ? `${pageOrders.map((order) => `<article class="admin-order-card"><div class="admin-order-summary"><strong>${Number(order.diamonds).toLocaleString('id-ID')} berlian · Rp ${Number(order.amount).toLocaleString('id-ID')}</strong><small>${escapeHtml(order.invoiceNumber)} · ${new Date(order.createdAt).toLocaleString('id-ID')}</small><small>User: ${escapeHtml(order.userId)}</small></div>${order.proofUrl ? `<a class="admin-proof-link" href="${escapeHtml(order.proofUrl)}" target="_blank" rel="noopener noreferrer"><img src="${escapeHtml(order.proofUrl)}" alt="Bukti pembayaran ${escapeHtml(order.invoiceNumber)}" /><span>Lihat bukti pembayaran</span></a>` : '<p class="admin-proof-missing">Bukti pembayaran belum diunggah.</p>'}<div class="admin-order-actions"><button class="button button-primary" type="button" data-action="admin-verify-order" data-invoice="${escapeHtml(order.invoiceNumber)}" ${adminActionInProgress || !order.proofUrl ? 'disabled' : ''}>${order.proofUrl ? 'Dana diterima' : 'Menunggu bukti pembayaran'}</button><button class="admin-reject-order" type="button" data-action="admin-reject-order" data-invoice="${escapeHtml(order.invoiceNumber)}" ${adminActionInProgress ? 'disabled' : ''}>Tolak pembelian</button></div></article>`).join('')}${orderPageCount > 1 ? `<nav class="admin-orders-pagination" aria-label="Navigasi transaksi menunggu verifikasi"><button type="button" data-action="admin-orders-page" data-page="${adminOrdersPage - 1}" aria-label="Halaman sebelumnya" ${adminOrdersPage === 0 ? 'disabled' : ''}></button><span>Halaman ${adminOrdersPage + 1} dari ${orderPageCount}</span><button type="button" data-action="admin-orders-page" data-page="${adminOrdersPage + 1}" aria-label="Halaman berikutnya" ${adminOrdersPage >= orderPageCount - 1 ? 'disabled' : ''}></button></nav>` : ''}`
    : `<div class="admin-empty-state"><img src="${ASSETS.focusShortage}" alt="" /><p class="admin-empty">Tidak ada transaksi yang menunggu verifikasi.</p></div>`;
  const videoMarkup = adminVideos.length
    ? (() => {
      const pageSize = 6;
      const pageCount = Math.ceil(adminVideos.length / pageSize);
      adminVideosPage = Math.min(adminVideosPage, pageCount - 1);
      const pageVideos = adminVideos.slice(adminVideosPage * pageSize, (adminVideosPage + 1) * pageSize);
      return `${pageVideos.map((video) => `<article class="admin-video-row"><strong>${escapeHtml(video.show_title)} · Episode ${Number(video.episode_number)}</strong><span>${escapeHtml(video.category === 'anime' ? 'Anime' : 'K-drama')} · ${escapeHtml(video.episode_title)}</span><small>${new Date(video.created_at).toLocaleDateString('id-ID')}</small></article>`).join('')}${pageCount > 1 ? `<nav class="admin-orders-pagination" aria-label="Navigasi video terbaru"><button type="button" data-action="admin-latest-videos-page" data-page="${adminVideosPage - 1}" aria-label="Video sebelumnya" ${adminVideosPage === 0 ? 'disabled' : ''}></button><span>Halaman ${adminVideosPage + 1} dari ${pageCount}</span><button type="button" data-action="admin-latest-videos-page" data-page="${adminVideosPage + 1}" aria-label="Video berikutnya" ${adminVideosPage >= pageCount - 1 ? 'disabled' : ''}></button></nav>` : ''}`;
    })()
    : '<p class="admin-empty">Belum ada video yang ditambahkan.</p>';
  const verifiedOrderMarkup = adminVerifiedOrders.length
    ? (() => {
      const pageSize = 4;
      const pageCount = Math.ceil(adminVerifiedOrders.length / pageSize);
      adminVerifiedOrdersPage = Math.min(adminVerifiedOrdersPage, pageCount - 1);
      const pageOrders = adminVerifiedOrders.slice(
        adminVerifiedOrdersPage * pageSize,
        (adminVerifiedOrdersPage + 1) * pageSize
      );
      return `${pageOrders.map((order) => `<article class="admin-verified-order"><div class="admin-verified-proof">${order.proofUrl ? `<a href="${escapeHtml(order.proofUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Lihat bukti pembayaran ${escapeHtml(order.invoiceNumber)}"><img src="${escapeHtml(order.proofUrl)}" alt="Bukti pembayaran ${escapeHtml(order.invoiceNumber)}" /></a>` : '<span>Tidak ada lampiran</span>'}</div><div class="admin-verified-details"><strong>${Number(order.diamonds).toLocaleString('id-ID')} berlian · Rp ${Number(order.amount).toLocaleString('id-ID')}</strong><small>${escapeHtml(order.invoiceNumber)} · ${new Date(order.verifiedAt || order.createdAt).toLocaleString('id-ID')}</small><small>User: ${escapeHtml(order.userName || 'Pengguna tidak ditemukan')}</small><span class="admin-order-status ${order.status === 'rejected' ? 'is-rejected' : ''}">${order.status === 'rejected' ? 'Pembelian ditolak' : 'Pembelian terverifikasi'}</span></div></article>`).join('')}${pageCount > 1 ? `<nav class="admin-orders-pagination" aria-label="Navigasi histori verifikasi"><button type="button" data-action="admin-history-page" data-page="${adminVerifiedOrdersPage - 1}" aria-label="Histori sebelumnya" ${adminVerifiedOrdersPage === 0 ? 'disabled' : ''}></button><span>Halaman ${adminVerifiedOrdersPage + 1} dari ${pageCount}</span><button type="button" data-action="admin-history-page" data-page="${adminVerifiedOrdersPage + 1}" aria-label="Histori berikutnya" ${adminVerifiedOrdersPage >= pageCount - 1 ? 'disabled' : ''}></button></nav>` : ''}`;
    })()
    : '<p class="admin-empty">Belum ada pembelian yang diverifikasi.</p>';
  const adminChoices = [
    ['admin-verification', 'Verifikasi pembelian'],
    ['admin-history', 'Histori verifikasi'],
    ['admin-add-video', 'Tambah video'],
    ['admin-latest-videos', 'Video terbaru'],
  ];
  const addVideoForm = renderAdminVideoForm();
  const adminContent = {
    'admin-verification': `<section class="admin-panel-section admin-verification-section"><div class="admin-section-heading"><div><h2>Verifikasi pembelian</h2><p>Periksa bukti dan pastikan dana sudah masuk sebelum menyetujui transaksi.</p></div><span class="admin-pending-count">${adminOrders.length} tertunda</span></div>${adminPanelLoading ? '<p class="admin-empty" role="status">Memuat transaksi...</p>' : orderMarkup}</section>`,
    'admin-history': `<section class="admin-panel-section admin-history-section"><h2>Histori verifikasi</h2>${adminPanelLoading ? '<p class="admin-empty" role="status">Memuat histori...</p>' : verifiedOrderMarkup}</section>`,
    'admin-add-video': `<section class="admin-panel-section admin-add-video-section"><h2>Tambah video</h2>${addVideoForm}</section>`,
    'admin-latest-videos': `<section class="admin-panel-section admin-latest-videos-section"><h2>Video terbaru</h2>${adminPanelLoading ? '<p class="admin-empty" role="status">Memuat video...</p>' : videoMarkup}</section>`,
  };
  const content = page === 'admin'
    ? `<nav class="admin-menu" aria-label="Menu panel admin">${adminChoices.map(([target, label]) => `<button class="admin-menu-item" type="button" data-nav="${target}"><span>${label}</span><span class="admin-menu-trailing">${target === 'admin-verification' && adminOrders.length ? `<span class="admin-menu-pending-count" aria-label="${adminOrders.length} transaksi menunggu verifikasi">${adminOrders.length}</span>` : ''}<b aria-hidden="true">›</b></span></button>`).join('')}</nav>`
    : adminContent[page] || '';
  app.innerHTML = appFrame(page, `<section class="admin-panel">
    ${adminPanelMessage ? `<p class="admin-panel-message" role="status">${escapeHtml(adminPanelMessage)}</p>` : ''}
    ${adminPanelError ? `<p class="admin-panel-error" role="alert">${escapeHtml(adminPanelError)} <button type="button" data-action="retry-admin-panel">Coba lagi</button></p>` : ''}
    ${content}
  </section>`);
  const adminVideoForm = app.querySelector('[data-form="admin-video"]');
  if (adminVideoForm) syncAdminVideoSeriesFields(adminVideoForm);
  if (!adminPanelAttempted && !adminPanelLoading) void loadAdminPanel();
}

async function loadAdminPanel() {
  if (adminPanelLoading) return;
  adminPanelLoading = true;
  adminPanelAttempted = true;
  const requestedUserId = currentAccount?.id;
  adminPanelError = '';
  try {
    const [orderResult, videoResult] = await Promise.all([
      authenticatedRequest('/api/admin/orders'),
      authenticatedRequest('/api/admin/videos'),
    ]);
    if (!orderResult.response.ok) throw new Error(orderResult.result.error || 'Transaksi admin tidak dapat dimuat.');
    if (!videoResult.response.ok) throw new Error(videoResult.result.error || 'Daftar video admin tidak dapat dimuat.');
    if (!Array.isArray(orderResult.result.orders) || !Array.isArray(orderResult.result.verifiedOrders) || !Array.isArray(videoResult.result.videos)) {
      throw new Error('Data panel admin tidak valid.');
    }
    if (currentAccount?.id !== requestedUserId) return;
    adminOrders = orderResult.result.orders;
    adminVerifiedOrders = orderResult.result.verifiedOrders;
    adminVideos = videoResult.result.videos;
    adminPanelLoaded = true;
  } catch (error) {
    console.error('Data panel admin gagal dimuat:', error);
    if (currentAccount?.id === requestedUserId) {
      adminPanelError = error.message || 'Data panel admin tidak dapat dimuat.';
    }
  } finally {
    adminPanelLoading = false;
    if (currentAccount?.id === requestedUserId && isAdminPage()) renderAdminPanel();
    else if (currentAccount?.id === requestedUserId && currentPage() === 'profile') renderProfile();
  }
}

async function verifyAdminOrder(invoiceNumber) {
  await updateAdminOrder(invoiceNumber, 'verify');
}

async function rejectAdminOrder(invoiceNumber) {
  await updateAdminOrder(invoiceNumber, 'reject');
}

async function updateAdminOrder(invoiceNumber, action) {
  if (adminActionInProgress) return;
  adminActionInProgress = true;
  adminPanelMessage = action === 'reject' ? 'Menolak transaksi...' : 'Memverifikasi transaksi...';
  adminPanelError = '';
  renderAdminPanel();
  try {
    const { response, result } = await authenticatedRequest('/api/admin/orders', {
      method: 'POST',
      body: JSON.stringify({ invoiceNumber, action }),
    });
    if (!response.ok) throw new Error(result.error || (action === 'reject' ? 'Pembelian tidak dapat ditolak.' : 'Pembayaran tidak dapat diverifikasi.'));
    adminPanelMessage = action === 'reject'
      ? `Transaksi ${invoiceNumber} ditolak. Berlian tidak diberikan.`
      : `Transaksi ${invoiceNumber} berhasil diverifikasi.`;
    adminPanelLoaded = false;
    adminPanelAttempted = false;
  } catch (error) {
    console.error('Verifikasi transaksi admin gagal:', error);
    adminPanelError = error.message || 'Pembayaran tidak dapat diverifikasi.';
  } finally {
    adminActionInProgress = false;
    if (isAdminPage()) {
      if (adminPanelLoaded) renderAdminPanel();
      else void loadAdminPanel();
    }
  }
}

async function uploadAdminVideo(button) {
  if (adminActionInProgress) return;
  const form = button.closest('form');
  if (!form || !validateAdminVideoWizard(form)) return;
  const file = form?.querySelector('#admin-video-file')?.files?.[0];
  const category = form?.querySelector('#admin-video-category')?.value;
  const selectedFolder = form?.querySelector('#admin-video-folder')?.value;
  const isNewShow = selectedFolder === '__new__';
  const existingShow = isNewShow ? null : adminSeriesForFolder(category, selectedFolder);
  const folderLabel = form?.querySelector('#admin-video-folder-name')?.value.trim();
  const showTitle = form?.querySelector('#admin-video-show')?.value.trim();
  const defaults = builtInShowMetadata(showTitle);
  const episodeTitle = form?.querySelector('#admin-video-episode')?.value.trim();
  const episodeNumber = Number(form?.querySelector('#admin-video-number')?.value);
  const posterFile = form?.querySelector('#admin-video-poster')?.files?.[0];
  const episodePosterFile = form?.querySelector('#admin-video-episode-poster')?.files?.[0];
  const thumbnailFile = form?.querySelector('#admin-video-thumbnail')?.files?.[0];
  const showDescription = form?.querySelector('#admin-video-description')?.value.trim()
    || existingShow?.show_description || defaults?.description || '';
  const genreText = form?.querySelector('#admin-video-genres')?.value.trim();
  const genres = genreText
    ? genreText.split(',').map((genre) => genre.trim()).filter(Boolean)
    : existingShow?.genres?.length ? existingShow.genres : defaults?.genres || [];
  const showType = form?.querySelector('#admin-video-type')?.value || existingShow?.show_type || defaults?.type || 'Series';
  const needsPoster = !existingShow?.poster_path;
  const needsEpisodePoster = Boolean(defaults?.episodePoster) || !existingShow?.episode_poster_path;
  if (!file || !['video/mp4', 'video/webm'].includes(file.type) || file.size > 50 * 1024 * 1024) {
    adminPanelError = 'Pilih video MP4/WebM dengan ukuran maksimal 50 MB.';
    renderAdminPanel();
    return;
  }
  if (!showTitle || (isNewShow && !folderLabel) || !episodeTitle || !Number.isInteger(episodeNumber) || episodeNumber < 1 || episodeNumber > 9999) {
    adminPanelError = 'Lengkapi nama folder, judul, dan nomor episode dengan benar.';
    renderAdminPanel();
    return;
  }
  const imageFiles = [posterFile, episodePosterFile, thumbnailFile].filter(Boolean);
  if (
    (needsPoster && !posterFile && !defaults?.poster)
    || (needsEpisodePoster && !episodePosterFile && !defaults?.episodePoster)
    || !showDescription
    || !genres.length
    || !thumbnailFile
    || imageFiles.some((image) => !['image/png', 'image/jpeg', 'image/webp'].includes(image.type) || image.size > 5 * 1024 * 1024)
    || genres.length > 20
    || genres.some((genre) => genre.length > 40)
  ) {
    adminPanelError = 'Poster dan thumbnail harus PNG/JPG/WebP maksimal 5 MB. Lengkapi juga metadata folder dan genre.';
    renderAdminPanel();
    return;
  }

  adminActionInProgress = true;
  adminPanelMessage = 'Mengunggah video...';
  adminPanelError = '';
  renderAdminPanel();
  const uploadedPaths = [];
  let catalogued = false;
  let safeToCleanUpload = false;
  try {
    const { session } = await authenticatedRequest('/api/admin/access');
    const userId = session.user.id;
    const folderName = existingShow?.folder_name
      || `${catalogFolderSlug(isNewShow ? folderLabel : showTitle)}${isNewShow ? `-${crypto.randomUUID().slice(0, 8)}` : ''}`;
    const upload = async (path, uploadFile) => {
      const { error } = await supabaseClient.storage
        .from('catalog-video')
        .upload(path, uploadFile, { contentType: uploadFile.type, upsert: false });
      if (error) throw error;
      uploadedPaths.push(path);
    };
    let posterPath = existingShow?.poster_path || '';
    let episodePosterPath = existingShow?.episode_poster_path || '';
    let posterUploadFile = posterFile;
    if (needsPoster && !posterUploadFile && defaults?.poster) {
      const posterResponse = await fetch(defaults.poster);
      if (!posterResponse.ok) throw new Error('Poster bawaan folder tidak dapat dimuat.');
      posterUploadFile = await posterResponse.blob();
    }
    if (posterUploadFile) {
      const posterExtension = posterUploadFile.type === 'image/jpeg' ? 'jpg' : posterUploadFile.type.split('/')[1];
      posterPath = `${userId}/${folderName}/poster.${posterExtension}`;
      await upload(posterPath, posterUploadFile);
    }
    let episodePosterUploadFile = episodePosterFile;
    if (needsEpisodePoster && !episodePosterUploadFile && defaults?.episodePoster) {
      const posterResponse = await fetch(defaults.episodePoster);
      if (!posterResponse.ok) throw new Error('Poster horizontal bawaan folder tidak dapat dimuat.');
      episodePosterUploadFile = await posterResponse.blob();
    }
    if (episodePosterUploadFile) {
      const episodePosterExtension = episodePosterUploadFile.type === 'image/jpeg' ? 'jpg' : episodePosterUploadFile.type.split('/')[1];
      episodePosterPath = `${userId}/${folderName}/episode-posters/${crypto.randomUUID()}.${episodePosterExtension}`;
      await upload(episodePosterPath, episodePosterUploadFile);
    }
    const thumbnailExtension = thumbnailFile.type === 'image/jpeg' ? 'jpg' : thumbnailFile.type.split('/')[1];
    const thumbnailPath = `${userId}/${folderName}/thumbnails/episode-${episodeNumber}-${crypto.randomUUID()}.${thumbnailExtension}`;
    await upload(thumbnailPath, thumbnailFile);
    const videoExtension = file.type === 'video/webm' ? 'webm' : 'mp4';
    const videoPath = `${userId}/${folderName}/episodes/${crypto.randomUUID()}.${videoExtension}`;
    await upload(videoPath, file);

    const { response, result } = await authenticatedRequest('/api/admin/videos', {
      method: 'POST',
      body: JSON.stringify({
        category,
        showTitle,
        episodeTitle,
        episodeNumber,
        folderName,
        showDescription,
        genres,
        showType,
        posterPath,
        episodePosterPath,
        thumbnailPath,
        videoPath,
      }),
    });
    if (!response.ok) throw new Error(result.error || 'Video belum dapat dimasukkan ke katalog.');
    catalogued = true;
    adminPanelMessage = 'Video berhasil diunggah dan ditambahkan ke katalog.';
    adminPanelLoaded = false;
    adminPanelAttempted = false;
    catalogVideos = [];
    catalogVideosLoaded = false;
  } catch (error) {
    console.error('Video admin gagal diunggah:', error);
    adminPanelError = error.message || 'Video belum dapat diunggah.';
    if (uploadedPaths.length && !catalogued) {
      try {
        const { response, result } = await authenticatedRequest('/api/admin/videos');
        if (response.ok && Array.isArray(result.videos)) {
          catalogued = result.videos.some((video) => uploadedPaths.includes(video.video_path));
          safeToCleanUpload = !catalogued;
        }
      } catch (checkError) {
        console.error('Status penyimpanan video gagal diperiksa:', checkError);
      }
    }
    if (uploadedPaths.length && !catalogued && safeToCleanUpload) {
      const { error: cleanupError } = await supabaseClient.storage
        .from('catalog-video')
        .remove(uploadedPaths);
      if (cleanupError) console.error('File unggahan katalog yang gagal tidak dapat dibersihkan:', cleanupError);
    }
  } finally {
    adminActionInProgress = false;
    if (isAdminPage()) {
      if (adminPanelLoaded) renderAdminPanel();
      else void loadAdminPanel();
    }
  }
}

async function refreshCatalogVideos() {
  if (catalogVideosLoading || catalogVideosLoaded) return;
  catalogVideosLoading = true;
  try {
    const { data, error } = await supabaseClient
      .from('catalog_videos')
      .select('id,category,show_title,episode_title,episode_number,video_path,video_url,created_at,folder_name,show_description,poster_path,poster_url,episode_poster_path,episode_poster_url,genres,show_type,episode_description,thumbnail_path,thumbnail_url')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) throw error;
    catalogVideos = data || [];
    catalogVideosLoaded = true;
  } catch (error) {
    console.error('Video terbaru tidak dapat dimuat:', error);
    catalogVideosLoaded = true;
  } finally {
    catalogVideosLoading = false;
    const page = currentPage();
    if (page === 'watch-anime' || page === 'watch-kdrama') renderWatchCatalog(page === 'watch-anime' ? 'anime' : 'kdrama');
    else if (page === 'focus') renderFocus();
    else if (page === 'anime-episodes') renderAnimeEpisodes();
    else if (page === 'kdrama-episodes') renderKdramaEpisodes();
    else if (page === 'anime-stream') renderAnimeStream();
    else if (page === 'media-stream') renderMediaStream();
  }
}

function catalogVideoUrl(video) {
  const bucketPrefix = `${SUPABASE_URL.replace(/\/+$/, '')}/storage/v1/object/public/catalog-video/`;
  if (typeof video.video_url === 'string' && video.video_url.startsWith(bucketPrefix)) return video.video_url;
  const videoPath = typeof video.video_path === 'string'
    ? video.video_path.trim().replace(/\\/g, '/').replace(/^\/+/, '')
    : '';
  if (!videoPath) return '';
  const publicUrl = supabaseClient.storage.from('catalog-video').getPublicUrl(videoPath).data?.publicUrl;
  return typeof publicUrl === 'string' && publicUrl.startsWith(bucketPrefix) ? publicUrl : '';
}

function catalogPosterUrl(video, horizontal = false) {
  if (!video) return '';
  const url = horizontal ? video.episode_poster_url : video.poster_url;
  const path = horizontal ? video.episode_poster_path : video.poster_path;
  if (typeof url === 'string' && url) return url;
  if (typeof path !== 'string' || !path) return '';
  const bucketPrefix = `${SUPABASE_URL.replace(/\/+$/, '')}/storage/v1/object/public/catalog-video/`;
  const publicUrl = supabaseClient.storage.from('catalog-video').getPublicUrl(path).data?.publicUrl;
  return typeof publicUrl === 'string' && publicUrl.startsWith(bucketPrefix) ? publicUrl : '';
}

function catalogShowEpisodePoster(showTitle, category) {
  const video = catalogVideos.find((item) => (
    item.category === category
    && normalizeShowTitle(item.show_title) === normalizeShowTitle(showTitle)
    && catalogPosterUrl(item, true)
  ));
  return video ? catalogPosterUrl(video, true) : '';
}

function mediaEpisodeLabel(video, showTitle = video.show_title) {
  const episodeNumber = Number(video.episode_number);
  const episodeLabel = Number.isFinite(episodeNumber) && episodeNumber > 0
    ? `Episode ${episodeNumber}`
    : 'Episode';
  return `${episodeLabel} - ${showTitle}`;
}

function kdramaEpisodeLabel(showTitle, episodeNumber) {
  const normalizedTitle = normalizeShowTitle(showTitle);
  if (
    episodeNumber === 1 || episodeNumber === 2
  ) {
    if (
      normalizedTitle === normalizeShowTitle('Nine Puzzle')
      || normalizedTitle === normalizeShowTitle('Teach You a Lesson')
    ) return `Episode 1.${episodeNumber} - ${showTitle}`;
  }
  return mediaEpisodeLabel({ show_title: showTitle, episode_number: episodeNumber });
}

function kdramaEpisodeThumbnail(showTitle, episodeNumber, fallback = '') {
  const normalizedTitle = normalizeShowTitle(showTitle);
  const thumbnailPaths = normalizedTitle === normalizeShowTitle('Nine Puzzle')
    ? {
        1: 'assets/nine-puzzle-episode-1-thumbnail.png',
        2: 'assets/nine-puzzle-episode-2-thumbnail.png',
      }
    : normalizedTitle === normalizeShowTitle('Teach You a Lesson')
      ? {
          1: 'assets/teach-you-a-lesson-episode-1-thumbnail.png',
          2: 'assets/teach-you-a-lesson-episode-2-thumbnail.png',
        }
      : {};
  return thumbnailPaths[episodeNumber] || fallback;
}

function renderMediaStreamTabContent(showTitle, seriesVideos, metadata) {
  if (mediaStreamTab === 'description') {
    const currentDescription = currentMediaVideo?.show_description
      || currentMediaVideo?.episode_description
      || metadata?.description
      || '';
    return `<p class="anime-description">${escapeHtml(currentDescription)}</p>`;
  }
  if (mediaStreamTab === 'similar') {
    const similar = ['Nine Puzzle', 'Teach You a Lesson']
      .filter((title) => normalizeShowTitle(title) !== normalizeShowTitle(showTitle))
      .map((title) => {
        const similarMetadata = builtInShowMetadata(title);
        return `<article class="anime-similar-item"><button class="anime-similar-card" type="button" data-action="watch-show" data-show="${escapeHtml(title)}" data-category="kdrama" aria-label="Tonton ${escapeHtml(title)}"><img src="${similarMetadata?.poster || ''}" alt="Poster ${escapeHtml(title)}" /></button><strong>${escapeHtml(title)}</strong></article>`;
      }).join('');
    return `<div class="anime-similar-grid">${similar}</div>`;
  }

  const poster = builtInEpisodePoster(showTitle)
    || (currentMediaVideo && catalogShowEpisodePoster(showTitle, currentMediaVideo.category))
    || metadata?.episodePoster
    || (currentMediaVideo && catalogPosterUrl(currentMediaVideo, true))
    || (currentMediaVideo && catalogPosterUrl(currentMediaVideo))
    || metadata?.poster || '';
  const availableEpisodes = seriesVideos
    .filter((video) => Number.isFinite(Number(video.episode_number)) && Number(video.episode_number) > 0)
    .sort((first, second) => Number(first.episode_number) - Number(second.episode_number));
  const episodes = availableEpisodes.length
    ? availableEpisodes.map((video) => {
      const isSelected = video.id === currentMediaVideo?.id;
      const episodeNumber = Number(video.episode_number);
      const thumbnail = kdramaEpisodeThumbnail(
        showTitle,
        episodeNumber,
        video.thumbnail_url || catalogPosterUrl(video, true) || catalogPosterUrl(video) || metadata?.poster || '',
      );
      const title = kdramaEpisodeLabel(showTitle, episodeNumber);
      return `<button class="anime-episode-card${isSelected ? ' is-active' : ''}" type="button" data-action="select-media-stream-episode" data-video-id="${escapeHtml(video.id)}" aria-pressed="${isSelected}"><img class="anime-episode-thumbnail" src="${escapeHtml(thumbnail)}" alt="" /><span><strong>${escapeHtml(title)}</strong><small class="${isSelected ? 'anime-episode-duration' : ''}">${isSelected ? 'Memuat durasi...' : 'Pilih untuk memutar'}</small></span></button>`;
    }).join('')
    : [1, 2].map((episodeNumber) => {
      const thumbnail = kdramaEpisodeThumbnail(showTitle, episodeNumber, poster);
      const title = kdramaEpisodeLabel(showTitle, episodeNumber);
      return `<article class="anime-episode-card anime-episode-unavailable"><img class="anime-episode-thumbnail" src="${escapeHtml(thumbnail)}" alt="" /><span><strong>${escapeHtml(title)}</strong><small>Video belum tersedia</small></span></article>`;
    }).join('');
  return `<div class="anime-episode-list">${episodes}</div>`;
}

function renderMediaStream() {
  if (!currentMediaVideo) return navigate(`watch-${currentMediaVideo?.category || 'anime'}`);
  const category = currentMediaVideo.category;
  const backPage = category === 'kdrama' ? 'kdrama-episodes' : 'anime-episodes';
  const showTitle = currentMediaVideo.show_title;
  const metadata = builtInShowMetadata(showTitle);
  const seriesVideos = catalogVideos
    .filter((video) => (
      video.category === category
      && normalizeShowTitle(video.show_title) === normalizeShowTitle(showTitle)
    ))
    .sort((first, second) => Number(first.episode_number) - Number(second.episode_number));
  const currentEpisode = seriesVideos.find((video) => video.id === currentMediaVideo.id)
    || seriesVideos[0]
    || currentMediaVideo;
  if (currentEpisode !== currentMediaVideo) currentMediaVideo = currentEpisode;
  const videoUrl = catalogVideoUrl(currentEpisode);
  const genres = currentEpisode.genres?.length ? currentEpisode.genres : metadata?.genres || [];
  const poster = builtInEpisodePoster(showTitle)
    || catalogShowEpisodePoster(showTitle, category)
    || metadata?.episodePoster
    || catalogPosterUrl(currentEpisode, true)
    || catalogPosterUrl(currentEpisode)
    || metadata?.poster || '';
  const streamTitle = videoUrl
    ? mediaEpisodeLabel(currentEpisode)
    : showTitle;
  const player = videoUrl
    ? `<div class="anime-video-stage"><video id="media-video" playsinline preload="metadata" src="${escapeHtml(videoUrl)}" aria-label="${escapeHtml(streamTitle)}"></video><button class="anime-back-control" type="button" data-nav="${backPage}" aria-label="Kembali ke daftar tayangan"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg></button><div class="anime-video-controls"><button class="anime-play-control" type="button" data-action="toggle-media-video-playback" aria-label="Putar video"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4v16l13-8z"/></svg></button><button class="anime-fullscreen-control" type="button" data-action="toggle-stream-fullscreen" aria-label="Layar penuh"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m13-5v3a2 2 0 0 1-2 2h-3"/></svg></button><p class="stream-fullscreen-status" role="status" hidden></p><input id="media-video-seek" class="anime-video-seek" type="range" min="0" max="1000" step="1" value="0" aria-label="Posisi video" /></div></div>`
    : `<div class="media-stream-placeholder"><img src="${escapeHtml(poster)}" alt="Poster ${escapeHtml(showTitle)}" /><span>Episode belum tersedia</span><button class="anime-back-control" type="button" data-nav="${backPage}" aria-label="Kembali ke daftar tayangan"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg></button></div>`;
  const videoToPreserve = mediaVideoElement
    && (mediaPiPWindow?.contains(mediaVideoElement) || app.contains(mediaVideoElement))
    ? {
        element: mediaVideoElement,
        currentTime: mediaVideoElement.currentTime,
        wasPlaying: !mediaVideoElement.paused && !mediaVideoElement.ended,
        src: mediaVideoElement.getAttribute('src') || '',
      }
    : null;
  const streamContent = `<section class="anime-stream-page"><div class="anime-video-shell">${player}</div><h1 class="anime-stream-title">${escapeHtml(streamTitle)}</h1><div class="anime-stream-genres">${genres.map((genre) => `<span>${escapeHtml(genre)}</span>`).join('')}</div><nav class="anime-stream-tabs" aria-label="Informasi tayangan"><button type="button" data-media-stream-tab="episode" class="${mediaStreamTab === 'episode' ? 'is-active' : ''}">Episode</button><button type="button" data-media-stream-tab="description" class="${mediaStreamTab === 'description' ? 'is-active' : ''}">Deskripsi</button><button type="button" data-media-stream-tab="similar" class="${mediaStreamTab === 'similar' ? 'is-active' : ''}">Serupa</button></nav><div class="anime-stream-tab-content">${renderMediaStreamTabContent(showTitle, seriesVideos, metadata)}</div></section>`;
  app.innerHTML = streamContent;
  const newVideo = app.querySelector('#media-video');
  let video = newVideo;
  if (newVideo && videoToPreserve) {
    video = videoToPreserve.element;
    const sourceChanged = videoToPreserve.src !== (videoUrl || '');
    if (sourceChanged) {
      if (videoUrl) video.setAttribute('src', videoUrl);
      else video.removeAttribute('src');
      video.load();
    }
    newVideo.replaceWith(video);
    mediaVideoElement = video;
    if (!sourceChanged && (videoToPreserve.wasPlaying || videoToPreserve.currentTime > 0)) {
      const restorePlayback = () => {
        if (video.currentTime !== videoToPreserve.currentTime && Number.isFinite(videoToPreserve.currentTime)) {
          video.currentTime = videoToPreserve.currentTime;
        }
        if (videoToPreserve.wasPlaying) {
          video.play().catch((error) => console.error('Video gagal dilanjutkan:', error));
        }
      };
      if (video.readyState >= HTMLMediaElement.HAVE_METADATA) restorePlayback();
      else video.addEventListener('loadedmetadata', restorePlayback, { once: true });
    }
  } else {
    video = newVideo;
    mediaVideoElement = video;
  }
  if (video) {
    bindMediaVideoUi(video);
    showAnimeControls();
    if (mediaAutoplayRequested) {
      mediaAutoplayRequested = false;
      video.play().catch((error) => console.error('Video gagal diputar:', error));
    }
  } else if (catalogVideosLoaded) {
    mediaAutoplayRequested = false;
  }
  mediaPiPWindow?.remove();
  mediaPiPWindow = null;
  if (!catalogVideosLoaded) void refreshCatalogVideos();
}

function renderAccount() {
  if (!currentAccount) return navigate('login');
  const username = escapeHtml(currentAccount.name);
  const email = escapeHtml(currentAccount.email);
  const avatar = getAccountAvatarSource();
  app.innerHTML = `<section class="account-page"><header class="account-page-header"><button type="button" data-nav="profile" aria-label="Kembali">‹</button><h1>Profil</h1></header><div class="account-avatar"><img id="account-avatar-image" src="${avatar}" alt="Avatar ${username}" /></div><button class="account-avatar-change" type="button" data-action="open-avatar-options">Ganti avatar</button><form class="account-data-form" data-form="account-data"><label for="account-name">Nama pengguna</label><input id="account-name" name="name" value="${username}" required /><label for="account-email">Email</label><input id="account-email" name="email" type="email" value="${email}" required /><label for="account-password">Password</label><input id="account-password" name="password" type="password" minlength="6" placeholder="•••••••" autocomplete="new-password" /><p id="account-save-status" role="status"></p></form><button class="account-delete-button" type="button" data-action="delete-account">Hapus akun</button></section>`;
}

function getAccountAvatarSource() {
  if (currentAccount?.avatarData) return currentAccount.avatarData;
  if (currentAccount?.avatarChoice === 'female') return 'assets/avatar-female.png';
  if (currentAccount?.avatarChoice === 'male') return 'assets/avatar-male.png';
  return ASSETS.profileAvatar;
}

function modalView() {
  if (!modal) return '';
  let body = '';

  if (modal.type === 'analyzing') {
    body = `<div class="dialog analyzing-dialog"><div class="loading-spinner" aria-hidden="true"></div><h2>Menganalisis tugas...</h2><p>Kudo sedang membaca tugasmu.</p></div>`;
  } else if (modal.type === 'task-added') {
    const task = modal.task;
    body = `<div class="dialog result-dialog task-added-dialog"><img class="task-added-art" src="${ASSETS.artDaily}" alt="Anak-anak belajar bersama" /><h2>Tugas ditambahkan</h2><p>${escapeHtml(task.title)} masuk ke ${task.difficulty === 'hard' ? 'Boss Fight' : 'Daily Quest'}.</p><button class="button button-primary" type="button" data-action="close-and-home">Kembali</button></div>`;
  } else if (modal.type === 'boss-victory') {
    body = `<div class="dialog result-dialog boss-victory-dialog"><h2>Selamat!!</h2><p>Kamu berhasil mengalahkan ${escapeHtml(modal.bossName || 'boss')}.</p><img class="boss-victory-art" src="assets/boss-victory-art.png" alt="Kudo merayakan kemenangan" /><button class="button button-primary" type="button" data-action="boss-victory-back">Kembali</button></div>`;
  } else if (modal.type === 'watch-filter') {
    const title = modal.filterKey === 'genre' ? 'Pilih genre' : 'Pilih jenis';
    body = `<div class="filter-sheet"><h2>${title}</h2><div class="filter-sheet-options">${modal.options.map((option) => `<button class="filter-chip ${modal.selection === option ? 'is-selected' : ''}" type="button" data-filter-option="${escapeHtml(option)}" aria-pressed="${modal.selection === option}">${escapeHtml(option)}</button>`).join('')}</div><button class="button button-primary filter-confirm" type="button" data-action="confirm-watch-filter">Terapkan</button></div>`;
  } else if (modal.type === 'anime-ticket-gate') {
    body = `<div class="focus-gate-sheet"><h2>Ingin menggunakan tiket untuk menonton?</h2><div class="focus-gate-item anime-ticket-item"><img src="${ASSETS.ticket}" alt="Tiket nonton" /><strong>1X</strong></div><button class="button button-primary focus-gate-confirm" type="button" data-action="use-anime-ticket">Gunakan tiket</button><button class="shop-decline-button" type="button" data-action="close-modal">Tidak, terima kasih</button></div>`;
  } else if (modal.type === 'avatar-options') {
    body = `<div class="avatar-options-sheet"><h2>Pilih avatar</h2><div class="avatar-options-grid"><button class="avatar-choice ${modal.selection === 'female' ? 'is-selected' : ''}" type="button" data-avatar-choice="female" aria-label="Avatar perempuan" aria-pressed="${modal.selection === 'female'}"><img src="assets/avatar-female.png" alt="Avatar perempuan" /></button><button class="avatar-choice ${modal.selection === 'male' ? 'is-selected' : ''}" type="button" data-avatar-choice="male" aria-label="Avatar laki-laki" aria-pressed="${modal.selection === 'male'}"><img src="assets/avatar-male.png" alt="Avatar laki-laki" /></button></div><button class="button button-primary" type="button" data-action="confirm-avatar">Konfirmasi</button></div>`;
  } else if (modal.type === 'profile-info') {
    body = `<div class="dialog result-dialog profile-info-dialog"><h2>${escapeHtml(modal.title)}</h2><img src="${ASSETS.profileInfoArt}" alt="Anak-anak belajar bersama" /><p>${escapeHtml(modal.message)}</p><button class="button button-primary" type="button" data-action="close-modal">Kembali</button></div>`;
  } else if (modal.type === 'task-photo') {
    body = `<div class="task-photo-zoom"><button type="button" data-action="close-modal" aria-label="Tutup">×</button><img src="${modal.src}" alt="Lampiran tugas diperbesar" /></div>`;
  } else if (modal.type === 'delete-account-confirm') {
    body = `<div class="dialog result-dialog"><h2>Hapus akun?</h2><p>Semua data dan progres akun ini akan dihapus permanen dan tidak dapat dipulihkan.</p><button class="button button-primary" type="button" data-action="confirm-delete-account" ${accountActionPending ? 'disabled' : ''}>Hapus akun</button><button class="button button-secondary" type="button" data-action="close-modal" ${accountActionPending ? 'disabled' : ''}>Batal</button></div>`;
  } else if (modal.type === 'account-action-error') {
    body = `<div class="dialog result-dialog"><h2>${escapeHtml(modal.title)}</h2><p>${escapeHtml(modal.message)}</p><button class="button button-primary" type="button" data-action="close-modal">Kembali</button></div>`;
  } else if (modal.type === 'mood') {
    const choices = [['ceria', 'mood-ceria.png'], ['tenang', 'mood-tenang.png'], ['biasa', 'mood-biasa.png'], ['lelah', 'mood-lelah.png'], ['sulit', 'mood-sulit.png']];
    body = `<div class="dialog mood-dialog"><h2>Bagaimana mood kamu?</h2><p>Setelah menyelesaikan tugas ini, pilih yang paling mewakili dirimu.</p><div class="mood-options">${choices.map(([label, image]) => `<button class="mood-choice ${modal.mood === label ? 'selected' : ''}" type="button" data-mood="${label}" aria-label="${label}" aria-pressed="${modal.mood === label}"><img src="assets/${image}" alt="" /></button>`).join('')}</div><button class="button button-primary" type="button" data-action="save-mood" ${modal.mood ? '' : 'disabled'}>Tambahkan</button></div>`;
  } else if (modal.type === 'focus-gate') {
    body = `<div class="focus-gate-sheet"><h2>Ingin menggunakan jam untuk mendengarkan?</h2><div class="focus-gate-item"><img src="${ASSETS.hourglass}" alt="Jam Fokus" /><strong>1X</strong></div><button class="button button-primary focus-gate-confirm" type="button" data-action="use-hourglass">${modal.switching ? 'Gunakan waktu' : 'Gunakan jam'}</button><button class="shop-decline-button" type="button" data-action="close-modal">Tidak, terima kasih</button></div>`;
  } else if (modal.type === 'focus-empty') {
    body = `<div class="dialog focus-gate focus-shortage-dialog"><h2>Maaf waktu kamu kurang</h2><p>Pergi ke toko untuk menambah waktu</p><img class="focus-shortage-art" src="${ASSETS.focusShortage}" alt="Kudo meminta tambahan waktu" /><button class="button button-primary" type="button" data-action="go-shop">Tambah</button><button class="text-button" type="button" data-action="close-modal">Kembali</button></div>`;
  } else if (modal.type === 'focus-ended') {
    body = `<div class="dialog result-dialog focus-shortage-dialog"><h2>Maaf waktu kamu kurang</h2><p>Pergi ke toko untuk menambah waktu</p><img class="focus-shortage-art" src="${ASSETS.focusShortage}" alt="Kudo meminta tambahan waktu" /><button class="button button-primary" type="button" data-action="go-shop">Tambah</button><button class="text-button" type="button" data-action="close-modal">Kembali</button></div>`;
  } else if (modal.type === 'focus-paused') {
    body = `<div class="dialog result-dialog"><div class="result-icon">⏸️</div><h2>Sesi dijeda</h2><p>Jam Fokus tidak berkurang selama jeda.</p><button class="button button-primary" type="button" data-action="resume-focus">Lanjutkan</button><button class="text-button" type="button" data-action="close-modal">Tutup</button></div>`;
  } else if (modal.type === 'purchase') {
    body = `<div class="dialog result-dialog"><div class="result-icon">${modal.ok ? '🎉' : '💎'}</div><h2>${modal.ok ? 'Pembelian berhasil' : 'Kristal belum cukup'}</h2><p>${modal.ok ? `${escapeHtml(modal.item)} ditambahkan ke inventori.` : 'Selesaikan tugas untuk mendapat kristal lagi.'}</p><button class="button button-primary" type="button" data-action="close-modal">Kembali</button></div>`;
  } else if (modal.type === 'shop-confirm') {
    const hourglassItem = modal.itemKey === 'hourglasses';
    const itemName = hourglassItem ? 'Penambah waktu' : 'Tiket nonton';
    const itemImage = hourglassItem ? ASSETS.hourglass : ASSETS.ticket;
    body = `<div class="dialog result-dialog"><h2>Konfirmasi pembelian</h2><div class="shop-confirm-item"><img src="${itemImage}" alt="" /><strong>${itemName}${modal.quantity > 1 ? ` ×${modal.quantity}` : ''}</strong><span><img src="${ASSETS.diamondItem}" alt="" />${Number(modal.cost).toLocaleString('id-ID')}</span></div><button class="button button-primary shop-confirm-button" type="button" data-action="confirm-shop-buy">Beli</button><button class="text-button" type="button" data-action="close-modal">Batal</button></div>`;
  } else if (modal.type === 'shop-item-purchase') {
    const hourglassItem = modal.itemKey === 'hourglasses';
    const itemImage = hourglassItem ? ASSETS.hourglass : ASSETS.ticket;
    body = `<div class="item-purchase-sheet"><h2>${hourglassItem ? 'Tambah waktu?' : 'Tambah Tiket?'}</h2><div class="item-purchase-card ${hourglassItem ? '' : 'is-ticket'}"><img src="${itemImage}" alt="" /><strong>1X</strong><span class="item-purchase-price"><img src="${ASSETS.diamondItem}" alt="" />${Number(modal.cost).toLocaleString('id-ID')}</span></div><button class="button button-primary item-purchase-confirm" type="button" data-action="confirm-shop-buy">Dapatkan ${hourglassItem ? 'penambah waktu' : 'tiket nonton'}</button><button class="item-purchase-decline" type="button" data-action="decline-shop-purchase">Tidak, terima kasih</button></div>`;
  } else if (modal.type === 'free-chest-offer') {
    body = `<div class="dialog result-dialog free-chest-offer-dialog"><img class="free-chest-offer-art" src="${ASSETS.shopFreeChestArt}" alt="Anak-anak dan kucing berharap" /><h2>Penawaran peti gratis</h2><p>Iklan belum tersedia.</p><button class="button button-primary" type="button" data-action="close-modal">Kembali</button></div>`;
  } else if (modal.type === 'show-unavailable') {
    const unavailableTitle = modal.targetShow === 'Nine Puzzle' ? 'Nine puzzles' : modal.targetShow === 'Teach You a Lesson' ? 'Teach you a lesson' : modal.targetShow || 'Maaf';
    body = `<div class="dialog result-dialog free-chest-offer-dialog"><img class="free-chest-offer-art" src="${ASSETS.shopFreeChestArt}" alt="Tayangan belum tersedia" /><h2>${escapeHtml(unavailableTitle)}</h2><p>Tayangan ini belum tersedia.</p><button class="button button-primary" type="button" data-action="close-modal">Kembali</button></div>`;
  } else if (modal.type === 'shop-info') {
    body = `<div class="dialog result-dialog"><div class="result-icon">${modal.icon || '✨'}</div><h2>${escapeHtml(modal.title)}</h2><p>${escapeHtml(modal.message)}</p><button class="button button-primary" type="button" data-action="close-modal">Kembali</button></div>`;
  } else if (modal.type === 'shop-insufficient') {
    body = `<div class="dialog result-dialog focus-shortage-dialog"><h2>Maaf berlian kamu kurang</h2><p>Pergi ke toko untuk menambah berlian</p><img class="focus-shortage-art" src="${ASSETS.focusShortage}" alt="Kudo meminta tambahan" /><button class="button button-primary shop-insufficient-button" type="button" data-action="go-shop">Tambah</button><button class="text-button" type="button" data-action="close-modal">Kembali</button></div>`;
  } else if (modal.type === 'strict-block') {
    body = `<div class="dialog strict-mode-dialog"><h2>Maaf</h2><p>Kamu dalam mode strict mode</p><img src="${ASSETS.focusShortage}" alt="Kudo meminta kamu tetap fokus" /><button class="text-button" type="button" data-action="close-modal">Kembali</button></div>`;
  } else if (modal.type === 'daily-claimed') {
    body = `<div class="dialog result-dialog"><div class="result-icon">💎</div><h2>Hadiah harian diklaim</h2><p>+20 kristal sudah masuk ke inventori.</p><button class="button button-primary" type="button" data-action="close-modal">Kembali</button></div>`;
  } else if (modal.type === 'confirm-delete') {
    body = `<div class="dialog result-dialog delete-confirm-dialog"><img class="delete-confirm-art" src="assets/delete-task-art.png" alt="Kudo kesulitan mengerjakan tugas" /><h2>Hapus tugas?</h2><p>${escapeHtml(modal.title)}</p><button class="button button-primary" type="button" data-action="delete-task">Hapus tugas</button><button class="button button-secondary" type="button" data-action="close-modal">Batal</button></div>`;
  } else if (modal.type === 'reset') {
    body = `<div class="dialog result-dialog"><h2>Hapus data demo?</h2><p>Ini akan menghapus tugas dan progres yang tersimpan di browser ini.</p><button class="button button-primary" type="button" data-action="confirm-reset">Reset data</button><button class="text-button" type="button" data-action="close-modal">Batal</button></div>`;
  }

  const overlayClass = modal.type === 'delete-account-confirm'
    ? 'modal-overlay delete-account-overlay'
    : modal.type === 'watch-filter'
    ? 'modal-overlay filter-sheet-overlay'
    : modal.type === 'boss-victory'
      ? 'modal-overlay boss-victory-overlay'
    : modal.type === 'task-photo'
      ? 'modal-overlay task-photo-overlay'
    : modal.type === 'avatar-options'
      ? 'modal-overlay avatar-options-overlay'
    : modal.type === 'shop-item-purchase'
      ? 'modal-overlay item-purchase-overlay'
    : modal.type === 'focus-gate' || modal.type === 'anime-ticket-gate'
      ? 'modal-overlay focus-gate-overlay'
      : 'modal-overlay';
  return `<div class="${overlayClass}" role="presentation"><div class="modal-position" role="presentation">${body}</div></div>`;
}

function render() {
  if (!state.activeFocus || state.activeFocus.paused) clearInterval(focusTicker);
  processTaskDeadlineMessages();
  scheduleTaskDeadlineRefresh();
  const page = currentPage();
  if (page === 'purchase-history' && lastRenderedPage !== 'purchase-history') {
    markPurchaseHistoryRead();
  }
  lastRenderedPage = page;
  if (page !== 'boss-select') selectedBossAvatar = null;
  const isStreamingPage = page === 'anime-stream' || page === 'media-stream';
  if (page === 'focus-session') {
    if (mediaVideoElement || mediaPiPWindow) closeMediaPiP();
    if (animeVideoElement || animeTrailerFrame || animePiPWindow) closeAnimePiP();
  } else if (isStreamingPage && state.activeFocus) {
    clearInterval(focusTicker);
    stopWhiteNoise();
    state.activeFocus = null;
    focusMiniPlayerAvailable = false;
    persist();
  }
  const existingMediaVideo = app.querySelector('#media-video') || mediaVideoElement;
  if (existingMediaVideo) mediaVideoElement = existingMediaVideo;
  if (page === 'anime-stream' && (mediaVideoElement || mediaPiPWindow)) closeMediaPiP();
  if (page === 'media-stream' && (animeVideoElement || animeTrailerFrame || animePiPWindow)) {
    closeAnimePiP();
  }
  if (page === 'anime-stream') app.querySelector('#media-video')?.pause();
  const existingAnimeVideo = app.querySelector('#anime-video') || animeVideoElement;
  if (existingAnimeVideo) animeVideoElement = existingAnimeVideo;
  const existingAnimeFrame = app.querySelector('.anime-video-shell iframe')
    || animeTrailerFrame
    || animePiPWindow?.querySelector('iframe');
  if (existingAnimeFrame) animeTrailerFrame = existingAnimeFrame;
  if (page !== 'anime-stream' && (animeVideoElement || animeTrailerFrame)) showAnimePiP();
  if (page !== 'media-stream' && mediaVideoElement) showMediaPiP();
  if (page === 'login' || page === 'signup') renderAuth(page);
  else if (page === 'forgot') renderForgot();
  else if (page === 'reset-password') renderPasswordReset();
  else if (page === 'home') renderHome();
  else if (page === 'add-task') renderTaskCreate();
  else if (page === 'daily') renderTaskPage('easy');
  else if (page === 'boss') renderTaskPage('hard');
  else if (page === 'boss-select') renderBossAvatarSelection();
  else if (page === 'focus') renderFocus();
  else if (page === 'focus-mode') renderFocusMode();
  else if (page === 'focus-session') renderFocusSession();
  else if (page === 'watch-anime') renderWatchCatalog('anime');
  else if (page === 'watch-kdrama') renderWatchCatalog('kdrama');
  else if (page === 'anime-episodes') renderAnimeEpisodes();
  else if (page === 'kdrama-episodes') renderKdramaEpisodes();
  else if (page === 'media-stream') renderMediaStream();
  else if (page === 'anime-stream') renderAnimeStream();
  else if (page === 'shop') renderShop();
  else if (page === 'performance') renderPerformance();
  else if (page === 'transaction') renderTransaction();
  else if (page === 'rewards') renderRewards();
  else if (page === 'chest-opening') renderChestOpening();
  else if (page === 'chest-reward') renderChestReward();
  else if (page === 'profile') renderProfile();
  else if (page === 'messages') renderMessages();
  else if (page === 'account') renderAccount();
  else if (page === 'purchase-history') renderPurchaseHistory();
  else if (isAdminPage(page)) renderAdminPanel();
  else renderWelcome();
  if (focusMiniPlayerAvailable && state.activeFocus && page !== 'focus-session') {
    const sounds = { Rain: ASSETS.noiseRain, 'Ocean Waves': ASSETS.noiseOcean, Forest: ASSETS.noiseForest };
    const session = state.activeFocus;
    const remaining = session.paused
      ? Math.max(0, Math.ceil((session.remaining || 0) / 1000))
      : Math.max(0, Math.ceil((session.endsAt - Date.now()) / 1000));
    const duration = (session.duration || 3600000) / 1000;
    const progress = Math.min(100, Math.max(0, ((duration - remaining) / duration) * 100));
    const playerIcon = session.paused
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4v16l13-8z" /></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h4v16H7zm7 0h4v16h-4z" /></svg>';
    app.querySelector('.product-screen')?.insertAdjacentHTML('beforeend', `<aside class="focus-mini-player" aria-label="White noise sedang diputar"><button class="focus-mini-open" type="button" data-action="open-focus-session" aria-label="Kembali ke white noise yang sedang diputar"></button><img src="${sounds[session.noise] || ASSETS.noiseRain}" alt="" /><span class="focus-mini-copy"><strong>${escapeHtml(session.noise || 'White noise')}</strong><small>White noise</small></span><button class="focus-mini-toggle" type="button" data-action="toggle-focus-player" aria-label="${session.paused ? 'Putar' : 'Jeda'}">${playerIcon}</button><button type="button" data-action="dismiss-focus-player" aria-label="Hentikan white noise">×</button><span class="focus-mini-progress" aria-hidden="true"><span id="focus-mini-progress" style="width:${progress}%"></span></span></aside>`);
  }
  if (modal) app.insertAdjacentHTML('beforeend', modalView());
  if (state.activeFocus && !state.activeFocus.paused) startFocusTicker();
}

function classifyTask(title, deadline, photo) {
  if (!deadline) return 'hard';
  const daysUntil = taskDaysUntilDeadline(deadline);
  if (daysUntil === null) return 'hard';
  return daysUntil > 7 ? 'easy' : 'hard';
}

function compressPhoto(file) {
  return createImageBitmap(file).then((bitmap) => new Promise((resolve) => {
    const scale = Math.min(1, 800 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    canvas.toBlob((blob) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob || file);
    }, 'image/jpeg', .72);
  }));
}

const moods = { ceria: '😄', tenang: '🙂', biasa: '😐', lelah: '😮‍💨', sulit: '😣' };

app.addEventListener('click', async (event) => {
  const target = event.target;
  if (['anime-stream', 'media-stream'].includes(currentPage()) && target.closest('.anime-video-stage')) {
    showAnimeControls();
    if (!target.closest('button, input')) return;
  }
  if (target.classList.contains('modal-overlay')) {
    if (modal?.type === 'strict-block') return;
    if (modal?.type === 'analyzing') analysisToken += 1;
    if (modal?.type === 'anime-ticket-gate' && currentPage() === 'anime-stream') {
      modal = null;
      target.remove();
      return;
    }
    modal = null;
    render();
    return;
  }
  const button = target.closest('button');
  if (!button) return;
  if (button.dataset.go) return navigate(button.dataset.go);
  if (button.dataset.action === 'show-watch-all') {
    const kind = button.dataset.nav === 'watch-anime' ? 'anime' : 'kdrama';
    watchFilters[kind] = { genre: 'Semuanya', type: 'Semuanya' };
    watchSearch = '';
    watchCatalogPage[kind] = 1;
    return navigate(button.dataset.nav);
  }
  if (button.dataset.nav) {
    return navigate(button.dataset.nav);
  }
  if (button.dataset.action === 'remove-admin-upload') {
    const form = button.closest('form');
    const input = form?.querySelector(`#${button.dataset.inputId}`);
    clearAdminUploadSelection(input);
    if (input?.id === 'admin-video-poster' || input?.id === 'admin-video-episode-poster') syncAdminVideoSeriesFields(form);
    return;
  }
  if (button.dataset.action === 'admin-video-next' || button.dataset.action === 'admin-video-previous') {
    const form = button.closest('form');
    const step = Number(form?.dataset.currentStep || 1);
    if (button.dataset.action === 'admin-video-next') {
      const currentSection = form?.querySelector(`[data-admin-step="${step}"]`);
      const invalidControl = [...(currentSection?.querySelectorAll('input, select, textarea') || [])]
        .find((control) => !control.checkValidity());
      if (invalidControl) {
        invalidControl.reportValidity();
        return;
      }
      setAdminVideoStep(form, step + 1);
    } else {
      setAdminVideoStep(form, step - 1);
    }
    return;
  }
  if (button.dataset.action === 'watch-catalog-page') {
    const kind = button.dataset.kind;
    if (kind === 'anime' || kind === 'kdrama') {
      watchCatalogPage[kind] = Number(button.dataset.page);
      const grid = app.querySelector('.catalog-grid');
      if (grid) grid.innerHTML = renderWatchCatalogResults(kind);
    }
    return;
  }
  if (button.dataset.action === 'open-watch-filter') {
    const kind = currentPage() === 'watch-anime' ? 'anime' : 'kdrama';
    const baseGenres = kind === 'anime'
      ? ['Petualangan', 'Fantasi', 'Drama', 'Memasak', 'Komedi']
      : ['Aksi', 'Thriller', 'Komedi', 'Drama', 'Sekolah', 'Misteri', 'Kejahatan', 'Psikologi'];
    const catalogShows = catalogVideos.filter((video) => video.category === kind);
    const catalogGenres = catalogShows.flatMap((video) => (
      Array.isArray(video.genres) ? video.genres : []
    ));
    const catalogTypes = catalogShows.map((video) => video.show_type).filter(Boolean);
    const filterKey = button.dataset.filterKey;
    const options = filterKey === 'genre'
      ? ['Semuanya', ...new Set([...baseGenres, ...catalogGenres])]
      : ['Semuanya', ...new Set(['Series', 'Movie', ...catalogTypes])];
    modal = { type: 'watch-filter', filterKey, selection: watchFilters[kind][filterKey], options };
    render();
    return;
  }
  if (button.dataset.animeTab) {
    animeStreamTab = button.dataset.animeTab;
    app.querySelectorAll('[data-anime-tab]').forEach((tab) => tab.classList.toggle('is-active', tab === button));
    const isDungeon = selectedAnime === 'Delicious in Dungeon';
    const tabContent = app.querySelector('.anime-stream-tab-content');
    if (tabContent) tabContent.innerHTML = renderAnimeTabContent();
    return;
  }
  if (button.dataset.mediaStreamTab) {
    mediaStreamTab = button.dataset.mediaStreamTab;
    app.querySelectorAll('[data-media-stream-tab]').forEach((tab) => {
      tab.classList.toggle('is-active', tab === button);
    });
    const metadata = builtInShowMetadata(currentMediaVideo?.show_title);
    const seriesVideos = catalogVideos.filter((video) => (
      video.category === currentMediaVideo?.category
      && normalizeShowTitle(video.show_title) === normalizeShowTitle(currentMediaVideo?.show_title)
    ));
    const tabContent = app.querySelector('.anime-stream-tab-content');
    if (tabContent) {
      tabContent.innerHTML = renderMediaStreamTabContent(
        currentMediaVideo.show_title,
        seriesVideos,
        metadata,
      );
    }
    return;
  }
  if (button.dataset.avatarChoice && modal?.type === 'avatar-options') {
    modal.selection = button.dataset.avatarChoice;
    app.querySelectorAll('.avatar-choice').forEach((choice) => {
      const selected = choice.dataset.avatarChoice === modal.selection;
      choice.classList.toggle('is-selected', selected);
      choice.setAttribute('aria-pressed', String(selected));
    });
    return;
  }
  if (button.dataset.action === 'select-boss-avatar') {
    if (!Object.hasOwn(BOSS_AVATARS, button.dataset.bossAvatar)) return;
    selectedBossAvatar = button.dataset.bossAvatar;
    app.querySelectorAll('.boss-avatar-choice').forEach((choice) => {
      const selected = choice.dataset.bossAvatar === selectedBossAvatar;
      choice.classList.toggle('is-selected', selected);
      choice.setAttribute('aria-pressed', String(selected));
    });
    return;
  }
  if (button.dataset.filterOption && modal?.type === 'watch-filter') {
    modal.selection = button.dataset.filterOption;
    app.querySelectorAll('[data-filter-option]').forEach((optionButton) => {
      const selected = optionButton.dataset.filterOption === modal.selection;
      optionButton.classList.toggle('is-selected', selected);
      optionButton.setAttribute('aria-pressed', String(selected));
    });
    return;
  }
  if (button.dataset.noise && !button.dataset.action) {
    modal = { type: 'focus-gate', noise: button.dataset.noise };
    render();
    return;
  }
  if (button.dataset.mood) {
    modal.mood = button.dataset.mood;
    app.querySelectorAll('.mood-choice').forEach((choice) => {
      const selected = choice === button;
      choice.classList.toggle('selected', selected);
      choice.setAttribute('aria-pressed', String(selected));
    });
    const saveMoodButton = app.querySelector('[data-action="save-mood"]');
    if (saveMoodButton) saveMoodButton.disabled = false;
    return;
  }
  if (button.dataset.complete) {
    modal = { type: 'mood', taskId: button.dataset.complete, mood: '' };
    render();
    return;
  }
  if (button.dataset.delete) {
    const task = state.tasks.find((item) => item.id === button.dataset.delete);
    if (task) modal = { type: 'confirm-delete', taskId: task.id, title: task.title };
    render();
    return;
  }
  if (button.dataset.social) {
  if (button.dataset.social === 'Google') {
    const message = button.closest('form')?.querySelector('.form-message');
    button.disabled = true;

    try {
      const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;
      if (!data.url) throw new Error('URL login Google tidak tersedia.');
      localStorage.setItem(GOOGLE_AUTH_REDIRECT_PENDING_KEY, 'true');
      window.location.assign(data.url);
    } catch (error) {
      localStorage.removeItem(GOOGLE_AUTH_REDIRECT_PENDING_KEY);
      console.error('Login Google melalui Supabase gagal:', error);

      if (message) {
        message.textContent =
          error.message || 'Gagal memulai login Google. Silakan coba lagi.';
      }

      button.disabled = false;
    }

    return;
  }

  const message = app.querySelector('.form-message');

  if (message) {
    message.textContent =
      `Masuk dengan ${button.dataset.social} belum terhubung.`;
  }

  return;
  }
  
  if (button.classList.contains('password-toggle')) {
    const input = button.parentElement.querySelector('input');
    const visible = input.type === 'password';
    input.type = visible ? 'text' : 'password';
    button.setAttribute('aria-label', visible ? 'Sembunyikan password' : 'Tampilkan password');
    button.setAttribute('aria-pressed', String(visible));
    button.innerHTML = visible ? icons.eyeOpen : icons.eyeClosed;
    return;
  }
  if (button.dataset.action === 'performance-history-page') {
    performanceHistoryPage = Math.max(0, Number(button.dataset.page) || 0);
    render();
    return;
  }
  if (button.dataset.action === 'message-page') {
    messagePage = Math.max(0, Number(button.dataset.page) || 0);
    renderMessages();
    return;
  }
  if (button.dataset.action === 'purchase-history-page') {
    purchaseHistoryPage = Math.max(0, Number(button.dataset.page) || 0);
    renderPurchaseHistory();
    return;
  }
  if (button.dataset.action === 'admin-orders-page') {
    adminOrdersPage = Math.max(0, Number(button.dataset.page) || 0);
    renderAdminPanel();
    return;
  }
  if (button.dataset.action === 'admin-history-page') {
    adminVerifiedOrdersPage = Math.max(0, Number(button.dataset.page) || 0);
    renderAdminPanel();
    return;
  }
  if (button.dataset.action === 'admin-latest-videos-page') {
    adminVideosPage = Math.max(0, Number(button.dataset.page) || 0);
    renderAdminPanel();
    return;
  }
  if (button.dataset.action === 'task-list-page') {
    taskListPages[button.dataset.kind] = Math.max(0, Number(button.dataset.page) || 0);
    render();
    return;
  }
  if (
    button.dataset.action === 'close-modal'
    && modal?.type === 'anime-ticket-gate'
    && currentPage() === 'anime-stream'
  ) {
    modal = null;
    button.closest('.modal-overlay')?.remove();
    return;
  }
  if (button.type === 'submit') return;
  switch (button.dataset.action) {
    case 'select-media-stream-episode': {
      const episode = catalogVideos.find((video) => (
        video.id === button.dataset.videoId
        && video.category === currentMediaVideo?.category
        && normalizeShowTitle(video.show_title) === normalizeShowTitle(currentMediaVideo?.show_title)
      ));
      if (!episode) return;
      requestStreamTicket(episode.category, episode.id, episode.show_title);
      return;
    }
    case 'open-kdrama-episode': {
      const episode = catalogVideos.find((video) => (
        video.id === button.dataset.videoId
        && video.category === 'kdrama'
      ));
      if (!episode) {
        console.error('Episode K-drama tidak ditemukan di katalog:', button.dataset.videoId);
        toast = 'Episode tidak tersedia. Muat ulang katalog dan coba lagi.';
        render();
        return;
      }
      requestStreamTicket(episode.category, episode.id, episode.show_title);
      return;
    }
    case 'watch-show':
      {
        const video = catalogVideos.find((item) => item.id === button.dataset.videoId)
          || catalogVideos.find((item) => (
            item.category === button.dataset.category
            && normalizeShowTitle(item.show_title) === normalizeShowTitle(button.dataset.show)
          ));
        if (video) {
          if (video.category === 'anime') {
            if (
              currentPage() === 'anime-stream'
              && selectedAnime.toLocaleLowerCase() === video.show_title.toLocaleLowerCase()
            ) {
              selectedAnimeCatalogVideoId = '';
            }
            if (
              animePiPWindow
              && selectedAnime.toLocaleLowerCase() !== video.show_title.toLocaleLowerCase()
            ) closeAnimePiP();
            selectedAnime = video.show_title;
            selectedAnimeCatalogVideoId = '';
            animeStreamTab = 'episode';
            animeAutoplayRequested = false;
            modal = null;
            navigate('anime-episodes');
            return;
          }
          if (video.category === 'kdrama') {
            mediaStreamTab = 'episode';
            mediaAutoplayRequested = false;
            currentMediaVideo = video;
            navigate('kdrama-episodes');
            return;
          }
          currentMediaVideo = video;
          navigate('media-stream');
          return;
        }
      }
      if (button.dataset.category === 'kdrama' || currentPage() === 'watch-kdrama') {
        const metadata = builtInShowMetadata(button.dataset.show);
        if (metadata) {
          mediaStreamTab = 'episode';
          mediaAutoplayRequested = false;
          currentMediaVideo = {
            category: 'kdrama',
            show_title: button.dataset.show,
            poster_url: metadata.poster,
            genres: metadata.genres,
            show_type: metadata.type,
            show_description: metadata.description,
            episode_number: null,
            episode_title: '',
            episode_description: '',
            video_url: '',
            video_path: '',
          };
          navigate('kdrama-episodes');
          return;
        }
        modal = { type: 'show-unavailable', targetShow: button.dataset.show };
        render();
        return;
      }
      if (currentPage() === 'watch-anime' || currentPage() === 'anime-stream' || currentPage() === 'anime-episodes' || (currentPage() === 'focus' && ['Delicious in Dungeon', "Frieren: Beyond Journey's End"].includes(button.dataset.show))) {
        if (['Delicious in Dungeon', "Frieren: Beyond Journey's End"].includes(button.dataset.show)) {
          if (currentPage() === 'anime-stream' && selectedAnime === button.dataset.show) {
            selectAnimeEpisodeTab();
            return;
          }
          if (animePiPWindow && selectedAnime !== button.dataset.show) closeAnimePiP();
          selectedAnime = button.dataset.show;
          selectedAnimeCatalogVideoId = '';
          animeStreamTab = 'episode';
          animeAutoplayRequested = false;
          modal = null;
        } else {
          toast = `${button.dataset.show} akan segera tayang.`;
          break;
        }
        navigate('anime-episodes');
        return;
      }
      toast = `${button.dataset.show} akan segera tayang.`;
      break;
    case 'view-task-photo': modal = { type: 'task-photo', src: button.dataset.photo }; break;
    case 'play-anime-episode':
      {
        const video = app.querySelector('#anime-video');
        if (video?.paused) video.play().catch(() => {}); else video?.pause();
      }
      return;
    case 'select-anime-catalog-episode': {
      const episode = getAnimeCatalogEpisodes(selectedAnime)
        .find((video) => video.id === button.dataset.videoId);
      if (!episode) {
        console.error('Episode anime tidak ditemukan di katalog:', button.dataset.videoId);
        toast = 'Episode tidak tersedia. Muat ulang katalog dan coba lagi.';
        render();
        return;
      }
      requestStreamTicket('anime', episode.id, episode.showTitle || selectedAnime);
      return;
    }
    case 'toggle-anime-playback': {
      const video = app.querySelector('#anime-video');
      if (video) { if (video.paused) video.play().catch(() => {}); else video.pause(); }
      return;
    }
    case 'toggle-media-video-playback': {
      const video = app.querySelector('#media-video');
      if (video) {
        if (video.paused) video.play().catch((error) => console.error('Video gagal diputar:', error));
        else video.pause();
      }
      return;
    }
    case 'toggle-stream-fullscreen': {
      const video = app.querySelector('#anime-video, #media-video');
      void toggleStreamFullscreen(video);
      return;
    }
    case 'seek-anime-video': {
      const video = app.querySelector('#anime-video');
      if (video && Number.isFinite(video.duration)) video.currentTime = Math.min(video.duration, Math.max(0, video.currentTime + Number(button.dataset.seconds)));
      return;
    }
    case 'use-anime-ticket': {
      if (state.chests < 1) { modal = null; navigate('shop'); return; }
      const ticketRequest = modal;
      if (ticketRequest?.category === 'anime') {
        const episode = getAnimeCatalogEpisodes(ticketRequest.showTitle || selectedAnime)
          .find((video) => video.id === ticketRequest.videoId);
        if (!episode) {
          console.error('Episode anime tidak ditemukan saat menggunakan tiket:', ticketRequest.videoId);
          toast = 'Episode tidak tersedia. Muat ulang katalog dan coba lagi.';
          render();
          return;
        }
        state.chests -= 1;
        persist();
        modal = null;
        if (animePiPWindow) closeAnimePiP();
        selectedAnime = ticketRequest.showTitle || episode.showTitle || selectedAnime;
        selectedAnimeCatalogVideoId = episode.id;
        animeStreamTab = 'episode';
        animeAutoplayRequested = true;
        navigate('anime-stream');
        return;
      }
      const episode = catalogVideos.find((video) => (
        video.category === 'kdrama'
        && video.id === ticketRequest?.videoId
        && normalizeShowTitle(video.show_title) === normalizeShowTitle(ticketRequest?.showTitle)
      ));
      if (!episode) {
        console.error('Episode K-drama tidak ditemukan saat menggunakan tiket:', ticketRequest?.videoId);
        toast = 'Episode tidak tersedia. Muat ulang katalog dan coba lagi.';
        render();
        return;
      }
      state.chests -= 1;
      persist();
      modal = null;
      currentMediaVideo = episode;
      mediaStreamTab = 'episode';
      mediaAutoplayRequested = true;
      navigate('media-stream');
      return;
    }
    case 'profile-info': modal = { type: 'profile-info', title: button.dataset.title, message: button.dataset.message }; break;
    case 'open-avatar-options': modal = { type: 'avatar-options', selection: currentAccount?.avatarChoice || 'male' }; break;
    case 'confirm-avatar':
      if (currentAccount && modal?.type === 'avatar-options') {
        currentAccount.avatarChoice = modal.selection;
        delete currentAccount.avatarData;
        modal = null;
        render();
        persistAccounts();
        return;
      }
      modal = null;
      render();
      return;
    case 'open-suggestions': window.open('https://wa.me/6285163158816', '_blank', 'noopener,noreferrer'); return;
    case 'edit-profile': modal = { type: 'profile-edit' }; break;
    case 'profile-performance': navigate('performance'); return;
    case 'retry-purchase-history':
      purchaseHistoryLoaded = false;
      purchaseHistoryError = '';
      renderPurchaseHistory();
      return;
    case 'retry-profile-purchase-history':
      purchaseHistoryLoaded = false;
      purchaseHistoryError = '';
      renderProfile();
      return;
    case 'admin-add-video':
      await uploadAdminVideo(button);
      return;
    case 'admin-verify-order':
      if (!window.confirm('Pastikan dana untuk transaksi ini sudah diterima dan sesuai dengan bukti pembayaran. Lanjutkan verifikasi?')) return;
      await verifyAdminOrder(button.dataset.invoice);
      return;
    case 'admin-reject-order':
      if (!window.confirm('Tolak pembelian ini? Transaksi akan ditandai ditolak dan berlian tidak diberikan.')) return;
      await rejectAdminOrder(button.dataset.invoice);
      return;
    case 'retry-admin-panel':
      adminPanelLoaded = false;
      adminPanelAttempted = false;
      adminPanelError = '';
      if (currentPage() === 'profile') renderProfile();
      else renderAdminPanel();
      return;
    case 'toggle-strict': state.strictMode = !state.strictMode; persist(); break;
    case 'logout':
      try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
        clearTimeout(cloudSaveTimer);
        stopWhiteNoise();
        closeAnimePiP();
        resetAccountScopedPages();
        currentAccount = null;
        localStorage.removeItem(ACTIVE_ACCOUNT_STORAGE_KEY);
        localStorage.removeItem(STORAGE_KEY);
        state = createEmptyAccountState();
        modal = null;
        navigate('welcome');
      } catch (error) {
        console.error('Logout Supabase gagal:', error);
        modal = {
          type: 'account-action-error',
          title: 'Gagal keluar',
          message: error.message || 'Tidak dapat keluar dari akun. Silakan coba lagi.',
        };
        render();
      }
      return;

    case 'delete-account': modal = { type: 'delete-account-confirm' }; break;
    case 'confirm-delete-account': {
      if (accountActionPending) return;
      if (!currentAccount) {
        modal = null;
        navigate('welcome');
        return;
      }
      accountActionPending = true;
      button.disabled = true;
      try {
        const accountToDelete = currentAccount;
        if (accountToDelete.id) {
          const { error } = await supabaseClient.rpc('delete_current_user');
          if (error) throw error;
        }

        clearTimeout(cloudSaveTimer);
        legacyAccounts = legacyAccounts.filter(
          (account) => account.email?.toLowerCase() !== accountToDelete.email?.toLowerCase()
        );
        localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(legacyAccounts));
        stopWhiteNoise();
        closeAnimePiP();
        await supabaseClient.auth.signOut({ scope: 'local' });
        resetAccountScopedPages();
        currentAccount = null;
        localStorage.removeItem(ACTIVE_ACCOUNT_STORAGE_KEY);
        localStorage.removeItem(STORAGE_KEY);
        state = createEmptyAccountState();
        modal = null;
        accountActionPending = false;
        navigate('welcome');
      } catch (error) {
        console.error('Penghapusan akun gagal:', error);
        accountActionPending = false;
        modal = {
          type: 'account-action-error',
          title: 'Akun belum terhapus',
          message: error.message || 'Akun tidak dapat dihapus. Silakan coba lagi.',
        };
        render();
      }
      return;
    }
    case 'claim-free-chest': modal = { type: 'free-chest-offer' }; break;
    case 'buy-diamond-pack': {
      const amount = Number(button.dataset.amount);
      const prices = { 1200: 10000, 2000: 15000 };
      if (!prices[amount]) break;
      pendingDiamondOrder = {
        packId: String(amount),
        amount,
        price: prices[amount],
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('kudo-pending-diamond-order-v1', JSON.stringify(pendingDiamondOrder));
      navigate('transaction');
      return;
      }
      case 'pay-diamond-order': {
        if (!pendingDiamondOrder || ['paid', 'awaiting_verification'].includes(pendingDiamondOrder.status)) return;
        const payButton = button;
        if (!diamondProofFile) {
          diamondProofError = 'Lampirkan bukti pembayaran sebelum mengirim pesanan.';
          renderTransaction();
          return;
        }
        diamondPaymentSubmitting = true;
        diamondProofError = '';
        renderTransaction();
        try {
          const { data: { session }, error } = await supabaseClient.auth.getSession();
          if (error) throw error;
          if (!session?.access_token) throw new Error('Masuk ke akun Kudo sebelum membeli berlian.');

          if (
            !pendingDiamondOrder.invoiceNumber
            || pendingDiamondOrder.checkoutUrl
            || ['failed', 'expired', 'cancelled'].includes(pendingDiamondOrder.status)
          ) {
            const response = await fetch('/api/payments/create', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${session.access_token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                packId: pendingDiamondOrder.packId || String(pendingDiamondOrder.amount),
                paymentMethod: 'qris',
              }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Pesanan belum dapat dibuat.');

            pendingDiamondOrder.invoiceNumber = result.invoiceNumber;
            pendingDiamondOrder.amount = result.diamonds;
            pendingDiamondOrder.price = result.amount;
            pendingDiamondOrder.packId = String(result.diamonds);
            pendingDiamondOrder.checkoutUrl = '';
            pendingDiamondOrder.status = 'pending';
            localStorage.setItem('kudo-pending-diamond-order-v1', JSON.stringify(pendingDiamondOrder));
          }

          const extension = diamondProofFile.type === 'image/png'
            ? 'png'
            : diamondProofFile.type === 'image/webp' ? 'webp' : 'jpg';
          const proofPath = `${session.user.id}/${pendingDiamondOrder.invoiceNumber}/proof-${crypto.randomUUID()}.${extension}`;
          const { error: uploadError } = await supabaseClient.storage
            .from('payment-proofs')
            .upload(proofPath, diamondProofFile, {
              contentType: diamondProofFile.type,
              upsert: false,
            });
          if (uploadError) throw uploadError;

          const proofResponse = await fetch('/api/payments/proof', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${session.access_token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              invoiceNumber: pendingDiamondOrder.invoiceNumber,
              proofPath,
            }),
          });
          const proofResult = await proofResponse.json();
          if (!proofResponse.ok) throw new Error(proofResult.error || 'Bukti pembayaran belum dapat disimpan.');

          pendingDiamondOrder.status = 'awaiting_verification';
          diamondPaymentSubmitting = false;
          diamondProofFile = null;
          diamondProofError = '';
          if (diamondProofPreviewUrl) URL.revokeObjectURL(diamondProofPreviewUrl);
          diamondProofPreviewUrl = '';
          localStorage.setItem('kudo-pending-diamond-order-v1', JSON.stringify(pendingDiamondOrder));
          clearTimeout(diamondPaymentPollTimer);
          navigate('shop');
        } catch (error) {
          console.error('Bukti pembayaran QRIS gagal dikirim:', error);
          diamondPaymentSubmitting = false;
          diamondProofError = error.message || 'Bukti pembayaran belum dapat dikirim.';
          renderTransaction();
        }
        return;
      }
      case 'cancel-diamond-transaction':
        clearTimeout(diamondPaymentPollTimer);
        diamondPaymentSubmitting = false;
        diamondProofFile = null;
        diamondProofError = '';
        if (diamondProofPreviewUrl) URL.revokeObjectURL(diamondProofPreviewUrl);
        diamondProofPreviewUrl = '';
        pendingDiamondOrder = null;
        localStorage.removeItem('kudo-pending-diamond-order-v1');
      navigate('shop');
      return;
    case 'confirm-watch-filter': {
      const kind = currentPage() === 'watch-anime' ? 'anime' : 'kdrama';
      watchFilters[kind][modal.filterKey] = modal.selection;
      watchCatalogPage[kind] = 1;
      modal = null;
      renderWatchCatalog(kind);
      return;
    }
    case 'add-task': navigate('add-task'); return;
    case 'remove-diamond-proof':
      diamondProofFile = null;
      diamondProofError = '';
      if (diamondProofPreviewUrl) URL.revokeObjectURL(diamondProofPreviewUrl);
      diamondProofPreviewUrl = '';
      renderTransaction();
      return;
    case 'remove-task-photo': {
      const form = button.closest('.task-create-form');
      const input = form?.querySelector('#task-photo-input');
      const upload = form?.querySelector('.upload-area');
      const preview = form?.querySelector('.upload-preview');
      const status = form?.querySelector('.upload-status');
      taskPhotoData = '';
      if (input) { input.disabled = false; input.value = ''; }
      if (upload) upload.classList.remove('has-photo', 'upload-error');
      if (preview) { preview.removeAttribute('src'); preview.hidden = true; }
      if (status) { status.textContent = ''; status.hidden = true; }
      form?.classList.remove('has-attachment');
      button.hidden = true;
      return;
    }
    case 'close-modal': if (modal?.type === 'analyzing') analysisToken += 1; if (modal?.type === 'focus-ended') { modal = null; navigate('focus-mode'); return; } modal = null; break;
    case 'close-and-home': modal = null; navigate('home'); return;
    case 'save-mood': {
      const task = state.tasks.find((item) => item.id === modal.taskId);
      if (!task || !modal.mood) break;
      task.done = true;
      task.mood = modal.mood;
      task.completedAt = new Date().toISOString();
      state.moodLog.push({ mood: modal.mood, taskId: task.id, at: task.completedAt });
      state.crystals += Math.floor(Math.random() * 10) + 1;
      const defeatedBoss = task.difficulty === 'hard';
      if (defeatedBoss) state.bossHealth = Math.max(0, Number(state.bossHealth ?? 100) - 25);
      persist();
      modal = defeatedBoss && state.bossHealth === 0
        ? { type: 'boss-victory', bossName: (BOSS_AVATARS[state.bossAvatar] || BOSS_AVATARS['paper-task']).name }
        : null;
      break;
    }
    case 'boss-victory-back':
      state.bossHealth = 100;
      persist();
      modal = null;
      break;
    case 'confirm-boss-avatar':
      if (!Object.hasOwn(BOSS_AVATARS, selectedBossAvatar)) return;
      state.bossAvatar = selectedBossAvatar;
      selectedBossAvatar = null;
      persist();
      navigate('boss');
      return;
    case 'use-hourglass':
      if (state.hourglasses < 1) { modal = { type: 'focus-empty' }; break; }
      state.hourglasses -= 1;
      if (modal.switching && state.activeFocus) {
        state.activeFocus.noise = modal.noise;
        startWhiteNoise(state.activeFocus.noise, { startPaused: Boolean(state.activeFocus.paused) });
        if (state.activeFocus.paused) audioContext?.suspend();
        persist();
        modal = null;
        break;
      }
      focusMiniPlayerAvailable = true;
      state.activeFocus = { noise: modal.noise, startedAt: Date.now(), duration: 60 * 60 * 1000, endsAt: Date.now() + 60 * 60 * 1000 };
      startWhiteNoise(modal.noise);
      persist();
      modal = null;
      navigate('focus-session');
      return;
    case 'toggle-focus-player': {
      const session = state.activeFocus;
      if (!session) break;
      if (session.paused) {
        session.endsAt = Date.now() + (session.remaining || 0);
        delete session.remaining;
        delete session.paused;
        if (focusTrackSource(session.noise) && focusTrackAudio) focusTrackAudio.play().catch(() => {});
        else if (focusTrackSource(session.noise)) startWhiteNoise(session.noise);
        else if (audioContext) audioContext.resume(); else startWhiteNoise(session.noise);
      } else {
        session.remaining = Math.max(0, session.endsAt - Date.now());
        session.paused = true;
        if (focusTrackSource(session.noise)) focusTrackAudio?.pause(); else audioContext?.suspend();
      }
      persist();
      break;
    }
    case 'open-focus-session':
      if (state.activeFocus) navigate('focus-session');
      return;
    case 'switch-focus-sound': {
      const sounds = ['Rain', 'Ocean Waves', 'Forest'];
      const nextName = button.dataset.noise;
      const currentNoise = state.activeFocus?.noise || 'Rain';
      const candidates = sounds.filter((name) => name !== currentNoise);
      const requestedNoise = nextName || candidates[Math.floor(Math.random() * candidates.length)];
      if (requestedNoise && requestedNoise !== state.activeFocus?.noise) {
        modal = { type: 'focus-gate', noise: requestedNoise, switching: true };
      }
      break;
    }
    case 'go-shop': modal = null; navigate('shop'); return;
    case 'pause-focus':
      if (state.activeFocus) {
        state.activeFocus.remaining = Math.max(0, state.activeFocus.endsAt - Date.now());
        state.activeFocus.paused = true;
        if (focusTrackSource(state.activeFocus.noise)) focusTrackAudio?.pause(); else audioContext?.suspend();
        persist();
        modal = { type: 'focus-paused' };
      }
      break;
    case 'resume-focus':
      if (state.activeFocus?.paused) {
        state.activeFocus.endsAt = Date.now() + state.activeFocus.remaining;
        delete state.activeFocus.remaining;
        delete state.activeFocus.paused;
        persist();
        if (focusTrackSource(state.activeFocus.noise) && focusTrackAudio) focusTrackAudio.play().catch(() => {});
        else if (focusTrackSource(state.activeFocus.noise)) startWhiteNoise(state.activeFocus.noise);
        else if (audioContext) audioContext.resume();
        else startWhiteNoise(state.activeFocus.noise);
      }
      modal = null;
      break;
    case 'dismiss-focus-player': stopWhiteNoise(); state.activeFocus = null; focusMiniPlayerAvailable = false; persist(); break;
    case 'stop-focus': stopWhiteNoise(); state.activeFocus = null; focusMiniPlayerAvailable = false; persist(); modal = { type: 'focus-ended' }; break;
    case 'buy-item-pack': case 'buy-hourglass': case 'buy-chest': {
      const itemKey = button.dataset.itemKey || (button.dataset.action === 'buy-hourglass' ? 'hourglasses' : 'chests');
      const quantity = Number(button.dataset.quantity || 1);
      const defaultCost = button.dataset.action === 'buy-hourglass' ? 50
        : button.dataset.action === 'buy-chest' ? 100
          : 500;
      const cost = Number(button.dataset.cost || defaultCost * quantity);
      modal = state.crystals >= cost ? { type: 'shop-item-purchase', itemKey, quantity, cost } : { type: 'shop-insufficient' };
      break;
    }
    case 'decline-shop-purchase': modal = null; break;
    case 'confirm-shop-buy': {
      const key = modal.itemKey;
      const quantity = Number(modal.quantity || 1);
      const defaultCost = modal.itemKey === 'hourglasses' ? 50 : 100;
      const cost = Number(modal.cost || defaultCost * quantity);
      if (state.crystals < cost) modal = { type: 'shop-insufficient' };
      else {
        state.crystals -= cost;
        state[key] += quantity;
        persist();
        modal = null;
      }
      break;
    }
    case 'open-chest':
      if (state.chests > 0) {
        state.chests -= 1;
        state.chestSession = { missionKey: 'peti', missionTitle: 'membuka peti', stage: 'closed' };
        persist();
        navigate('chest-opening');
        return;
      }
      break;
    case 'open-mission-chest': {
      const mission = dailyMissions().find((item) => item.key === button.dataset.mission);
      if (mission?.done && !mission.opened) {
        modal = null;
        state.chestSession = { missionKey: mission.key, missionTitle: mission.title, stage: 'closed' };
        persist();
        navigate('chest-opening');
        return;
      }
      break;
    }
    case 'open-chest-session': {
      const session = state.chestSession;
      if (session?.stage === 'closed') {
        const type = 'diamond';
        const amount = Math.floor(Math.random() * 50) + 1;
        state.crystals += amount;
        state.dailyMissionOpened[session.missionKey] = true;
        session.reward = { type, amount };
        session.stage = 'open';
        persist();
        render();
        window.setTimeout(() => {
          if (state.chestSession?.stage === 'open') navigate('chest-reward');
        }, 850);
        return;
      }
      break;
    }
    case 'show-chest-reward': navigate('chest-reward'); return;
    case 'finish-chest': state.chestSession = null; persist(); navigate('rewards'); return;
    case 'claim-daily':
      if (state.chestClaimedOn !== new Date().toISOString().slice(0, 10)) { state.chestClaimedOn = new Date().toISOString().slice(0, 10); state.crystals += 20; persist(); modal = { type: 'daily-claimed' }; }
      break;
    case 'delete-task': state.tasks = state.tasks.filter((task) => task.id !== modal.taskId); persist(); modal = null; break;
    case 'reset-demo': modal = { type: 'reset' }; break;
    case 'confirm-reset': stopWhiteNoise(); localStorage.removeItem(STORAGE_KEY); state = structuredClone(STARTER_STATE); modal = null; navigate('home'); return;
    default: break;
  }
  render();
});
app.addEventListener('change', async (event) => {
  if (event.target.id === 'admin-video-category') {
    const form = event.target.closest('form');
    const folderSelect = form?.querySelector('#admin-video-folder');
    ['#admin-video-poster', '#admin-video-episode-poster'].forEach((selector) => {
      clearAdminUploadSelection(form?.querySelector(selector));
    });
    if (folderSelect) folderSelect.innerHTML = adminSeriesOptions(event.target.value);
    syncAdminVideoSeriesFields(form, true);
    return;
  }
  if (event.target.id === 'admin-video-folder') {
    const form = event.target.closest('form');
    ['#admin-video-poster', '#admin-video-episode-poster'].forEach((selector) => {
      clearAdminUploadSelection(form?.querySelector(selector));
    });
    syncAdminVideoSeriesFields(form, true);
    return;
  }
  if (['admin-video-poster', 'admin-video-episode-poster', 'admin-video-thumbnail'].includes(event.target.id)) {
    const file = event.target.files?.[0];
    const area = event.target.previousElementSibling?.querySelector('.admin-upload-area');
    const preview = area?.querySelector('.admin-upload-preview');
    const prompt = area?.querySelector('strong');
    const removeButton = event.target.previousElementSibling?.querySelector('.admin-upload-remove');
    const status = event.target.form?.querySelector(`[data-upload-status="${event.target.id}"]`);
    if (!file || !preview) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      clearAdminUploadSelection(event.target);
      if (status) {
        status.textContent = 'Pilih PNG/JPG/WebP maksimal 5 MB.';
        status.hidden = false;
      }
      return;
    }
    if (preview.src.startsWith('blob:')) URL.revokeObjectURL(preview.src);
    preview.src = URL.createObjectURL(file);
    preview.hidden = false;
    if (prompt) prompt.hidden = true;
    if (removeButton) removeButton.hidden = false;
    if (status) {
      status.textContent = '';
      status.hidden = true;
    }
    return;
  }
  if (event.target.id === 'admin-video-file') {
    const uploadBox = event.target.previousElementSibling;
    const selected = uploadBox?.querySelector('.admin-selected-file');
    const prompt = uploadBox?.querySelector('strong');
    const removeButton = uploadBox?.querySelector('.admin-upload-remove');
    const status = event.target.form?.querySelector(`[data-upload-status="${event.target.id}"]`);
    const file = event.target.files?.[0];
    if (file && (!['video/mp4', 'video/webm'].includes(file.type) || file.size > 50 * 1024 * 1024)) {
      clearAdminUploadSelection(event.target);
      if (status) {
        status.textContent = 'Pilih video MP4/WebM dengan ukuran maksimal 50 MB.';
        status.hidden = false;
      }
      return;
    }
    if (file && selected) {
      selected.textContent = file.name;
      selected.hidden = false;
      if (prompt) prompt.hidden = true;
      if (removeButton) removeButton.hidden = false;
      if (status) {
        status.textContent = '';
        status.hidden = true;
      }
    }
    return;
  }
  if (event.target.id === 'diamond-proof-input') {
    const file = event.target.files?.[0] || null;
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (file && (!allowedTypes.includes(file.type) || file.size > 5 * 1024 * 1024)) {
      diamondProofFile = null;
      if (diamondProofPreviewUrl) URL.revokeObjectURL(diamondProofPreviewUrl);
      diamondProofPreviewUrl = '';
      diamondProofError = file.size > 5 * 1024 * 1024
        ? 'Ukuran gambar maksimal 5 MB.'
        : 'Pilih gambar PNG, JPG, atau WebP.';
      event.target.value = '';
      renderTransaction();
      return;
    }
    diamondProofFile = file;
    diamondProofError = '';
    if (diamondProofPreviewUrl) URL.revokeObjectURL(diamondProofPreviewUrl);
    diamondProofPreviewUrl = file ? URL.createObjectURL(file) : '';
    renderTransaction();
    return;
  }
  if (event.target.matches('[data-anime-video]')) {
    const assetId = event.target.value;
    const asset = getAnimeVideoAsset(assetId);
    const video = app.querySelector('#anime-video');
    if (!asset || asset.showTitle.toLocaleLowerCase() !== selectedAnime.toLocaleLowerCase() || !video) return;

    if (!state.animeVideoAssets || typeof state.animeVideoAssets !== 'object' || Array.isArray(state.animeVideoAssets)) {
      state.animeVideoAssets = {};
    }
    state.animeVideoAssets[selectedAnime] = assetId;
    video.pause();
    if (asset.src) video.src = asset.src;
    else video.removeAttribute('src');
    const episodeTitle = animeEpisodeTitle(asset);
    video.setAttribute('aria-label', episodeTitle);
    video.load();
    const title = app.querySelector('.anime-stream-title');
    if (title) title.textContent = episodeTitle;
    const duration = app.querySelector('.anime-episode-duration');
    if (duration) duration.textContent = 'Memuat durasi...';
    const tabContent = app.querySelector('.anime-stream-tab-content');
    if (tabContent) tabContent.innerHTML = renderAnimeTabContent();
    updateAnimeVideoUi(video);
    persist();
    return;
  }

  if (event.target.id === 'account-avatar-input') {
    const file = event.target.files?.[0];

    if (!file || !currentAccount) return;

    try {
      const data = await compressPhoto(file);
      currentAccount.avatarData = data;
      currentAccount.avatarChoice = 'custom';
      persistAccounts();
      render();
    } catch {
      toast = 'Foto profil gagal diproses.';
      render();
    }

    return;
  }

  if (event.target.id === 'task-photo-input') {
    const file = event.target.files?.[0];

    if (!file) return;

    const upload = app.querySelector('.task-create-form .upload-area');
    const form = event.target.closest('.task-create-form');
    const preview = upload?.querySelector('.upload-preview');
    const removeButton = app.querySelector('.task-create-form .upload-remove');
    const status = app.querySelector('.task-create-form .upload-status');

    if (!file.type.startsWith('image/')) {
      taskPhotoData = '';
      upload?.classList.add('upload-error');
      if (preview) preview.hidden = true;
      if (status) { status.textContent = 'Pilih file gambar yang valid.'; status.hidden = false; }
      event.target.value = '';
      return;
    }

    try {
      taskPhotoData = await compressPhoto(file);

      if (upload) {
        upload.classList.remove('upload-error');
        upload.classList.add('has-photo');
      }
      form?.classList.add('has-attachment');
      event.target.disabled = true;
      if (removeButton) removeButton.hidden = false;
      if (status) { status.textContent = ''; status.hidden = true; }
      if (preview) {
        preview.src = taskPhotoData;
        preview.alt = `Pratinjau lampiran ${file.name}`;
        preview.hidden = false;
      }
    } catch {
      taskPhotoData = '';

      if (upload) {
        upload.classList.add('upload-error');
        upload.classList.remove('has-photo');
      }
      if (preview) preview.hidden = true;
      if (status) { status.textContent = 'Gambar gagal diproses. Coba file lain.'; status.hidden = false; }
      event.target.value = '';
    }

    return;
  }

  if (event.target.matches('[data-watch-search]')) {
    watchSearch = event.target.value;
    const kind = currentPage() === 'watch-anime' ? 'anime' : 'kdrama';
    watchCatalogPage[kind] = 1;
    const grid = app.querySelector('.catalog-grid');
    if (grid) grid.innerHTML = renderWatchCatalogResults(kind);
    return;
  }
});

app.addEventListener('input', (event) => {
  if (event.target.matches('[data-watch-search]')) {
    watchSearch = event.target.value;
    const kind = currentPage() === 'watch-anime' ? 'anime' : 'kdrama';
    watchCatalogPage[kind] = 1;
    const grid = app.querySelector('.catalog-grid');
    if (grid) grid.innerHTML = renderWatchCatalogResults(kind);
    return;
  }
  if (event.target.matches('#anime-video-seek')) {
    const video = app.querySelector('#anime-video');
    if (video && Number.isFinite(video.duration)) {
      video.currentTime = Number(event.target.value) / 1000 * video.duration;
      event.target.style.setProperty('--seek-progress', `${Number(event.target.value) / 10}%`);
    }
    return;
  }
  if (event.target.matches('#media-video-seek')) {
    const video = app.querySelector('#media-video');
    if (video && Number.isFinite(video.duration)) {
      video.currentTime = Number(event.target.value) / 1000 * video.duration;
      event.target.style.setProperty('--seek-progress', `${Number(event.target.value) / 10}%`);
    }
  }
});

app.addEventListener('submit', async (event) => {
  event.preventDefault();

  const form = event.target.closest('form');

  if (!form) return;
  if (!form.reportValidity()) return;

  const formData = new FormData(form);

  if (form.dataset.form === 'login') {
  const email = String(
    formData.get('email') || ''
  ).trim().toLowerCase();

  const password = String(
    formData.get('password') || ''
  );

  const message = form.querySelector('.form-message');

  if (!email || !password) {
    if (message) {
      message.textContent =
        'Email dan kata sandi wajib diisi.';
    }
    return;
  }

  try {
    const { data, error } =
      await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

    if (error) throw error;

    if (!data.user) {
      throw new Error('User Supabase tidak ditemukan.');
    }

    const synced = await syncSupabaseSession();

    if (!synced || !currentAccount) {
      throw new Error(
        'Login berhasil, tetapi data akun gagal dimuat.'
      );
    }

    completeDailyCheckIn();
    persist();

    modal = null;
    navigate('home');
  } catch (error) {
    console.error('Login Supabase gagal:', error);

    if (message) {
      message.textContent =
        error.message ||
        'Login gagal. Periksa email dan kata sandi.';
    }
  }

  return;
}

  if (form.dataset.form === 'password-reset') {
    const password = String(formData.get('password') || '');
    const message = form.querySelector('.form-message');
    if (password.length < 6) {
      if (message) message.textContent = 'Password minimal terdiri dari 6 karakter.';
      return;
    }

    try {
      const { error } = await supabaseClient.auth.updateUser({ password });
      if (error) throw error;
      if (message) message.textContent = 'Password berhasil diperbarui.';
      window.setTimeout(() => navigate('home'), 1200);
    } catch (error) {
      console.error('Pembaruan password gagal:', error);
      if (message) message.textContent = error.message || 'Password tidak dapat diperbarui.';
    }
    return;
  }

  if (form.dataset.form === 'signup') {
  const name = String(
    formData.get('name') || ''
  ).trim();

  const email = String(
    formData.get('email') || ''
  ).trim().toLowerCase();

  const password = String(
    formData.get('password') || ''
  );

  const message = form.querySelector('.form-message');

  if (!email || !password) {
    if (message) {
      message.textContent = 'Email dan kata sandi wajib diisi.';
    }
    return;
  }

  try {
    const { data, error } =
      await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            name
          }
        }
      });

    if (error) {
      throw error;
    }

    if (data.session) {
      const synced = await syncSupabaseSession();

      if (!synced || !currentAccount) {
        throw new Error(
          'Pendaftaran berhasil, tetapi data akun gagal dimuat.'
        );
      }

      completeDailyCheckIn();
      persist();
      modal = null;
      navigate('home');
      return;
    }

    currentAccount = null;
    localStorage.removeItem(ACTIVE_ACCOUNT_STORAGE_KEY);
    if (message) {
      message.textContent =
        'Registrasi berhasil. Buka tautan verifikasi di email untuk langsung masuk ke beranda.';
    }
  } catch (error) {
    console.error('Register Supabase gagal:', error);

    if (message) {
      message.textContent =
        error?.message ||
        'Registrasi gagal. Silakan coba lagi.';
    }
  }

  return;
}

  if (form.dataset.form === 'profile-edit') {
    const name = String(
      formData.get('name') || ''
    ).trim();

    const email = String(
      formData.get('email') || ''
    ).trim().toLocaleLowerCase();

    const newPassword = String(
      formData.get('password') || ''
    );

    const message =
      form.querySelector('.profile-edit-message');

    if (!currentAccount) {
      if (message) {
        message.textContent =
          'Masuk terlebih dahulu untuk mengubah data akun.';
      }

      return;
    }

    if (
      accounts.some(
        (account) =>
          account !== currentAccount &&
          account.email?.toLocaleLowerCase() === email
      )
    ) {
      if (message) {
        message.textContent =
          'Email ini sudah digunakan akun lain.';
      }

      return;
    }

    currentAccount.name = name;
    currentAccount.email = email;

    if (newPassword) {
      currentAccount.salt = encodeBase64(
        crypto.getRandomValues(new Uint8Array(16))
      );

      currentAccount.passwordHash =
        await hashPassword(
          newPassword,
          currentAccount.salt
        );
    }

    state.username = name;

    localStorage.setItem(
      ACTIVE_ACCOUNT_STORAGE_KEY,
      email
    );

    persistAccounts();
    persist();

    modal = null;

    render();

    return;
  }

  if (form.dataset.form === 'forgot') {
    const email = String(
        formData.get('email') || ''
    ).trim().toLowerCase();

    const message = form.querySelector('.form-message');

    if (!email) {
        if (message) {
            message.textContent = 'Email wajib diisi.';
        }
        return;
    }

    try {
        const { error } =
            await supabaseClient.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/?mode=reset-password`
            });

        if (error) {
            throw error;
        }

        if (message) {
            message.textContent =
                'Link reset password telah dikirim ke email kamu. Silakan cek inbox atau folder spam.';
        }
    } catch (error) {
        console.error('Reset password gagal:', error);

        if (message) {
            message.textContent =
                error.message || 'Gagal mengirim link reset password.';
        }
    }

    return;
}

  if (form.dataset.form === 'task-add') {
    const title = String(
      formData.get('title') || ''
    ).trim();

    const description = String(
      formData.get('description') || ''
    ).trim();

    const deadline = String(
      formData.get('deadline') || ''
    );

    const photo = taskPhotoData;

    if (!photo) {
      const upload =
        form.querySelector('.upload-area');

      if (upload) {
        upload.classList.add('upload-error');

        const note = upload.querySelector('small');

        if (note) {
          note.textContent =
            'Lampirkan foto tugas terlebih dahulu.';
        }
      }

      return;
    }

    const task = {
      id: crypto.randomUUID(),
      title,
      description,
      deadline,
      photo,
      createdAt: new Date().toISOString(),
      difficulty: classifyTask(
        title,
        deadline,
        photo
      ),
      done: false,
    };

    modal = {
      type: 'analyzing',
    };

    const token = ++analysisToken;

    render();

    window.setTimeout(() => {
      if (token !== analysisToken) return;

      state.tasks.unshift(task);

      persist();

      modal = {
        type: 'task-added',
        task,
      };

      render();
    }, 900);

    return;
  }
});

window.addEventListener(
  'beforeunload',
  (event) => {
    if (!state.strictMode) return;

    event.preventDefault();
    event.returnValue = '';
  }
);

window.addEventListener('hashchange', (event) => {
  const fromPage = new URL(event.oldURL).hash.slice(1);
  const toPage = new URL(event.newURL).hash.slice(1);
  resetWatchFiltersOnReturn(fromPage, toPage);
  render();
});

async function startKudo() {
    scheduleDailyMissionRefresh();

    const isGoogleAuthRedirectPending =
      localStorage.getItem(GOOGLE_AUTH_REDIRECT_PENDING_KEY) === 'true'
      || window.location.hash.includes('access_token=')
      || new URLSearchParams(window.location.search).has('code');
    let waitForGoogleAuthSession = Promise.resolve(null);

    if (isGoogleAuthRedirectPending) {
      waitForGoogleAuthSession = new Promise((resolve) => {
        let settled = false;
        let timeoutId;
        let subscription;

        const finish = (session) => {
          if (settled) return;
          settled = true;
          window.clearTimeout(timeoutId);
          subscription?.unsubscribe();
          resolve(session);
        };

        const { data } = supabaseClient.auth.onAuthStateChange(
          (_event, session) => {
            if (session) finish(session);
          }
        );
        subscription = data.subscription;
        timeoutId = window.setTimeout(() => finish(null), 15000);
      });
    }

    const oauthParams = new URLSearchParams(window.location.search);
    const recoveryParams = new URLSearchParams(window.location.hash.slice(1));
    const isPasswordRecovery = oauthParams.get('mode') === 'reset-password'
      || recoveryParams.get('type') === 'recovery';
    const oauthError =
      oauthParams.get('error_description') || oauthParams.get('error');

    try {
      if (oauthError) {
        throw new Error(oauthError);
      }

      const synced = await syncSupabaseSession();

      if (!synced && isGoogleAuthRedirectPending) {
        const session = await waitForGoogleAuthSession;
        if (session) {
          const restored = await syncSupabaseSession();
          if (!restored || !currentAccount) {
            throw new Error('Sesi Google berhasil, tetapi data akun gagal dimuat.');
          }
        }
      }
    } catch (error) {
      localStorage.removeItem(GOOGLE_AUTH_REDIRECT_PENDING_KEY);
      console.error('Sesi login tidak dapat dipulihkan:', error);
      navigate('login');

      const message = app.querySelector('.form-message');
      if (message) {
        message.textContent =
          'Login berhasil dimulai, tetapi sesi atau data akun gagal dimuat. Silakan coba lagi.';
      }

      return;
    }

    if (isPasswordRecovery) {
        localStorage.removeItem(GOOGLE_AUTH_REDIRECT_PENDING_KEY);
        navigate('reset-password');
        return;
    }

    if (currentAccount) {
        localStorage.removeItem(GOOGLE_AUTH_REDIRECT_PENDING_KEY);
        completeDailyCheckIn();
        if (currentPage() === 'transaction' && pendingDiamondOrder?.invoiceNumber) {
          render();
          return;
        }
        navigate('home');
        return;
    }

    if (isGoogleAuthRedirectPending) {
      localStorage.removeItem(GOOGLE_AUTH_REDIRECT_PENDING_KEY);
      navigate('login');

      const message = app.querySelector('.form-message');
      if (message) {
        message.textContent =
          'Login Google berhasil dimulai, tetapi sesi akun tidak dapat dipulihkan. Silakan coba masuk kembali.';
      }

      return;
    }

    render();
}

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') refreshDailyMissionsIfDateChanged();
});

startKudo();
