type Vector = {
    x: number;
    y: number;
  };
  
  class Player {
    position: Vector; // Pozicija igrača na canvasu
    size: number; // Veličina igrača
    color: string = 'red'; // Boja igrača
  
    constructor(position: Vector, size: number) {
      this.position = position;
      this.size = size;
    }
  
    // Micanje igrača u odnosu na pritisnute tipke
    move(direction: Vector) {
      this.position.x += direction.x * 5; 
      this.position.y += direction.y * 5;
    }
  
    // Crtanje igrača na canvasu
    draw(context: CanvasRenderingContext2D) {
      context.fillStyle = this.color;
      context.fillRect(this.position.x, this.position.y, this.size, this.size);
    }
  }
  
  export default Player;
  