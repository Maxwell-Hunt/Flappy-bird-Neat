var pop;
var pipes = [];
var counter = 0;
var slider;
function setup() {
    pop = new Population(500, Player);
    slider = document.getElementById("slider");
    slider.value = 1;
}

function updatePipes() {
    if (counter % 130 === 0) {
        pipes.push(new Pipe());
    }

    for (var i = pipes.length - 1; i >= 0; i--) {
        pipes[i].show();
        pipes[i].update();
        if (pipes[i].x < -pipes[i].w) {
            pipes.splice(i, 1);
        }
    }
}

function draw() {
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < slider.value; i++) {
        updatePipes();
        if (pop.run(pipes)) {
            pipes = [];
            counter = 0;
        }
        counter++;
    }
    requestAnimationFrame(draw);
}

setup();
draw();