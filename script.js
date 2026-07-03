const env = window.BIRTHDAY_ENV;

const app = document.querySelector("#app");
const scenes = [...document.querySelectorAll(".scene")];
const stepDots = [...document.querySelectorAll(".steps span")];
const nextButtons = [...document.querySelectorAll(".next")];
const reviewReturnButtons = [...document.querySelectorAll(".review-return")];
const gateDays = document.querySelector("#gateDays");
const gateHours = document.querySelector("#gateHours");
const gateMinutes = document.querySelector("#gateMinutes");
const gateSeconds = document.querySelector("#gateSeconds");
const gateStatus = document.querySelector("#gateStatus");
const gateOpen = document.querySelector("#gateOpen");
const gateGif = document.querySelector("#gateGif");
const gateOverrideToggle = document.querySelector("#gateOverrideToggle");
const gateOverride = document.querySelector("#gateOverride");
const gateOverrideInput = document.querySelector("#gateOverrideInput");
const gateOverrideSubmit = document.querySelector("#gateOverrideSubmit");
const gateOverrideHint = document.querySelector("#gateOverrideHint");
const passwordInput = document.querySelector("#passwordInput");
const unlockBtn = document.querySelector("#unlockBtn");
const holdGift = document.querySelector("#holdGift");
const lockGif = document.querySelector("#lockGif");
const passwordHint = document.querySelector("#passwordHint");
const suspenseText = document.querySelector("#suspenseText");
const memoryCards = [...document.querySelectorAll(".memory-card")];
const memoryNote = document.querySelector("#memoryNote");
const memoryGif = document.querySelector("#memoryGif");
const memoryNext = document.querySelector(".memory-next");
const countNumber = document.querySelector("#countNumber");
const countCaption = document.querySelector("#countCaption");
const countGif = document.querySelector("#countGif");
const suspenseGif = document.querySelector("#suspenseGif");
const birthdayGif = document.querySelector("#birthdayGif");
const cakeScene = document.querySelector(".cake-scene");
const cakeStage = document.querySelector("#cakeStage");
const micStart = document.querySelector("#micStart");
const cakeStatus = document.querySelector("#cakeStatus");
const blowLevel = document.querySelector("#blowLevel");
const letterText = document.querySelector("#letterText");
const letterGif = document.querySelector("#letterGif");
const yesBtn = document.querySelector("#yesBtn");
const shyBtn = document.querySelector("#shyBtn");
const choiceRow = document.querySelector(".choice-row");
const finalCard = document.querySelector(".final-card");
const finalGif = document.querySelector("#finalGif");
const finalMessage = document.querySelector("#finalMessage");
const revisitPanel = document.querySelector("#revisitPanel");
const revisitTitle = document.querySelector("#revisitTitle");
const revisitGrid = document.querySelector("#revisitGrid");
const hearts = document.querySelector(".hearts");
const soundToggle = document.querySelector("#soundToggle");
const youtubeHolder = document.querySelector("#youtubeHolder");

const secret = env.password;
let currentScene = 0;
let typingTimer;
let timeGateTimer;
let countdownTimer;
let heartTimer;
let suspenseTimer;
let lockGifTimer;
let sceneGifTimer;
let blowAnimation;
let blowStream;
let blowAudioContext;
let blowAnalyser;
let blowSource;
let blowScore = 0;
let candleBlown = false;
let micStarting = false;
let youtubeFrame;
let youtubePlaying = true;
let resumeMusicAfterCake = false;
let isReviewingScene = false;
const openedMemories = new Set();

const memories = [
  { img: "./assets/soft-cats.gif", text: env.memory.cards[0].text },
  { img: "./assets/together.gif", text: env.memory.cards[1].text },
  { img: "./assets/sleepy-pat.gif", text: env.memory.cards[2].text },
];

const lockGifs = [
  "./assets/start.gif",
  "./assets/soft-cats.gif",
  "./assets/together.gif",
  "./assets/sleepy-pat.gif",
  "./assets/please.gif",
];

