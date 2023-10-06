const crypto = require('crypto');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
class KeyGenerator {
  static generateKey() {
    return crypto.randomBytes(32).toString('hex'); // 256 bits key
  }
}
class HMACCalculator {
  static calculateHMAC(key, message) {
    const hmac = crypto.createHmac('sha3-256', key);
    hmac.update(message);
    return hmac.digest('hex');
  }
}
class GameRules {
  constructor(moves) {
    this.moves = moves;
  }

  determineOutcome(userMove, computerMove) {
    const totalMoves = this.moves.length;
    const indexUser = this.moves.indexOf(userMove);
    const indexComputer = this.moves.indexOf(computerMove);

    if (indexUser === indexComputer) {
      return 'Draw';
    }

    const half = totalMoves / 2;
    const movesToBeat = this.moves.slice((indexUser + 1) % totalMoves, (indexUser + half) % totalMoves);

    if (movesToBeat.includes(computerMove)) {
      return 'Win';
    } else {
      return 'Lose';
    }
  }
}
class TableGenerator {
  static generateTable(moves, rules) {
    const table = [['Move', ...moves]];

    for (let i = 0; i < moves.length; i++) {
      const currentMove = moves[i];
      const row = [currentMove];
      for (let j = 0; j < moves.length; j++) {
        const outcome = rules.determineOutcome(currentMove, moves[j]);
        row.push(outcome);
      }
      table.push(row);
    }

    return table;
  }
}

function displayMenu(moves) {
  console.log("Menu:");
  for (let i = 0; i < moves.length; i++) {
    console.log(`${i + 1} - ${moves[i]}`);
  }
  console.log("0 - Exit");
  console.log(`${moves.length + 1} - Help`);
}

const moves = process.argv.slice(2);

if (moves.length < 3 || moves.length % 2 === 0 || new Set(moves).size !== moves.length) {
  console.error("Usage: node script.js move1 move2 move3 ... (provide an odd number of non-repeating moves)");
  process.exit(1);
}

let key = KeyGenerator.generateKey();

function playGame() {
  const computerMove = moves[crypto.randomInt(moves.length)];

  console.log(`HMAC: ${HMACCalculator.calculateHMAC(key, computerMove)}`);

  displayMenu(moves);

  rl.question("Choose your move (enter the number): ", (userChoice) => {
    const choiceIndex = parseInt(userChoice);

    if (isNaN(choiceIndex) || choiceIndex < 0 || choiceIndex > moves.length + 1) {
      console.log("Invalid input. Please choose a valid number from the menu.");
      playGame();
    } else if (choiceIndex === 0) {
      console.log("Goodbye!");
      rl.close();
    } else if (choiceIndex === moves.length + 1) {
      const rules = new GameRules(moves);
      const table = TableGenerator.generateTable(moves, rules);
      displayTable(table);
      playGame();
    } else {
      const userMove = moves[choiceIndex - 1];
      console.log(`Your move: ${userMove}`);
      console.log(`Computer's move: ${computerMove}`);

      const rules = new GameRules(moves);
      const outcome = rules.determineOutcome(userMove, computerMove);

      if (outcome === 'Draw') {
        console.log("It's a tie!");
      } else if (outcome === 'Win') {
        console.log(`You win! ${userMove} beats ${computerMove}`);
      } else {
        console.log(`You lose! ${computerMove} beats ${userMove}`);
      }

      rl.question("Enter the HMAC shown above: ", (userHMAC) => {
        if (userHMAC === HMACCalculator.calculateHMAC(key, computerMove)) {
          console.log("HMAC verified. It matches!");
        } else {
          console.log("HMAC does not match. Something might be wrong.");
        }
        console.log(`HMAC Key: ${key}`);
        key = KeyGenerator.generateKey();
        rl.close();
      });
    }
  });
}

function displayTable(table) {
  console.log("Game Rules Table:");
  for (const row of table) {
    console.log(row.join('\t'));
  }
}

playGame();
