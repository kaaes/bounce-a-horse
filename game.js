window.requestAnimationFrame = window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.oRequestAnimationFrame ||
window.msRequestAnimationFrame;

window.cancelRequestAnimationFrame = window.cancelRequestAnimationFrame ||
window.webkitCancelRequestAnimationFrame ||
window.mozCancelRequestAnimationFrame ||
window.oCancelRequestAnimationFrame ||
window.msCancelRequestAnimationFrame;

function Game() {
  if (!requestAnimationFrame || !cancelRequestAnimationFrame) {
    throw new Error('Request Animation Frame is required for this game');
  }

  this.board;
  this.wanted;
  this.current;

  this.reqAnimFrame;

  this.context = board.getContext('2d');

  this.frame = this.frame.bind(this);
  this.onKeyReleased = this.onKeyReleased.bind(this);
  this.onKeyPressed = this.onKeyPressed.bind(this);
  this.onReset = this.onReset.bind(this);

  this.setUpDom();
}

Game.random = function(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

Game.prototype.init = function() {       
  document.body.addEventListener('keyup', this.onKeyReleased);
  document.body.addEventListener('keyup', this.reseButton);
  document.body.addEventListener('keydown', this.onKeyPressed);

  this.ball = new Ball(this.context);

  this.power = 1;
  this.angle = Game.random(0,360); 

  this.bangs = Game.random(2, 10);
  this.bangCounter = 0;

  this.ball.setPosition(
    Game.random(this.ball.offsetX, board.width - this.ball.offsetX),
    Game.random(this.ball.offsetY, board.height - this.ball.offsetY));

  this.ball.speed = this.getSpeedVector(this.angle);

  this.ball.collisionDist = 0;

  this.drawScore();
  this.drawScene();
  this.drawArrow();
}

Game.prototype.setUpDom = function() {
  this.board = document.querySelector('#board');

  this.board.width = 800;
  this.board.height = 400;

  this.wanted = document.querySelector('.wanted-bang');
  this.current = document.querySelector('.current-bang');
}

Game.prototype.drawScore = function() {
  this.wanted.innerHTML = this.bangs + ':';
  this.current.innerHTML = this.bangCounter;
}

Game.prototype.drawScene = function() {
  this.context.clearRect(0, 0, board.width, board.height);
  this.ball.draw();

  if (this.ball.collision) {
    this.bangCounter++;
    this.current.innerHTML = this.bangCounter;
  }

  return this.ball.isMoving();
}

Game.prototype.frame = function() {
  if (this.drawScene()) {
    this.reqAnimFrame = requestAnimationFrame(this.frame);
  } else {
    if (this.bangCounter === this.bangs) {
      this.ball.draw(true);
      this.current.innerHTML += ' WIN!';
    } else {
      this.current.innerHTML += ' MEH';
    }
  }
}

Game.prototype.getSpeedVector = function(angle) {

  var rad = this.angle * Math.PI/180;
  var l = 1;

  var y = Math.sin(rad) * l;
  var x = Math.cos(rad) * l;

        //console.log(angle, x, y);
        return [x, y];
      }

      Game.prototype.drawArrow = function() {
        var rad = this.angle * Math.PI/180;
        var c = this.context;

        c.save();
        c.translate(this.ball.position[0], this.ball.position[1]);
        c.rotate(rad + Math.PI/2);

        c.beginPath();
        c.moveTo(-5, 12);
        c.lineTo(5, 12);
        c.lineTo(5, -12);
        c.lineTo(10, -12);
        c.lineTo(0, -20);
        c.lineTo(-10, -12);
        c.lineTo(-5, -12);
        c.lineTo(-5, 12);
        c.closePath();
        c.stroke();

        c.restore();
      }

      Game.prototype.onKeyPressed = function(evt) {
        if (evt.keyCode === 32) {
          this.power += 2.4;
        }
      };

      Game.prototype.onKeyReleased = function(evt) {
        if (evt.keyCode === 32) {
          document.body.removeEventListener('keyup', this.onKeyReleased);
          document.body.addEventListener('keyup', this.onReset);
          this.ball.speed[0] *= this.power; 
          this.ball.speed[1] *= this.power; 

          this.frame();
        }
      }

      Game.prototype.onReset = function(evt) {
        if (evt.keyCode === 32) {
          document.body.removeEventListener('keyup', this.onReset);
          cancelRequestAnimationFrame(this.reqAnimFrame);
          this.init();
        }
      }

      function Ball(context) {
        this.position = [0, 0];
        this.speed = [1, 1];

        this.acceleration = -0.01;

        this.width = 80;
        this.height = 80;

        this.offsetX = this.width/2;
        this.offsetY = this.height/2;

        this.collisionDist = 0;
        this.collision = false;

        this.head = document.querySelector('#head');
        this.head2 = document.querySelector('#head2');
        this.head3 = document.querySelector('#head3');

        this.context = context;
      }

      Ball.prototype.draw = function(win) {
        var c = this.context;

        this.collision = false;

        console.log(this.speed);

        this.speed[0] *= (1 + this.acceleration);
        this.speed[1] *= (1 + this.acceleration);

        console.log(this.speed);

        if (this.collisionDist > 0 && this.collisionDist < 15) {
          this.collisionDist++;
        } else {
          this.collisionDist = 0;
        }
        
        if (this.position[1] < this.offsetY ||
          this.position[1] >= board.height - this.offsetY) {

          this.speed[1] *= -1; 
        this.position[1] = this.position[1] < this.offsetY ? this.offsetY : board.height - this.offsetY;

        this.collision = true;
        this.collisionDist = 1;
      }

      if (this.position[0] < this.offsetX ||
        this.position[0] >= board.width - this.offsetX) {

        this.speed[0] *= -1; 
      this.position[0] = this.position[0] < this.offsetX ? this.offsetY : board.width - this.offsetX;

      this.collision = true;
      this.collisionDist = 1;
    }

    this.position[0] += this.speed[0];
    this.position[1] += this.speed[1];

    c.save();
    c.translate(this.position[0], this.position[1]);

    c.rotate(Math.abs(this.position[0]) * Math.PI/180);

    var img = win ? head3 : this.collisionDist ? head2 : head;

    c.drawImage(img, -this.offsetX, -this.offsetY, this.width, this.height);

    c.restore();
  }

  Ball.prototype.setPosition = function(x, y) {
    this.position = [x, y];
  }

  Ball.prototype.setSpeed = function(x, y) {
    this.speed = [x, y];
  }

  Ball.prototype.isMoving = function() {
    return Math.abs(this.speed[0]) > 0.1 ||
    Math.abs(this.speed[1]) > 0.1;
  }