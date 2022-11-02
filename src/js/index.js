const gameField = document.querySelector('.playing-field__container');
const sizeButtons = document.querySelectorAll('.new-size__btn');

sizeButtons.forEach(item => {
  let size = Number(item.dataset.size)
  item.addEventListener('click', () => createCellsList(size))
})

let createCellsList = (size) => {
  gameField.innerHTML = '';
  let itemsCount = size ** 2;
  let cellSize = Math.floor(100/size); 

  for (let i = 0; i < itemsCount; i++) {
    let newButton = createCell(i+1, cellSize);
    gameField.append(newButton)
  }

  let hideChilds = gameField.querySelectorAll('.number-button');
  hideChilds[hideChilds.length-1].style.opacity = '0';
  hideChilds[hideChilds.length-1].classList.add('dropzone');

  gameNumbers = Array.from(gameField.querySelectorAll('.number-button'));
  numbersCounter = gameNumbers.length;
  emptyItemValue = numbersCounter;
  numbersValues = gameNumbers.map(item => Number(item.innerHTML));
  matrixSize = getMatrixSize(numbersCounter);
  matrixValues = getMatrixValues(numbersValues, matrixSize);
  prevCoords = null;
  gameField.style.pointerEvents = 'none';
  closeMenu();
  clearInterval(timer);
  timeObj.value = 0;
  timeText.innerHTML = `${0} : ${0}`;
  stepsCounter = 0;
  stepText.innerHTML = `${stepsCounter}`;
  setPositions(matrixValues);

  dropzone = gameNumbers[gameNumbers.length-1]
  gameField.addEventListener('dragstart', event => dragItem(event));
  dropzone.addEventListener('dragover', event => dragOver(event));
  dropzone.addEventListener('drop', event => dropItem(event))
}

function createCell(value, size) {
  let button = document.createElement('button');
  button.classList.add('number-button');
  button.setAttribute('draggable', 'true');
  button.innerHTML = `${value}`;
  button.style.width = `${size}%`;
  button.style.height = `${size}%`;
  return button
}


let gameNumbers = Array.from(gameField.querySelectorAll('.number-button'));

let numbersCounter = gameNumbers.length;
let emptyItemValue = numbersCounter;
let numbersValues = gameNumbers.map(item => Number(item.innerHTML));

let getMatrixSize = (values) => Math.sqrt(values)

function getMatrixValues(values, size) {
  let matrix = new Array(size);
  
  for (let i = 0; i < matrix.length; i++) {
    let newArray = new Array(size);
    matrix[i] = newArray;
  }
  
  let x = 0;
  let y = 0;
  for (let i = 0; i < values.length; i++) {
    if (x >= size) {
      y++;
      x = 0;
    }
    matrix[y][x] = values[i];
    x++;
  }

  return matrix;
}

let matrixSize = getMatrixSize(numbersCounter);
let matrixValues = getMatrixValues(numbersValues, matrixSize);

function setItemPosition(item, x, y) {
  const shiftPosition = 100;
  item.style.transform = `translate(${x*shiftPosition}%, ${y*shiftPosition}%)`;
}

function setPositions(matrix) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix.length; x++) {
      let value = matrix[y][x];
      let item = gameNumbers[value - 1];
      setItemPosition(item, x, y);
    }
  }
}

setPositions(matrixValues);
gameNumbers[numbersCounter - 1].style.opacity = '0';
gameNumbers[numbersCounter - 1].classList.add('dropzone');


// // перемешать

let mixBtn = document.querySelector('.button-mix');


mixBtn.addEventListener('click', () => mixItems());

let mixItems = () => {

  let iterations = 50 * getMatrixSize(numbersCounter);
  for (let i = 0; i < iterations; i++) {
    swapRandomValidCell(matrixValues);
  } 
  gameField.style.pointerEvents = 'auto';
  setPositions(matrixValues);
  clearInterval(timer)
  timeObj.value = 0;
  stepsCounter = 0;
  timeText.innerHTML = `0 : 0`;
  stepText.innerHTML = `0`;
  stopwatch();
}

let prevCoords;