const sceneGifs = {
  0: {
    element: gateGif,
    files: ["./assets/party-cake.gif", "./assets/happy-clean.gif", "./assets/please.gif", "./assets/start.gif"],
  },
  2: {
    element: suspenseGif,
    files: ["./assets/please.gif", "./assets/mochi-walk.gif", "./assets/cute-lie.gif", "./assets/start.gif"],
  },
  3: {
    element: memoryGif,
    files: ["./assets/soft-cats.gif", "./assets/together.gif", "./assets/sleepy-pat.gif", "./assets/hearts-clean.gif"],
  },
  4: {
    element: countGif,
    files: ["./assets/start.gif", "./assets/please.gif", "./assets/happy-clean.gif", "./assets/party-cake.gif"],
  },
  7: {
    element: letterGif,
    files: ["./assets/love-clean.gif", "./assets/kiss-clean.gif", "./assets/start.gif", "./assets/sleepy-pat.gif"],
  },
  8: {
    element: finalGif,
    files: ["./assets/hug.gif", "./assets/kiss-clean.gif", "./assets/love-clean.gif", "./assets/hearts-clean.gif"],
  },
};

let lockGifIndex = 0;
const sceneGifIndexes = {};

function setText(selector, value) {
  const node = document.querySelector(selector);
  if (node) node.textContent = value;
}

function applyContent() {
  document.title = env.pageTitle;

  setText("#gateEyebrow", env.timeGate.eyebrow);
  setText("#gateTitle", env.timeGate.title);
  setText("#gateLead", env.timeGate.lead);
  setText("#gateDaysLabel", env.timeGate.labels.days);
  setText("#gateHoursLabel", env.timeGate.labels.hours);
  setText("#gateMinutesLabel", env.timeGate.labels.minutes);
  setText("#gateSecondsLabel", env.timeGate.labels.seconds);
  gateStatus.textContent = env.timeGate.status;
  gateOpen.textContent = env.timeGate.button;
  gateOverrideToggle.textContent = env.timeGate.overrideButton;
  gateOverrideInput.placeholder = env.timeGate.overridePlaceholder;
  gateOverrideSubmit.textContent = env.timeGate.overrideSubmit;
  gateOverrideHint.textContent = env.timeGate.overrideHint;

  setText("#lockEyebrow", env.lock.eyebrow);
  setText("#lockTitle", env.lock.title);
  setText("#lockLead", env.lock.lead);
  passwordInput.placeholder = env.lock.inputPlaceholder;
  unlockBtn.textContent = env.lock.button;
  passwordHint.textContent = env.lock.hint;
  setText("#tapLabel", env.lock.tapLabel);

  setText("#suspenseEyebrow", env.suspense.eyebrow);
  setText("#suspenseTitle", env.suspense.title);
  setText("#suspenseNext", env.common.next);

  setText("#memoryEyebrow", env.memory.eyebrow);
  setText("#memoryTitle", env.memory.title);
  setText("#memoryLead", env.memory.lead);
  setText("#memoryNote p", env.memory.emptyNote);
  memoryNext.textContent = env.common.continue;
  memoryCards.forEach((card, index) => {
    card.querySelector("span").textContent = env.memory.cards[index].eyebrow;
    card.querySelector("strong").textContent = env.memory.cards[index].title;
  });

  setText("#countdownEyebrow", env.countdown.eyebrow);
  countCaption.textContent = env.countdown.captions[0];

  setText("#birthdayEyebrow", env.birthday.eyebrow);
  setText("#birthdayTitle", env.birthday.title);
  setText("#birthdayLead", env.birthday.lead);
  setText("#birthdayNext", env.birthday.button);

  setText("#cakeEyebrow", env.cake.eyebrow);
  setText("#cakeTitle", env.cake.title);
  setText("#cakeLead", env.cake.lead);
  micStart.textContent = env.cake.button;
  cakeStatus.textContent = env.cake.permission;

  setText("#letterEyebrow", env.letter.eyebrow);
  setText("#letterTitle", env.letter.title);
  setText("#letterNext", env.letter.button);

  setText("#finalEyebrow", env.final.eyebrow);
  setText("#finalTitle", env.final.title);
  yesBtn.textContent = env.final.yes;
  shyBtn.textContent = env.final.shy;
  revisitTitle.textContent = env.final.revisitTitle;
  reviewReturnButtons.forEach((button) => {
    button.textContent = env.final.revisitBack;
  });
  revisitGrid.innerHTML = "";
  env.final.revisit.forEach((item) => {
    const button = document.createElement("button");
    button.className = "revisit-btn";
    button.type = "button";
    button.textContent = item.label;
    button.addEventListener("click", () => goToScene(item.scene, { review: true }));
    revisitGrid.append(button);
  });
  soundToggle.textContent = env.common.soundLabel;
}

