class Player {
    constructor(genome) {
        if (!genome) {
            this.brain = new Genome(5, 2);
        } else {
            this.brain = genome;
        }
        this.x = 35;
        this.r = 17;
        this.y = canvas.height / 2;
        this.vel = 0;
        this.acc = 0.5;
        this.dead = false;
    }

    show() {
        if (this.brain.rank === "normal") {
            c.fillStyle = "rgba(255,255,255,0.5)";
        } else {
            c.fillStyle = "lime";
        }
        c.beginPath();
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        c.fill();
        c.stroke();
    }

    jump() {
        this.vel = -8;
    }

    think(pipes) {
        var inputs = [];
        inputs.push(this.vel / 19);
        inputs.push(this.y / canvas.height);
        if (pipes[0]) {
            inputs.push(pipes[0].x / canvas.width);
            inputs.push(pipes[0].h1 / canvas.width);
            inputs.push(pipes[0].y2 / canvas.width);
        } else {
            for (var i = 0; i < 3; i++) {
                inputs.push(0);
            }
        }
        var thought = this.brain.feedForward(inputs);
        if (thought[0] > thought[1]) {
            this.jump();
        }
    }

    checkDeath(pipes) {
        if (pipes[0]) {
            if (this.x + this.r > pipes[0].x && this.x - this.r < pipes[0].x + pipes[0].w) {
                if (!(this.y - this.r > pipes[0].h1 && this.y + this.r < pipes[0].y2)) {
                    this.dead = true;
                }
            }
        }

        if (this.y + this.r > canvas.height || this.y - this.r < 0) {
            this.dead = true;
        }
    }

    update(pipes) {
        this.y += this.vel;
        this.vel += this.acc;
        this.think(pipes);
        this.checkDeath(pipes);
        this.brain.fitness++;
    }
}
