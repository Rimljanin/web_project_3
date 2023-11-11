'use client';

import React, { useEffect, useRef, useState } from 'react';
import Player from './player';
import Game from './game';

const GameCanvas = () => {
  // Kreira reference i state varijable za upravljanje igrom
  const canvasRef = useRef<HTMLCanvasElement>(null); // Referenca na HTML canvas element
  const [game, setGame] = useState<Game | null>(null); // Stanje igre, sadrži instancu igre ili null
  const [gameOver, setGameOver] = useState(false); // Stanje koje pokazuje je li igra završila
  const [currentTime, setCurrentTime] = useState(0); // Trenutno vrijeme trajanja igre
  const [bestTime, setBestTime] = useState(0); // Najbolje vrijeme postignuto u igri
  const animationFrameRef = useRef<number | null>(null); // Referenca za praćenje ID-a zahtjeva za animaciju

  // Funkcija za pokretanje ili restartiranje igre
  const startGame = () => {
    setGameOver(false); // Resetira stanje kraja igre
    const canvas = canvasRef.current; // Dohvaća canvas element
    if (!canvas) return; // Prekida funkciju ako canvas nije dostupan

    // Postavlja veličinu canvasa prema dimenzijama prozora preglednika
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Dohvaća 2D kontekst za crtanje na canvasu
    const context = canvas.getContext('2d');
    if (!context) return; // Prekida funkciju ako kontekst nije dostupan

    // Inicijalizira igrača i igru
    const player = new Player({ x: canvas.width / 2, y: canvas.height / 2 }, 50);
    const newGame = new Game(player, () => {
      // Postavlja kraj igre i ažurira trenutno i najbolje vrijeme
      setGameOver(true);
      setCurrentTime(newGame.currentTime);
      setBestTime(newGame.bestTime);
      // Zaustavlja animaciju kad igra završi
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    });

    setGame(newGame); // Postavlja trenutno stanje igre

    
    const handleKeyDown = (event: KeyboardEvent) => {
      // Definira smjer kretanja igrača na temelju pritisnutih tipki
      let direction = { x: 0, y: 0 };
      switch (event.key) {
        case 'ArrowUp': direction.y = -1; break;
        case 'ArrowDown': direction.y = 1; break;
        case 'ArrowLeft': direction.x = -1; break;
        case 'ArrowRight': direction.x = 1; break;
      }
      // Pomakne igrača u definiranom smjeru
      player.move(direction);
      // Obrada izlaska igrača izvan granica canvasa
      if (player.position.x < 0) player.position.x = canvas.width;
      if (player.position.x > canvas.width) player.position.x = 0;
      if (player.position.y < 0) player.position.y = canvas.height;
      if (player.position.y > canvas.height) player.position.y = 0;
    };

    window.addEventListener('keydown', handleKeyDown); // Dodaje event listener za tipkovnicu

    // Glavna funkcija za renderiranje igre
    const render = () => {
      if (newGame.isRunning) {
        // Briše prethodni sadržaj canvasa
        context.clearRect(0, 0, canvas.width, canvas.height);
        // Ažurira stanje igre i crta novi frame
        newGame.update();
        newGame.draw(context);
        // Zatraži novi frame za animaciju
        animationFrameRef.current = requestAnimationFrame(render);
      }
    };

    newGame.start(); // Pokreće igru
    render(); // Pokreće animacijsku petlju

    // Cleanup funkcija koja uklanja event listener i zaustavlja animaciju
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  };

  useEffect(() => {
    startGame(); // Pokreće igru kada je komponenta spremna
  }, []);

  // Funkcija za restartiranje igre
  const restartGame = () => {
    if (animationFrameRef.current) {
      // Zaustavlja trenutnu animaciju
      cancelAnimationFrame(animationFrameRef.current);
    }
    startGame(); // Ponovno pokreće igru
  };

  // Formatira vrijeme iz milisekundi u sekunde
  const formatTime = (time: number) => {
    return (time / 1000).toFixed(2); // Pretvara vrijeme u sekunde s dvije decimale
  };

  // JSX za renderiranje komponente
  return (
    <div>
  <canvas ref={canvasRef} ></canvas>
  {gameOver && (
    <div style={{
      position: 'absolute', 
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white', 
      padding: '20px', 
      border: '2px solid black', 
      borderRadius: '10px', 
      textAlign: 'center'
    }}>
      <h2>Game Over!</h2>
      <p>Current Time: {formatTime(currentTime)} seconds</p>
      <p>Best Time: {formatTime(bestTime)} seconds</p>
      <button onClick={restartGame} style={{ padding: '10px 20px', marginTop: '15px' }}>Restart Game</button>
    </div>
  )}
</div>

  );
};

export default GameCanvas;