// Juego "Thor y Loki: El robo de Mjölnir" + Minijuego "La Huida"

// tp final
// integrantes: Angel Matias Ojeda  122819/5, Nadia B. Romero 118770/6
// com 3, prof David Bodeian :D
// prof David Bodeian :D


let pantalla = "inicio";
let imgs = {};
let textos = {};
let inicio_mus;
let ingame_mus;
// musiquita del minijuego
let minijuego_mus;
let muted = false;

// --- Variables para el Minijuego ---
let miJuego; // Objeto principal del minijuego
let juegoIniciado = false;

// --- para el cambio de música con fade ---
let currentMusic = null;
let targetMusic = null;
let fadeDuration = 1.0;
let fadeStartTime = 0;
let fading = false;

// --- para que los botones no se activen mil veces ---
let clickBloqueado = false;

function preload() {
  // cargo las imágenes de la historia
  imgs["inicio"] = loadImage("data/inicio.png");
  imgs["creditos"] = loadImage("data/creditos.jpg");
  imgs["intro"] = loadImage("data/intro.png");
  imgs["solo"] = loadImage("data/solo.png");
  imgs["loki"] = loadImage("data/loki.png");
  imgs["thrym"] = loadImage("data/thrym.png");
  imgs["freya"] = loadImage("data/freya.png");
  imgs["plan"] = loadImage("data/plan.png");
  imgs["boda"] = loadImage("data/boda.png");
  imgs["banquete"] = loadImage("data/banquete.png");
  imgs["martillo"] = loadImage("data/martillo.png");
  imgs["escape"] = loadImage("data/escape.png"); // Usada si ganan el minijuego
  imgs["asgard"] = loadImage("data/asgard.png");
  imgs["lokiFinal"] = loadImage("data/loki_final.png");
  imgs["finalHeroico"] = loadImage("data/final_heroico.png");
  imgs["finalMalo"] = loadImage("data/final_malo.png");

  // placeholders
  imgs["trineo_placeholder"] = loadImage("https://placehold.co/40x60/red/white.png?text=Trineo");
  imgs["gigante_placeholder"] = loadImage("https://placehold.co/50x50/blue/white.png?text=Gigante");
  imgs["gigante"] = loadImage("data/gigante.png");
  imgs["trineo"] = loadImage("data/trineo_thorloki.png");

  imgs["cursor"] = loadImage("data/cursor.png");
  imgs["mute"] = loadImage("data/mute.png");
  imgs["unmute"] = loadImage("data/unmute.png");


  inicio_mus = loadSound('sonidos/gwynlordofcinder_motoisakuraba.mp3');
  ingame_mus = loadSound('sonidos/deslienssolides_shirosagisu.mp3');
  // musica en el jueguito
  minijuego_mus = loadSound('sonidos/planetsakaar_markmothersbaugh.mp3');
}

function setup() {
  createCanvas(640, 480);
  textFont("Georgia");
  textAlign(CENTER, CENTER);
  noCursor();

  // Textos de la historia
  textos["intro"] = "Thor descubre que su martillo ha sido robado.\n¿Va solo a Jotunheim o pide ayuda a Loki?";
  textos["solo"] = "Thor viaja solo a Jotunheim.\n¿Elige atacar silenciosamente o ir cual kamikaze?";
  textos["loki"] = "Thor pide ayuda a Loki.\nJuntos parten hacia Jotunheim.";
  textos["thrym"] = "El gigante Thrym exige a Freyja como esposa a cambio del martillo.\nLoki presenta un plan fuera de lo normal";
  textos["freya"] = "Freyja rechaza indignada.\n¿Qué harán ahora?";
  textos["plan"] = "Loki idea un plan: disfrazar a Thor de novia.";
  textos["boda"] = "Thor disfrazado y Loki llegan al banquete nupcial.";
  textos["banquete"] = "Thor come demasiado y casi arruina el plan.\nThrym sospecha...";
  textos["martillo"] = "El martillo aparece para bendecir la unión.\nEs la oportunidad perfecta.";
  // textos nuevos juego
  textos["escape"] = "¡Lo lograron! Thor y Loki escapan a toda velocidad con el martillo.";
  textos["asgard"] = "De vuelta en Asgard, todos esperan saber la verdad.";
  textos["lokiFinal"] = "Loki manipula la situación para quedar como si él haya sido el héroe.";
  textos["finalHeroico"] = "¡Thor recupera el martillo y derrota a los gigantes!\nFinal Heroico.";
  textos["finalMalo"] = "No pudieron escapar. Los gigantes los atraparon.\nFinal Malo.";

  // inicializar juego
  miJuego = new Juego();
}

