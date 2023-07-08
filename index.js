const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;
//fill bg black color
c.fillRect(0, 0, canvas.width, canvas.height);

//simulate gravity
const gravity = 0.7;

//background: woods
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: './oak_woods/background/wood.png',
});

//background: shop
const shop = new Sprite({
  position: {
    x: 650,
    y: 186,
  },
  imageSrc: './oak_woods/background/shop_anim.png',
  scale: 2.3,
  framesMax: 6,
});

//player Fighter
const player = new Fighter({
  position: {
    x: 100,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  //for attack box position
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: './oak_woods/samuraiMack/Idle.png',
  scale: 2.5,
  framesMax: 8,
  //for image or idle start position
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: './oak_woods/samuraiMack/Idle.png',
      framesMax: 8,
    },
    run: {
      imageSrc: './oak_woods/samuraiMack/Run.png',
      framesMax: 8,
    },
    jump: {
      imageSrc: './oak_woods/samuraiMack/Jump.png',
      framesMax: 2,
    },
    fall: {
      imageSrc: './oak_woods/samuraiMack/Fall.png',
      framesMax: 2,
    },
    attack1: {
      imageSrc: './oak_woods/samuraiMack/Attack1.png',
      framesMax: 6,
    },
    takeHit: {
      imageSrc: './oak_woods/samuraiMack/Take Hit - white silhouette.png',
      framesMax: 4,
    },
    death: {
      imageSrc: './oak_woods/samuraiMack/Death.png',
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 160,
    height: 50,
  },
});
//enemy Fighter
const enemy = new Fighter({
  position: {
    x: 850,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 50,
    y: 0,
  },
  color: 'blue',
  imageSrc: './oak_woods/kenji/Idle.png',
  scale: 2.5,
  framesMax: 4,
  //for image or idle start position
  offset: {
    x: 215,
    y: 170,
  },
  sprites: {
    idle: {
      imageSrc: './oak_woods/kenji/Idle.png',
      framesMax: 4,
    },
    run: {
      imageSrc: './oak_woods/kenji/Run.png',
      framesMax: 8,
    },
    jump: {
      imageSrc: './oak_woods/kenji/Jump.png',
      framesMax: 2,
    },
    fall: {
      imageSrc: './oak_woods/kenji/Fall.png',
      framesMax: 2,
    },
    attack1: {
      imageSrc: './oak_woods/kenji/Attack1.png',
      framesMax: 4,
    },
    takeHit: {
      imageSrc: './oak_woods/kenji/Take hit.png',
      framesMax: 3,
    },
    death: {
      imageSrc: './oak_woods/kenji/Death.png',
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50,
    },
    width: 170,
    height: 50,
  },
});
//key to use
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
};

decreaseTimer();

/* CREATE ANIMATION LOOP */
function animate() {
  //make function loop forever
  window.requestAnimationFrame(animate);
  //make black canvas draw every frame
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);
  //draw background before characters
  background.update();
  shop.update();
  //give background overlay color make characters stand out
  c.fillStyle = 'rgba(255, 255, 255, 0.15)';
  c.fillRect(0, 0, canvas.width, canvas.height);

  //Fighter update every frame
  player.update();
  enemy.update();

  //make Fighter stop moving while keyup
  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //player movement
  if (keys.a.pressed && player.lastkey === 'a') {
    player.velocity.x = -5;
    //switch image movement
    player.switchSprite('run');
  } else if (keys.d.pressed && player.lastkey === 'd') {
    player.velocity.x = 5;
    player.switchSprite('run');
  } else {
    player.switchSprite('idle');
  }

  //player jump movement
  if (player.velocity.y < 0) {
    player.switchSprite('jump');
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall');
  }

  //enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastkey === 'ArrowLeft') {
    enemy.velocity.x = -5;
    enemy.switchSprite('run');
  } else if (keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight') {
    enemy.velocity.x = 5;
    enemy.switchSprite('run');
  } else {
    enemy.switchSprite('idle');
  }

  //enemy jump movement
  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump');
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall');
  }

  //player attack & enemy get hit
  if (
    rectangularCollision({ rectangule1: player, rectangule2: enemy }) &&
    //attack only happen in specific frame
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit();
    //make attack only hit once
    player.isAttacking = false;

    document.querySelector('#enemyHealth').style.width = enemy.health + '%';
  }

  //if attack miss finish attack
  if (player.isAttacking && player.framesCurrent === 4)
    player.isAttacking = false;

  //enemy attack condition
  if (
    rectangularCollision({ rectangule1: enemy, rectangule2: player }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit();
    enemy.isAttacking = false;

    document.querySelector('#playerHealth').style.width = player.health + '%';
  }

  //if attack miss finish attack
  if (enemy.isAttacking && enemy.framesCurrent === 2) enemy.isAttacking = false;

  //when one of the player health turn 0, but still got time
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

//track keydown
window.addEventListener('keydown', event => {
  if (!player.dead) {
    switch (event.key) {
      /* PLAYER */
      case 'd':
        keys.d.pressed = true;
        player.lastkey = 'd';
        break;
      case 'a':
        keys.a.pressed = true;
        player.lastkey = 'a';
        break;
      case 'w':
        player.velocity.y = -20;
        break;
      case ' ':
        player.attack();
        break;
    }
  }
  if (!enemy.dead) {
    switch (event.key) {
      /* ENEMY */
      case 'ArrowRight':
        keys.ArrowRight.pressed = true;
        enemy.lastkey = 'ArrowRight';
        break;
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true;
        enemy.lastkey = 'ArrowLeft';
        break;
      case 'ArrowUp':
        enemy.velocity.y = -20;
        break;
      case 'ArrowDown':
        enemy.attack();
        break;
    }
  }
});
//track keyup
window.addEventListener('keyup', event => {
  switch (event.key) {
    /* PLAYER */
    case 'd':
      keys.d.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;

    /* ENEMY */
    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      break;
  }
});