function normalize(value) {
  return value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function goToScene(index, options = {}) {
  const previousScene = currentScene;
  isReviewingScene = Boolean(options.review);
  currentScene = index;
  scenes.forEach((scene, sceneIndex) => {
    scene.classList.toggle("active", sceneIndex === index);
    scene.classList.toggle("reviewing", isReviewingScene && sceneIndex === index);
  });
  reviewReturnButtons.forEach((button) => {
    const scene = button.closest(".scene");
    button.hidden = !(isReviewingScene && Number(scene?.dataset.scene) === index);
  });
  stepDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === index);
  });
  app.classList.toggle("birthday-mode", index === 5 || index === 6);
  app.classList.toggle("final-mode", index === 8);

  clearTimeout(typingTimer);
  clearTimeout(suspenseTimer);
  clearInterval(timeGateTimer);
  clearInterval(countdownTimer);
  stopSceneGifLoop();
  if (index === 6 && previousScene !== 6) {
    resumeMusicAfterCake = youtubePlaying;
    pauseMusic();
  }
  if (previousScene === 6 && index !== 6) {
    stopBlowDetector();
    if (resumeMusicAfterCake) playMusic();
    resumeMusicAfterCake = false;
  }
  if (index === 1) startLockGifLoop();
  else stopLockGifLoop();

  if (index === 0) startTimeGate();
  if (index === 2) startSuspense();
  if ([0, 2, 3, 4, 7].includes(index)) startSceneGifLoop(index);
  if (index === 4) startCountdown();
  if (index === 6) startCakeWish();
  if (index === 7) typeText(letterText, env.letter.body, 22);
}

function startLockGifLoop() {
  if (lockGifTimer) return;
  lockGifTimer = setInterval(() => {
    lockGifIndex = (lockGifIndex + 1) % lockGifs.length;
    switchGif(lockGif, lockGifs, lockGifIndex, 130);
  }, 2000);
}

function stopLockGifLoop() {
  clearInterval(lockGifTimer);
  lockGifTimer = null;
}

function switchGif(element, files, index, delay = 140) {
  element.classList.add("switching");
  setTimeout(() => {
    element.src = files[index];
    element.classList.remove("switching");
  }, delay);
}

function startSceneGifLoop(sceneIndex) {
  const config = sceneGifs[sceneIndex];
  if (!config || !config.element) return;
  sceneGifIndexes[sceneIndex] = sceneGifIndexes[sceneIndex] || 0;
  config.element.src = config.files[sceneGifIndexes[sceneIndex]];
  sceneGifTimer = setInterval(() => {
    sceneGifIndexes[sceneIndex] = (sceneGifIndexes[sceneIndex] + 1) % config.files.length;
    switchGif(config.element, config.files, sceneGifIndexes[sceneIndex]);
  }, 2000);
}

function stopSceneGifLoop() {
  clearInterval(sceneGifTimer);
  sceneGifTimer = null;
}

function startTimeGate() {
  gateOpen.hidden = true;
  gateOpen.disabled = true;
  gateOverride.hidden = true;
  gateOverrideInput.value = "";
  gateOverrideHint.textContent = env.timeGate.overrideHint;
  timeGateTimer = setInterval(updateTimeGate, 1000);
  updateTimeGate();
}

