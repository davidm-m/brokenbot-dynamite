class Brokenbot {
    constructor() {
        this.myDynamite = 100;
        this.opponentDynamite = 100;
        this.minDynamite = 1;
    }

    makeMove(gamestate) {
        this.getLastWinner(gamestate.rounds);
        if (Utility.getDrawStreak(gamestate.rounds) > 1 && this.myDynamite > this.minDynamite) {
            this.myDynamite--;
            return "D";
        }
        const waterOdds = this.getWaterOdds(gamestate.rounds);
        const dynamiteOdds = (this.myDynamite > this.minDynamite && gamestate.rounds.length > 20) ? 1/15 : 0;
        return this.getMoveByOdds(waterOdds, dynamiteOdds);
    }

    getWaterOdds(rounds) {
        let numOfRounds = 20;
        if (!this.opponentDynamite > 0 || rounds.length === 0) {
            return 0;
        } else if (rounds.length < 20) {
            numOfRounds = rounds.length;
        }
        const recentRounds = rounds.slice(-numOfRounds);
        const numberOfDynamite = recentRounds.filter(round => round.p2 === "D").length;
        return numberOfDynamite/numOfRounds;
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

    getLastWinner(rounds) {
        if (!rounds.length > 0) {
            return;
        }
        if (rounds[rounds.length - 1].p2 === "D") {
            this.opponentDynamite--;
        }
        return Utility.getWinner(
           rounds[rounds.length - 1].p1,
            rounds[rounds.length - 1].p2
        );
    }
    
}

class Utility {

    static getDrawStreak(rounds) {
        if (rounds.length === 0) {
            return 0;
        }
        let streak = 0;
        for (let i = rounds.length - 1; i >= 0; i--) {
            if (Utility.getWinner(rounds[i].p1, rounds[i].p2) === 0) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }

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
