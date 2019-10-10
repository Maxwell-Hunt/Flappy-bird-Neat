class Pipe {
    constructor() {
        this.x = canvas.width;
        this.y1 = 0;
        this.h1 = Math.random() * (canvas.height - 200) + 50;
        this.w = 40;
        this.gap = 150;
        this.y2 = this.h1 + this.gap;
        this.h2 = canvas.height - this.y2;
        this.vel = -2;
    }

    show() {
        c.fillStyle = "white";
        c.fillRect(this.x, this.y1, this.w, this.h1);
        c.fillRect(this.x, this.y2, this.w, this.h2);
    }

    update() {
        this.x += this.vel;
    }
}