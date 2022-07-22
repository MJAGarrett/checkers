/* Notes to Self/ToDo Section 07/13/22:
1. Need to restrict selection of pieces if a jump is available. Potentially through a jumpAvailable State.
2. Need to create a settings area to change mustJumpIfAvailable and moreThanTwoJumpsAllowed.
3. Need to add a win condition if a player cannot move. ------------------------------------------------------------- Done
4. Would be nice to add move highlighting.

--------------------------------------------------------------------------------------------------------------------------------------------------------------*/

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import StatusArea from "./StatusArea";

// Game Logic Constants
const whitePieces = ["w", "kw"];
const blackPieces = ["b", "kb"];
const downMovers = ["b", "kb", "kw"];
const upMovers = ["w", "kb", "kw"];

function Square(props) {
  // The className let is there to capture and apply a class of "selected" if the current square is selected.
  let className = "";

  // The below let and two ifs are there purely to eliminate possible empty space in the
  // class list in the DOM by removing empty space in the below string literals.
  // They are purely cosmetic, as spaces in the aforementioned string literals would suffice, but would
  // leave empty space within the class list that would show in a browser inspector.
  let noPieces = "";
  if (props.noPieces === "no-pieces") {
    noPieces = " " + props.noPieces;
  }
  if (props.className) {
    className = " " + props.className;
  }
  // Returns a button with class name of "occupied" and content of whichever piece is on it or a button with null content and appropriate class names.
  if (props.pieceType) {
    return (
      <button
        className={`square occupied ${props.blackOrWhite}${className}`}
        onClick={props.onClick}
      >
        {props.pieceType}
      </button>
    );
  } else {
    return (
      <button
        className={`square ${props.blackOrWhite}${noPieces}${className}`}
        onClick={props.onClick}
      >
        {props.pieceType}
      </button>
    );
  }
}

