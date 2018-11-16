class Brokenbot {
    constructor() {
        this.myDynamite = 100;
        this.opponentDynamite = 100;
    }

    makeMove(gamestate) {
        this.getLastWinner(gamestate);
        return this.getRandomMove();
    }

    getRandomMove() {
        let moves = ["R", "P", "S"];
        if (this.myDynamite > 0) {
            moves.push("D");
        }
        if (this.opponentDynamite > 0) {
            moves.push("W");
        }
        const result = this.getRandomFromArray(moves);
        if (result === "D") {
            this.myDynamite--;
        }
        return result;
    }

    getRandomRPS() {
        return this.getRandomFromArray(["R", "P", "S"]);
    }

    getRandomFromArray(array) {
        const random = Math.floor(Math.random() * array.length);
        return array[random];
    }

    getLastWinner(gamestate) {
        if (!gamestate.rounds.length > 0) {
            return;
        }
        if (gamestate.rounds[gamestate.rounds.length - 1].p2 === "D") {
            this.opponentDynamite--;
        }
        return this.getWinner(
            gamestate.rounds[gamestate.rounds.length - 1].p1,
            gamestate.rounds[gamestate.rounds.length - 1].p2
        );
    }

    getWinner(p1, p2) {
        if (p1 === p2) {
            return 0;
        } else if (p1 === "D") {
            if (p2 === "W") {
                return 2;
            } else {
                return 1;
            }
        } else if (p1 === "W") {
            if (p2 === "D") {
                return 1;
            } else {
                return 2;
            }
        } else if (p1 === "R") {
            if (p2 === "S") {
                return 1;
            } else {
                return 2;
            }
        } else if (p1 === "P") {
            if (p2 === "R") {
                return 1;
            } else {
                return 2;
            }
        } else if (p1 === "S") {
            if (p2 === "P") {
                return 1;
            } else {
                return 2;
            }
        }
    }
}

module.exports = new Brokenbot();
