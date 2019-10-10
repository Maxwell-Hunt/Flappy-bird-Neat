class Node {
    constructor(number, type) {
        this.number = number;
        this.type = type;
        this.value = 0;
        this.outputConnections = [];
        this.inputConnections = [];
        this.engaged = false;
    }

    activation(x) {
        return 1 / (1 + Math.exp(-4.9 * x));
    }

    ready(g) {
        var r = true;
        for (var i = 0; i < this.inputConnections.length; i++) {
            if (g.nodes[g.getNodeIndex(this.inputConnections[i].fromNode)].engaged) {
                continue;
            }
            r = false;
            break;
        }
        return r;
    }

    engage(g) {
        this.engaged = true;
        if (this.type !== "input") {
            this.value = this.activation(this.value);
        }
        for (var i = 0; i < this.outputConnections.length; i++) {
            if (this.outputConnections[i].enabled === true) {
                g.nodes[g.getNodeIndex(this.outputConnections[i].toNode)].value += this.value * this.outputConnections[i].weight;
            }
        }
    }

    isConnectedTo(genome, other) {
        if (other === this.number) {
            return true;
        }
        for (var i = 0; i < this.inputConnections.length; i++) {
            if (genome.nodes[genome.getNodeIndex(this.inputConnections[i].fromNode)].isConnectedTo(genome,other)) {
                return true;
            }
        }
        return false;
    }

    copy() {
        var co = new Node(this.number, this.type);
        co.value = this.value;
        co.outputConnections = [];
        for (var i = 0; i < this.outputConnections.length; i++) {
            co.outputConnections.push(this.outputConnections[i].copy());
        }
        co.inputConnections = [];
        for (var i = 0; i < this.inputConnections.length; i++) {
            co.inputConnections.push(this.inputConnections[i].copy());
        }
        return co;
    }
}