class Brokenbot {
    constructor() {
        this.myDynamite = 100;
        this.opponentDynamite = 100;
        this.minDynamite = 1;
        this.opponentDrawCounter = 100;
        this.myScore = 0;
        this.opponentScore = 0;
        this.breaksWithDynamite = false;
        this.breaksWithWater = false;
        this.rpsWindowSize = 1;
    }

    makeMove(gamestate) {
        if (this.opponentDynamite < 1) {
            this.breaksWithDynamite = false;
        }
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
                if (this.breaksWithDynamite && this.breaksWithWater) {
                    return this.getMoveByOdds(0.4, 0.4, gamestate.rounds)
                }
                if (this.breaksWithWater) {
                    return this.getRandomRPS(gamestate.rounds);
                } else if (this.breaksWithDynamite) {
                    return this.getMoveByOdds(0.5, 0, gamestate.rounds);
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
                ? 1 / 20
                : 0;
        return this.getMoveByOdds(waterOdds, dynamiteOdds, gamestate.rounds);
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
        return numberOfDynamite / (numOfRounds * 1.5);
    }

    getRandomMove() {
        let moves = ["R", "P", "S"];
        if (this.myDynamite > this.minDynamite) {
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

    getMoveByOdds(wOdds, dOdds, rounds) {
        const random = Math.random();
        if (random < wOdds) {
            return "W";
        } else if (this.myDynamite > this.minDynamite && random < dOdds + wOdds) {
            this.myDynamite--;
            return "D";
        } else {
            return this.getRandomRPS(rounds);
        }
    }

    getRandomRPS(rounds) {
        // const random = Math.random();
        // const rpsMoves = this.getLastRPSMoves(rounds)
        // const total = rpsMoves.R + rpsMoves.P + rpsMoves.S;
        // if (total === 0) {
        //     return Utility.getRandomFromArray(["R", "P", "S"]);
        // }
        // if (random < rpsMoves.R / total) {
        //     return "P";
        // } else if (random < (rpsMoves.R + rpsMoves.P) / total) {
        //     return "S";
        // } else {
        //     return "R";
        // }
        return Utility.getRandomFromArray(["R", "P", "S"]);
    }

    getLastRPSMoves(rounds) {
        let rpsMoves = {
            R: 0,
            P: 0,
            S: 0,
        }
        let i = rounds.length - 1;
        while (i >= 0 && (rpsMoves.R + rpsMoves.P + rpsMoves.S) < this.rpsWindowSize) {
            if (rounds[i].p2 === "R") {
                rpsMoves.R++;
            } else if (rounds[i].p2 === "P") {
                rpsMoves.R++;
            } else if (rounds[i].p2 === "S") {
                rpsMoves.S++;
            }
            i--;
        }
        return rpsMoves;
    }

    beatLastMove(rounds) {
        switch(rounds[rounds.length - 1]) {
            case "R":
                return "P";
            case "P":
                return "S";
            case "S":
                return "R";
            case "W":
                return this.getRandomRPS(rounds);
            case "D":
                return "W";
            default:
                return this.getRandomRPS(rounds);
        }
    }

    getLastWinner(rounds) {
        if (!rounds.length > 0) {
            return;
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