let swapRandomValidCell = (matrix) => {
  let validArray = pickValidItems(prevCoords);
  let swapValue = validArray[Math.floor(Math.random() * validArray.length)];
  let swapCoords = findCoodsByItem(swapValue, matrix);
  let emptyCoords = findCoodsByItem(emptyItemValue, matrix);
  swapItems(swapCoords, emptyCoords, matrix);
  prevCoords = emptyCoords;
}


// перемещение кнопок

gameField.addEventListener('click', (event) => moveItem(event));

let moveItem = (event) => {
  const pickedButton = event.target.closest('.number-button');
  if (!pickedButton) return

  let pickedButtonValue = Number(pickedButton.innerHTML);
  let pickedButtonCoords = findCoodsByItem(pickedButtonValue, matrixValues);
  let emptyButtonCoords = findCoodsByItem(emptyItemValue, matrixValues);
  let isValid = swapValidation(pickedButtonCoords, emptyButtonCoords);
  
  if (isValid) {
    stepsCounter++;
    swapItems(pickedButtonCoords, emptyButtonCoords, matrixValues);
    stepText.innerHTML = `${stepsCounter}`;
    audio.play();
  } else {
    flashValid();
  } 
}

let flashValid = () => {
  let flashArray = pickValidItems();
  flashArray.forEach(item => {
    // gameNumbers[item - 1].classList.remove('number-button--green');
    gameNumbers[item - 1].classList.add('number-button--green');
    setTimeout(() => gameNumbers[item - 1].classList.remove('number-button--green'), 2500);
  })
}

let findCoodsByItem = (itemValue, matrix) => {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix.length; x++) {
      if (matrix[y][x] == itemValue) {
        return {x , y}
      }
    }
  }
}

let swapValidation = (coordsItem, coordsEpmty = findCoodsByItem(emptyItemValue, matrixValues)) => {
   let diffX = Math.abs(coordsEpmty.x - coordsItem.x);
   let diffY = Math.abs(coordsEpmty.y - coordsItem.y);
   return (diffX == 1 || diffY == 1) && (coordsEpmty.x == coordsItem.x || coordsEpmty.y == coordsItem.y)
}

let swapItems = (coords1, coords2, matrix) => {
  let tmpBuffer = matrix[coords1.y][coords1.x];
  matrix[coords1.y][coords1.x] = matrix[coords2.y][coords2.x];
  matrix[coords2.y][coords2.x] = tmpBuffer;
  setPositions(matrix);

  if (isWin(matrix)) {
    flashWin();
    validateTopResult(stepsCounter, timeObj);
    showResult();
    gameField.style.pointerEvents = 'none';
    clearInterval(timer);
  }
}


let getWinCombination = () => new Array(matrixValues.flat().length).fill(0).map((item, index) => index + 1);

let isWin = (matrix) => {
  let winComb = getWinCombination();
  let currentComb = matrix.flat();

  for (let i = 0; i < winComb.length; i++) {
    if (winComb[i] !== currentComb[i]) {
      return false
    }
  }
  return true
}

let flashWin = () => {
  let flashItems = gameField.querySelectorAll('.number-button');
  setTimeout(() => flashItems.forEach(elem => elem.classList.add('number-button--green')), 200);
  setTimeout(() => flashItems.forEach(elem => elem.classList.remove('number-button--green')), 2000);
}

