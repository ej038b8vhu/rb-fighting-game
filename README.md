# Pixel fighting game

#### Practice OOP 

![fighting](https://github.com/ej038b8vhu/rb-fighting-game/assets/97674389/74f7acba-578d-43d2-8951-9b4add43b346)




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
