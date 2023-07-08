const timerBtn = document.querySelector('#timer');

//reload get new game
timerBtn.addEventListener('click', () => {
  //start new game for browser
  if (!+timerBtn.innerHTML) history.go(0); // or "/"" to reload current page

  //extension tab refresh
  chrome.tabs?.reload(tabs[0].url);
});

//detect attack range & detect for collision
function rectangularCollision({ rectangule1, rectangule2 }) {
  return (
    rectangule1.attackBox.position.x + rectangule1.attackBox.width >=
      rectangule2.position.x &&
    rectangule1.attackBox.position.x <=
      rectangule2.position.x + rectangule2.width &&
    rectangule1.attackBox.position.y + rectangule1.attackBox.height >=
      rectangule2.position.y &&
    rectangule1.attackBox.position.y <=
      rectangule2.position.y + rectangule2.height
  );
}

//determin winner
function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);

  const displayText = document.querySelector('#displayText');

  displayText.style.display = 'flex';
  if (player.health === enemy.health) {
    displayText.innerHTML = 'Tie';
  } else if (player.health > enemy.health) {
    displayText.innerHTML = 'Player 1 wins';
  } else if (enemy.health > player.health) {
    displayText.innerHTML = 'Player 2 wins';
  }

  if (displayText.innerHTML) {
    timerBtn.style.fontSize = '.7em';
    timerBtn.style.cursor = 'pointer';
    timerBtn.style.backgroundColor = 'rgba(100, 0, 0, .5)';
    timerBtn.innerHTML = `New
    Game`;
  }
}

//game timerd
let timer = 60;
let timerId;
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector('#timer').innerHTML = timer;
  }
  if (timer === 0) {
    determineWinner({ player, enemy, timerId });
  }
}
