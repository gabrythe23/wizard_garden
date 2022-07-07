import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { RandomReveal } from "react-random-reveal";
import { Board } from "../components/board";
import { PlayersName } from "../components/players-name";

const Home: NextPage = () => {
  const colors = ["#65816d", "#bd7423"];
  const baseColor = "#c8cbbf";
  const [firstPlayerName, setFirstPlayerName] = useState("");
  const [secondPlayerName, setSecondPlayerName] = useState("");
  const [playersScore, setPlayserScore] = useState([0, 0]);
  const [active, setActive] = useState(0);
  const [chosenColor, setChosenColor] = useState("");
  const [turn, setTurn] = useState(0);
  const [pawns, setPawns] = useState(16);
  const [openModal, setOpenModal] = useState(false);
  const [table, setTable] = useState<Array<string[]>>([
    [baseColor, baseColor, baseColor, baseColor],
    [baseColor, baseColor, baseColor, baseColor],
    [baseColor, baseColor, baseColor, baseColor],
    [baseColor, baseColor, baseColor, baseColor],
  ]);
  let playersOrder = [firstPlayerName, secondPlayerName];

  const setNextStep = () =>
    setActive((current) => (current < 4 ? current + 1 : current));

  const nextStep = () => {
    if (active === 0 && !firstPlayerName.length && !secondPlayerName.length)
      return;
    if (active === 0) setOpenModal(true);
    setNextStep();
  };

  useEffect(() => {
    if (pawns === 0) return setNextStep();
  }, [pawns]);

  const callback = (n: number, table: Array<string[]>, givenScore: number) => {
    setTurn(n);
    setTable(table);

    const currPawn = pawns - 1 + givenScore * 3;
    setPawns(currPawn);

    if (givenScore) {
      const score: number[] = [...playersScore];
      score[turn % 2] = score[turn % 2] + givenScore;
      setPlayserScore(score);
    }
    if (turn === 3 && active === 1) {
      setTurn(0);
      setOpenModal(true);
      setNextStep();
    } else if (active === 1 || active || 2) {
      setOpenModal(true);
    }
  };

  const randomOrderPlayersAndGetFirst = () => {
    if (Math.ceil(Math.random() * 100) % 2) {
      playersOrder = [secondPlayerName, firstPlayerName];
    }
    return playersOrder[0];
  };

  const winner = (): string => {
    const init = "The Winner is ";
    const [a, b] = playersScore;
    if (a === b) return "Tie!";
    if (a > b) return init + playersOrder[0];
    if (a < b) return init + playersOrder[0];
    return "";
  };

  return (
    <>
      <>
        {active === 0 && (
          <PlayersName
            goToNext={nextStep}
            firstPlayerName={firstPlayerName}
            secondPlayerName={secondPlayerName}
            setFirstPlayerName={(c: string) => setFirstPlayerName(c)}
            setSecondPlayerName={(c: string) => setSecondPlayerName(c)}
          />
        )}

        {active === 1 && (
          <Board
            turnColor={colors}
            limit={4}
            turn={turn}
            callback={callback}
            baseColor={baseColor}
            table={table}
            preparation={true}
            currentPlayerName={playersOrder[turn % 2]}
            currentPlayerScore={playersScore[turn % 2]}
          />
        )}

        {active === 2 && (
          <div
            tabIndex={0}
            className="flex flex-col h-screen justify-evenly items-center border-0 focus:outline-none noselect"
          >
            <RandomReveal
              isPlaying
              duration={4}
              characters={randomOrderPlayersAndGetFirst()}
              onComplete={() => {
                setTimeout(nextStep, 2000);
                return;
              }}
            />
          </div>
        )}

        {active === 3 && (
          <>
            <Board
              turnColor={colors}
              turn={turn}
              limit={pawns}
              callback={callback}
              baseColor={baseColor}
              table={table}
              currentPlayerName={playersOrder[turn % 2]}
              currentPlayerScore={playersScore[turn % 2]}
            />
            {pawns}---{active}
          </>
        )}

        {active === 4 && (
          <div
            tabIndex={0}
            className="flex flex-col h-screen justify-evenly items-center border-0 focus:outline-none noselect"
          >
            <RandomReveal isPlaying duration={4} characters={winner()} />
          </div>
        )}
      </>
    </>
  );
};

export default Home;
