var CLASS_NAME_SCORE_BOX_PARENT = 'GPRP-score-box-parent';
var CLASS_NAME_SCORE_BOX = 'GPRP-score-box';
var ID_NAME_TOTAL_RATINGS = 'GPRP-total-ratings';
var ID_NAME_TOTAL_RATINGS_WITH_REVIEWS = 'GPRP-total-ratings-with-reviews';

// from '3,000' to 3000
function atoi (a) {
  return parseInt(a.split(',').join('').trim());
}

function addClass (element, className) {
  if (!element.classList.contains(className)) {
    element.classList.add(className);
  }
}

function addId (element, idName) {
  element.id = idName;
}

function getElementWithText (root, tag, text) {
  var candidates = root.querySelectorAll(tag);
  for (var i = 0, l = candidates.length; i < l; i++) {
    var candidate = candidates[i];
    if (candidate.textContent.trim() === text) {
      return candidate;
    }
  }
}

function getElementsWithText (root, tag, text) {
  var elements = [];
  var candidates = root.querySelectorAll(tag);
  for (var i = 0, l = candidates.length; i < l; i++) {
    var candidate = candidates[i];
    if (candidate.textContent.trim() === text) {
      elements.push(candidate);
    }
  }
  return elements;
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
  return getElementWithText(document, 'div', score2fixed);
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

function updateScoreAndStyle (score) {
  var score4fixed = score.toFixed(4);
  var styleText = [
    '.' + CLASS_NAME_SCORE_BOX_PARENT + '{',
    '  width: 200px;',
    '}',
    '.' + CLASS_NAME_SCORE_BOX + ' {',
    '  position: relative;',
    '}',
    '.' + CLASS_NAME_SCORE_BOX + ':after {',
    '  content: "' + score4fixed + '";',
    '  position: absolute;',
    '  top: 0;',
    '  left: 0;',
    '  background: white;',
    '}',
    '.' + CLASS_NAME_SCORE_BOX_PARENT + ':hover .' + CLASS_NAME_SCORE_BOX + ':after {',
    '  display: none;',
    '}',
    '#' + ID_NAME_TOTAL_RATINGS + '{',
    '  width: 50%;',
    '  float: left;',
    '  border-bottom: none;',
    '}',
    '#' + ID_NAME_TOTAL_RATINGS_WITH_REVIEWS + '{',
    '  width: 50%;',
    '  float: left;',
    '  padding-top: 0;',
    '  padding-bottom: 15px;',
    '  padding-left: 15px;',
    '  border-left: 1px solid #ddd;',
    '}'
  ].join('');

  var style = document.createElement('style');
  style.appendChild(document.createTextNode(styleText));
  document.body.appendChild(style);
}

function precise() {
  // calculate score
  var scoreInfoList = getScoreInfoList();
  var score = calcPreciseScore(scoreInfoList);

  // update score
  updateScoreAndStyle(score);
  var scoreElement = getScoreElement(score);
  addClass(scoreElement, CLASS_NAME_SCORE_BOX);
  addClass(scoreElement.parentElement, CLASS_NAME_SCORE_BOX_PARENT);
  var overviewElement = scoreElement.parentElement.parentElement;
  var totalRatingsElement = getElementWithText(overviewElement, 'div', 'Total Ratings');
  var totalRatingsWRElement = getElementWithText(overviewElement, 'div', 'Total Ratings with Reviews');
  addId(totalRatingsElement.parentElement, ID_NAME_TOTAL_RATINGS);
  addId(totalRatingsWRElement.parentElement, ID_NAME_TOTAL_RATINGS_WITH_REVIEWS);
}

function openReviews (lang) {
  var targetText = 'Auto-translated from ' + lang;
  var elements = getElementsWithText(document, 'a', targetText);
  for (var i = 0, l = elements.length; i < l; i++) {
    var element = elements[i];
    element.nextElementSibling.click();
  }
}

function isCorrectURL () {
  return window.location.hash.startsWith('#ReviewsPlace');
}

function isLoaded () {
  var scoreInfoList = getScoreInfoList();
  return scoreInfoList.length === 5;
}

// main funciton
(function () {
  function polish () {
    if (!isCorrectURL()) {
      return;
    }

    if (!isLoaded()) {
      requestAnimationFrame(polish);
      return;
    }

    // show precise review score
    precise();
    // open reviews
    openReviews('Japanese');
  }

  window.onhashchange = function () {
    polish();
  };
  polish();
})();
