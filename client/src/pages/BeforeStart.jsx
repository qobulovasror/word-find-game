import { useEffect, useState } from "react";
import { disconnect, startGameEmit } from "../socket";

export default function BeforeStart(props) {
  const { data, setData, users, setUsers, gameStatus, setGameStatus } = props;
  const [time, setTime] = useState(5);
  const logout = () => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Would do you like leave the room ?")) {
      window.localStorage.removeItem("game_data");
      window.location.reload();

      setData("");
      setUsers([]);
      disconnect();
    }
  };
  const startReq = () => {
    startGameEmit(data?.user?.id);
  };
  useEffect(() => {
    if (!gameStatus) return;
    setTime(Number(gameStatus) || 5);
  }, [gameStatus]);

  useEffect(() => {
    if (!gameStatus) return;
    const interval = setInterval(() => {
      if (time === 1) {
        clearInterval(interval);
        setGameStatus("start");
      }
      setTime(Number(time) - 1);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [gameStatus, setGameStatus, time]);

  return (
    <div className="conatainer">
      <div className="row">
        <div className="col-1 col-md-3 col-lg-4"></div>
        <div className="col-10 col-md-6 col-lg-4 mt-5">
          <div className="card p-2 px-3">
            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-primary col-3"
                onClick={logout}
                disabled={gameStatus}
              >
                <i className="bx bx-arrow-back"></i> Back
              </button>
              {gameStatus ? (
                <span className="badge text-bg-primary fs-6" style={{height: 30}}>
                  Starting... {time}
                </span>
              ) : (
                <></>
              )}
            </div>
            <div className="d-flex justify-content-center mt-2">
              <h3 className="text-center">Game players:</h3>
            </div>
            <div
              className="card"
              style={{ maxHeight: "65vh", overflow: "hidden scroll" }}
            >
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Role</th>
                  </tr>
                </thead>
                <tbody style={{ maxHeight: "10vh", overflow: "scroll" }}>
                  {users?.map((user, index) => (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{user.name}</td>
                      {user.status === "owner" ? (
                        <td>
                          <span className="badge text-bg-primary fs-6">
                            creater
                          </span>
                        </td>
                      ) : (
                        <td>
                          <span className="badge text-bg-secondary fs-6">
                            player
                          </span>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="d-flex justify-content-between mt-1">
              <div className="col">
                <b>Join code:</b>{" "}
                <div className="badge text-bg-primary fs-6">
                  {data.roomcode}
                </div>
                <button
                  className="btn btn-primary"
                  style={{ padding: "1px 7px", marginTop: -4, marginLeft: 5 }}
                  onClick={() => navigator.clipboard.writeText(data.roomcode)}
                >
                  <i className="bx bx-copy"></i>
                </button>
              </div>
              <div className="d-flex justify-content-end">
                <h6 className="pt-1">Players count: {users?.length}</h6>
              </div>
            </div>
            {data.user.status === "owner" ? (
              <button
                type="button"
                className="btn btn-primary mt-3"
                onClick={startReq}
                disabled={gameStatus}
              >
                <i className="bx bx-run"></i>{" "}
                {!gameStatus ? "Start game" : time}
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="col-1 col-md-3 col-lg-4"></div>
      </div>
    </div>
  );
}
