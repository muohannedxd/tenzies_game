import { useEffect, useState } from "react";

export default function Main() {
  // the array of boxes (random ten elements array)
  /**
   * create an array of 10 elements using Array.from({length:10})
   * we map each element to an object with the properties
   */
  const [boxes, setBoxes] = useState(
    JSON.parse(localStorage.getItem("boxes")) ||
      Array.from({ length: 10 }, (_, index) => ({
        id: index + 1,
        number: Math.floor(Math.random() * 6) + 1,
        isHeld: false,
      }))
  );

  // checking if game won or not
  const [won, setWon] = useState(false);
  // do this everytime boxes are changed
  useEffect(() => {
    let counter = 0;
    for (let i = 0; i < boxes.length; i++) {
      if (boxes[i].isHeld) {
        counter++;
      }
    }
    if (counter === boxes.length) {
      setWon(true);
    }
  }, [boxes]);

  // to randomize when click the rolling button
  function randomDice() {
    setBoxes((prevBoxes) => {
      // do not forget the return here
      return prevBoxes.map((box) => {
        if (!box.isHeld) {
          // and here as well inside the if and else
          return {
            ...box,
            number: Math.floor(Math.random() * 6) + 1,
          };
        } else {
          return {
            ...box,
          };
        }
      });
    });
  }

  // error handler state
  const [error, setError] = useState(false);

  // to toggle the hold (freeze)
  function toggleHold(id, number) {
    for (let i = 0; i < boxes.length; i++) {
      if (boxes[i].isHeld && (boxes[i].number != number)) {
        setError(true)
        return
      }
    }

    setBoxes((prevBoxes) => {
      return prevBoxes.map((box) => {
        if (box.id === id) {
          return {
            ...box,
            isHeld: !box.isHeld,
          };
        } else {
          return {
            ...box,
          };
        }
      });
    });
  }

  // the play again handling
  function playAgain() {
    setBoxes((prevBoxes) => {
      return prevBoxes.map((box) => {
        return {
          ...box,
          number: Math.floor(Math.random() * 6) + 1,
          isHeld: false,
        };
      });
    });
    setWon(false)
    setError(false)
  }

  // save state in local storage
  useEffect(() => {
    localStorage.setItem("boxes", JSON.stringify(boxes));
  }, [boxes]);

  return (
    <div className="flex flex-col w-[70%] sm:w-[90%] mx-auto my-20">
      <div className="flex flex-col w-[80%] mx-auto">
        <p className="flex font-bold text-5xl justify-center">Tenzies</p>
        <p className="flex text-center my-4 justify-center">
          Click similar dices to hold and freeze, and keep rolling till all of
          them match
        </p>
      </div>
      <div className="flex flex-wrap gap-3 justify-center mx-auto my-10">
        {boxes.map((box) => (
          <button
            key={box.id}
            className={`box ${box.isHeld ? "bg-winGreen" : "bg-white"}`}
            onClick={() => toggleHold(box.id, box.number)}
          >
            {box.number}
          </button>
        ))}
      </div>
      <p
        className={`flex justify-center text-xl ${
          won ? "text-green-700" : "text-red-600"
        }`}
      >
        {!won
          ? "Keep rolling, you are almost there!"
          : "You won! Want to play again?"}
      </p>
      <button
        className="btn w-[40%] mx-auto my-10"
        onClick={!won ? randomDice : playAgain}
      >
        {!won ? "Roll the dices" : "Play again"}
      </button>
    </div>
  );
}
