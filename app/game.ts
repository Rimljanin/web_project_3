import Asteroid from "./asteroid";
import Player from "./player";

class Game {
    asteroids: Asteroid[] = []; //Asteroidi
    player: Player; // Igrač
    isRunning: boolean = false; // Stanje igre
    startTime: number = 0; // Početak vremena igre
    bestTime: number = 0; // Najbolje vrijeme
    currentTime: number = 0; // Trenutno vrijeme
  
  // Callback funkcija koja se poziva kada igra završi
  onGameEnd: () => void;

  // Konstruktor klase Game
  constructor(player: Player, onGameEnd: () => void) {
    this.player = player;
    this.onGameEnd = onGameEnd;
    this.loadBestTime(); // Učitava najbolje vrijeme iz localStorage-a
  }

  // Metoda koja pokreće igru
  start() {
    this.isRunning = true;
    this.startTime = Date.now(); // Postavlja početno vrijeme
    this.generateAsteroids(); // Generira početne asteroide
  }

  // Metoda za generiranje asteroida
  generateAsteroids() {
    const numberOfAsteroids = 5; // Osnovni broj asteroida
    for (let i = 0; i < numberOfAsteroids; i++) {
      this.asteroids.push(this.createRandomAsteroid()); // Dodaje nove asteroide u listu
    }
  }

  // Metoda za stvaranje pojedinačnog nasumičnog asteroida
  createRandomAsteroid(): Asteroid {
    // Postavlja nasumičnu početnu poziciju i brzinu asteroida
    const position = { x: Math.random() * window.innerWidth, y: -50 };
    const velocity = { x: (Math.random() - 0.5) * 2, y: Math.random() * 2 + 1 };
    const size = Math.random() * 30 + 10;
    return new Asteroid(position, velocity, size);
  }

  // Metoda za ažuriranje stanja igre
  update() {
    // Pomiče sve asteroide
    this.asteroids.forEach(asteroid => asteroid.move());

    // Provjerava sudar za svaki asteroid
    this.asteroids.forEach(asteroid => {
        if (this.checkCollision(asteroid, this.player)) {
          this.isRunning = false; // Zaustavlja igru ako dođe do sudara
          this.saveBestTime(); // Sprema najbolje vrijeme
          this.onGameEnd(); // Poziva callback za kraj igre
        }
      });

    // Dodaje nove asteroide s malom vjerojatnošću
    if (Math.random() < 0.01) {
      this.asteroids.push(this.createRandomAsteroid());
    }

    // Ažurira trenutno vrijeme igre
    if (this.isRunning) {
      this.currentTime = Date.now() - this.startTime;
    }
  }

  // Metoda za crtanje igre
  draw(context: CanvasRenderingContext2D) {
    // Crtanje svih asteroida i igrača na canvasu
    this.asteroids.forEach(asteroid => asteroid.draw(context));
    this.player.draw(context);
  }

  // Metoda za spremanje najboljeg vremena
  saveBestTime() {
    // Ažurira najbolje vrijeme ako je trenutno vrijeme veće
    if (!this.bestTime || this.currentTime > this.bestTime) {
      this.bestTime = this.currentTime;
      localStorage.setItem('bestTime', this.bestTime.toString()); // Sprema u localStorage
    }
  }

  // Metoda za učitavanje najboljeg vremena
  loadBestTime() {
    // Učitava najbolje vrijeme iz localStorage-a
    const storedBestTime = localStorage.getItem('bestTime');
    if (storedBestTime) {
      this.bestTime = parseInt(storedBestTime, 10);
    }
  }

  // Metoda za provjeru sudara
  checkCollision(asteroid: Asteroid, player: Player): boolean {
    // Provjerava preklapanje između igrača i asteroida
    const collision = (
      asteroid.position.x < player.position.x + player.size &&
      asteroid.position.x + asteroid.size > player.position.x &&
      asteroid.position.y < player.position.y + player.size &&
      asteroid.size + asteroid.position.y > player.position.y
    );

    // Reproducira zvuk sudara ako dođe do sudara
    if (collision) {
      this.playBeepSound();
    }

    return collision;
  }

  // Metoda za reprodukciju zvuka sudara
  playBeepSound() {
    // Stvaranje i konfiguracija audio konteksta za bip zvuk
    const audioContext = new (window.AudioContext || window.AudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = 1000; // Frekvencija bipa
    gainNode.gain.value = 1; // Jačina zvuka
    oscillator.start(audioContext.currentTime); // Početak zvuka
    oscillator.stop(audioContext.currentTime + 0.3); // Kraj zvuka
  }
}

export default Game;