function draw() {
  background(20);
  manejarMusica();

  // maquina de estados principal
  if (pantalla === "inicio") {
    mostrarInicio();
  } else if (pantalla === "creditos") {
    mostrarCreditos();
  } else if (pantalla === "minijuego") {
    // Aquí corre el minijuego
    if (!juegoIniciado) {
      miJuego.iniciar();
      juegoIniciado = true;
    }
    miJuego.actualizar();
    miJuego.dibujar();
  } else {
    mostrarPantalla();
  }

  // mute y cursor
  dibujarUI();
}

function dibujarUI() {
  // ícono de mute
  let iconX = 10;
  let iconY = 10;
  let iconSize = 40;

  if (imgs["mute"] && imgs["unmute"]) {
    image(muted ? imgs["mute"] : imgs["unmute"], iconX, iconY, iconSize, iconSize);
  } else {

    fill(100);
    rect(iconX, iconY, iconSize, iconSize);
    fill(255);
    textSize(10);
    text(muted ? "MUTE" : "ON", iconX + 20, iconY + 20);
  }

  // dibuja el cursor personalizado si existe
  if (imgs["cursor"]) {
    image(imgs["cursor"], mouseX, mouseY, 32, 32);
  }
}


// MINIJUEGO ! ! ! :D


//  1 jugador
class Trineo {
  constructor() {
    this.ancho = 95;
    this.alto = 95;
    this.x = width / 2;
    this.y = height - 100;
    this.velocidad = 5;
    this.color = color(255, 0, 0); // placeholder
  }

  actualizar() {
    // movimiento
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.velocidad;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.velocidad;
    }
    // limites del camino
    this.x = constrain(this.x, 120, width - 120);
  }

  dibujar() {
    //png trineo de thor loki
    if (imgs["trineo"] && imgs["trineo"].width > 0) {
      imageMode(CENTER);
      image(imgs["trineo"], this.x, this.y, this.ancho, this.alto);
      imageMode(CORNER);
    } else if (imgs["trineo_placeholder"] && imgs["trineo_placeholder"].width > 0) {
      imageMode(CENTER);
      image(imgs["trineo_placeholder"], this.x, this.y, this.ancho, this.alto);
      imageMode(CORNER);
    } else {
      fill(this.color);
      rectMode(CENTER);
      rect(this.x, this.y, this.ancho, this.alto);
      rectMode(CORNER);
    }
  }
  // hitbox
  chocaCon(gigante) {

    let margen = 25; 
    if (this.x + this.ancho/2 - margen > gigante.x - gigante.ancho/2 + margen &&
      this.x - this.ancho/2 + margen < gigante.x + gigante.ancho/2 - margen &&
      this.y + this.alto/2 - margen > gigante.y - gigante.alto/2 + margen &&
      this.y - this.alto/2 + margen < gigante.y + gigante.alto/2 - margen) {
      return true;
    }
  
    return false;
  }
}

//  2 gigantes
class Gigante {
  constructor(x, y, velocidad) {
    this.x = x;
    this.y = y;
    // tamaño de la imagen de los gigantes
    this.ancho = 85;
    this.alto = 85;
    this.velocidad = velocidad;
    this.pasado = false; // para saber si ya lo esquivas
  }

  actualizar() {
    this.y += this.velocidad;
  }

  dibujar() {
    //png de los gigantes
    if (imgs["gigante"] && imgs["gigante"].width > 0) {
      imageMode(CENTER);
      image(imgs["gigante"], this.x, this.y, this.ancho, this.alto);
      imageMode(CORNER);
    } else if (imgs["gigante_placeholder"] && imgs["gigante_placeholder"].width > 0) {
      imageMode(CENTER);
      image(imgs["gigante_placeholder"], this.x, this.y, this.ancho, this.alto);
      imageMode(CORNER);
    } else {
      // fallback gráfico
      fill(0, 0, 255); // placeholder
      ellipse(this.x, this.y, this.ancho, this.alto);
    }
  }

  estaFueraPantalla() {
    return (this.y > height + 50);
  }
}

//  3 camino
class Camino {
  constructor() {
    this.lineasY = 0;
    this.velocidad = 8; // que tan rápido se mueve el suelo
  }

  actualizar() {
    this.lineasY += this.velocidad;
    if (this.lineasY > 50) {
      this.lineasY = 0;
    }
  }

