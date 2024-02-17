import React from "react";
import BeforeStart from "./BeforeStart";
import RunTest from "./RunTest";

export default function Room(props) {
  const { data, setData, users, setUsers, gameStatus, setGameStatus, currentQuestion } = props;
  return (
    <>
      {gameStatus === "start" ? (
        <RunTest
          data={data}
          setData={setData}
          users={users}
          currentQuestion={currentQuestion}
        />
      ) : (
        <BeforeStart
          data={data}
          setData={setData}
          users={users}
          setUsers={setUsers}
          gameStatus={gameStatus}
          setGameStatus={setGameStatus}
        />
      )}
    </>
  );
}
