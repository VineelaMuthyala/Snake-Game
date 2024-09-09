

import React, { Component, createRef } from 'react';
import './index.css';

const INITIAL_SNAKE = [{ x: 2, y: 2 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const CELL_SIZE = 30; // Fixed cell size for all grid sizes
const getInitialSnake = (gridSize) => [{ x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2) }];

class SnakeGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      snake: getInitialSnake(15),
      direction: INITIAL_DIRECTION,
      food: this.generateFood(15),
      selectedFood: 'apple', // New state for selected food
      gameOver: false,
      gameStarted: false,
      topScore:0,
      gridSize: 15, // Default grid size is medium (15x15)
      showSettings: false, // hide settings initially
      gridColors: ['#cfd8dc', '#90a4ae'],// Default grid colors
    };
    // Create a ref for the dropdown
    this.dropdownRef = createRef();
  }

  ////

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    // Add a click event listener to the document
    document.addEventListener('click', this.handleDocumentClick);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('click', this.handleDocumentClick);
    clearInterval(this.gameInterval);
  }

  handleDocumentClick = (e) => {
    // Check if the click is outside of the dropdown
    if (this.state.showSettings && this.dropdownRef.current && !this.dropdownRef.current.contains(e.target)) {
      this.setState({ showSettings: false });
    }
  };

  toggleSettings = () => {
    this.setState((prevState) => ({ showSettings: !prevState.showSettings }));
  };


   // Food options with their corresponding images
   foodOptions = {
    apple: 'https://res.cloudinary.com/dtf1kbume/image/upload/v1725864036/apple_coos9z.jpg',
    banana: 'https://res.cloudinary.com/dtf1kbume/image/upload/v1725806369/Banana-Single_shok1y.jpg',
    strawberry: 'https://res.cloudinary.com/dtf1kbume/image/upload/v1725807650/sb_n8byhd.jpg',
  };


  handleKeyDown = (e) => {
    const { direction , gameStarted, gameOver} = this.state;

    // Start the game when the first arrow key is pressed
  if (!gameStarted && !gameOver) {
    this.startGame();
  }


    switch (e.keyCode) {
      case 37: // left arrow
        if (direction.x !== 1) this.setState({ direction: { x: -1, y: 0 } });
        break;
      case 38: // up arrow
        if (direction.y !== 1) this.setState({ direction: { x: 0, y: -1 } });
        break;
      case 39: // right arrow
        if (direction.x !== -1) this.setState({ direction: { x: 1, y: 0 } });
        break;
      case 40: // down arrow
        if (direction.y !== -1) this.setState({ direction: { x: 0, y: 1 } });
        break;
      default:
        break;
    }
  };

  
  

  gameLoop = () => {
    if (this.state.gameOver || !this.state.gameStarted) return;

    this.setState(prevState => {
      const newSnake = this.moveSnake(prevState);
      if (!newSnake || newSnake.length === 0) {
        console.error("Snake array is empty or undefined.");
        return;
      }
  
      // Calculate current score based on snake length
      const currentScore = prevState.snake.length > 0 ? prevState.snake.length - 1 : 0;
      console.log("Current Score:", currentScore);


      if (this.checkCollision(newSnake)) {
        const newTopScore = Math.max(prevState.topScore || 0, currentScore);
        console.log("New Top Score:", newTopScore);
        return {
          gameOver: true,
          topScore: newTopScore, // Set the new top score if it's a higher score
        };
      }

      if (this.checkFoodCollision(newSnake)) {
        return { snake: newSnake, food: this.generateFood(prevState.gridSize) };
      } else {
        return { snake: newSnake.slice(0, -1) };
      }
    });
  };


 
  // Change the grid size
  changeGridSize = (size) => {
    let gridSize;
    switch (size) {
      case 'small':
        gridSize = 10;
        break;
      case 'medium':
        gridSize = 15;
        break;
      case 'large':
        gridSize = 20;
        break;
      default:
        gridSize = 15;
    }
    this.setState({
      gridSize: gridSize,
      snake: getInitialSnake(gridSize),
      direction: INITIAL_DIRECTION,
      food: this.generateFood(gridSize),
      gameOver: false,
      gameStarted: false,
      showSettings:false
    });
   
  };
  changeGridColor = (season) => {
    let gridColors;
    switch (season) {
      case 'summer':
        gridColors = ['#f0ed9e', '#c9c671']; // Example shades for summer (yellow)
        break;
      case 'winter':
        gridColors = ['#d3ebe9', '#7ed1ed']; // Example shades for winter (gray)
        break;
      case 'spring':
        gridColors = ['#ccf2ae', '#6fbf80']; // Example shades for spring (green)
        break;
      default:
        gridColors = ['#ffffff', '#000000']; // Default colors if no season is selected
    }
    this.setState({ gridColors });
  };
  

  // Reset the game with the new grid size
  resetGame = (gridSize) => {
    this.setState({
      snake: INITIAL_SNAKE,
      direction: INITIAL_DIRECTION,
      food: this.generateFood(gridSize),
      gameOver: false,
      gameStarted: false,
    });
  };

  moveSnake = (prevState) => {
    const { snake, direction } = prevState;
    
    const newHead = {
      x: snake[0].x + direction.x,
      y: snake[0].y + direction.y
    };
    return [newHead, ...snake];
  };

  
  checkCollision = (snake) => {
    const [head, ...body] = snake;
    const { gridSize } = this.state;
    return (
      head.x < 0 ||
      head.y < 0 ||
      head.x >= gridSize ||
      head.y >= gridSize ||
      body.some(segment => segment.x === head.x && segment.y === head.y)
    );
  };

  checkFoodCollision = (snake) => {
    const [head] = snake;
    const { food } = this.state;
    return head.x === food.x && head.y === food.y;
  };

  generateFood = (gridSize) => {
    return {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    };
  };

   // Change selected food type
   changeFoodType = (foodType) => {
    this.setState({ selectedFood: foodType });
  };

  startGame = () => {

    clearInterval(this.gameInterval);
    
    this.setState({
      snake: INITIAL_SNAKE,
      direction: INITIAL_DIRECTION,
      food: this.generateFood(this.state.gridSize),
      gameOver: false,
      gameStarted: true,
      
    }, () => {
      this.gameInterval = setInterval(this.gameLoop, 300);
    });
  };

  render() {
    const { snake, food, gameOver, gameStarted,topScore ,gridSize,selectedFood,gridColors,showSettings} = this.state;
      // Calculate the overall board size based on grid size
      const boardSize = CELL_SIZE * gridSize;
      // Safety checks
  if (!snake || !Array.isArray(snake)) {
    console.error('Snake array is not properly initialized:', snake);
    return null;
  }

  if (!food || typeof food !== 'object') {
    console.error('Food object is not properly initialized:', food);
    return null;
  }
       // Dynamic grid styles
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${gridSize}, ${CELL_SIZE}px)`,
    gridTemplateRows: `repeat(${gridSize}, ${CELL_SIZE}px)`,
    width: `${boardSize}px`,
    height: `${boardSize}px`,
    backgroundColor : gridColors[0],
  };

    const headerStyle = {
      width: `${boardSize}px`, // Dynamically set the width to match the board size
      height: '30px', // You can adjust this if you want dynamic height as well
      backgroundColor: '#28a745', // Keep or modify your preferred styles
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px'
    };
  
     // Get the selected food image URL
  const foodImage = this.foodOptions[selectedFood];

    return (
      <div className="snake-game-container">
          <div className='header' style={headerStyle}>
          <div className="score-container">
          Score: {snake.length - 1}  &nbsp;|&nbsp; Top Score: {topScore}
          </div>
          <button className="settings-button" onClick={this.toggleSettings}>
    ⚙️
  </button>
  {showSettings && (
   <div className="settings-dropdown">
   
   <div className="grid-size-options">
    <button 
      className={`grid-option ${gridSize === 10 ? 'selected' : ''}`}
      onClick={() => this.changeGridSize('small')}
    >
      Small 
    </button>
    <button 
      className={`grid-option ${gridSize === 15 ? 'selected' : ''}`}
      onClick={() => this.changeGridSize('medium')}
    >
      Medium 
    </button>
    <button 
      className={`grid-option ${gridSize === 20 ? 'selected' : ''}`} 
      onClick={() => this.changeGridSize('large')}
    >
      Large 
    </button>
  </div>
 
  
   <div className="grid-color-options">
     <img
       src="https://res.cloudinary.com/dtf1kbume/image/upload/v1725865481/sun_umqkgm.jpg" 
       alt="Summer"
       className={`color-option ${this.state.gridColors[0] === '#ffeb3b' ? 'selected' : ''}`}
       onClick={() => this.changeGridColor('summer')}
     />
     <img
       src="https://res.cloudinary.com/dtf1kbume/image/upload/v1725865469/snoflake_s6lj07.jpg" 
       alt="Winter"
       className={`color-option ${this.state.gridColors[0] === '#cfd8dc' ? 'selected' : ''}`}
       onClick={() => this.changeGridColor('winter')}
     />
     <img
       src="https://res.cloudinary.com/dtf1kbume/image/upload/v1725865492/Yellow_Flower_fopptl.jpg" 
       alt="Spring"
       className={`color-option ${this.state.gridColors[0] === '#8bc34a' ? 'selected' : ''}`}
       onClick={() => this.changeGridColor('spring')}
     />
   </div>
 
   
   <div className="food-options">
     <img
       src="https://res.cloudinary.com/dtf1kbume/image/upload/v1725864036/apple_coos9z.jpg" 
       alt="Apple"
       className={`food-option ${selectedFood === 'apple' ? 'selected' : ''}`}
       onClick={() => this.changeFoodType('apple')}
     />
     <img
       src="https://res.cloudinary.com/dtf1kbume/image/upload/v1725806369/Banana-Single_shok1y.jpg" 
       alt="Banana"
       className={`food-option ${selectedFood === 'banana' ? 'selected' : ''}`}
       onClick={() => this.changeFoodType('banana')}
     />
     <img
       src="https://res.cloudinary.com/dtf1kbume/image/upload/v1725807650/sb_n8byhd.jpg" 
       alt="Strawberry"
       className={`food-option ${selectedFood === 'strawberry' ? 'selected' : ''}`}
       onClick={() => this.changeFoodType('strawberry')}
     />
   </div>
 </div>
 
  )}
          </div>
          
          <div className="game-board" style={gridStyle}>
          {/* Game grid */}
          {[...Array(this.state.gridSize)].map((_, row) =>
            [...Array(this.state.gridSize)].map((_, col) => {
              const isSnakeHead = snake[0].x === col && snake[0].y === row;
              const isSnakeBody = snake.some((segment, index) => index !== 0 && segment.x === col && segment.y === row);
              const isFood = food.x === col && food.y === row;

               // Determine the class based on row and column
               const isEvenRow = row % 2 === 0;
               const isEvenCol = col % 2 === 0;
               const cellClass = isEvenRow
    ? (isEvenCol ? gridColors[0] : gridColors[1])
    : (isEvenCol ? gridColors[1] : gridColors[0]);

 

              return (
                <div
                key={`${row}-${col}`}
                className={`grid-cell ${cellClass} ${isSnakeHead ? 'snake-head' : isSnakeBody ? 'snake-body' : isFood ? 'food' : ''}`}
                style={{
                  width: `${CELL_SIZE}px`,
                  height: `${CELL_SIZE}px`,
                  backgroundImage: isFood && !isSnakeHead ? `url(${foodImage})` : 'none',
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundColor: cellClass,

                }}
              />
              );
            })
          
          )}
          {!gameStarted && !gameOver && (
            <div className="arrow-box">
              <div className="arrow">↑</div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="arrow">←</div>
                <div className="arrow">→</div>
              </div>
              <div className="arrow">↓</div>
              <h3 className='instruction-heading'>Use arrow keys to move</h3>
            </div>
          )}
        </div>
        {gameOver && (
          <div className="game-over-overlay">
            <h2 className='game-over-heading'>Game Over!</h2>
            
            <button onClick={this.startGame} className="button">
              Play Again
            </button>
          </div>
        )}
     
      </div>
    );
  }
}

export default SnakeGame; 