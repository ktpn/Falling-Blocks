function gameStart() {

document.addEventListener('DOMContentLoaded', () => {

const grid = document.querySelector(".grid");
let squares = Array.from(document.querySelectorAll(".grid div"));
const scoreDisplay = document.querySelector("#score");
const startBtn = document.querySelector("#start-button");
const width = 10;
let nextRandom = 0;
let timerId
let score = 0;


const colors = [
    "orange", "red", "purple", "blue", "yellow", "brown", "green"
]


// The Tetrominoes
const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
]

const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]

  const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]

  const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]

  const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

  let currentPosition = 4;
  let currentRotation = 0;

  //Randomly select Tetromino and its first rotation/position
  let random = Math.floor(Math.random()*theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  //Draw the Tetromino
  function draw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino');
        squares[currentPosition + index].style.backgroundColor = colors[random];
    })
  }

  //Undraw the Tetromino
  function undraw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.remove("tetromino");
        squares[currentPosition + index].style.backgroundColor = "";
    })
  }

  //Tetrominos move down every second
  //timerId = setInterval(moveDown, 1000);

  //Assign functions to keyCodes
  function control(e) {
    if(e.keyCode === 37) {
        moveLeft()
    } else if (e.keyCode === 38) {
        rotate ()
    } else if (e.keyCode === 39) {
        moveRight ()
    } else if (e.keyCode === 40) {
        moveDown ()
    }
  }
  document.addEventListener("keyup", control);




  //Move down function
  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }

  //Freeze function
  function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains("taken"))) {
        current.forEach(index => squares[currentPosition + index].classList.add("taken"));

        //Start a new tetromino falling
        random = nextRandom;
        nextRandom = Math.floor(Math.random()*theTetrominoes.length);
        current = theTetrominoes[random][currentRotation];
        currentPosition = 4;
        draw();
        displayShape();
        addScore();
        gameOver();
    }
  }

  //Move left but stop at the edge of grid or blockage
  function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);

    if (!isAtLeftEdge) currentPosition -=1;
    if (current.some(index => squares[currentPosition + index].classList.contains("taken"))) {
        currentPosition +=1;
    }
    draw();
  }

  //Move right but stop at edge
  function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)

    if (!isAtRightEdge) currentPosition +=1;
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -=1;
    }
    draw();
  }

  //Rotate the tetromino
  function rotate() {
    undraw()
    currentRotation ++;
    if(currentRotation === current.length) { //If the current rotation get to 4, the end, cycle back to 0.
        currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    draw();
  }

  //Show next tetromino in mini-grid display
  const displaySquares = document.querySelectorAll(".mini-grid div");
  const displayWidth = 4;
  let displayIndex = 0;
  

  //The Tetrominos without rotations
  const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
    [0, 1, displayWidth, displayWidth+1], //oTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
  ];

  //Display the shape in the mini-grid display
  function displayShape() {
    //Remove any trace of a tetromino from the entire grid
    displaySquares.forEach(square => {
        square.classList.remove("tetromino");
        square.style.backgroundColor = "";
    })
    upNextTetrominoes[nextRandom].forEach(index => {
        displaySquares[displayIndex + index].classList.add("tetromino");
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
    })
  }


  //Start/pause button
  startBtn.addEventListener("click", () => {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    } else {
        draw();
        timerId = setInterval(moveDown, 1000);
        nextRandom = Math.floor(Math.random()*theTetrominoes.length);
        displayShape();
    }
  })

  //Add Score
  function addScore() {
    for (let i = 0; i < 199; i +=width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

        if (row.every(index => squares[index].classList.contains("taken"))) {
            score += 10;
            scoreDisplay.innerHTML = score;
            row.forEach(index => {
                squares[index].classList.remove("taken");
                squares[index].classList.remove("tetromino");
                squares[index].style.backgroundColor = "";
            })
            const squaresRemoved = squares.splice(i, width);
            squares = squaresRemoved.concat(squares);
            squares.forEach(cell => grid.appendChild(cell));
            console.log(squaresRemoved)
        }
    }
  }

  //Gameover
  function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains("taken"))) {
        scoreDisplay.innerHTML = "Game Over!";
        scoreDisplay.style.color = "red";
        clearInterval(timerId);

        

        const playAgain = document.createElement("button");

        const removeStart = document.getElementById("start-button");

        playAgain.innerHTML = "Play Again?"
        document.getElementById("resetButton").appendChild(playAgain);
        removeStart.remove();

        playAgain.addEventListener("click", () => {
            location.reload();
        })

    
        
    }
  }


});
}

gameStart();