class Board extends React.Component {
  // Passes appropriate props to Square components and returns a button with appropriate properties for its position on the board.
  renderSquare(i) {
    let staggered = false;
    // Below if hardcodes the staggered rows
    if (
      (i >= 8 && i <= 15) ||
      (i >= 24 && i <= 31) ||
      (i >= 40 && i <= 47) ||
      (i >= 56 && i <= 63)
    ) {
      staggered = true;
    }
    if (staggered === false) {
      // Initializes a "white" square at the start of odd number rows (ie, first, third, fifth)
      // and alternates between "white" and "black" (really "color1" and "color2", but white and black were
      // set first).
      if (i % 2 === 0) {
        return (
          <Square
            noPieces="no-pieces"
            blackOrWhite="first"
            key={`square${1 + i}`}
            pieceType={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
          />
        );
      } else {
        return (
          <Square
            blackOrWhite="second"
            noPieces=""
            key={`square${1 + i}`}
            pieceType={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
          />
        );
      }
    } else {
      // Initializes a "black" square at the start of even number rows
      if (i % 2 === 1) {
        return (
          <Square
            noPieces="no-pieces"
            blackOrWhite="first"
            key={`square${1 + i}`}
            pieceType={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
          />
        );
      } else {
        return (
          <Square
            blackOrWhite="second"
            noPieces=""
            key={`square${1 + i}`}
            pieceType={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
          />
        );
      }
    }
  }

  // Creates the DOM structure of the board as 8 rows of 8 buttons each.
  renderBoard() {
    let board = [];
    for (let r = 0; r < 8; r++) {
      let rowItems = [];
      for (let c = 0; c < 8; c++) {
        // Creates 8 "square" buttons for each row.
        let newSquare = this.renderSquare(r * 8 + c);

        // Below if checks if there is a selected piece and updates classList of square it is on for styling purposes. Otherwise continue as normal.
        if (this.props.selectedSquare) {
          if (this.props.selectedSquare === r * 8 + c) {
            let newestSquare = React.cloneElement(newSquare, {
              className: "selected",
            });
            rowItems.push(newestSquare);
          } else {
            rowItems.push(newSquare);
          }
        } else {
          rowItems.push(newSquare);
        }
      }

      // Adds each row to an array representing the entire board.
      board.push(
        React.createElement(
          "div",
          {
            key: `row${1 + r}`,
            className: `board-row row${1 + r}`,
          },
          rowItems
        )
      );
    }

    // Returns an array of 8 <div> elements with with 8 child buttons.
    return board;
  }

  render() {
    return <div>{this.renderBoard()}</div>;
  }
}

const boardStart = () => {
  // Initializes an empty array representing the checkerboard.
  let board = Array(64).fill(null);
  let staggered = false;

  // Maps over initial array and places pieces in their intial locations.
  let updated = board.map((val, index) => {
    // Staggered will switch on every row change and stagger the placement of pieces.
    if (index > 0 && index % 8 === 0) {
      staggered = !staggered;
    }
    let whichPiece = null;
    if (staggered === false) {
      if (index % 2 === 1 && index > 39) {
        whichPiece = `w`;
      }
      if (index % 2 === 1 && index < 24) {
        whichPiece = `b`;
      }
    } else {
      if (index % 2 === 0 && index > 39) {
        whichPiece = `w`;
      }
      if (index % 2 === 0 && index < 24) {
        whichPiece = `b`;
      }
    }
    return whichPiece;
  });

  // Return updated array.
  return updated;
};

/* Testing board states
------------------------------------------------
const testBoard = Array(64);
const surroundTest = testBoard
  .fill("kw", 1, 2)
  .fill("kb", 8, 9)
  .fill("kb", 17, 18);
const testIt = testBoard.fill("kw", 23, 24);
const testy = testIt.fill("kb", 35, 36);
------------------------------------------------*/

class Game extends React.Component {
  constructor(props) {
    super(props);

    // Starting states
    this.state = {
      history: [
        {
          squares: boardStart(),
        },
      ],
      stepNumber: 0,
      currentSelection: null,
      whoseTurn: blackPieces,
      onDoubleTurn: false,
      gameOver: false,
      mustJumpIfAvailable: false,
      moreThanTwoJumps: false,
    };
  }

  // Checks whether a piece can capture another piece after first capture and sets state appropriately.
  checkDoubleMove(index) {
    if (
      this.canJump(index).length === 0 ||
      (!this.moreThanTwoJumps && this.state.onDoubleTurn)
    ) {
      // If cannot jump another piece or both has already jumped twice
      // and more than two jumps are NOT allowed, end turn and remove selection.
      this.setState({
        whoseTurn:
          this.state.whoseTurn === blackPieces ? whitePieces : blackPieces,
        currentSelection: null,
        onDoubleTurn: false,
      });
    } else {
      // If can jump another piece and only jumped one previous piece, continue turn and set onDoubleTurn.
      this.setState({
        onDoubleTurn: true,
        currentSelection: index,
      });
    }
  }

  // Returns an array of possible jump moves of piece when called.
  canJump(i) {
    const cells = document.querySelectorAll(".game-board button");
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    let currentPlayerPieces = this.state.whoseTurn;
    let currentOpponentPieces =
      currentPlayerPieces === blackPieces ? whitePieces : blackPieces;

    let possibleMoves = [];

    let [jumpUpLeft, jumpUpRight, jumpDownLeft, jumpDownRight] = [
      cells[i - 18],
      cells[i - 14],
      cells[i + 14],
      cells[i + 18],
    ];

    let [upLeft, upRight, downLeft, downRight] = [
      cells[i - 9],
      cells[i - 7],
      cells[i + 7],
      cells[i + 9],
    ];

    // Both square[i] and square[this.state.currentSelection] are needed below as when checkDoubleMove()
    // is called the piece has not yet rendered to the event index yet.
    // i is used for checking a jump as a first move, the state is used when checking for a possible double jump.

    // Checks down jumps.
    if (
      downMovers.includes(squares[this.state.currentSelection]) ||
      downMovers.includes(squares[i])
    ) {
      // Down left
      if (i + 14 <= 63) {
        if (
          currentOpponentPieces.includes(downLeft.textContent) &&
          jumpDownLeft.textContent === "" &&
          jumpDownLeft.classList.contains("no-pieces") !== true
        ) {
          possibleMoves.push(i + 14);
        }
      }
      // Down Right
      if (i + 18 <= 63) {
        if (
          currentOpponentPieces.includes(downRight.textContent) &&
          jumpDownRight.textContent === "" &&
          jumpDownRight.classList.contains("no-pieces") !== true
        ) {
          possibleMoves.push(i + 18);
        }
      }
    }
    // Checks Up jumps
    if (
      upMovers.includes(squares[this.state.currentSelection]) ||
      upMovers.includes(squares[i])
    ) {
      // Up Left.
      if (i - 18 >= 0) {
        if (
          currentOpponentPieces.includes(upLeft.textContent) &&
          jumpUpLeft.textContent === "" &&
          jumpUpLeft.classList.contains("no-pieces") !== true
        ) {
          possibleMoves.push(i - 18);
        }
      }
      // Up Right
      if (i - 14 >= 0) {
        if (
          currentOpponentPieces.includes(upRight.textContent) &&
          jumpUpRight.textContent === "" &&
          jumpUpRight.classList.contains("no-pieces") !== true
        ) {
          possibleMoves.push(i - 14);
        }
      }
    }
    return possibleMoves;
  }

  // Checks if a basic checker is at the appropriate end of the board for kinging
  // and returns a king of its corresponding color.
  kingPiece(checker, i) {
    if (checker === "b" && i >= 56) {
      return "kb";
    } else if (checker === "w" && i <= 7) {
      return "kw";
    } else {
      return checker;
    }
  }

  // Returns an array of possible single moves when called.
  canMove(i) {
    const cells = document.querySelectorAll(".game-board button");
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    let possibleMoves = [];

    let [upLeft, upRight, downLeft, downRight] = [
      cells[i - 9],
      cells[i - 7],
      cells[i + 7],
      cells[i + 9],
    ];

    // Checks downward movement.
    if (downMovers.includes(squares[i])) {
      if (i + 7 <= 63) {
        // Down Left
        if (
          downLeft.textContent === "" &&
          downLeft.classList.contains("no-pieces") !== true
        ) {
          possibleMoves.push(i + 7);
        }
      }
      if (i + 9 <= 63) {
        // Down Right
        if (
          downRight.textContent === "" &&
          downRight.classList.contains("no-pieces") !== true
        ) {
          possibleMoves.push(i + 9);
        }
      }
    }

    // Checks upward movement.
    if (upMovers.includes(squares[i])) {
      // Up Left
      if (i - 9 >= 0) {
        if (
          upLeft.textContent === "" &&
          upLeft.classList.contains("no-pieces") !== true
        ) {
          possibleMoves.push(i - 9);
        }
      }
      // Up Right
      if (i - 7 >= 0) {
        if (
          upRight.textContent === "" &&
          upRight.classList.contains("no-pieces") !== true
        ) {
          possibleMoves.push(i - 7);
        }
      }
    }
    return possibleMoves;
  }

  handleClick(i) {
    console.log(i);
    console.log(this.state.currentSelection);
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    let currentPlayerPieces = this.state.whoseTurn;
    let checkerIndex = this.state.currentSelection;
    let checker = squares[checkerIndex];

    console.log(this.state);

    // Checks if there is already a selected piece or if the game has ended and prevents selection
    // if either are true.
    if (!checkerIndex && !this.state.gameOver) {
      // Prevents selecting a square that is empty or that contains the other player's pieces.
      if (!squares[i] || !currentPlayerPieces.includes(squares[i])) {
        alert("Can't select");
      }
      // NTS: An if preventing selection if another piece can jump could go here.

      // Checks if the square's piece can move or jump another piece. If it can
      // then select it by updating state, otherwise do nothing.
      else if (this.canMove(i).length > 0 || this.canJump(i).length > 0) {
        this.setState({ currentSelection: i });
      }
    }
    // The above if makes sure only valid pieces are selected
    // The below if allows removing a selection if a capture has not been made.
    else {
      if (i === checkerIndex && this.state.onDoubleTurn !== true) {
        this.setState({ currentSelection: null });
      }
      // The below if series handles movement
      else if (currentPlayerPieces.includes(checker)) {
        if (!squares[i]) {
          /* 
            The below if handles moving into empty space.
            If the game forces jumps and the piece selected can jump, then movement not allowed.
            Otherwise can move as normal.
          */
          if (
            !this.state.mustJumpIfAvailable ||
            this.canJump(checkerIndex).length === 0
          ) {
            if (this.canMove(checkerIndex).includes(i)) {
              // Moves piece into square and checks if it should be a king.
              squares[i] = this.kingPiece(checker, i);
              // Removes piece from origin square.
              squares[checkerIndex] = null;
              // Sets state appropriately
              this.setState({
                history: history.concat([{ squares: squares }]),
                stepNumber: history.length,
                whoseTurn:
                  this.state.whoseTurn === blackPieces
                    ? whitePieces
                    : blackPieces,
                currentSelection: null,
              });
            }
          }
          // Updates board if a capture occurs.
          if (this.canJump(checkerIndex).includes(i)) {
            // Saves index of move for reference.
            let moveTaken = this.canJump(checkerIndex).find((val) => val === i);
            // Moves piece into square and kings it if it should be kinged.
            squares[i] = this.kingPiece(checker, i);
            squares[checkerIndex] = null;

            // Checks if the checker jumped and eliminates the opponent's checker
            if (moveTaken - checkerIndex === 14) {
              squares[checkerIndex + 7] = null;
            } else if (moveTaken - checkerIndex === 18) {
              squares[checkerIndex + 9] = null;
            } else if (moveTaken - checkerIndex === -14) {
              squares[checkerIndex - 7] = null;
            } else if (moveTaken - checkerIndex === -18) {
              squares[checkerIndex - 9] = null;
            }

            // Sets history but does not change or remove selection. Calls checkDoubleMove()
            // which is responsible for those changes.
            this.setState({
              history: history.concat([{ squares: squares }]),
              stepNumber: history.length,
            });
            this.checkDoubleMove(i);
          }
        }
      }
    }
  }

  // Allows a player to end a second turn without without making another jump.
  endMoveClick() {
    this.setState({
      onDoubleTurn: false,
      whoseTurn:
        this.state.whoseTurn === blackPieces ? whitePieces : blackPieces,
      currentSelection: null,
    });
  }

  // Resets relevant game states to default.
  restartGame() {
    this.setState({
      stepNumber: 0,
      currentSelection: null,
      whoseTurn: blackPieces,
      onDoubleTurn: false,
      gameOver: false,
    });
  }

  // Checks if a player has won the game.
  calculateWinner(board) {
    // Counts the pieces remaining
    let numBlackPieces = 0;
    let numWhitePieces = 0;
    let possibleMovesBlack = [];
    let possibleMovesWhite = [];

    board.forEach((val, index) => {
      if (blackPieces.includes(val)) {
        numBlackPieces++;
        console.log(index); // Remove after testing is finished
        console.log(val); // Remove after testing is finished.

        // The four If statements below exist to prevent adding an empty array to the possibleMoves
        // arrays above and increasing their length such that the if statements checking
        // for lose conditions below incorrectly evaluate a lost game as still playable as a
        // result of arrays of +0 length containing empty, nested arrays.

        if (this.canMove(index).length > 0) {
          possibleMovesBlack.push(this.canMove(index));
        }
        if (this.canJump(index).length > 0) {
          possibleMovesBlack.push(this.canJump(index));
        }
      } else if (whitePieces.includes(val)) {
        numWhitePieces++;
        if (this.canMove(index).length > 0) {
          possibleMovesWhite.push(this.canMove(index));
        }
        if (this.canJump(index).length > 0) {
          possibleMovesWhite.push(this.canJump(index));
        }
      }
    });

    // Checks if any player has been eliminated.
    if (numBlackPieces === 0) {
      alert("White Wins!");
      this.setState({ gameOver: true });
    } else if (numWhitePieces === 0) {
      alert("Black Wins!");
      this.setState({ gameOver: true });
    } else if (
      (this.state.whoseTurn === blackPieces &&
        possibleMovesBlack.length === 0) ||
      (this.state.whoseTurn === whitePieces && possibleMovesWhite.length === 0)
    ) {
      if (numWhitePieces > numBlackPieces) {
        alert("White Wins!");
        this.setState({ gameOver: true });
      } else if (numWhitePieces < numBlackPieces) {
        alert("Black Wins!");
        this.setState({ gameOver: true });
      } else {
        alert("Tie! Now, how did that happen?");
      }
    }
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    // Creates a JSX element with the necessary DOM to display whose turn it is
    // and the amount of checkers each player has remaining.
    let statusDisplay = StatusArea(current.squares, this.state.whoseTurn);

    console.log(this.state.whoseTurn);

    return (
      <div className="game">
        <h1>Checkers</h1>
        <div className="left-content">
          <div className="game-board">
            <Board
              selectedSquare={this.state.currentSelection}
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
        </div>
        {statusDisplay}
        <div className="right-content">
          <div className="restart-wrapper">
            <button className="restart" onClick={() => this.restartGame()}>
              Restart the game.
            </button>
          </div>
          <EndMove
            onDoubleMove={this.state.onDoubleTurn}
            onClick={(i) => this.endMoveClick(i)}
          />
        </div>
      </div>
    );
  }

  // Runs on updates after initial render.
  // Moved calculateWinner here to allow for DOM selection in
  // the canJump and canMove functions called within calculateWinner.
  componentDidUpdate() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    // Check for a winner. Need to limit it with !this.state.gameOver to avoid an infinite loop.
    if (!this.state.gameOver) {
      this.calculateWinner(current.squares);
    }
  }
}

// Creates a simple button interface for skipping a double turn
// and limits it to display only on double turns.
function EndMove(props) {
  if (props.onDoubleMove) {
    return (
      <div className="end-move-wrapper" style={{ maxWidth: "325px" }}>
        <button className="end-move" onClick={props.onClick}>
          End turn without a double move.
        </button>
      </div>
    );
  }
}
// --------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
