import { Alert, Grid, Modal } from "@mantine/core";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { AlertCircle } from "tabler-icons-react";
import { range } from "../utils";

type CallBackOnClick = (e: React.MouseEvent, i: number, j: number) => void;

interface BoardProps {
  limit?: number;
  preparation?: boolean;
  turn: number;
  callback: (turn: number, table: Array<string[]>, score: number) => void;
  turnColor: string[];
  baseColor: string;
  table: Array<string[]>;
  currentPlayerName: string;
  currentPlayerScore: number;
}

interface GridProps {
  table: Array<string[]>;
  onBoxClick: CallBackOnClick;
}

interface BoxProps {
  color: string;
  i: number;
  j: number;
  onBoxClick: CallBackOnClick;
}

const Box = (props: BoxProps) => {
  // <motion.div
  //     className={`flex justify-center ${props.color} items-center w-20 h-20 lg:w-24 lg:h-24 text-white sm:text-2xl lg:text-6xl font-semibold border-solid border`}
  //     animate={{
  //       scale: [1, 2, 2, 1, 1],
  //       rotate: [0, 0, 270, 270, 0],
  //       borderRadius: ["20%", "20%", "30%", "30%", "20%"],
  //
  //       backgroundColor: "white",
  //       transitionEnd: {
  //         backgroundColor: "red",
  //       },
  //     }}
  //     transition={{
  //       duration: 2,
  //       ease: "easeInOut",
  //       times: [0, 0.2, 0.5, 0.8, 1],
  //       repeat: 1,
  //       repeatDelay: 1,
  //     }}
  // />
  return (
    <div
      key={`table-${props.i}-${props.j}`}
      onClick={(e) => props.onBoxClick(e, props.i, props.j)}
      className={`flex justify-center ${props.color} items-center w-20 h-20 lg:w-24 lg:h-24 text-white sm:text-2xl lg:text-6xl font-semibold border-solid border`}
    />
  );
};

const GridBoard = (props: GridProps) => {
  const boxes: JSX.Element[] = [];
  for (let i = 0; i < props.table.length; i++) {
    for (let j = 0; j < props.table[i].length; j++) {
      boxes.push(
        <Box
          color={props.table[i][j]}
          i={i}
          j={j}
          onBoxClick={props.onBoxClick}
        />
      );
    }
  }

  return (
    <>
      <div className="grid grid-cols-4 border-4 border-gray-700 bg-gray-200">
        {boxes}
      </div>
    </>
  );
};

