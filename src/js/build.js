let body = document.querySelector('body');
createLayout();

function createLayout() {
  let mainTag = document.createElement('main');
  mainTag.classList.add('section', 'section-100vh');
  body.append(mainTag);
  mainTag.append(createGameSection());
  mainTag.append(createMenuSection());
}

function createGameSection() {
  let gameSection = document.createElement('section');
  gameSection.classList.add('section', 'game');
  let gameContainer = document.createElement('div');
  gameContainer.classList.add('container', 'game__container');
  gameSection.append(gameContainer);
  gameContainer.append(createPlayingField());
  gameContainer.append(createResultPony());
  return gameSection;
}

function createPlayingField() {
  let playingField = document.createElement('div');
  playingField.classList.add('playing-field');
  let playingSetups = document.createElement('div');
  playingSetups.classList.add('playing-field__setups');
  playingField.append(playingSetups);
  playingSetups.append(createSetups());

  let playingContainer = document.createElement('div');
  playingContainer.classList.add('playing-field__container');
  playingField.append(playingContainer);
  let size = 4;
  let cellsCount = size ** 2;
  let cellSize = Math.floor(100/size);
  for (let i = 0; i < cellsCount; i++) {
    let newButton = createCell(i+1, cellSize);
    playingContainer.append(newButton)
  }

  let hideChilds = playingContainer.querySelectorAll('.number-button');
  hideChilds[hideChilds.length-1].style.opacity = '0';
  hideChilds[hideChilds.length-1].classList.add('dropzone');

  gameNumbers = Array.from(playingContainer.querySelectorAll('.number-button'));

  let numbersCounter = gameNumbers.length;
  emptyItemValue = numbersCounter;
  let numbersValues = gameNumbers.map(item => Number(item.innerHTML));
  let matrixSize = size;
  let matrixValues = getMatrixValues(numbersValues, matrixSize);
  prevCoords = null;
  playingContainer.style.pointerEvents = 'none';

  setPositions(matrixValues);

  let playingNewGame = document.createElement('div');
  playingNewGame.classList.add('playing-field__new-game');
  playingNewGame.append(createNewGameButton());
  playingField.append(playingNewGame);
  return playingField;
}

function createSetups() {
  let setups = document.createElement('div');
  setups.classList.add('setup');
  let setupsStats = document.createElement('div');
  setupsStats.classList.add('setup__stats');
  setups.append(setupsStats);
  let setupsSettings = document.createElement('div');
  setupsSettings.classList.add('setup__settings');
  setups.append(setupsSettings);
  let setupTimer = document.createElement('div');
  setupTimer.classList.add('setup__timer');
  setupTimer.innerHTML = `Time: <span class="setup__timer-value">0 : 0</span>`;
  setupsStats.append(setupTimer);
  let setupSteps = document.createElement('div');
  setupSteps.classList.add('setup__steps');
  setupSteps.innerHTML = `Steps: <span class="setup__steps-value">0</span>`;
  setupsStats.append(setupSteps);
  setupsSettings.append(createMusicIcon());
  setupsSettings.append(createSettingsIcon());
  return setups;
}

function createMusicIcon() {
  let music = document.createElement('div');
  music.classList.add('music__icon');
  music.innerHTML = `<svg class="music">
                      <use xlink:href="./images/sprite.svg#music"></use>
                    </svg>`;
  return music;
}

function createSettingsIcon() {
  let settings = document.createElement('div');
  settings.classList.add('param__icon');
  settings.innerHTML = `<svg class="param">
                          <use xlink:href="./images/sprite.svg#setup"></use>
                        </svg>`
  return settings;
}

function createResultPony() {
  let resultPony = document.createElement('div');
  resultPony.classList.add('result-pony');
  resultPony.append(createResultPonyText());
  resultPony.append(createResultPonyImage());
  return resultPony;
}

function createNewGameButton() {
  let newGameButton = document.createElement('button');
  newGameButton.classList.add('button-mix');
  newGameButton.innerText = 'new game';
  return newGameButton;
}

function createResultPonyText() {
  let resultPonyText = document.createElement('div');
  resultPonyText.classList.add('result-pony__text');
  return resultPonyText;
}

function createResultPonyImage() {
  let resultPonyImage = document.createElement('div');
  resultPonyImage.classList.add('result-pony__img');
  resultPonyImage.innerHTML = `<img class="result-pony__pic" src="./images/pony.png" alt="pony">`;
  return resultPonyImage;
}

function createMenuSection() {
  let menuSection = document.createElement('section');
  menuSection.classList.add('section', 'menu');
  let container = document.createElement('div');
  container.classList.add('container', 'menu__container');
  menuSection.append(container);
  container.append(createSaveLoad());
  container.append(createPickSize());
  container.append(createTopResults());
  container.append(createCloseMenu());
  return menuSection;
}

function createSaveLoad() {
  let saveLoad = document.createElement('div');
  saveLoad.classList.add('menu__save');
  let saveBtn = document.createElement('button');
  saveBtn.classList.add('save');
  saveBtn.innerText = 'save';
  saveLoad.append(saveBtn);
  let saveIndicator = document.createElement('div');
  saveIndicator.classList.add('saved');
  saveIndicator.innerText = 'saved';
  saveLoad.append(saveIndicator);
  let loadBtn = document.createElement('button');
  loadBtn.classList.add('load');
  loadBtn.innerText = 'load';
  saveLoad.append(loadBtn);
  return saveLoad;
}

function createPickSize() {
  let newSize = document.createElement('div');
  newSize.classList.add('menu__pick-size');
  let newSizeContainer = document.createElement('div');
  newSizeContainer.classList.add('new-size');
  newSize.append(newSizeContainer);

  for (let i = 3; i < 9; i++) {
    let newSizeBtn = document.createElement('button');
    newSizeBtn.classList.add('new-size__btn');
    newSizeBtn.innerHTML = `${i}x${i}`;
    newSizeBtn.setAttribute(`data-size`, `${i}`);
    newSizeContainer.append(newSizeBtn);
  }

  return newSize;
}

function createTopResults() {
  let topResults = document.createElement('div');
  topResults.classList.add('menu__top');
  let topResultsContainer = document.createElement('div');
  topResultsContainer.classList.add('top-results');
  topResults.append(topResultsContainer);
  let title = document.createElement('div');
  title.classList.add('top-results__title');
  title.innerText = 'Top 10';
  topResultsContainer.append(title);
  let list = document.createElement('ul');
  list.classList.add('top-results__list');
  topResultsContainer.append(list);
  let titleItem = document.createElement('li');
  titleItem.classList.add('top-results__item');
  titleItem.innerHTML = `<div class="top-results__time-now">Date</div>
                         <div class="top-results__steps">Steps</div>
                         <div class="top-results__time">Time</div>`;
  list.append(titleItem);
  return topResults;
}

function createCloseMenu() {
  let closeContainer = document.createElement('div');
  closeContainer.classList.add('menu__close');
  let closeBtn = document.createElement('button');
  closeBtn.classList.add('close-btn');
  closeBtn.innerHTML = `<svg class="close">
                          <use xlink:href="./images/sprite.svg#close"></use>
                        </svg>`;
  closeContainer.append(closeBtn);
  return closeContainer;
}