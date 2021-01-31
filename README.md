# Four Connect with Angular Animation and HTML & CSS only

Hey guys, here I created a simple four Connect game with Angular - Animations (Angular CLI version 11.1.1)

### Start game

Just go to the project folder and type `ng serve`. Navigate to `http://localhost:4200/` and have fun.

### Animations

I use angular-animations for the movement of the circles. There are two `triggers` defined. One for moving the circles and the other one for hiding the containers. The hop effect is defined by the keyframe which just translate the position of the circle on the y-axes. Since Im̀ not familiar with `dynamic components` in Angular I used a simple trick to put the circles in the holes.
Instead of adding new circles dynamically to the html DOM I created on top of each column six circles which are not visible on the initial state. By clicking on one column a click event will triggered which takes the first circle object on the corresponding column to change its state. By changing the state the circle will be visible with the correct color.

