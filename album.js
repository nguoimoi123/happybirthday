const BIRTHDAY_MONTH = 7;
const BIRTHDAY_DAY = 30;
const FIRST_AGE = 19;
const LAST_AGE = 100;
const FIRST_YEAR = 2026;
const STORAGE_KEY = "ngoc-birthday-album:opened:v1";
const EARLY_ACCESS_PASSWORD = "cainibimat";

const seededOpened = {
  19: {
    birthday: "2026-07-30",
    openedAt: "2026-07-30T00:00:00+07:00",
  },
};

const releases = {
  19: {
    published: true,
    href: "./19/?replay=1&from=album",
    title: "Sinh nhật tuổi 19",
    note: "Mùa sinh nhật đầu tiên trong album của tụi mình.",
    concept: "Căn phòng ký ức Peach Cat",
    cover: "./19/assets/party-cake.gif",
    coverAlt: "Peach Cat trong căn phòng sinh nhật tuổi 19",
    accent: "#c9567d",
  },
  20: {
    published: false,
    title: "Sinh nhật tuổi 20",
    note: "Một bất ngờ mới đang được cất thật kỹ.",
    concept: "Bữa tiệc Bugcat & Capoo",
    cover: "./20/assets/bugcat-celebrate.gif",
    coverAlt: "Bugcat và Capoo đang ăn mừng sinh nhật tuổi 20",
    accent: "#3f9db5",
  },
};

const yearGrid = document.querySelector("#yearGrid");
const template = document.querySelector("#yearCardTemplate");
const filters = [...document.querySelectorAll(".filter")];
const showMore = document.querySelector("#showMore");
let currentFilter = "all";
let expanded = false;

function birthdayForAge(age) {
  const year = FIRST_YEAR + (age - FIRST_AGE);
  return {
    year,
    iso: `${year}-07-30`,
    timestamp: new Date(`${year}-07-30T00:00:00+07:00`).getTime(),
  };
}

function readOpened() {
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") || {};
  } catch {
    saved = {};
  }
  return { ...saved, ...seededOpened };
}

function isBirthdayToday(age, now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now).reduce((result, part) => {
    result[part.type] = part.value;
    return result;
  }, {});
  const birthday = birthdayForAge(age);
  return Number(parts.year) === birthday.year
    && Number(parts.month) === BIRTHDAY_MONTH
    && Number(parts.day) === BIRTHDAY_DAY;
}

function formatBirthday(age) {
  return `30 tháng 7, ${birthdayForAge(age).year}`;
}

function formatOpenedDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "30/07/2026";
  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Bangkok",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function nextBirthdayAge(now = Date.now()) {
  for (let age = FIRST_AGE; age <= LAST_AGE; age += 1) {
    if (isBirthdayToday(age, new Date(now))) return age;
    if (birthdayForAge(age).timestamp > now) return age;
  }
  return LAST_AGE;
}

function renderCards() {
  const opened = readOpened();
  const nextAge = nextBirthdayAge();
  yearGrid.replaceChildren();

  for (let age = FIRST_AGE; age <= LAST_AGE; age += 1) {
    const release = releases[age];
    const openedRecord = opened[age];
    const state = openedRecord ? "opened" : "waiting";
    const card = template.content.firstElementChild.cloneNode(true);
    card.dataset.state = state;
    card.dataset.age = String(age);
    if (release?.accent) card.style.setProperty("--season-accent", release.accent);
    card.classList.toggle("opened", Boolean(openedRecord));
    card.classList.toggle("next", age === nextAge);

    card.querySelector(".year-label").textContent = `năm ${birthdayForAge(age).year}`;
    card.querySelector(".age-number").textContent = age;
    card.querySelector("h3").textContent = release?.title || `Sinh nhật tuổi ${age}`;
    card.querySelector(".card-date").textContent = openedRecord
      ? `Đã mở ngày ${formatOpenedDate(openedRecord.openedAt)}`
      : formatBirthday(age);

    const status = card.querySelector(".status-pill");
    const note = card.querySelector(".card-note");
    const action = card.querySelector(".card-action");

    if (openedRecord && release?.published) {
      status.textContent = "đã mở ♡";
      note.textContent = `${release.concept} · ${release.note}`;
      const link = document.createElement("a");
      link.href = release.href;
      link.textContent = "Xem lại khoảnh khắc →";
      action.append(link);
    } else if (release?.published && isBirthdayToday(age)) {
      status.textContent = "mở hôm nay";
      note.textContent = `${release.concept} · Căn phòng sinh nhật đã sẵn sàng trong đúng ngày của Ngọc.`;
      const link = document.createElement("a");
      link.href = release.href;
      link.textContent = "Mở mùa sinh nhật →";
      link.addEventListener("click", () => recordOpenedOnBirthday(age));
      action.append(link);
    } else {
      status.textContent = age === nextAge ? "mùa kế tiếp" : "đang khóa";
      note.textContent = "Một mùa sinh nhật bí mật. Chỉ được mở khi tới đúng ngày.";
      const placeholder = document.createElement("span");
      placeholder.className = "early-trigger card-early-trigger";
      placeholder.setAttribute("role", "button");
      placeholder.setAttribute("tabindex", "0");
      placeholder.textContent = "Đang đếm ngược";
      const reveal = () => showCardEarlyAccess(age, action);
      placeholder.addEventListener("click", reveal);
      placeholder.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          reveal();
        }
      });
      action.append(placeholder);
    }

    if (release?.cover) {
      const sticker = document.createElement("img");
      sticker.className = "card-sticker";
      sticker.src = release.cover;
      sticker.alt = release.coverAlt || "";
      card.append(sticker);
    }

    yearGrid.append(card);
  }

  document.querySelector("#openedCount").textContent = Object.keys(opened).length;
  applyFilter();
}

