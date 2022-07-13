import React from "react";

export default function StatusArea(board, whoseTurn) {
  let pieceCountWhite = 0;
  let pieceCountBlack = 0;
  board.forEach((element) => {
    if (element === "w" || element === "kw") {
      pieceCountWhite++;
    } else if (element === "b" || element === "kb") {
      pieceCountBlack++;
    }
  });

  return (
    <div className="status-area">
      <div className="grid-container">
        <div className="white-info grid-item">
          <h3 className={whoseTurn.includes("w") ? "active-turn" : "inactive"}>
            White Turn
          </h3>
          <p>{`${pieceCountWhite} white pieces remaining.`}</p>
        </div>
        <div className="black-info grid-item">
          <h3 className={whoseTurn.includes("b") ? "active-turn" : "inactive"}>
            Black Turn
          </h3>
          <p>{`${pieceCountBlack} white pieces remaining.`}</p>
        </div>
      </div>
    </div>
  );
}
