var bg, bgImg;
var player, shooterImg, shooter_shooting;
var zumbi, zumbiImg, tsunamiZombie;
var life = 3;
var heart1, heart2, heart3;
var heart1Img, heart2Img, heart3Img;
var bullets = 70;
var bulletGroup;
var score = 0;
var gameState = 'fight';
var cripta, criptaImg;

function preload() {
  shooterImg = loadImage('assets/shooter_2.png');
  shooter_shooting = loadImage('assets/shooter_3.png');
  bgImg = loadImage('assets/bg.jpeg');
  zumbiImg = loadImage('assets/zombie.png');
  heart1Img = loadImage('assets/heart_1.png');
  heart2Img = loadImage('assets/heart_2.png');
  heart3Img = loadImage('assets/heart_3.png');
  criptaImg = loadImage('assets/cripta.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  //adicionando a imagem de fundo
  bg = createSprite(displayWidth / 2 - 20, displayHeight / 2 - 40, 20, 20);
  bg.addImage(bgImg);
  bg.scale = 1.1;

  //criando o sprite do jogador
  player = createSprite(displayWidth - 1150, displayHeight - 300, 50, 50);
  player.addImage(shooterImg);
  player.scale = 0.3;
  player.debug = false;
  player.setCollider('rectangle', 0, 0, 300, 300);

  heart1 = createSprite(displayWidth - 130, 40, 20, 20);
  heart1.addImage(heart1Img);
  heart1.scale = 0.4;
  heart1.visible = false;

  heart2 = createSprite(displayWidth - 170, 40, 20, 20);
  heart2.addImage(heart2Img);
  heart2.scale = 0.4;
  heart2.visible = false;

  heart3 = createSprite(displayWidth - 210, 40, 20, 20);
  heart3.addImage(heart3Img);
  heart3.scale = 0.4;
  heart3.visible = true;

  cripta = createSprite(displayWidth / 2, 500, 500);
  cripta.addImage(criptaImg);
  cripta.scale = 3;
  cripta.visible = false;

  tsunamiZombie = new Group();
  bulletGroup = new Group();
}

function draw() {
  background(0);

  //movendo o jogador para cima e para baixo e tornando o jogo compatível com dispositivos móveis usando toques
  if (keyDown('UP_ARROW') || touches.length > 0) {
    player.y = player.y - 30;
  }
  if (keyDown('DOWN_ARROW') || touches.length > 0) {
    player.y = player.y + 30;
  }
  if (keyDown('LEFT_ARROW') || touches.length > 0) {
    player.x = player.x - 30;
  }
  if (keyDown('RIGHT_ARROW') || touches.length > 0) {
    player.x = player.x + 30;
  }

  //solte balas e mude a imagem do atirador para a posição de tiro quando a tecla de espaço for pressionada
  if (keyWentDown('space')) {
    var bullet = createSprite(player.x, player.y - 30, 20, 10);
    bullet.velocityX = 20;
    bulletGroup.add(bullet);
    bullets = bullets - 1;

    player.addImage(shooter_shooting);
  }
  if (life === 2) {
    heart1.visible = false;
    heart2.visible = true;
    heart3.visible = false;
  }
  if (life === 1) {
    heart1.visible = true;
    heart2.visible = false;
    heart3.visible = false;
  }
  if (life === 0) {
    heart1.visible = false;
    heart2.visible = false;
    heart3.visible = false;
  }

  //o jogador volta à imagem original quando pararmos de pressionar a barra de espaço
  else if (keyWentUp('space')) {
    player.addImage(shooterImg);
  }
  if (tsunamiZombie.isTouching(player)) {
    for (var i = 0; i < tsunamiZombie.length; i++) {
      if (tsunamiZombie[i].isTouching(player)) {
        tsunamiZombie[i].destroy();
        life = life - 1;
        console.log(life);
      }
    }
  }
  if (tsunamiZombie.isTouching(bulletGroup)) {
    for (var i = 0; i < tsunamiZombie.length; i++) {
      if (tsunamiZombie[i].isTouching(bulletGroup)) {
        tsunamiZombie[i].destroy();
        bulletGroup.destroyEach();
        score = score + 2;
      }
    }
  }
  if (bullets === 0) {
    gameState = 'Sem balas';
  }
  if (life < 1 && gameState === 'fight') {
    gameState = 'perdeu';
  }
  if (score === 100) {
    gameState = 'ganhou';
  }
  zombieZ();
  drawSprites();

  textSize(20);
  fill('white');
  text('pontuação: ' + score, displayWidth - 250, 100);
  text('balas: ' + bullets, displayWidth - 250, 140);

  if (gameState === 'perdeu') {
    textSize(80);
    fill('red');
    text('você perdeu', displayWidth / 2 - 250, 400);
    tsunamiZombie.destroyEach();
    player.destroy();
    cripta.visible = true;
  } else if (gameState === 'ganhou') {
    textSize(80);
    fill('green');
    text('você ganhou', displayWidth / 2 - 250, 400);
    tsunamiZombie.destroyEach();
    player.destroy();
    cripta.visible = true;
  } else if (gameState === 'Sem balas') {
    textSize(80);
    fill('blue');
    text('Oh não, acabou suas balas', displayWidth / 2 - 400, 400);
    tsunamiZombie.destroyEach();
    player.destroy();
    bulletGroup.destroyEach();
    cripta.visible = true;
  }
}

function zombieZ() {
  if (frameCount % 50 === 0) {
    zumbi = createSprite(random(700, 1100), random(200, 500), 40, 40);
    zumbi.addImage(zumbiImg);
    zumbi.scale = 0.15;
    zumbi.velocityX = -(3 + score / 10);
    zumbi.setCollider('rectangle', 0, 0, 300, 900);
    zumbi.debug = false;
    zumbi.lifeTime = 600;
    tsunamiZombie.add(zumbi);
  }
}
