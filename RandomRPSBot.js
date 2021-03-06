class RandomRPSBot {
    makeMove(gamestate) {
        return this.getRandomMove();
    }

    getRandomMove() {
        const moves = ["R", "P", "S"];
        const result = Utility.getRandomFromArray(moves);
        return result;
    }
}

class Utility {

    static getRandomFromArray(array) {
        const random = Math.floor(Math.random() * array.length);
        return array[random];
    }
}

module.exports = new RandomRPSBot();