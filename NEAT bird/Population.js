class Population {
    constructor(popSize, agent) {
        this.popSize = popSize;
        this.agentType = agent;
        this.history = new History();
        this.agents = [];
        this.avgFit = 0;
        this.bestFit = 0;
        this.solution = null;
        this.currBest = null;
        this.fitnessGoal = 1000;
        for (var i = 0; i < this.popSize; i++) {
            this.agents.push(new this.agentType());
            for (var j = 0; j < 1; j++) {
                this.agents[i].brain.mutateAddConnection(1, this.history);
            }
        }

        this.genomes = [];
        for (var i = 0; i < this.popSize; i++) {
            this.genomes.push(this.agents[i].brain);
        }
        this.speciesPool = [];
        this.species = [];
    }

    createSpeciesPool() {
        for (var i = 0; i < this.species.length; i++) {
            for (var j = 0; j < this.species[i].totalAdjustedFitness * 100; j++) {
                this.speciesPool.push(i);
            }
        }
    }

    getRandomSpecies() {
        return this.speciesPool[Math.floor(Math.random() * this.speciesPool.length)];
    }

    evaluate() {
        //Debugging
        for (var i = 0; i < this.genomes.length; i++) {
            this.genomes[i].rank = "normal";
        }
        var s = 0;
        for (var i = 0; i < this.genomes.length; i++) {
            s += this.genomes[i].fitness;
        }
        s /= this.genomes.length;
        this.avgFit = s;

        var b = -Infinity;
        var bestBrain = null;
        for (var i = 0; i < this.genomes.length; i++) {
            if (this.genomes[i].fitness > b) {
                b = this.genomes[i].fitness;
                bestBrain = this.genomes[i];
            }
        }
        this.bestFit = b;
        this.curBest = bestBrain;
        if (b > this.fitnessGoal) {
            this.solution = bestBrain;
        }
        // Place all genomes into species
        for (var i = 0; i < this.genomes.length; i++) {
            var foundSpecies = false;
            for (var j = 0; j < this.species.length; j++) {
                if (Genome.getDistance(this.genomes[i], this.species[j].mascot, 1, 0.4) < 3) {
                    this.species[j].genomes.push(this.genomes[i]);
                    this.genomes[i].species = j;
                    foundSpecies = true;
                    break;
                }
            }
            if (foundSpecies === false) {
                this.species.push(new Species(this.genomes[i]));
                this.species[this.species.length - 1].genomes.push(this.genomes[i]);
                this.genomes[i].species = this.species.length - 1;
            }
        }

        // Adjust Fitness scores
        for (var i = 0; i < this.genomes.length; i++) {
            this.genomes[i].fitness = this.genomes[i].fitness / this.species[this.genomes[i].species].genomes.length;
            this.species[this.genomes[i].species].totalAdjustedFitness += this.genomes[i].fitness;
        }

        // Place Best Genomes straight into next generation
        var nextGen = [];
        for (var i = 0; i < this.species.length; i++) {
            this.species[i].sortGenomes();
            nextGen.push(this.species[i].genomes[0]);
            nextGen[i].rank = "master";
        }

        // Breed the rest of the generation
        this.createSpeciesPool();
        for (var i = 0; i < this.species.length; i++) {
            this.species[i].createMatingPool();
        }
        while (nextGen.length < this.popSize) {
            var s = this.getRandomSpecies();
            var parentA = this.species[s].getRandomGenome();
            var parentB = this.species[s].getRandomGenome();
            var child;
            if (parentA.fitness > parentB.fitness) {
                child = Genome.crossover(parentA, parentB);
            } else {
                child = Genome.crossover(parentB, parentA);
            }
            if (Math.random() < 0.8) {
                child.mutateShiftWeight(0.9, 0.1);
                child.mutateRandomWeight(0.1);
            }
            child.mutateEnableDisable(0.01);
            child.mutateAddConnection(0.1, this.history);
            child.mutateAddNode(0.03, this.history);
            child.rank = "normal";
            nextGen.push(child);
        }

        // Set everything up for the next generation
        this.species = [];
        this.speciesPool = [];
        this.genomes = [];
        for (var i = 0; i < nextGen.length; i++) {
            this.genomes.push(nextGen[i].copy());
        }
        for (var i = 0; i < this.genomes.length; i++) {
            this.genomes[i].fitness = 0;
            this.genomes[i].species = 0;
        }
        this.agents = [];
        for (var i = 0; i < this.popSize; i++) {
            this.agents.push(new this.agentType(this.genomes[i]));
        }
    }

    run(pipes) {
        var allDead = true;
        for (var i = 0; i < this.popSize; i++) {
            if (this.agents[i].brain.fitness > this.fitnessGoal && this.solution == null) {
                this.agents[i].dead = true;
            }
            if (!this.agents[i].dead) {
                this.agents[i].show();
                this.agents[i].update(pipes);
                allDead = false;
            }
        }
        if (allDead) {
            this.evaluate();
            console.log("Average: " + this.avgFit + " Best: " + this.bestFit);
           // console.log("New Generation");
        }
        return allDead;
    }
}