function updateTimeGate() {
  const target = new Date(env.timeGate.target).getTime();
  const remaining = target - Date.now();

  if (!Number.isFinite(target)) {
    gateStatus.textContent = env.timeGate.ready;
    releaseTimeGate();
    return;
  }

  if (remaining <= 0) {
    gateDays.textContent = "00";
    gateHours.textContent = "00";
    gateMinutes.textContent = "00";
    gateSeconds.textContent = "00";
    gateStatus.textContent = env.timeGate.ready;
    releaseTimeGate();
    return;
  }

  const seconds = Math.floor(remaining / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const displaySeconds = seconds % 60;

  gateDays.textContent = padTime(days);
  gateHours.textContent = padTime(hours);
  gateMinutes.textContent = padTime(minutes);
  gateSeconds.textContent = padTime(displaySeconds);
  gateStatus.textContent = env.timeGate.status;
}

function releaseTimeGate() {
  clearInterval(timeGateTimer);
  gateOpen.hidden = false;
  gateOpen.disabled = false;
  softBurst(48);
  setTimeout(() => {
    if (currentScene === 0) goToScene(1);
  }, 1200);
}

function padTime(value) {
  return String(value).padStart(2, "0");
}

async function tryTimeGateOverride() {
  const entered = gateOverrideInput.value.trim();
  const enteredHash = await sha256(entered);

  if (enteredHash === env.timeGate.overrideHash) {
    softBurst(42);
    goToScene(1);
    return;
  }

  gateOverrideHint.textContent = env.timeGate.overrideWrong;
  gateOverrideInput.select();
  document.querySelector(".time-gate-scene").classList.remove("shake");
  void document.querySelector(".time-gate-scene").offsetWidth;
  document.querySelector(".time-gate-scene").classList.add("shake");
}

async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function typeText(target, text, speed = 28, done) {
  clearTimeout(typingTimer);
  target.textContent = "";
  let index = 0;

  function tick() {
    target.textContent += text[index];
    target.scrollTop = target.scrollHeight;
    index += 1;
    if (index < text.length) {
      typingTimer = setTimeout(tick, text[index - 1] === "\n" ? 180 : speed);
      return;
    }

    if (done) done();
  }

  tick();
}

function startSuspense() {
  let lineIndex = 0;
  suspenseText.textContent = "";

  function nextLine() {
    if (lineIndex >= env.suspense.lines.length) return;
    typeAppendLine(suspenseText, env.suspense.lines[lineIndex], 26);
    lineIndex += 1;
    suspenseTimer = setTimeout(nextLine, 2300);
  }

  nextLine();
}

function typeAppendLine(target, text, speed = 28) {
  clearTimeout(typingTimer);
  if (target.textContent) target.textContent += "\n";
  let index = 0;

  function tick() {
    target.textContent += text[index];
    target.scrollTop = target.scrollHeight;
    index += 1;
    if (index < text.length) {
      typingTimer = setTimeout(tick, speed);
    }
  }

  tick();
}

function unlock() {
  if (normalize(passwordInput.value) !== normalize(secret)) {
    passwordHint.textContent = env.lock.wrongHint;
    passwordInput.select();
    document.querySelector(".lock-scene").classList.remove("shake");
    void document.querySelector(".lock-scene").offsetWidth;
    document.querySelector(".lock-scene").classList.add("shake");
    return;
  }

  softBurst();
  goToScene(2);
  startHearts();
}

function openMemory(card) {
  const index = Number(card.dataset.memory);
  const data = memories[index];
  openedMemories.add(index);
  card.classList.add("done");
  memoryNote.querySelector("img").src = data.img;
  typeText(memoryNote.querySelector("p"), data.text, 20);
  if (openedMemories.size === memories.length) {
    memoryNext.disabled = false;
  }
}

function startCountdown() {
  let value = 5;
  countNumber.textContent = value;
  countCaption.textContent = env.countdown.captions[0];

  countdownTimer = setInterval(() => {
    value -= 1;
    if (value <= 0) {
      clearInterval(countdownTimer);
      app.classList.remove("shake");
      void app.offsetWidth;
      app.classList.add("shake");
      bigBurst();
      setTimeout(() => goToScene(5), 720);
      return;
    }

    countNumber.textContent = value;
    countCaption.textContent = env.countdown.captions[5 - value] || env.countdown.captions[0];
    softBurst(28);
  }, 1000);
}

function startCakeWish() {
  candleBlown = false;
  blowScore = 0;
  cakeScene.classList.remove("blown", "fallback", "listening", "waiting");
  cakeStatus.textContent = env.cake.permission;
  micStart.hidden = false;
  micStart.disabled = false;
  micStart.dataset.fallback = "";
  micStart.textContent = env.cake.button;
  blowLevel.style.width = "0%";
  requestBlowMic();
}

async function requestBlowMic() {
  if (candleBlown || micStarting || blowStream) return;

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!navigator.mediaDevices?.getUserMedia || !AudioContextClass) {
    enableCakeFallback(env.cake.unavailable);
    return;
  }

  stopBlowDetector();
  micStarting = true;
  micStart.disabled = true;
  cakeScene.classList.add("waiting");
  cakeStatus.textContent = env.cake.permission;

  try {
    blowStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
      video: false,
    });
    blowAudioContext = new AudioContextClass();
    await blowAudioContext.resume();
    blowSource = blowAudioContext.createMediaStreamSource(blowStream);
    blowAnalyser = blowAudioContext.createAnalyser();
    blowAnalyser.fftSize = 2048;
    blowAnalyser.smoothingTimeConstant = 0.58;
    blowSource.connect(blowAnalyser);

    cakeScene.classList.remove("waiting", "fallback");
    cakeScene.classList.add("listening");
    cakeStatus.textContent = env.cake.listening;
    micStart.hidden = true;
    micStart.disabled = false;
    monitorBlow();
  } catch (error) {
    enableCakeFallback(env.cake.retry);
  } finally {
    micStarting = false;
    cakeScene.classList.remove("waiting");
  }
}

