const rollButton = document.getElementById("roll-button");
const restartButton = document.getElementById("restart-button");
const keepDiceInput = document.getElementById("keep-input");
const keepDiceConfirm = document.getElementById("submit-keep-dice");
const scoreInput = document.getElementById("score-input");
const scoreConfirm = document.getElementById("submit-score");
const scoreSheet = document.getElementById("scoresheet");
const radioButtonsScore = document.querySelectorAll('input[name="score"]');
const scoreTotal = document.getElementById("score-grand-total");
const scoreTotalUpper = document.getElementById("score-total-upper");
const endOfGameScreen = document.getElementById("end-of-game-screen");
const diceDiv = document.getElementById("dice");
const scoreMessage = document.getElementById("score-message");
const allRadioButtons = document.getElementsByName("score");
const rollCounter = document.getElementById("roll-counter");

let dice = [];
let rollCount = 1;
let turnCount = 1;
let intervalId;
let selectedField;
let checkboxDice = [];

rollButton.addEventListener("click", rollDice);
restartButton.addEventListener("click", restart);
scoreConfirm.addEventListener("click", chooseField);
keepDiceConfirm.addEventListener("click", () => {
  keepDice();
  increaseRollCount();
});

scoreTotal.innerHTML = 0;
scoreTotalUpper.innerHTML = 0;
rollCounter.innerHTML = `Roll ${rollCount} / 3`;

clearDiceArray();
for (let i = 1; i < 6; i++) {
  checkboxDice.push(document.getElementById(`checkboxDice${i}`));
}
changeDiceImageRandom();

function clearDiceArray() {
  for (let i = 1; i < 6; i++) {
    const diceElement = document.getElementById(`dice${i}`);
    dice.push({ diceElement, keep: false, value: 1 });
    document.getElementById(`checkboxDice${i}`).checked = false;
  }
}

function rollDice() {
  intervalId = setInterval(changeDiceImageRandom, 30);
  setTimeout(() => {
    clearInterval(intervalId);
    endOfRoll();
  }, 1000);
  rollButton.classList.toggle("hidden");
}

function endOfRoll() {
  rollCounter.innerHTML = `Roll ${rollCount} / 3`;
  if (rollCount < 3) keepDiceInput.classList.toggle("hidden");
  if (rollCount === 3) scoreInput.classList.toggle("hidden");
}

function endOfGame() {
  checkBonus();
  endOfGameScreen.classList.toggle("hidden");
  diceDiv.classList.toggle("hidden");
  scoreMessage.innerHTML = `Congratulations or I'm sorry! You've reached ${scoreTotal.innerHTML} points!`;
}

function restart() {
  turnCount = 1;
  rollCount = 1;
  for (let i = 0; i < allRadioButtons.length; i++) {
    allRadioButtons[i].disabled = false;
  }
  const allTableInputs = document.getElementsByClassName("tableInput");
  for (let i = 0; i < allTableInputs.length; i++) {
    allTableInputs[i].innerHTML = "";
  }
  endOfGameScreen.classList.toggle("hidden");
  rollButton.classList.toggle("hidden");
  rollCounter.classList.toggle("hidden");
  diceDiv.classList.toggle("hidden");
  scoreTotal.innerHTML = "0";
  scoreTotalUpper.innerHTML = "0";
  rollCounter.innerHTML = `Roll ${rollCount} / 3`;
  clearDiceArray();
}

function checkBonus() {
  const bonusField = document.getElementById("score-bonus");
  if (parseInt(scoreTotalUpper.innerHTML) >= 63) {
    bonusField.innerHTML = 35;
    scoreTotal.innerHTML = parseInt(scoreTotal.innerHTML) + 35;
    scoreTotalUpper.innerHTML = parseInt(scoreTotalUpper.innerHTML) + 35;
  } else bonusField.innerHTML = 0;
}

function createDiceImage(num) {
  const diceImg = document.createElement("img");
  diceImg.src = `Images/Alea_${num}.png`;
  return diceImg;
}

function keepDice() {
  keepDiceInput.classList.toggle("hidden");
  for (let i = 0; i < checkboxDice.length; i++) {
    if (checkboxDice[i].checked) {
      dice[i].keep = true;
    } else dice[i].keep = false;
  }
  if (rollCount < 3) {
    rollButton.classList.toggle("hidden");
  }
}

function increaseRollCount() {
  rollCount++;
  rollCounter.innerHTML = `Roll ${rollCount} / 3`;
}

