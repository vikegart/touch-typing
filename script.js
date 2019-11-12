"use strict";

// Global state

let vocabulary;
let levelCount = 0;
let words;
let wordIndex;
let contentToType;
let contentTyped;
let beginTime = new Date();

let divToType = document.getElementById("toType");
let divTyped = document.getElementById("typed");
let spanTime = document.getElementById("time");
let spanErrorsCount = document.getElementById("errorsCount");
let spanWordIndex = document.getElementById("wordIndex");

// Functions

const startButton = document.getElementById('everybodydance');
const mainGame = document.getElementById('main');
const tableInfo = document.getElementById('display');

startButton.onclick = () => {
  startButton.classList.add("pressed");
  setTimeout(()=>{
    hideButton();
    showGameScreen();
    initGame();
  }, 500);
}

function showGameScreen() {
  mainGame.style.display = 'block';
  tableInfo.style.display = 'block';
}
function hideButton() {
  startButton.style.display = 'none';
}


function initGame() {
  setInterval(updateTime, 100);
  fetch("vocabulary.json")
    .then(response => response.json())
    .then(json => { vocabulary = json; })
    .then(() => { initLevel(); });
}

function initLevel() {
  spanErrorsCount.textContent = 0;
  words = choice(vocabulary).slice();
  //shuffle(words);
  wordIndex = 0;
  initWord();
}

function initWord() {
  if (wordIndex == words.length) {
    initLevel();
    return;
  }
  contentToType = words[wordIndex++];
  contentTyped = "";
  spanWordIndex.textContent = wordIndex;
  updateMain();
  let utterance = new SpeechSynthesisUtterance(contentToType);
  window.speechSynthesis.speak(utterance);
}

function updateMain() {
  removeChildren(divToType);
  removeChildren(divTyped);
  let span;
let errorsCount = 0;  
  for (let i in contentToType) {
    span = document.createElement("span");
    span.textContent = contentToType[i];
    if (i < contentTyped.length) {
      if (contentTyped[i].toLowerCase() == contentToType[i].toLowerCase()) {
        span.className = "correct";
      } else {
        span.className = "incorrect";
        errorsCount += 1;
        spanErrorsCount.textContent = errorsCount;
      }
    }
    divToType.appendChild(span);
    span = document.createElement("span");
    span.textContent = i < contentTyped.length ? contentTyped[i] : i == contentTyped.length ? "|" : " ";
    if (i == contentTyped.length && contentTyped.length < contentToType.length) {
      span.className = "cursor";
    }
    divTyped.appendChild(span);
  }
}

function updateTime() {
  let now = new Date();
  let seconds = Math.floor((now - beginTime) / 1000);
  let minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;
  spanTime.textContent = padding(minutes) + ":" + padding(seconds);
}

// Utility functions

function removeChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function choice(array) {
  let index = Math.floor(Math.random() * array.length);
  return array[index];
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function padding(num) {
  let tens = Math.floor(num / 10);
  let ones = num - tens * 10;
  return "" + tens + ones;
}

// Add event listeners

window.addEventListener("keydown", event => {
  let changed = false;
  if (contentTyped.length > 0 && event.key == "Escape") {
    contentTyped = "";
    changed = true;
  } else if (contentTyped.length > 0 && event.key == "Backspace") {
    contentTyped = contentTyped.slice(0, -1);
    changed = true;
  } else if (contentTyped.length < contentToType.length && event.key.length == 1) {
    contentTyped += event.key;
    changed = true;
  }
  if (changed) {
    updateMain();
    if (contentTyped.toLowerCase() == contentToType.toLowerCase()) {
      initWord();
    }
  }
});
