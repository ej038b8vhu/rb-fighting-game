class Sprite {
  //constructor fire every time when create a new instance
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.timer = document.querySelector('#timer').innerHTML;
    //for crop image, shop image have 6 same part, framesMax = 6
    this.framesMax = framesMax;
    //current frame
    this.framesCurrent = 0;
    //how many frames current elapsed over, keep increasing
    this.framesElapsed = 0;
    //how many frames shold go through before change frameCurrent animation
    this.framesHold = 10;
    //for adjust image position offset purpose
    this.offset = offset;
  }
  //draw a background
  draw() {
    c.drawImage(
      this.image,
      //crop image x, y, width, height for both wood & shop
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax, //cut image to 1 / 6
      this.image.height,
      //image position
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      //image width & height
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }

  //
  animateFrames() {
    //every animation() update image and:
    this.framesElapsed++;
    //let animation effect slow down
    if (this.framesElapsed % this.framesHold === 0) {
      //for background shop loop purpose
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }

  //update screen every frame
  update() {
    this.draw();
    this.animateFrames();
  }
}

//inherit Sprite, if same method show in both class, Fighter overwrite it.
class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = 'red',
    sprites, //for a instance has many image source to switch
    //get from paraent
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    attackBox = { offset: {}, width: undefined, height: undefined },
  }) {
    //super() call parent's constructort
    super({
      // inherit property from  parent, those have to be in parent's constructor
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
    });

    this.velocity = velocity; //speed
    this.width = 50;
    this.height = 150;
    this.lastkey; //track the lastkey user press
    //Fighter attack range
    this.attackBox = {
      position: {
        //** this won't have shallow copy of Fighter position
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
    //take property from parent
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 10;
    //make different Fighter image have right image source
    this.sprites = sprites;
    this.dead = false;
    for (let sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }
  //draw a square shape for start
  /* draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
    //only draw attack box while attack
    if (this.isAttacking) {
      c.fillStyle = 'green';
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  } */
  //update screen every frame
  update() {
    this.draw();
    //use parent function directly
    //if dead no longer run animateFrames
    if (!this.dead) this.animateFrames();
    //** make attackBox.position === this.position
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
    //velocity only increase by gravity or control jump movement
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    //Fighter falling down effct condition
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      //stop falling down
      this.velocity.y = 0;
      //make idle falling down touch ground smoothly
      this.position.y = 330; //ground height
    } else {
      //y direction affect by gravity
      this.velocity.y += gravity;
    }
  }
  //attack time
  attack() {
    this.switchSprite('attack1');
    this.isAttacking = true;
  }

  //get hit
  takeHit() {
    //prevent time === 0 attack
    if (+timer) this.health -= 20;

    //is death?
    if (this.health <= 0) {
      this.switchSprite('death');
    } else {
      this.switchSprite('takeHit');
    }
  }

  //resposible for switch between different sprite & overriding any other animationa with the attack  animation
  switchSprite(sprite) {
    //override when fighter dead
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.framesMax - 1) {
        this.dead = true;
      }
      return;
    }

    if (
      //let attack1 only run once then back to idle
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.framesMax - 1
    )
      return;

    //override when fighter get hit
    if (
      this.image == this.sprites.takeHit.image &&
      this.framesCurrent < this.sprites.takeHit.framesMax - 1
    )
      return;

    switch (sprite) {
      case 'idle':
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          //make flash disapear
          this.framesCurrent = 0;
        }
        break;
      case 'run':
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'jump':
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'fall':
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.framesCurrent = 0;
        }
      case 'attack1':
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.framesMax = this.sprites.attack1.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'takeHit':
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.framesMax = this.sprites.takeHit.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'death':
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.framesMax = this.sprites.death.framesMax;
          this.framesCurrent = 0;
        }
        break;
    }
  }
}
