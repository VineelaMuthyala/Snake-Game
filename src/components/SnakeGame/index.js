// src/SnakeGame.js
import React, { useState, useEffect, useCallback } from 'react';
import './index.css';

const GRID_SIZE = 20;

const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 }; // Start moving up
const SPEED = 200;

const SnakeGame = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(generateFood());
  const [gameOver, setGameOver] = useState(false);

  // Generate food position
  const generateFood = useCallback(() => {
    let newFood;
    const isOnSnake = (food) =>
      snake.some(segment => segment.x === food.x && segment.y === food.y);

    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (isOnSnake(newFood));

    return newFood;
  }, [snake]);

  // Handle key presses for direction changes
  const handleKeyDown = useCallback((e) => {
    switch (e.key) {
      case 'ArrowUp':
        if (direction.y === 0) setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
        if (direction.y === 0) setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
        if (direction.x === 0) setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
        if (direction.x === 0) setDirection({ x: 1, y: 0 });
        break;
      default:
        break;
    }
  }, [direction]);

  useEffect(() => {
    const moveSnake = () => {
      const newSnake = [...snake];
      const head = {
        x: newSnake[0].x + direction.x,
        y: newSnake[0].y + direction.y,
      };

      // Check collision with walls
      if (
        head.x < 0 ||
        head.x >= GRID_SIZE ||
        head.y < 0 ||
        head.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return;
      }

      // Check collision with itself
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return;
      }

      // Add new head position
      newSnake.unshift(head);

      // Check if snake has eaten the food
      if (head.x === food.x && head.y === food.y) {
        setFood(generateFood());
      } else {
        // Remove the tail if no food was eaten
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    if (!gameOver) {
      const interval = setInterval(moveSnake, SPEED);
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        clearInterval(interval);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [snake, direction, food, handleKeyDown, generateFood, gameOver]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setGameOver(false);
  };

  return (
    <div className="snake-game">
      {gameOver ? (
        <div className="game-over">
          <h1>Game Over</h1>
          <button onClick={resetGame}>Restart</button>
        </div>
      ) : (
        <div className="grid">
          {[...Array(GRID_SIZE)].map((_, row) => (
            <div key={row} className="row">
              {[...Array(GRID_SIZE)].map((_, col) => (
                <div
                  key={col}
                  className={`cell ${
                    snake.some(segment => segment.x === col && segment.y === row)
                      ? 'snake'
                      : ''
                  } ${food.x === col && food.y === row ? 'food' : ''}`}
                ></div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