  dibujar() {
    // fondo
    background(200, 220, 255);

    // camino principal
    noStroke();
    fill(230, 240, 255);
    rectMode(CORNER);
    rect(100, 0, width - 200, height);

    // bordes
    fill(150, 180, 200);
    rect(0, 0, 100, height);
    rect(width - 100, 0, 100, height);

    // lineas del medio
    stroke(255);
    strokeWeight(4);
    for (let i = -50; i < height; i += 50) {
      line(width / 2, i + this.lineasY, width / 2, i + this.lineasY + 25);
    }
    noStroke();
  }
}

// 4 juego controlador pprincipal
class Juego {
  constructor() {
    this.trineo = new Trineo();
    this.camino = new Camino();
    this.gigantes = []; // ARREGLO de objetos
    this.tiempoTotal = 30; // 30 segundos para escapar
    this.tiempoRestante = this.tiempoTotal;
    this.vidas = 3;
    this.estado = "instrucciones"; // estados: instrucciones, jugando, ganado, perdido
    this.timerGigantes = 0;
  }

  iniciar() {
    //reiniciar variables para una nueva partida
    this.trineo = new Trineo();
    this.gigantes = [];
    this.tiempoRestante = this.tiempoTotal;
    this.vidas = 3;
    this.estado = "instrucciones";
    this.timerGigantes = 0;
  }

  actualizar() {
    if (this.estado === "jugando") {
      this.camino.actualizar();
      this.trineo.actualizar();

      // bajar el tiempo
      if (frameCount % 60 == 0 && this.tiempoRestante > 0) {
        this.tiempoRestante--;
      }

      // ganaste si el tiempo llega a 0
      if (this.tiempoRestante <= 0) {
        this.estado = "ganado";
      }

      // generar gigantescada 30 frames
      this.timerGigantes++;
      if (this.timerGigantes > 30) {
        // posición X aleatoria dentro del camino
        let xAzar = random(130, width - 130);
        // velocidad aleatoria para variar dificultad
        let velAzar = random(4, 7);
        this.gigantes.push(new Gigante(xAzar, -50, velAzar));
        this.timerGigantes = 0;
      }

      // cctualizar y verificar colisiones de gigantes
      for (let i = this.gigantes.length - 1; i >= 0; i--) {
        let g = this.gigantes[i];
        g.actualizar();

        // verificar choque
        if (this.trineo.chocaCon(g)) {
          this.vidas--;
          // remover gigante para no chocar mil veces con el mismo
          this.gigantes.splice(i, 1);

          // BUG SOLUCIONADO: Se agrega la comprobación de vidas <= 0
          if (this.vidas <= 0) {
            this.estado = "perdido";
          }
          // fin bug
        }

        // eliminar si sale de pantalla
        // Se añade verificacion extra por si ya fue eliminado por choque
        if (this.gigantes[i] && g.estaFueraPantalla()) {
          this.gigantes.splice(i, 1);
        }
      }
    }
  }

  dibujar() {
    this.camino.dibujar();

    if (this.estado === "instrucciones") {
      // instrucciones
      fill(0, 0, 0, 200);
      rectMode(CORNER);
      rect(50, 100, width - 100, height - 200, 20);
      fill(255);
      textSize(24);
      text("¡HUYE DE LOS GIGANTES!", width/2, 150);
      textSize(18);
      text("Usa las flechas IZQUIERDA y DERECHA\npara mover el trineo.", width/2, 220);
      text("Esquiva los obstáculos durante " + this.tiempoTotal + " segundos.", width/2, 280);

      boton("¡EMPEZAR!", width/2, 350, () => this.estado = "jugando");
    } else if (this.estado === "jugando") {
      // dibujar elementos
      for (let i = 0; i < this.gigantes.length; i++) {
        this.gigantes[i].dibujar();
      }
      this.trineo.dibujar();

      // HUD
      this.dibujarHUD();
    } else if (this.estado === "ganado") {
      // mensaje victoria
      fill(0, 150, 0, 200);
      rectMode(CENTER);
      rect(width/2, height/2, 400, 200, 20);
      fill(255);
      textSize(30);
      text("¡ESCAPARON!", width/2, height/2 - 30);
      textSize(18);
      text("Thor y Loki han huido con el Mjölnir.", width/2, height/2 + 20);

      // boton continuar
      boton("Continuar", width/2, height/2 + 80, () => {
        pantalla = "escape";
        juegoIniciado = false; //
      }
      );
    } else if (this.estado === "perdido") {
      // Mensaje de derrota
      fill(150, 0, 0, 200);
      rectMode(CENTER);
      rect(width/2, height/2, 400, 200, 20);
      fill(255);
      textSize(30);
      text("¡ATRAPADOS!", width/2, height/2 - 30);
      textSize(18);
      text("Los gigantes han destruido el trineo.", width/2, height/2 + 20);

      // boton reintentar o rendirse
      boton("Reintentar", width/2 - 100, height/2 + 80, () => this.iniciar());
      boton("Rendirse", width/2 + 100, height/2 + 80, () => {
        pantalla = "finalMalo";
        juegoIniciado = false;
      }
      );
    }
  }

