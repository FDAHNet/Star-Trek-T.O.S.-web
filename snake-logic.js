(function (globalScope) {
  "use strict";

  var GRID_SIZE = 16;
  var INITIAL_DIRECTION = "right";
  var DIRECTIONS = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
  };
  var OPPOSITES = {
    up: "down",
    down: "up",
    left: "right",
    right: "left"
  };

  function clonePosition(position) {
    return { x: position.x, y: position.y };
  }

  function positionsEqual(a, b) {
    return a.x === b.x && a.y === b.y;
  }

  function randomInt(max, rng) {
    return Math.floor(rng() * max);
  }

  function createInitialSnake() {
    return [
      { x: 8, y: 8 },
      { x: 7, y: 8 },
      { x: 6, y: 8 }
    ];
  }

  function createInitialState(options) {
    var settings = options || {};
    var gridSize = settings.gridSize || GRID_SIZE;
    var snake = settings.snake ? settings.snake.map(clonePosition) : createInitialSnake();
    var direction = settings.direction || INITIAL_DIRECTION;
    var state = {
      gridSize: gridSize,
      snake: snake,
      direction: direction,
      queuedDirection: direction,
      food: null,
      score: settings.score || 0,
      isGameOver: false
    };

    state.food = settings.food
      ? clonePosition(settings.food)
      : spawnFood(state, settings.rng || Math.random);

    return state;
  }

  function cloneState(state) {
    return {
      gridSize: state.gridSize,
      snake: state.snake.map(clonePosition),
      direction: state.direction,
      queuedDirection: state.queuedDirection,
      food: state.food ? clonePosition(state.food) : null,
      score: state.score,
      isGameOver: state.isGameOver
    };
  }

  function queueDirection(state, nextDirection) {
    if (!DIRECTIONS[nextDirection] || state.isGameOver) {
      return state;
    }

    var effectiveDirection = state.queuedDirection || state.direction;
    if (nextDirection === effectiveDirection || nextDirection === OPPOSITES[effectiveDirection]) {
      return state;
    }

    var nextState = cloneState(state);
    nextState.queuedDirection = nextDirection;
    return nextState;
  }

  function spawnFood(state, rng) {
    var freeCells = [];
    var y;
    var x;

    for (y = 0; y < state.gridSize; y += 1) {
      for (x = 0; x < state.gridSize; x += 1) {
        if (!state.snake.some(function (segment) { return segment.x === x && segment.y === y; })) {
          freeCells.push({ x: x, y: y });
        }
      }
    }

    if (freeCells.length === 0) {
      return null;
    }

    return clonePosition(freeCells[randomInt(freeCells.length, rng || Math.random)]);
  }

  function stepGame(state, rng) {
    if (state.isGameOver) {
      return state;
    }

    var nextDirection = state.queuedDirection || state.direction;
    var vector = DIRECTIONS[nextDirection];
    var currentHead = state.snake[0];
    var nextHead = {
      x: currentHead.x + vector.x,
      y: currentHead.y + vector.y
    };
    var grows = state.food && positionsEqual(nextHead, state.food);
    var nextSnake = [nextHead].concat(state.snake.map(clonePosition));

    if (!grows) {
      nextSnake.pop();
    }

    var hitsWall =
      nextHead.x < 0 ||
      nextHead.y < 0 ||
      nextHead.x >= state.gridSize ||
      nextHead.y >= state.gridSize;

    var hitsSelf = nextSnake.slice(1).some(function (segment) {
      return positionsEqual(segment, nextHead);
    });

    if (hitsWall || hitsSelf) {
      return {
        gridSize: state.gridSize,
        snake: nextSnake,
        direction: nextDirection,
        queuedDirection: nextDirection,
        food: state.food ? clonePosition(state.food) : null,
        score: state.score,
        isGameOver: true
      };
    }

    var nextState = {
      gridSize: state.gridSize,
      snake: nextSnake,
      direction: nextDirection,
      queuedDirection: nextDirection,
      food: state.food ? clonePosition(state.food) : null,
      score: state.score,
      isGameOver: false
    };

    if (grows) {
      nextState.score += 1;
      nextState.food = spawnFood(nextState, rng || Math.random);
      if (nextState.food === null) {
        nextState.isGameOver = true;
      }
    }

    return nextState;
  }

  var api = {
    GRID_SIZE: GRID_SIZE,
    DIRECTIONS: DIRECTIONS,
    createInitialState: createInitialState,
    queueDirection: queueDirection,
    spawnFood: spawnFood,
    stepGame: stepGame
  };

  globalScope.SnakeLogic = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
}(typeof window !== "undefined" ? window : globalThis));