export const Board = (props: BoardProps) => {
  let score = 0;
  const [blockUserAction, setBlockUserAction] = useState(false);
  const [color, setColor] = useState(props.baseColor);

  const setColorOnClick = (e: React.MouseEvent, css: string) => {
    e.preventDefault();
    setColor(css);
  };

  const onClick = (e: React.MouseEvent, i: number, j: number) => {
    e.preventDefault();
    if (color === props.baseColor) return;
    // no more turn for players
    if (props.limit === 0) return;
    // cell yet selected
    if (props.table[i][j] !== props.baseColor) return;

    const toSwitch = cellToSwitch(i, j);
    // swap color
    if (props.preparation && toSwitch.length > 0) {
      // todo error no
      setBlockUserAction(true);
      return;
    }

    for (const [i, j] of toSwitch) {
      props.table[i][j] =
        props.table[i][j] === props.turnColor[1]
          ? props.turnColor[0]
          : props.turnColor[1];
    }
    // add color to cell
    props.table[i][j] = !color
      ? props.turnColor[Math.ceil(props.turn % 2)]
      : color;
    findPointsAndWipeBoard();
    // return callback
    setColor(props.baseColor);
    props.callback(props.turn + 1, props.table, score);
  };

  const cellToSwitch = (y: number, x: number): Array<[number, number]> => {
    const toSwitch: Array<[number, number]> = [];

    const excludedIndexes = [0, 2];

    const iPoints = range(y - 1, y + 1);
    const jPoints = range(x - 1, x + 1);

    for (let i = 0; i < iPoints.length; i++) {
      for (let j = 0; j < jPoints.length; j++) {
        const excluded =
          excludedIndexes.includes(i) && excludedIndexes.includes(j);
        const inTable =
          props.table[iPoints[i]] &&
          props.table[iPoints[i]][jPoints[j]] &&
          props.table[iPoints[i]][jPoints[j]] !== props.baseColor;

        if (!excluded && inTable) toSwitch.push([iPoints[i], jPoints[j]]);
      }
    }

    return toSwitch;
  };

  const findPointsAndWipeBoard = () => {
    // horizontal
    for (let i = 0; i < 4; i++) {
      const rowWithPoint = props.table[i].every(
        (r) => r !== props.baseColor && r === props.table[i][0]
      );
      if (rowWithPoint) {
        score++;
        for (let j = 0; j < 4; j++) {
          props.table[i][j] = props.baseColor;
        }
      }
    }

    // vertical
    const invertedTable = props.table.map((_, index) =>
      props.table.map((row) => row[index])
    );
    for (let j = 0; j < 4; j++) {
      const rowWithPoint = invertedTable[j].every(
        (r) => r !== props.baseColor && r === invertedTable[j][0]
      );
      if (rowWithPoint) {
        score++;
        for (let i = 0; i < 4; i++) {
          props.table[i][j] = props.baseColor;
        }
      }
    }

    // diagonal
    const diagonals = getDiagonalMoves(props.table);
    for (const diagonal of diagonals) {
      const rowWithPoint = diagonal.every(
        (r) => r[0] !== props.baseColor && r[0] === diagonal[0][0]
      );
      if (rowWithPoint) {
        score++;
        diagonal.forEach((d) => (props.table[d[1]][d[2]] = props.baseColor));
      }
    }

    return props.table;
  };

  const getDiagonalMoves = (
    board: any[][]
  ): Array<[string, number, number][]> => {
    const diagonalMoves: Array<[string, number, number][]> = [];
    const equalBasedDiagonal: [string, number, number][] = []; // i === j
    const sumBasedDiagonal: [string, number, number][] = []; // i + j == n -1

    // Check for left to right diagonal moves
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board.length; col++) {
        if (row === col) {
          equalBasedDiagonal.push([board[row][col], row, col]);
        }
      }
    }

    // Check for right to left diagonal moves
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board.length; col++) {
        if (row + col === board.length - 1) {
          sumBasedDiagonal.push([board[row][col], row, col]);
        }
      }
    }

    diagonalMoves.push(equalBasedDiagonal, sumBasedDiagonal);
    return diagonalMoves;
  };

  return (
    <>
      <Modal
        centered
        opened={blockUserAction}
        onClose={() => setBlockUserAction(false)}
        title={"You can't put seed there!"}
      >
        <Alert icon={<AlertCircle size={16} />} title="Error!" color="red">
          {"You can't put seed there!"}
        </Alert>
      </Modal>

      <div
        tabIndex={0}
        className="flex flex-col h-screen justify-evenly items-center border-0 focus:outline-none noselect"
      >
        <GridBoard table={props.table} onBoxClick={onClick} />
        <Grid>
          <Grid.Col span={4}>
            <div
              className={`flex justify-center ${props.turnColor[0]} items-center w-20 h-20 lg:w-24 lg:h-24 text-white sm:text-2xl lg:text-6xl font-semibold border-solid border`}
              onClick={(e) => setColorOnClick(e, props.turnColor[0])}
            />
          </Grid.Col>
          <Grid.Col span={4} />
          <Grid.Col span={4}>
            <div
              className={`flex justify-center ${props.turnColor[1]} items-center w-20 h-20 lg:w-24 lg:h-24 text-white sm:text-2xl lg:text-6xl font-semibold border-solid border`}
              onClick={(e) => setColorOnClick(e, props.turnColor[1])}
            />
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={4} className={"text-center"}>
            {props.currentPlayerName}
          </Grid.Col>
          <Grid.Col span={4} />
          <Grid.Col span={4} className={"text-center"}>
            {props.currentPlayerScore}
          </Grid.Col>
        </Grid>
      </div>
    </>
  );
};
