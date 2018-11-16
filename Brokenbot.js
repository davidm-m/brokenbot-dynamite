class Brokenbot {
    constructor() {
        this.myDynamite = 100;
        this.opponentDynamite = 100;
    }

    makeMove(gamestate) {
        this.getLastWinner(gamestate);
        const waterOdds = this.getWaterOdds(gamestate);
        const dynamiteOdds = this.myDynamite > 0 ? 0.1 : 0;
        return this.getMoveByOdds(waterOdds, dynamiteOdds);
    }

    getWaterOdds(gamestate) {
        if (!this.opponentDynamite > 0) {
            return 0;
        } else if (gamestate.rounds.length < 10) {
            return 0.15;
        } else {
            const recentRounds = gamestate.rounds.slice(-10);
            const numberOfDynamite = recentRounds.filter(round => round.p2 === "D").length;
            return numberOfDynamite/10;
        }
    }

    getRandomMove() {
        let moves = ["R", "P", "S"];
        if (this.myDynamite > 0) {
            moves.push("D");
        }
        if (this.opponentDynamite > 0) {
            moves.push("W");
        }
        const result = Utility.getRandomFromArray(moves);
        if (result === "D") {
            this.myDynamite--;
        }
        return result;
    }

    getMoveByOdds(wOdds, dOdds) {
        const random = Math.random();
        if (random < wOdds) {
            return "W";
        } else if (random < (dOdds + wOdds)) {
            this.myDynamite--;
            return "D";
        } else {
            return this.getRandomRPS();
        }
    }

    getRandomRPS() {
        return Utility.getRandomFromArray(["R", "P", "S"]);
    }

    getLastWinner(gamestate) {
        if (!gamestate.rounds.length > 0) {
            return;
        }
        if (gamestate.rounds[gamestate.rounds.length - 1].p2 === "D") {
            this.opponentDynamite--;
        }
        return Utility.getWinner(
            gamestate.rounds[gamestate.rounds.length - 1].p1,
            gamestate.rounds[gamestate.rounds.length - 1].p2
        );
    }

    
}

class Utility {

    static getRandomFromArray(array) {
        const random = Math.floor(Math.random() * array.length);
        return array[random];
    }

    static getWinner(p1, p2) {
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
