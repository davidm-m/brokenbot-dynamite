class Brokenbot {
    constructor() {
        this.myDynamite = 100;
        this.opponentDynamite = 100;
        this.minDynamite = 5;
        this.opponentDrawCounter = 100;
        this.myScore = 0;
        this.opponentScore = 0;
        this.breaksWithDynamite = false;
        this.breaksWithWater = false;
        this.opponentMoves = {
            R: 0,
            P: 0,
            S: 0,
        }
    }

    makeMove(gamestate) {
        const lastWinner = this.getLastWinner(gamestate.rounds);
        const drawStreak = Utility.getDrawStreak(gamestate.rounds);
        const prevDrawStreak = Utility.getDrawStreak(
            gamestate.rounds.slice(0, -1)
        );
        if (prevDrawStreak > 0 && drawStreak === 0) {
            if (gamestate.rounds[gamestate.rounds.length - 1].p2 === "D") {
                this.breaksWithDynamite = true;
            } else if (
                gamestate.rounds[gamestate.rounds.length - 1].p2 === "W"
            ) {
                this.breaksWithWater = true;
            }
            if (
                gamestate.rounds[gamestate.rounds.length - 1].p2 === "D" ||
                gamestate.rounds[gamestate.rounds.length - 1].p2 === "W"
            ) {
                this.opponentDrawCounter = prevDrawStreak;
            } else {
                this.opponentDrawCounter = prevDrawStreak + 1;
            }
        }
        if (drawStreak > 0) {
            if (gamestate.rounds[gamestate.rounds.length - 1].p2 === "D") {
                this.breaksWithDynamite = true;
                this.opponentDrawCounter = drawStreak - 1;
            } else if (
                gamestate.rounds[gamestate.rounds.length - 1].p2 === "W"
            ) {
                this.breaksWithWater = true;
                this.opponentDrawCounter = drawStreak - 1;
            }
            if (drawStreak >= this.opponentDrawCounter) {
                if (this.breaksWithWater) {
                    return this.getRandomRPS();
                } else if (this.breaksWithDynamite) {
                    return "W";
                }
            }
            if (drawStreak > 1 && this.myDynamite > this.minDynamite) {
                this.myDynamite--;
                return "D";
            }
        }
        const waterOdds = this.getWaterOdds(gamestate.rounds);
        const dynamiteOdds =
            this.myDynamite > this.minDynamite && gamestate.rounds.length > 20
                ? 1 / 40
                : 0;
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
        const numberOfDynamite = recentRounds.filter(round => round.p2 === "D")
            .length;
        return numberOfDynamite / (numOfRounds * 2);
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
        } else if (random < dOdds + wOdds) {
            this.myDynamite--;
            return "D";
        } else {
            return this.getRandomRPS();
        }
    }

    getRandomRPS() {
        const random = Math.random();
        const rpsMoves = this.opponentMoves.R + this.opponentMoves.P + this.opponentMoves.S;
        if (rpsMoves === 0) {
            return Utility.getRandomFromArray(["R", "P", "S"]);
        }
        if (random < this.opponentMoves.R / rpsMoves) {
            return "P";
        } else if (random < (this.opponentMoves.R + this.opponentMoves.P) / rpsMoves) {
            return "S";
        } else {
            return "R";
        }
    }

    getLastWinner(rounds) {
        if (!rounds.length > 0) {
            return;
        }
        switch(rounds[rounds.length - 1].p2) {
            case "R":
                this.opponentMoves.R++;
                break;
            case "P":
                this.opponentMoves.P++;
                break;
            case "S":
                this.opponentMoves.S++;
                break;
            default:
                break;
        }
        if (rounds[rounds.length - 1].p2 === "D") {
            this.opponentDynamite--;
        }
        const lastWinner = Utility.getWinner(
            rounds[rounds.length - 1].p1,
            rounds[rounds.length - 1].p2
        );
        if (lastWinner === 1) {
            this.myScore += Utility.getDrawStreak(rounds.slice(0, -1)) + 1;
        } else if (lastWinner === 2) {
            this.opponentScore +=
                Utility.getDrawStreak(rounds.slice(0, -1)) + 1;
        }
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
