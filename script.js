document.addEventListener('DOMContentLoaded', () =>{
  const grid = document.querySelector('.map');
  let squares = Array.from(document.querySelectorAll('.map div'));
  const width = 10;
  let timerId;
  const startButton = document.querySelector('#startBtn');
  const colors = ['red', 'orange', 'green', 'blue', 'purple'];

  // expressing the four tetrominoes in array coordinates
  const lTetromino = [[1, 1+width, 1+width*2, width*2+2],
                      [width, width+1, width+2, 2],
                      [0, 1, width+1, width*2+1],
                      [width, width+1, width+2, width*2]];
  
  const zTetromino = [[1, 1+width, 2+width, 2+width*2],
                      [width, width+1, 1, 2],
                      [1, 1+width, 2+width, 2+width*2],
                      [width, width+1, 1, 2]];
  
  const tTetromino = [[1, width, width+1, width+2],
                      [width, 1, width+1, width*2+1],
                      [width, width+1, width+2, width*2+1],
                      [1, width+1, 2*width+1, width+2]];
  
  const oTetromino = [[0, 1, width, 1+width],
                      [0, 1, width, 1+width],
                      [0, 1, width, 1+width],
                      [0, 1, width, 1+width]];

  const iTetromino = [[1, width+1, width*2+1, width*3+1],
                      [width,width+1,width+2,width+3],
                      [1, width+1, width*2+1, width*3+1],
                      [width,width+1,width+2,width+3]];
  
  const theTetrominos = [lTetromino, zTetromino, oTetromino, tTetromino, iTetromino];
  
  let currentPosition = 3;
  let currentRotation = 0;
  
  let random = Math.floor(Math.random()*5);
  let current = theTetrominos[random][currentRotation];
  
  function draw(){
    current.forEach(index =>{
      squares[index+currentPosition].classList.add('tetromino');
      squares[index+currentPosition].style.backgroundColor = colors[random];
    });
  }

  function undraw(){
    current.forEach(index=>{
      squares[index+currentPosition].classList.remove('tetromino');
      squares[index+currentPosition].style.backgroundColor = '';
    });
  }
  
  function moveDown(){
    undraw();
    currentPosition+=width;
    draw();
    freeze();
  }

  function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      random = Math.floor(Math.random() * theTetrominos.length);
      current = theTetrominos[random][currentRotation];
      currentPosition = 4;
      addScore();
      gameOver();
      draw();
    }
  }

  function move(e){
    if(e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate()
    } else if (e.keyCode === 39) {
      moveRight()
    } else if (e.keyCode === 40) {
      moveDown()
  }}

  document.addEventListener('keyup', move)
    
  function moveLeft(){
    undraw();
    if(!current.some(index=> (currentPosition + index)%width===0)&&
        !current.some(index=> squares[currentPosition + index - 1].classList.contains('taken'))){
      currentPosition--;
    }
    draw();
  }

  function moveRight(){
    undraw();
    if(!current.some(index=> (currentPosition + index)%width===9)&&
      !current.some(index=> squares[currentPosition + index + 1].classList.contains('taken'))){
      currentPosition++;
    }
    draw();
  }
    
  function rotate(){
    undraw();
    console.log("current position: " + currentPosition);
    if(isAtLeft()) {
      console.log("Why am I here");
      handleLeftEdge();
    }else if(isAtRight()){
      handleRightEdge();
    }
    console.log("current position after handled: " + currentPosition);
    currentRotation++;
    if(currentRotation === current.length) currentRotation=0;
    current = theTetrominos[random][currentRotation];
    draw();
    
  }

  function handleLeftEdge(){
    if(theTetrominos[random]===lTetromino){
      if(currentRotation===0){currentPosition++;}
    }else if(theTetrominos[random]===tTetromino){
      if(currentRotation===3){currentPosition++;}
    }else if(theTetrominos[random]===iTetromino){
      if(currentRotation%2===0){currentPosition++;}
    }else if(theTetrominos[random]===zTetromino){
      if(currentRotation%2===0){currentPosition++;}
    }
  }

  function handleRightEdge(){
    if(theTetrominos[random]===lTetromino){
      if(currentRotation===2){currentPosition--;}
    }else if(theTetrominos[random]===tTetromino){
      if(currentRotation===1){currentPosition--;}
    }else if(theTetrominos[random]===iTetromino){
      if(currentRotation%2===0){currentPosition-=2;}
    }
  }
  
  function isAtRight() {
    return current.some(index=> (currentPosition + index + 1) % width === 0)  
  }

  function isAtLeft() {
    console.log("Passing through isAtLeft() function");
    current.forEach(index => {
      console.log("index of tetromino: " + (currentPosition + index));
    })
    return current.some(index=> (currentPosition + index) % width === 0)
  }

  function addScore(){
    for(let i = 0; i<129; i+=width){
      const completeRow = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
      if(completeRow.every(index => squares[index].classList.contains('taken'))){
        completeRow.forEach(index => {
          squares[index].classList.remove('taken');
          squares[index].classList.remove('tetromino');
          squares[index].style.backgroundColor = '';
        })
        const squaresRemove = squares.splice(i, width);
        squares = squaresRemove.concat(squares);
        squares.forEach(index=>grid.appendChild(index));
      }
      
    }
  }
  function gameOver(){
    if(current.some(index=>squares[currentPosition+index].classList.contains('taken'))){
      clearInterval(timerId);
      alert("YOU LOSE");
    }
  }
  startButton.addEventListener('click', ()=>{
    if(timerId){
      clearInterval(timerId);
      timerId = null;
    }else{
      draw();
      timerId = setInterval(moveDown, 1000);
    }
  })
  
})