let pickValidItems = (ignoreCoords) => {
  let emptyCoords = findCoodsByItem(emptyItemValue, matrixValues);
  let validArray = [];

  if (!ignoreCoords) {
    if (matrixValues[emptyCoords.y+1]) validArray.push(matrixValues[emptyCoords.y+1][emptyCoords.x])
    if (matrixValues[emptyCoords.y-1]) validArray.push(matrixValues[emptyCoords.y-1][emptyCoords.x])
    if (matrixValues[emptyCoords.x+1]) validArray.push(matrixValues[emptyCoords.y][emptyCoords.x+1])
    if (matrixValues[emptyCoords.x-1]) validArray.push(matrixValues[emptyCoords.y][emptyCoords.x-1])
  } else {

    if (matrixValues[emptyCoords.y+1] && (
      matrixValues[emptyCoords.y+1][emptyCoords.x] != matrixValues[ignoreCoords.y][ignoreCoords.x]
    )) validArray.push(matrixValues[emptyCoords.y+1][emptyCoords.x])

    if (matrixValues[emptyCoords.y-1] && (
      matrixValues[emptyCoords.y-1][emptyCoords.x] != matrixValues[ignoreCoords.y][ignoreCoords.x]
    )) validArray.push(matrixValues[emptyCoords.y-1][emptyCoords.x])

    if (matrixValues[emptyCoords.x+1] && (
      matrixValues[emptyCoords.y][emptyCoords.x+1] != matrixValues[ignoreCoords.y][ignoreCoords.x]
    )) validArray.push(matrixValues[emptyCoords.y][emptyCoords.x+1])
    
    if (matrixValues[emptyCoords.x-1] && (
      matrixValues[emptyCoords.y][emptyCoords.x-1] != matrixValues[ignoreCoords.y][ignoreCoords.x]
    )) validArray.push(matrixValues[emptyCoords.y][emptyCoords.x-1])
  }

  return validArray
}


// //статистика и результаты

let resultFlag = 1;
let showResult = () => {
  let result = document.querySelector('.result-pony');
  let textResult = result.querySelector('.result-pony__text');
  let targetTranslate = 1000 * resultFlag;
  textResult.innerHTML = `Hooray! You solved the puzzle<br>in ${timeObj.min} : ${timeObj.sec} and ${stepsCounter} moves`
  result.style.transform = `translateX(${0})`;
  setTimeout(() => {
    result.style.transform = `translateX(${targetTranslate}%)`
    timeObj.value = 0;
    stepsCounter = 0;
    timeText.innerHTML = `0 : 0`;
    stepText.innerHTML = `0`;
  }, 5000)
  resultFlag = resultFlag * (-1)
}

let timeObj = {
  value: 0,
  sec: 0,
  min: 0
};

let stepsCounter = 0;
let timer;

let stopwatch = () => {
  timer = setInterval(() => {
    timeObj.sec = timeObj.value % 60;
    timeObj.min = Math.trunc(timeObj.value / 60 % 60);
    timeText.innerHTML = `${timeObj.min} : ${timeObj.sec}`;
    timeObj.value++;
  }, 1000);
}


let timeText = document.querySelector('.setup__timer-value');
let stepText = document.querySelector('.setup__steps-value');

let audio = new Audio();
audio.src = './images/mixkit-plastic-bubble-click-1124.wav';

let muteSound = document.querySelector('.music');

muteSound.addEventListener('click', () => {
  if (muteSound.classList.contains('music--mute')) {
    muteSound.classList.remove('music--mute');
    audio.volume = 1;
  } else {
    muteSound.classList.add('music--mute');
    audio.volume = 0;
  }
})

let closeBtn = document.querySelector('.close-btn');
let overlay = document.querySelector('.menu');
let openButton = document.querySelector('.param__icon');

closeBtn.addEventListener('click', () => closeMenu());

let closeMenu = () => {
  overlay.style.transform = `translateY(${-100}%)`;
  if (timeObj.value > 0) stopwatch();
}

openButton.addEventListener('click', () => openMenu());

let openMenu = () => {
  overlay.style.transform = `translateY(${0}%)`;
  clearInterval(timer);
}

let topList = document.querySelector('.top-results__list');

let addNewTopNote = (steps, time) => {
  let date = new Date();
  let resultItem = document.createElement('div');
  resultItem.classList.add('top-results__item');
  let dateNow = document.createElement('div');
  dateNow.classList.add('top-results__time-now');
  dateNow.innerText = `${date.getHours()}:${date.getMinutes()} ${date.getDate()}.${date.getMonth() + 1}`;
  let stepsResult = document.createElement('div');
  stepsResult.classList.add('top-results__steps');
  stepsResult.innerText = `${steps}`;
  let timeResult = document.createElement('div');
  timeResult.classList.add('top-results__time');
  timeResult.innerText = `${time.min} : ${time.sec}`

  resultItem.append(dateNow, stepsResult, timeResult);

  return resultItem;
}