function recordOpenedOnBirthday(age) {
  const release = releases[age];
  if (!release?.published || !isBirthdayToday(age)) return false;
  const opened = readOpened();
  if (opened[age]) return true;
  opened[age] = {
    birthday: birthdayForAge(age).iso,
    openedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(opened));
  } catch {
    return false;
  }
  return true;
}

function passwordMatches(value) {
  return value.trim().toLowerCase() === EARLY_ACCESS_PASSWORD;
}

function tryEarlyAccess(age, input, status) {
  if (!passwordMatches(input.value)) {
    status.textContent = "Sai rồi nha bé, bí mật vẫn an toàn ♡";
    input.select();
    return;
  }

  const release = releases[age];
  if (release?.published && release.href) {
    const separator = release.href.includes("?") ? "&" : "?";
    window.location.assign(`${release.href}${separator}early=1`);
    return;
  }

  status.textContent = "Đúng mật khẩu rồi. Nhưng bí mật vẫn phải đợi đúng ngày mới chịu xuất hiện nha ♡";
  input.value = "";
}

function showCardEarlyAccess(age, action) {
  action.replaceChildren();
  const wrapper = document.createElement("div");
  wrapper.className = "early-access card-early-access";

  const label = document.createElement("label");
  const inputId = `early-password-${age}`;
  label.htmlFor = inputId;
  label.textContent = "Em muốn biết liền";

  const row = document.createElement("div");
  row.className = "early-input-row";
  const input = document.createElement("input");
  input.id = inputId;
  input.type = "password";
  input.autocomplete = "off";
  input.placeholder = "mật khẩu";
  const submit = document.createElement("button");
  submit.type = "button";
  submit.textContent = "Mở";
  const status = document.createElement("p");
  status.setAttribute("aria-live", "polite");

  const attempt = () => tryEarlyAccess(age, input, status);
  submit.addEventListener("click", attempt);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") attempt();
  });
  row.append(input, submit);
  wrapper.append(label, row, status);
  action.append(wrapper);
  input.focus();
}

function applyFilter() {
  const cards = [...yearGrid.children];
  let shown = 0;
  cards.forEach((card) => {
    const matches = currentFilter === "all" || card.dataset.state === currentFilter;
    const withinPreview = expanded || currentFilter !== "all" || shown < 8;
    card.hidden = !matches || !withinPreview;
    if (matches) shown += 1;
  });
  showMore.hidden = expanded || currentFilter !== "all";
}

function updateCountdown() {
  const now = Date.now();
  const age = nextBirthdayAge(now);
  const birthday = birthdayForAge(age);
  const remaining = Math.max(0, birthday.timestamp - now);
  const totalSeconds = Math.floor(remaining / 1000);

  document.querySelector("#nextAge").textContent = age;
  document.querySelector("#nextDate").textContent = formatBirthday(age);
  const release = releases[age];
  document.querySelector("#countdownNote").textContent = `Có một điều dành cho tuổi ${age} đang được cất thật kỹ. Bé có tò mò không?`;
  const conceptImage = document.querySelector("#nextConceptImage");
  const conceptCaption = document.querySelector("#nextConceptCaption");
  if (release?.cover) {
    conceptImage.src = release.cover;
    conceptImage.alt = release.coverAlt || "";
    conceptImage.hidden = false;
    conceptCaption.textContent = `${release.concept} · tuổi ${age}`;
  } else {
    conceptImage.removeAttribute("src");
    conceptImage.alt = "";
    conceptImage.hidden = true;
    conceptCaption.textContent = `mùa bí mật tuổi ${age}`;
  }
  document.querySelector("#days").textContent = String(Math.floor(totalSeconds / 86400)).padStart(3, "0");
  document.querySelector("#hours").textContent = String(Math.floor((totalSeconds % 86400) / 3600)).padStart(2, "0");
  document.querySelector("#minutes").textContent = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  document.querySelector("#seconds").textContent = String(totalSeconds % 60).padStart(2, "0");
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((item) => item.classList.toggle("active", item === button));
    currentFilter = button.dataset.filter;
    applyFilter();
  });
});

showMore.addEventListener("click", () => {
  expanded = true;
  applyFilter();
});

const nextEarlyTrigger = document.querySelector("#nextEarlyTrigger");
const nextEarlyAccess = document.querySelector("#nextEarlyAccess");
const nextEarlyPassword = document.querySelector("#nextEarlyPassword");
const nextEarlySubmit = document.querySelector("#nextEarlySubmit");
const nextEarlyStatus = document.querySelector("#nextEarlyStatus");

nextEarlyTrigger.addEventListener("click", () => {
  nextEarlyAccess.hidden = false;
  nextEarlyTrigger.hidden = true;
  nextEarlyPassword.focus();
});

nextEarlySubmit.addEventListener("click", () => {
  tryEarlyAccess(nextBirthdayAge(), nextEarlyPassword, nextEarlyStatus);
});

nextEarlyPassword.addEventListener("keydown", (event) => {
  if (event.key === "Enter") tryEarlyAccess(nextBirthdayAge(), nextEarlyPassword, nextEarlyStatus);
});

renderCards();
updateCountdown();
setInterval(updateCountdown, 1000);
