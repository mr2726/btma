import { useEffect, useRef, useState } from 'react';
import useEventListener from '@use-it/event-listener';
import * as constants from './constants';
import '../App.css'

// ground
let groundX = 0;

// bird
let birdX = 60;
let birdY = 120;
let birdYSpeed = 0;

// pipes
let pipeGapBottomY = constants.PIPE_HEIGHT;
let pipeX = constants.CANVAS_WIDTH;

// score
let score = 0;
let bestScore = parseInt(localStorage.getItem('bestScore') || '0', 10);

// check collision between circle and rectangle
const checkCollision = (circle, rect) => {
  if ((circle.x + circle.radius) >= rect.x && (circle.x - circle.radius) <= (rect.x + rect.width)) {
    if ((circle.y + circle.radius) >= rect.y && (circle.y - circle.radius) <= (rect.y + rect.height)) {
      return true;
    }
  }
  return false;
};

// check if bird has touched a pipe
const touchedPipe = () => {
  const birdHitbox = {
    x: birdX + (constants.BIRD_WIDTH / 2),
    y: birdY + (constants.BIRD_HEIGHT / 2) + 5,
    radius: 20
  };

  const upperPipe = {
    x: pipeX,
    y: 0,
    width: constants.PIPE_WIDTH,
    height: pipeGapBottomY
  };

  const lowerPipe = {
    x: pipeX,
    y: pipeGapBottomY + constants.PIPE_GAP,
    width: constants.PIPE_WIDTH,
    height: constants.CANVAS_HEIGHT - (pipeGapBottomY + constants.PIPE_GAP)
  };

  return checkCollision(birdHitbox, upperPipe) || checkCollision(birdHitbox, lowerPipe);
};

// check if bird has touched the ground
const fallOut = () => (birdY + constants.BIRD_HEIGHT) > constants.CANVAS_HEIGHT;

function GameOver({setScreenState, setRelativeState, menuState}) {
  const claim_button = () => {
    setScreenState('home');
    setRelativeState(true);
    menuState(true);
  }
  return (
    <div className='game_over'>
      <div className='game_over__popup'>
        <p>GAME OVER</p>
        <p>scrore: 9999</p>
        <button onClick={() => claim_button()}>claim</button>
      </div>
    </div>
  );
}

// stop game 
const reset = () => {
  hasStarted = false;
  hasFinished = true;
};

let hasStarted = false;
let hasFinished = false;
let canGetScore = true;

function Game({menuState, setRelativeState, setScreenState}) {
    const canvas = useRef(null);
    menuState(false);
    setRelativeState(false);
    const [gameOverScreen, setGameOverScreen] = useState(false);

    // bird jump
    const jump = () => {
      if (hasFinished) {
          return;
      }
      if (!hasStarted) {
          hasStarted = true;
      }
      birdYSpeed = constants.JUMP_SPEED;
    };

    // enable space button
    const handler = (key) => {
        if (hasFinished) {
            return;
        }
        if (key.code === 'Space') {
            if (!hasStarted) {
                hasStarted = true;
            }
            jump();
        }
    };

    useEventListener('keypress', handler);

    const draw = (context) => {
        // draw background
        context.fillStyle = "#C5BBE0";
        context.fillRect(0, 0, constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT);

        // draw bird
        context.drawImage(constants.BIRD, birdX, birdY, constants.BIRD_WIDTH, constants.BIRD_HEIGHT);

        // draw pipes
        context.fillStyle = "#221056";
        context.fillRect(pipeX, 0, constants.PIPE_WIDTH, pipeGapBottomY);
        context.fillRect(pipeX, pipeGapBottomY + constants.PIPE_GAP, constants.PIPE_WIDTH, constants.CANVAS_HEIGHT - (pipeGapBottomY + constants.PIPE_GAP));

        // draw scores
        context.fillStyle = "white";
        context.font = '26px Cherry Bomb One';
        context.fillText(score.toString(), constants.CANVAS_WIDTH / 2 - 15, 50);
    };

    const update = () => {
        if (touchedPipe() || fallOut()) {
            if (score > bestScore) {
                bestScore = score;
                localStorage.setItem('bestScore', score.toString());
            }
            reset();
            setGameOverScreen(true);
            return;
        }

        if (canGetScore && (birdX > pipeX + constants.PIPE_WIDTH)) {
            canGetScore = false;
            score += 10;
        }

        if (pipeX < -constants.PIPE_WIDTH) {
            pipeX = constants.CANVAS_WIDTH;
            pipeGapBottomY = constants.PIPE_GAP * Math.random();
            canGetScore = true;
        }

        if (groundX <= -constants.CANVAS_WIDTH) {
            groundX = 0;
        }

        // movements
        pipeX -= constants.SPEED;
        groundX -= constants.SPEED;
        birdY += birdYSpeed * (constants.INTERVAL / 1000);
        birdYSpeed -= constants.FALL_SPEED * (constants.INTERVAL / 1000);
    };

    const gameLoop = () => {
        if (canvas.current) {
            const context = canvas.current.getContext("2d");
            if (context) {
                if(hasStarted) update();
                draw(context);
                requestAnimationFrame(gameLoop);
            }
        }
    };

    useEffect(() => {
      requestAnimationFrame(gameLoop);
    });

    return (
        <div onClick={jump} onKeyPress={jump} style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh'}}>
            <canvas ref={canvas} width={constants.CANVAS_WIDTH} height={constants.CANVAS_HEIGHT} />
            {gameOverScreen === true ? <GameOver setScreenState={setScreenState} setRelativeState={setRelativeState} menuState={menuState} /> : <></>}
        </div>
    );
}

export default Game;