let sortResults = () => {
  let itemsList = [...document.querySelectorAll('.top-results__item')]
  itemsList.shift();
  itemsList.sort((a,b) => {
    if (Number(a.querySelector('.top-results__steps').innerHTML) > Number(b.querySelector('.top-results__steps').innerHTML)) {
      return 1;
    }
    if (Number(a.querySelector('.top-results__steps').innerHTML) < Number(b.querySelector('.top-results__steps').innerHTML)) {
      return -1;
    }
    return 0;
  });
  topList.innerHTML = `<li class="top-results__item">
  <div class="top-results__time-now">Date</div>
  <div class="top-results__steps">Steps</div>
  <div class="top-results__time">Time</div>
  </li>`;
  itemsList.forEach(elem => topList.append(elem))
}

let saveTopResult = () => {
  let data = localStorage.getItem('topResults');
  if (data) localStorage.removeItem('topResults');
  data = topList.innerHTML;
  localStorage.setItem('topResults', data)
}

let loadTopResults = () => {
  let data = localStorage.getItem('topResults');
  if (data) topList.innerHTML = `${data}`
}

loadTopResults();

let validateTopResult = (steps, time) => {
  let resultList = [...document.querySelectorAll('.top-results__steps')];
  resultList.shift();
  resultList = resultList.map(elem => Number(elem.innerHTML))
  if (resultList.length < 10) {
    topList.append(addNewTopNote(steps, time));
    sortResults();
    saveTopResult();
  } else {
    topList.append(addNewTopNote(steps, time));
    sortResults();
    let removeList = document.querySelectorAll('.top-results__item');
    removeList[removeList.length-1].remove();
    saveTopResult();
  }
}

let saveBtn = document.querySelector('.save');
let saved = document.querySelector('.saved');
let load = document.querySelector('.load')

saveBtn.addEventListener('click', () => saveResult());

let saveResult = () => {
  saved.style.opacity = '1';
  setTimeout(() => saved.style.opacity = '0', 2000);

  let data = {
    matrixSize: matrixSize,
    matrixValues: matrixValues,
    timeObj: timeObj,
    stepsCounter: stepsCounter
  }
  localStorage.setItem('game', JSON.stringify(data))
}

load.addEventListener('click', () => loadGame());

let loadGame = () => {
  let storage = localStorage.getItem('game');
  let data = JSON.parse(storage);
  if (storage) {
    createCellsList(data.matrixSize);
    setPositions(data.matrixValues);
    matrixValues = data.matrixValues;
    stepText.innerHTML = `${data.stepsCounter}`;
    stepsCounter = data.stepsCounter;
    timeText.innerHTML = `${data.timeObj.min} : ${data.timeObj.sec}`;
    clearInterval(timer);
    timeObj.value = data.timeObj.value
    stopwatch();
    gameField.style.pointerEvents = 'auto';
    overlay.style.transform = `translateY(${-100}%)`;
  }
}

// // drag

let dropzone = gameNumbers[gameNumbers.length-1];

// нативный drag
gameField.addEventListener('dragstart', event => dragItem(event));
dropzone.addEventListener('dragover', event => dragOver(event));
dropzone.addEventListener('drop', event => dropItem(event))

let dragItem = (event) => {
  let data = event.target.innerHTML;
  event.dataTransfer.setData("value", data);
}

let dragOver = (event) => {
  event.preventDefault();
}

let dropItem = (event) => {
  let dropValue = event.dataTransfer.getData("value");

  let pickedButtonValue = Number(dropValue);
  let pickedButtonCoords = findCoodsByItem(pickedButtonValue, matrixValues);
  let emptyButtonCoords = findCoodsByItem(emptyItemValue, matrixValues);
  let isValid = swapValidation(pickedButtonCoords, emptyButtonCoords);
  
  if (isValid) {
    stepsCounter++;
    swapItems(pickedButtonCoords, emptyButtonCoords, matrixValues);
    stepText.innerHTML = `${stepsCounter}`;
    audio.play();
  } else {
    flashValid();
  } 
}