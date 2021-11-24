// Variables decalred as constants at the beginning
const resetButton = document.querySelector('.reset');
const boardBorder = 'black';
const boardBackground = "white";
const snakeColour = 'lightgreen';
const snakeBorder = 'green';


// Starting position of the snake 
let snake = [
{x: 200, y: 200},
{x: 190, y: 200},
{x: 180, y: 200},
{x: 170, y: 200},
{x: 160, y: 200}
]

let score = 0;
let liveGame = true;

// True if direction changes
let changingDirection = false;
// Food variables
let food_x;
let food_y;
// Velocity
let dx = 20;
let dy = 0;


// Get the canvas element
// Returns a two dimensional drawing context
const snakeboard = document.getElementById("snakeboard");
const snakeboard_ctx = snakeboard.getContext("2d");


// Start game, inintialize functions
genFood();
main();
document.addEventListener("keydown", changeDirection);

// Main function 
function main() {
  changingDirection = false;

  setTimeout(function onTick() {
    if (gameOver()){
      alert("You lost! Press reset to try again");
      return;
    }

    clearBoard();
    drawSnake();
    drawFood();
    snakeMovement();

    // Repeat
    main();
  }, 100)
}

/* Reset button for the game
-Resets score
-Redraws the snake from starting position
-Generates food
-Runs main again
*/
resetButton.addEventListener('click', () => {
  liveGame = true;
  score = 0;
  document.getElementById('score').innerHTML = score;
  dx = 20;
  dy = 0;
  clearBoard(); 
  snake = [
  {x: 200, y: 200},
  {x: 190, y: 200},
  {x: 180, y: 200},
  {x: 170, y: 200},
  {x: 160, y: 200}
  ]
  genFood();  
  main();
});


// Draw a border around the canvas
// Essentially draws a new border/background on top of the current one
function clearBoard() {
  snakeboard_ctx.fillStyle = boardBackground;
  snakeboard_ctx.strokestyle = boardBorder;
  snakeboard_ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);
  snakeboard_ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
}

// Draw the snake on the canvas
// Draw each individual part of the snake
function drawSnake() {
  snake.forEach(drawSnakePart)
}

// Draws the food, colours it, sizes it
function drawFood() {
  snakeboard_ctx.fillStyle = 'red';
  snakeboard_ctx.strokestyle = 'black';
  snakeboard_ctx.fillRect(food_x, food_y, 20, 20);
  snakeboard_ctx.strokeRect(food_x, food_y, 20, 20);
}

// Draw one snake part
// Draws a rectanglle and fills it to represent the snake at its coordinates
function drawSnakePart(snakePart) {
  snakeboard_ctx.fillStyle = snakeColour;
  snakeboard_ctx.strokestyle = snakeBorder;
  snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 20, 20);
  snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 20, 20);
}

// Takes the length of the snake and detects connection at the border
function gameOver() {
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true
  }

// Creating the constants for collision
const hitLeftWall = snake[0].x < 0;
const hitRightWall = snake[0].x > snakeboard.width - 20;
const hitToptWall = snake[0].y < 0;
const hitBottomWall = snake[0].y > snakeboard.height - 20;

  // Changing the game status to false once the game ends
  if (hitLeftWall || hitRightWall || hitToptWall || hitBottomWall) {
    liveGame = false;
  }
  return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
}

// Random food 
function randomFood(min, max) {
  return Math.round((Math.random() * (max-min) + min) / 20) * 20;
}

// Food generation - location and eating detection
function genFood() {
  food_x = randomFood(0, snakeboard.width - 20);
  food_y = randomFood(0, snakeboard.height - 20);

  // If the new food location is where the snake currently is, generate a new food location
  snake.forEach(function hasSnakeEatenFood(part) {
    const hasEaten = part.x == food_x && part.y == food_y;
    if (hasEaten) genFood();
  });
}

// Assigning keys to change direction as an event
function changeDirection(event) {
  const leftKeyPress = 37;
  const rightKeyPress = 39;
  const upKeyPress = 38;
  const downKeyPress = 40;

  // Prevent the snake from reversing
  if (changingDirection) return;
  changingDirection = true;
  const keyPressed = event.keyCode;
  const goingUp = dy === -20;
  const goingDown = dy === 20;
  const goingRight = dx === 20;
  const goingLeft = dx === -20;
  if (keyPressed === leftKeyPress && !goingRight) {
    dx = -20;
    dy = 0;
  }

  if (keyPressed === upKeyPress && !goingDown) {
    dx = 0;
    dy = -20;
  }
  if (keyPressed === rightKeyPress && !goingLeft) {
    dx = 20;
    dy = 0;
  }
  if (keyPressed === downKeyPress && !goingUp) {
    dx = 0;
    dy = 20;
  }
}


// Movement
function snakeMovement() {
  // Create the new Snake's head
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};
  // Add the new head to the beginning of snake body
  snake.unshift(head);
  const hasEatenFood = snake[0].x === food_x && snake[0].y === food_y;
  if (hasEatenFood) {
    // Iease score
    score += 10;
    // Display score on screen
    document.getElementById('score').innerHTML = score;
    // Generate new food location
    genFood();
   } else {   // Remove the last part of snake body
    snake.pop();
  }
}

