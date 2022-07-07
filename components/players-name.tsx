import React, { ChangeEvent, Dispatch, useState } from "react";
import { TextInput, PasswordInput, Tooltip } from "@mantine/core";
import { sleep } from "../utils";

interface PlayersNameProps {
  firstPlayerName: string;
  setFirstPlayerName: (e: string) => void;
  secondPlayerName: string;
  setSecondPlayerName: (e: string) => void;
  goToNext: () => void;
}

interface PlayerNameProps {
  label: string;
  value: string;
  setValue: (e: string) => void;
}

const PlayerName = (props: PlayerNameProps) => {
  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    props.setValue(e.target.value);
  };
  return (
    <div>
      <label htmlFor="email-address" className="sr-only">
        First Player
      </label>
      <TextInput
        label={props.label}
        placeholder={props.label}
        value={props.value}
        onChange={onChange}
        className={
          "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
        }
      />
    </div>
  );
};

export function PlayersName(props: PlayersNameProps) {
  return (
    <>
      <div
        tabIndex={0}
        className="flex flex-col h-screen justify-evenly items-center border-0 focus:outline-none noselect"
      >
        <div className="max-w-md w-full space-y-8">
          <form className="mt-8 space-y-6" action="#" method="POST">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <PlayerName
                value={props.firstPlayerName}
                setValue={props.setFirstPlayerName}
                label={"First Player"}
              />
              <PlayerName
                value={props.secondPlayerName}
                setValue={props.setSecondPlayerName}
                label={"Second Player"}
              />
            </div>
            <div>
              <button
                type="submit"
                onClick={async (e) => {
                  e.preventDefault();
                  props.goToNext();
                }}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-300 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Go
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
