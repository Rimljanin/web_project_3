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
        // Postavljanje sjena
        context.shadowColor = 'rgba(0, 0, 0, 0.7)'; // Boja sjene
        context.shadowBlur = 10; 
        context.shadowOffsetX = 5; // Horizontalni pomak sjene
        context.shadowOffsetY = 5; // Vertikalni pomak sjene
    
        // Crtanje igrača
        context.fillStyle = this.color;
        context.fillRect(this.position.x, this.position.y, this.size, this.size);
    
        // Resetiranje postavki sjene
        context.shadowColor = 'transparent';
      }
  }
  
  export default Player;
  