function chooseField() {
  rollCounter.classList.toggle("hidden");
  scoreInput.classList.toggle("hidden");
  for (radioButton of radioButtonsScore) {
    if (radioButton.checked) {
      selectedField = radioButton.value;
      radioButton.disabled = true;
    }
  }
  score(selectedField);
  for (let i = 0; i < allRadioButtons.length; i++) {
    if (!allRadioButtons[i].disabled) {
      allRadioButtons[i].checked = true;
      break;
    }
  }
}

function score(str) {
  let scoreField = document.getElementById(`score-${str}`);
  scoreField.innerHTML = evaluate(selectedField);
  scoreTotal.innerHTML =
    parseInt(scoreTotal.innerHTML) + evaluate(selectedField);
  if (
    str === "ones" ||
    str === "twos" ||
    str === "threes" ||
    str === "fours" ||
    str === "fives" ||
    str === "sixes"
  ) {
    scoreTotalUpper.innerHTML =
      parseInt(scoreTotalUpper.innerHTML) + evaluate(selectedField);
  }
  dice = [];
  newRound();
}

function newRound() {
  turnCount++;
  if (turnCount < 14) {
    rollCounter.classList.toggle("hidden");
    rollButton.classList.toggle("hidden");
    clearDiceArray();
    rollCount = 1;
    rollCounter.innerHTML = `Roll ${rollCount} / 3`;
  }
  if (turnCount >= 14) endOfGame();
}

function changeDiceImage(elem, num) {
  const diceImg = createDiceImage(num);
  elem.appendChild(diceImg);
}

function changeDiceImageRandom() {
  dice = dice.map((singleDice) => {
    if (singleDice.keep) return singleDice;
    let randomNum = Math.floor(Math.random() * 6 + 1);
    if (singleDice.diceElement.hasChildNodes()) {
      singleDice.diceElement.innerHTML = "";
    }
    changeDiceImage(singleDice.diceElement, randomNum);
    return { ...singleDice, value: randomNum };
  });
}

function evaluate(str) {
  const diceValues = dice.map((die) => die.value);
  const diceValuesSum = diceValues.reduce((a, b) => {
    return a + b;
  });
  const diceValuesSorted = diceValues.reduce((a, b) => {
    a[b] = (a[b] || 0) + 1;
    return a;
  }, {});
  const diceQuantity = Object.values(diceValuesSorted);

  if (str === "ones") num = 1;
  if (str === "twos") num = 2;
  if (str === "threes") num = 3;
  if (str === "fours") num = 4;
  if (str === "fives") num = 5;
  if (str === "sixes") num = 6;

  if (str === "three-of-a-kind") {
    return diceQuantity.includes(3) ||
      diceQuantity.includes(4) ||
      diceQuantity.includes(5)
      ? diceValuesSum
      : 0;
  }
  if (str === "four-of-a-kind") {
    return diceQuantity.includes(4) || diceQuantity.includes(5)
      ? diceValuesSum
      : 0;
  }
  if (str === "yahtzee") {
    return diceQuantity.includes(5) ? 50 : 0;
  }
  if (str === "chance") return diceValuesSum;
  if (str === "full-house") {
    return diceQuantity.includes(2) && diceQuantity.includes(3) ? 25 : 0;
  }
  if (str === "small-straight") {
    if (
      (diceValues.includes(1) &&
        diceValues.includes(2) &&
        diceValues.includes(3) &&
        diceValues.includes(4)) ||
      (diceValues.includes(2) &&
        diceValues.includes(3) &&
        diceValues.includes(4) &&
        diceValues.includes(5)) ||
      (diceValues.includes(3) &&
        diceValues.includes(4) &&
        diceValues.includes(5) &&
        diceValues.includes(6))
    ) {
      return 30;
    } else return 0;
  }
  if (str === "large-straight") {
    if (
      (diceValues.includes(1) &&
        diceValues.includes(2) &&
        diceValues.includes(3) &&
        diceValues.includes(4) &&
        diceValues.includes(5)) ||
      (diceValues.includes(2) &&
        diceValues.includes(3) &&
        diceValues.includes(4) &&
        diceValues.includes(5) &&
        diceValues.includes(6))
    ) {
      return 40;
    } else return 0;
  }

  let counter = 0;
  for (let i = 0; i < diceValues.length; i++) {
    if (diceValues[i] === num) counter++;
  }
  return counter * num;
}