function monitorBlow() {
  const timeData = new Uint8Array(blowAnalyser.fftSize);
  const frequencyData = new Uint8Array(blowAnalyser.frequencyBinCount);

  function tick() {
    if (!blowAnalyser || candleBlown) return;

    blowAnalyser.getByteTimeDomainData(timeData);
    blowAnalyser.getByteFrequencyData(frequencyData);

    let sum = 0;
    for (const value of timeData) {
      const centered = value - 128;
      sum += centered * centered;
    }
    const volume = Math.sqrt(sum / timeData.length) / 128;
    const highStart = Math.floor(frequencyData.length * 0.42);
    let highTotal = 0;
    for (let index = highStart; index < frequencyData.length; index += 1) {
      highTotal += frequencyData[index];
    }
    const highNoise = highTotal / ((frequencyData.length - highStart) * 255);
    const soundsLikeBlow = volume > 0.075 || (volume > 0.045 && highNoise > 0.018);

    blowScore = Math.max(0, Math.min(12, blowScore + (soundsLikeBlow ? 1.2 + volume * 2 : -0.35)));
    blowLevel.style.width = `${Math.round((blowScore / 12) * 100)}%`;
    cakeStatus.textContent = blowScore > 4 ? env.cake.almost : env.cake.listening;

    if (blowScore >= 12) {
      blowOutCandles();
      return;
    }

    blowAnimation = requestAnimationFrame(tick);
  }

  tick();
}

function enableCakeFallback(message) {
  stopBlowDetector();
  cakeScene.classList.add("fallback");
  cakeStatus.textContent = message;
  micStart.hidden = false;
  micStart.disabled = false;
  micStart.dataset.fallback = "true";
  micStart.textContent = env.cake.fallbackButton;
}

function blowOutCandles() {
  if (candleBlown) return;
  candleBlown = true;
  cakeScene.classList.add("blown");
  cakeStatus.textContent = env.cake.done;
  micStart.hidden = true;
  blowLevel.style.width = "100%";
  stopBlowDetector();
  softBurst(62);
  setTimeout(() => goToScene(7), 1800);
}

function stopBlowDetector() {
  cancelAnimationFrame(blowAnimation);
  blowAnimation = null;

  if (blowSource) blowSource.disconnect();
  blowSource = null;
  blowAnalyser = null;

  if (blowStream) {
    blowStream.getTracks().forEach((track) => track.stop());
    blowStream = null;
  }

  if (blowAudioContext && blowAudioContext.state !== "closed") {
    blowAudioContext.close().catch(() => {});
  }
  blowAudioContext = null;
  cakeScene.classList.remove("listening", "waiting");
}

function moveShyButton() {
  if (choiceRow.classList.contains("done")) return;

  const rowRect = choiceRow.getBoundingClientRect();
  const buttonRect = shyBtn.getBoundingClientRect();
  const maxX = Math.max(120, Math.min(260, window.innerWidth * 0.24));
  const maxY = 72;
  let x = (Math.random() * 2 - 1) * maxX;
  let y = (Math.random() * 2 - 1) * maxY;

  const nextLeft = buttonRect.left - rowRect.left + x;
  const nextRight = nextLeft + buttonRect.width;
  if (nextLeft < -20) x += Math.abs(nextLeft) + 20;
  if (nextRight > rowRect.width + 20) x -= nextRight - rowRect.width - 20;

  shyBtn.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
}

function finalReveal() {
  finalCard.classList.add("revealed");
  choiceRow.classList.add("done");
  yesBtn.disabled = true;
  shyBtn.disabled = true;
  revisitPanel.hidden = true;
  finalGif.classList.add("show");
  finalGif.src = "./assets/hug.gif";
  startSceneGifLoop(8);
  typeText(finalMessage, env.final.message, 24, () => {
    revisitPanel.hidden = false;
  });
  bigBurst();
}

function softBurst(count = 40) {
  if (!window.confetti) return;
  window.confetti({
    particleCount: count,
    spread: 58,
    startVelocity: 24,
    ticks: 120,
    origin: { x: .5, y: .72 },
    colors: ["#ff7da8", "#ffd579", "#fff4dc"],
    disableForReducedMotion: true,
  });
}

