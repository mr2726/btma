// constants.js
export const INTERVAL = 20;
export const CANVAS_WIDTH = window.screen.width;
export const CANVAS_HEIGHT = window.screen.height;

// bird
export const BIRD = new Image();
BIRD.src = require("../img/bird.png");
export const BIRD_HEIGHT = 50;
export const BIRD_WIDTH = 50;

// pipes
export const PIPE_WIDTH = 40;
export const PIPE_HEIGHT = CANVAS_HEIGHT / 2;
export const PIPE_GAP = 180;

// movements
export const JUMP_SPEED = -150;
export const FALL_SPEED = -180;
export const SPEED = 1;
