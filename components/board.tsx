import { Alert, Grid, Modal } from "@mantine/core";
import React, { useState } from "react";
import { AlertCircle } from "tabler-icons-react";
import { range, sleep } from "../utils";

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
  const [table, setTable] = useState(props.table);

  const setColorOnClick = (e: React.MouseEvent, css: string) => {
    e.preventDefault();
    setColor(css);
  };

  const onClick = async (e: React.MouseEvent, i: number, j: number) => {
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
            table[iPoints[i]] &&
            table[iPoints[i]][jPoints[j]] &&
            table[iPoints[i]][jPoints[j]] !== props.baseColor;

          if (!excluded && inTable) toSwitch.push([iPoints[i], jPoints[j]]);
        }
      }

      return toSwitch;
    };

    e.preventDefault();
    if (color === props.baseColor) return;
    // no more turn for players
    if (props.limit === 0) return;
    // cell yet selected
    if (table[i][j] !== props.baseColor) return;

    const toSwitch = cellToSwitch(i, j);
    // swap color
    if (
      (props.preparation && toSwitch.length > 0) ||
      (!props.preparation && !toSwitch.length)
    ) {
      setBlockUserAction(true);
      return;
    }

    for (const [i, j] of toSwitch) {
      table[i][j] =
        table[i][j] === props.turnColor[1]
          ? props.turnColor[0]
          : props.turnColor[1];
    }
    // add color to cell
    table[i][j] = !color ? props.turnColor[Math.ceil(props.turn % 2)] : color;
    setTable(table);
    setColor(props.baseColor);
    await findPointsAndWipeBoard();

    // return callback
    props.callback(props.turn + 1, props.table, score);
  };

  const findPointsAndWipeBoard = async () => {
    const toSwap: Array<[number, number]> = [];
    // functions
    const readTable = (tbl: Array<string[]>): Array<[number, number]> => {
      const indexes: Array<[number, number]> = [];

      for (let i = 0; i < 4; i++) {
        const rowWithPoint = tbl[i].every(
          (r) => r !== props.baseColor && r === tbl[i][0]
        );
        if (rowWithPoint) {
          score++;
          for (let j = 0; j < 4; j++) indexes.push([i, j]);
        }
      }
      return indexes;
    };
    const getDiagonalMoves = (
      board: any[][]
    ): Array<[string, number, number][]> => {
      const diagonalMoves: Array<[string, number, number][]> = [];
      const equalBasedDiagonal: [string, number, number][] = []; // i === j
      const sumBasedDiagonal: [string, number, number][] = []; // i + j == n -1

      // Check for left to right diagonal moves
      for (let row = 0; row < board.length; row++)
        for (let col = 0; col < board.length; col++)
          if (row === col) equalBasedDiagonal.push([board[row][col], row, col]);

      // Check for right to left diagonal moves
      for (let row = 0; row < board.length; row++)
        for (let col = 0; col < board.length; col++)
          if (row + col === board.length - 1)
            sumBasedDiagonal.push([board[row][col], row, col]);

      diagonalMoves.push(equalBasedDiagonal, sumBasedDiagonal);
      return diagonalMoves;
    };

    // logic

    // horizontal
    toSwap.push(...readTable(table));
    // vertical
    toSwap.push(
      ...readTable(table.map((_, index) => table.map((row) => row[index]))).map(
        ([j, i]): [number, number] => [i, j]
      )
    );
    // diagonal
    for (const diagonal of getDiagonalMoves(table)) {
      const rowWithPoint = diagonal.every(
        (r) => r[0] !== props.baseColor && r[0] === diagonal[0][0]
      );
      if (rowWithPoint) {
        score++;
        toSwap.push(...diagonal.map(([a, i, j]): [number, number] => [i, j]));
      }
    }

    if (toSwap.length !== 0) {
      await sleep(2000);
      for (const [i, j] of toSwap) table[i][j] = props.baseColor;
    }

    return table;
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
