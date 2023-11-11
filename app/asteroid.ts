type Vector = {
    x: number;
    y: number;
  };
  
  class Asteroid {
    position: Vector; // Pozicija asteroida
    velocity: Vector; // Brzina i smjer kretanja
    size: number; // Veličina asteroida
    color: string = 'grey'; // Boja asteroida
  
    constructor(position: Vector, velocity: Vector, size: number) {
      this.position = position;
      this.velocity = velocity;
      this.size = size;
    }
  
    // Micanje asteroida
    move() {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
  
    // Crtanje asteroida na canvasu
    draw(context: CanvasRenderingContext2D) {
      context.fillStyle = this.color;
      context.fillRect(this.position.x, this.position.y, this.size, this.size);
    }
  }
  
  export default Asteroid;
  
  