  dibujarHUD() {
    // barra superior negra
    fill(0);
    rectMode(CORNER);
    rect(0, 0, width, 40);

    // Textos
    fill(255);
    textSize(18);
    textAlign(LEFT, CENTER);
    text("Tiempo: " + this.tiempoRestante + "s", 20, 20);
    textAlign(RIGHT, CENTER);
    // vidas como corazones
    let textoVidas = "❤❤❤";
    if (this.vidas === 2) textoVidas = "❤❤";
    if (this.vidas === 1) textoVidas = "❤";
    if (this.vidas <= 0) textoVidas = "";
    fill(255, 100, 100);
    text("Vidas: " + textoVidas, width - 20, 20);
    textAlign(CENTER, CENTER);
  }
}



// SISTEMA PRINCIPAL (MUSICA, PANTALLAS, BOTONES)


// crossfade musica
function manejarMusica() {
  if (muted) {
    if (currentMusic) currentMusic.stop();
    if (targetMusic) targetMusic.stop();
    currentMusic = null;
    targetMusic = null;
    fading = false;
    return;
  }

  // que música suena en qué pantalla
  let musicaDeseada;
  if (pantalla === "minijuego") {
    musicaDeseada = minijuego_mus;
  } else if (pantalla === "inicio" || pantalla === "creditos" || pantalla === "finalHeroico" ||
    pantalla === "finalMalo" || pantalla === "escape" || pantalla === "lokiFinal") {
    musicaDeseada = inicio_mus;
  } else {
    musicaDeseada = ingame_mus;
  }

  // si no hay música activa, iniciarla directamente (sin fade)
  if (!currentMusic && musicaDeseada) {
    if (musicaDeseada.isLoaded()) {
      musicaDeseada.loop();
      musicaDeseada.setVolume(1);
      currentMusic = musicaDeseada;
      targetMusic = null;
      fading = false;
    }
    return;
  }

  // la musica tiene crossfade para que no suene tan saturado
  if (currentMusic !== musicaDeseada) {

    if (fading && targetMusic === musicaDeseada) {
    } else {
      targetMusic = musicaDeseada;
      // verificacion por si el sonido no cargo
      if (targetMusic && targetMusic.isLoaded() && !targetMusic.isPlaying()) {
        targetMusic.loop();
        targetMusic.setVolume(0);
      }
      iniciarFade();
    }
  }


  if (fading) {
    let elapsed = (millis() - fadeStartTime) / 1000.0;
    let t = constrain(elapsed / fadeDuration, 0, 1);

    if (currentMusic) {
      currentMusic.setVolume(1 - t);
    }
    if (targetMusic) {
      targetMusic.setVolume(t);
    }

    if (t >= 1) {
      if (currentMusic && currentMusic.isPlaying()) currentMusic.stop();
      currentMusic = targetMusic;
      targetMusic = null;
      fading = false;
    }
  }
}

function iniciarFade() {
  fadeStartTime = millis();
  fading = true;
  // asegura el volumen en valor inicial
  if (currentMusic) currentMusic.setVolume(1);
  if (targetMusic) targetMusic.setVolume(0);
}

//pantallas de la historia
function mostrarInicio() {
  if (imgs["inicio"]) image(imgs["inicio"], 0, 0, width, height);

  fill(255);
  textSize(28);
  // sombra del texto
  fill(0, 150);
  text("Thor y Loki: El robo de Mjölnir", width/2 + 2, height/3 + 2);
  fill(255);
  text("Thor y Loki: El robo de Mjölnir", width/2, height/3);

  boton("Empezar", width/2, height/2, () => pantalla = "intro");
  boton("Créditos", width/2, height/2 + 60, () => pantalla = "creditos");
}

