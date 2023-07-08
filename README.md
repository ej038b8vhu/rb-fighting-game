# Pixel fighting game

#### practice of OOP 

- [itch](https://itch.io/game-assets)
  - assets collections

- [GSAP](https://github.com/greensock/GSAP?utm_source=cdnjs&utm_medium=cdnjs_link&utm_campaign=cdnjs_library)
  - [GSAP CDN](https://cdnjs.com/libraries/gsap)
  - GSAP is a JavaScript library for building high-performance animations that work in **every** major browser.
  - gsap not apply to extension tab. Use css transition instead
  ```javascript
    //gsap.to(element to have animation, { "what" to animate: way })
    gsap.to('#enemyHealth', {
      width: enemy.health + '%',
    });
  ```