class RandomBot {
    constructor() {
        this.dynamite = 100;
    }
    makeMove(gamestate) {
        return this.getRandomMove();
    }

    getRandomMove() {
        let moves = ["R", "P", "S"];
        if (this.dynamite > 0) {
            moves.push("D");
        }
        const result = Utility.getRandomFromArray(moves);
        if (result === "D") {
            this.dynamite--;
        }
        return result;
    }
}

class Utility {

    static getRandomFromArray(array) {
        const random = Math.floor(Math.random() * array.length);
        return array[random];
    }
}

module.exports = new RandomBot();