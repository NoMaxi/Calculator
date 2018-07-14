/* jshint esversion: 6 */
const btnPower = document.querySelector('.btn-power');
const btnReset = document.querySelector('.btn-reset');
const btnDelete = document.querySelector('.btn-delete');
const btnsDigits = document.querySelectorAll('.btn-digit');
const btnsOperators = document.querySelectorAll('.btn-operator:not(.btn-equal):not(.btn-percent)');
const inputField = document.querySelector('.screen-input');
const outputField = document.querySelector('.screen-output');
const btnPercent = document.querySelector('.btn-percent');
const btnEqual = document.querySelector('.btn-equal');
let inputString = inputField.firstChild;
let outputString = outputField.firstChild;

// Включение / выключение "питания" калькулятор
btnPower.addEventListener('click', () => {
  if (inputString.innerHTML.length == 0) {
    inputString.innerHTML = 0;
    outputString.innerHTML = 0;
  } else {
    inputString.innerHTML = '';
    outputString.innerHTML = '';
  }
});

// Событие сброса вводной строки и строки вывода до 0 - клавиша 'CE'
btnReset.addEventListener('click', () => {
  if (inputString.innerHTML.length > 0) {
    inputString.innerHTML = 0;
    outputString.innerHTML = 0;
  }
});

// Событие удаления 1 символа - клавиша 'DEL'
btnDelete.addEventListener('click', () => {
  if (inputString.innerHTML.length > 1) {
    inputString.innerHTML = inputString.innerHTML.slice(0, -1);
  } else {
    inputString.innerHTML = 0;
  }
});

// Событие нажатия на клавиши цифр - формирование вводной строки

btnsDigits.forEach(el => el.addEventListener('click', () => {
	if (inputString.innerHTML.length > 0) {
    if (/^0/.test(inputString.innerHTML)) {
      inputString.innerHTML = inputString.innerHTML.slice(1);
    }
    inputString.innerHTML += el.firstChild.innerHTML;
  }
}))

// Событие нажатия на клавиши вычитания, деления, сложения и умножения - формирование вводной строки
btnsOperators.forEach(el => el.addEventListener('click', () => {
  if (inputString.innerHTML.length > 0 && !/\u221a$/.test(inputString.innerHTML)) {
  	// Обрезка последнего значения вводной строки, если это оператор
    if (/[\u2212\u00f7\u002b\u00d7]$/.test(inputString.innerHTML) && !/\u221a/.test(el.firstChild.innerHTML)) {
    	inputString.innerHTML = inputString.innerHTML.slice(0, -1);
  	}
    inputString.innerHTML += el.firstChild.innerHTML;
  }
}));

// Событие обработки процентов - клавиша '%'
btnPercent.addEventListener('click', () => {
  inputString.innerHTML = replacePercent(inputString.innerHTML);
});

// Событие отображения результата расчета в строке вывода - клавиша '='
btnEqual.addEventListener('click', () => {
  if (inputStringEval(outputString.innerHTML) == inputStringEval(inputString.innerHTML)) {
    inputString.innerHTML = outputString.innerHTML;   // Перенос результата расчёта во вводную строку при повторном нажатии клавиши '='
  }
  outputString.innerHTML = calcErrorCheck(inputStringEval(inputString.innerHTML));
});

// Функция замены знаков сложения, вычитатния, деления и умножения
replaceOperators = (str) => {
   const replacedOperatorsString = str.replace(/\u2212/g, '-').replace(/\u00f7/g, '/')
   .replace(/\u002b/g, '+').replace(/\u00d7/g, '*');
   return replacedOperatorsString;
};

// Функция замены знака кв.корня на Math.sqrt()
replaceRadic = (str) => {
  if (str.includes('\u221a')) {
    const radicMatchArray = str.match(/\u221a\d*\.*\d*/g).map(el => el.slice(1));
    const replacedRadicString = str.split(/\u221a\d*\.*\d*/).map((el, i, array) => {
      return el.concat(i == array.length - 1 ? '' : 'Math.sqrt(' + radicMatchArray[i] + ')');
    }).join('');
    return replacedRadicString;
  } else {
    return str;
  }
};

// Функция обработки знака процентов
replacePercent = (str) => {
  const percentNumber = str.match(/\d*\.*\d*$/)[0];
  const unReplacedStringPart = str.split(/\d*\.*\d*$/)[0];
  const replacedStringPart = (eval(unReplacedStringPart.slice(0, -1)) * percentNumber / 100).toString(10);
  const replacedPercentString = unReplacedStringPart + replacedStringPart;
  return replacedPercentString;
};

consecutiveOperatorsReplace = (str, operator) => {
	if (/[\u2212\u00f7\u002b\u00d7]$/.test(str)) {
    	inputString.innerHTML.replace(/[\u2212\u00f7\u002b\u00d7]$/, operator);
  }
};

// Функция формирования итоговой вводной строки
inputStringPrepare = (str) => {
  return replaceRadic(replaceOperators(str));
};

inputStringEval = (str) => {
  return eval(inputStringPrepare(str));
};

// Функция проверки результата расчёта на ошибки
calcErrorCheck = (evalResult) => {
  if (isNaN(evalResult)) {
  	console.log('ERROR: Invalid input');
    outputString.style.color = '#FF0000FF';
    return 'ERROR: Invalid input';
  }
  switch (evalResult) {
    case Infinity:
      console.log('ERROR: Cannot divide by zero');
      outputString.style.color = '#FF0000FF';
      return 'ERROR: Cannot divide by zero';
      break;
    case undefined || null:
      console.log('ERROR: Invalid input');
      outputString.style.color = '#FF0000FF';
      return 'ERROR: Invalid input';
      break;
    default:
      console.log('No calculation errors detected');
      return evalResult;
      break;
  }
}
