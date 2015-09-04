var SCORE_BOX_CLASS_NAME = 'GPRP-score-box';

// from '3,000' to 3000
function atoi (a) {
  return parseInt(a.split(',').join('').trim());
}

function addClass(element, className) {
  if (!element.classList.contains(className)) {
    element.classList.add(className);
  }
}

function getScoreInfoList () {
  var scoreInfoList = [];
  var numberList = document.querySelectorAll('[title="The number of ratings made."]');
  for (var i = 0, l = numberList.length; i < l; i++) {
    scoreInfoList.push({
      number: atoi(numberList[i].textContent),
      score: l - i
    });
  }
  return scoreInfoList;
}

function getScoreElement (score) {
  var score2fixed = score.toFixed(2);
  var candidates = document.querySelectorAll('div');
  for (var i = 0, l = candidates.length; i < l; i++) {
    var candidate = candidates[i];
    if (candidate.textContent === score2fixed) {
      return candidate;
    }
  }
}

function calcPreciseScore (scoreInfoList) {
  var sumScore = 0, sumNumber = 0;
  for (var i = 0, l = scoreInfoList.length; i < l; i++) {
    var scoreInfo = scoreInfoList[i];
    sumScore += scoreInfo.score * scoreInfo.number;
    sumNumber += scoreInfo.number;
  }
  return sumScore / sumNumber;
}

function updateScore (element, score) {
  var score4fixed = score.toFixed(4);
  element.textContent = score4fixed;
}

function precise() {
  // check the page url
  if (!window.location.hash.startsWith('#ReviewsPlace')) {
    return;
  }

  // check the loding state
  var scoreInfoList = getScoreInfoList();
  if (scoreInfoList.length !== 5) {
    requestAnimationFrame(precise);
    return;
  }

  // calculate score
  var score = calcPreciseScore(scoreInfoList);

  // update score
  var scoreElement = getScoreElement(score);
  updateScore(scoreElement, score);
  addClass(scoreElement.parentElement, SCORE_BOX_CLASS_NAME);
}

window.onhashchange = function () {
  precise();
};
precise();

// set style (widen width of score box)
var style = document.createElement('style');
style.appendChild(document.createTextNode('.' + SCORE_BOX_CLASS_NAME + ' { width: 200px; }'));
document.body.appendChild(style);