function bigBurst() {
  if (!window.confetti) return;
  window.confetti({
    particleCount: 95,
    spread: 72,
    origin: { x: .22, y: .72 },
    colors: ["#ff7da8", "#ffd579", "#fff4dc"],
    disableForReducedMotion: true,
  });
  window.confetti({
    particleCount: 95,
    spread: 72,
    origin: { x: .78, y: .72 },
    colors: ["#ff9fbd", "#ffe3a3", "#ffffff"],
    disableForReducedMotion: true,
  });
}

function startHearts() {
  if (heartTimer) return;
  heartTimer = setInterval(() => {
    const heart = document.createElement("span");
    heart.className = "heart";
    heart.textContent = "♡";
    heart.style.left = `${Math.random() * 92 + 2}%`;
    heart.style.setProperty("--drift", `${Math.random() * 70 - 35}px`);
    heart.style.animationDuration = `${6 + Math.random() * 3}s`;
    hearts.append(heart);
    setTimeout(() => heart.remove(), 9500);
  }, 620);
}

function toggleSound() {
  if (youtubePlaying) {
    pauseMusic();
    return;
  }

  playMusic();
}

function playMusic() {
  ensureYoutubeFrame();
  postYoutubeCommand("playVideo");
  youtubePlaying = true;
  soundToggle.classList.add("on");
}

function pauseMusic() {
  postYoutubeCommand("pauseVideo");
  youtubePlaying = false;
  soundToggle.classList.remove("on");
}

function ensureYoutubeFrame() {
  if (youtubeFrame) return;

  youtubeFrame = document.createElement("iframe");
  youtubeFrame.title = "Birthday music";
  youtubeFrame.allow = "autoplay; encrypted-media";
  youtubeFrame.src = `https://www.youtube.com/embed/${env.music.youtubeVideoId}?enablejsapi=1&autoplay=1&playsinline=1&loop=1&playlist=${env.music.youtubeVideoId}`;
  youtubeFrame.addEventListener("load", () => postYoutubeCommand("playVideo"));
  youtubeHolder.append(youtubeFrame);
}

function startDefaultMusic() {
  playMusic();
}

function postYoutubeCommand(func) {
  if (!youtubeFrame?.contentWindow) return;
  youtubeFrame.contentWindow.postMessage(JSON.stringify({
    event: "command",
    func,
    args: [],
  }), "https://www.youtube.com");
}

applyContent();

gateOpen.addEventListener("click", () => {
  if (Date.now() >= new Date(env.timeGate.target).getTime()) goToScene(1);
});

gateOverrideToggle.addEventListener("click", () => {
  gateOverride.hidden = !gateOverride.hidden;
  if (!gateOverride.hidden) {
    gateOverrideInput.focus();
    gateOverrideHint.textContent = env.timeGate.overrideHint;
  }
});

gateOverrideSubmit.addEventListener("click", tryTimeGateOverride);
gateOverrideInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") tryTimeGateOverride();
});

unlockBtn.addEventListener("click", unlock);
holdGift.addEventListener("click", () => {
  passwordInput.focus();
  passwordHint.textContent = env.lock.tapHint;
  document.querySelector(".lock-scene").classList.remove("shake");
  void document.querySelector(".lock-scene").offsetWidth;
  document.querySelector(".lock-scene").classList.add("shake");
});
passwordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") unlock();
});

nextButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.closest(".scene")?.classList.contains("reviewing")) return;
    goToScene(Math.min(currentScene + 1, scenes.length - 1));
  });
});

reviewReturnButtons.forEach((button) => {
  button.addEventListener("click", () => goToScene(8));
});

micStart.addEventListener("click", () => {
  if (micStart.dataset.fallback === "true") {
    blowOutCandles();
    return;
  }

  requestBlowMic();
});

cakeStage.addEventListener("click", () => {
  if (cakeScene.classList.contains("fallback")) {
    blowOutCandles();
    return;
  }

  requestBlowMic();
});

memoryCards.forEach((card) => {
  card.addEventListener("click", () => openMemory(card));
});

yesBtn.addEventListener("click", finalReveal);
shyBtn.addEventListener("pointerenter", moveShyButton);
shyBtn.addEventListener("focus", moveShyButton);
shyBtn.addEventListener("click", (event) => {
  event.preventDefault();
  moveShyButton();
});
soundToggle.addEventListener("click", toggleSound);

goToScene(0);
startDefaultMusic();
