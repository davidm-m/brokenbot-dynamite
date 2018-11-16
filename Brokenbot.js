class Brokenbot {
    constructor() {
        let myDynamite = 100;
        let opponentDynamite = 100;
        const Moves = Object.freeze({
            Rock: "R",
            Paper: "S",
            Scissors: "S",
            Dynamite: "D",
            Water: "W"
        });
    }

    makeMove(gamestate) {
        getLastWinner(gamestate);
        return this.getRandomRPS();
    }

    getRandomRPS() {
        const random = Math.floor(Math.random() * 3);
        switch (random) {
            case 0:
                return Moves.Rock;
            case 1:
                return Moves.Paper;
            case 2:
                return Moves.Scissors;
            default:
                return Moves.Paper;
        }
    }

    getLastWinner(gamestate) {
        return this.getWinner(gamestate[gamestate.length -1].p1, gamestate[gamestate.length -1].p2)
    }

    getWinner(p1, p2) {
        if (p1 === p2) {
            return 0;
        } else if (p1 === Moves.Dynamite) {
            if (p2 === Moves.Water) {
                return 2;
            } else {
                return 1;
            }
        } else if (p1 === Moves.Water) {
            if (p2 === Moves.Dynamite) {
                return 1;
            } else {
                return 2;
            }
        } else if (p1 === Moves.Rock) {
            if (p2 === Moves.Scissors) {
                return 1;
            } else {
                return 2;
            }
        } else if (p1 === Moves.Paper) {
            if (p2 === Moves.Rock) {
                return 1;
            } else {
                return 2;
            }
        } else if (p1 === Moves.Scissors) {
            if (p2 === Moves.Paper) {
                return 1;
            } else {
                return 2;
            }
        }
    }
}

module.exports = new Bot();