function mostrarCreditos() {
  if (imgs["creditos"]) image(imgs["creditos"], 0, 0, width, height);
  rectMode(CENTER);
  fill(20, 20, 50, 200);
  rect(width/2, height/2, 300, 120, 5);
  fill(255);
  textSize(22);
  text("Créditos", width/2, height/2 - 30);
  textSize(16);
  text("Angel Ojeda\nNadia Romero\nObra original: mito nórdico de Thrym", width/2, height/2 + 20);
  boton("Volver al inicio", width/2, height - 80, () => pantalla = "inicio");
}

function mostrarPantalla() {

  if (imgs[pantalla]) {
    image(imgs[pantalla], 0, 0, width, height);
  } else {
    background(50);
  }

  // caja de texto
  rectMode(CENTER);
  fill(0, 0, 0, 150);
  rect(width/2, 60, width - 40, 80, 10);

  fill(255);
  textSize(16);
  text(textos[pantalla], width/2, 60);

  //botones segun pantalla
  if (pantalla === "intro") {
    boton("Ir solo", width/2 - 120, height - 100, () => pantalla = "solo");
    boton("Pedir ayuda a Loki", width/2 + 120, height - 100, () => pantalla = "loki");
  } else if (pantalla === "solo") {
    boton("Silencioso", width/2 - 120, height - 100, () => pantalla = "finalHeroico");
    boton("Kamikaze", width/2 + 120, height - 100, () => pantalla = "finalMalo");
  } else if (pantalla === "loki") {
    boton("Seguir al encuentro", width/2, height - 100, () => pantalla = "thrym");
  } else if (pantalla === "thrym") {
    boton("Hablar con Freyja", width/2 - 120, height - 100, () => pantalla = "freya");
    boton("Aceptar plan de Loki", width/2 + 120, height - 100, () => pantalla = "plan");
  } else if (pantalla === "freya") {
    boton("Abandonar misión", width/2 - 120, height - 100, () => pantalla = "finalMalo");
    boton("Aceptar plan de Loki", width/2 + 120, height - 100, () => pantalla = "plan");
  } else if (pantalla === "plan") {
    boton("Ir a la boda", width/2, height - 100, () => pantalla = "boda");
  } else if (pantalla === "boda") {
    boton("Seguir con el plan", width/2, height - 100, () => pantalla = "banquete");
  } else if (pantalla === "banquete") {
    boton("Esperar el martillo", width/2, height - 100, () => pantalla = "martillo");
  } else if (pantalla === "martillo") {
    boton("Atacar ahora", width/2 - 120, height - 100, () => pantalla = "finalHeroico");
    // ir al minijuego
    boton("Escapar con Loki", width/2 + 120, height - 100, () => pantalla = "minijuego");
  } else if (pantalla === "escape") {
    boton("Volver a Asgard", width/2, height - 100, () => pantalla = "asgard");
  } else if (pantalla === "asgard") {
    boton("Contar la verdad", width/2 - 120, height - 100, () => pantalla = "finalHeroico");
    boton("Mentir", width/2 + 120, height - 100, () => pantalla = "lokiFinal");
  } else if (pantalla === "lokiFinal" || pantalla === "finalHeroico" || pantalla === "finalMalo") {
    boton("Volver al inicio", width/2, height - 100, () => pantalla = "inicio");
  }
}

//  botones
function boton(txt, x, y, accion) {
  rectMode(CENTER);
  // Efecto simple de hover
  if (mouseX > x - 100 && mouseX < x + 100 && mouseY > y - 20 && mouseY < y + 20) {
    fill(70, 70, 100, 220); // Un poco más claro si el mouse está encima
  } else {
    fill(50, 50, 80, 200);
  }
  rect(x, y, 200, 40, 10);
  fill(255);
  textSize(16);
  text(txt, x, y);

  // hace que el click funcione una sola vez
  if (!clickBloqueado &&
    mouseIsPressed &&
    mouseX > x - 100 && mouseX < x + 100 &&
    mouseY > y - 20 && mouseY < y + 20) {
    accion();
    clickBloqueado = true;
  }
}

// cuando soltás el mouse se puede volver a hacer clic
function mouseReleased() {
  clickBloqueado = false;
}

// --- botón de mute global ---
function mouseClicked() {
  let iconX = 10, iconY = 10, iconSize = 40;
  if (mouseX > iconX && mouseX < iconX + iconSize && mouseY > iconY && mouseY < iconY + iconSize) {
    muted = !muted;
    if (muted) {
      if (currentMusic) currentMusic.stop();
      if (targetMusic) targetMusic.stop();
    }

    return false;
  }
}  
