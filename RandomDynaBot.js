class RandomDynaBot {
    constructor() {
        this.myDynamite = 100;
    }

    makeMove(gamestate) {
        return this.getRandomMove();
    }

    getRandomMove() {
        let moves = ["R", "P", "S", "W"];
        if (this.myDynamite > 0) {
            moves.push("D");
        }
        const result = Utility.getRandomFromArray(moves);
        if (result === "D") {
            this.myDynamite--;
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

module.exports = new RandomDynaBot();