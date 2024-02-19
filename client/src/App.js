import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import {
  initiateConnect,
  disconnect,
  desConnection,
  subscribeBeforeStartEvents,
  subscribeAfterStartEvents,
} from "./socket";

const Regis = lazy(() => import("./pages/Regis"));
const Room = lazy(() => import("./pages/Room"));
const Error404 = () => <>Error 404</>;

function App() {
  const [data, setData] = useState(JSON.parse(window.localStorage.getItem("game_data")));
  const [gameStatus, setGameStatus] = useState(false); //postStart, preStart
  const [users, setUsers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  useEffect(() => {
    initiateConnect();
    desConnection(() => {
      window.localStorage.removeItem("game_data");
      setGameStatus(false);
      setData("");
    });

    subscribeBeforeStartEvents((err, event, data) => {
      if (err) {
        toast.error(err);
      } else {
        switch (event) {
          case "gameSuccCreate": {
            window.localStorage.setItem("game_data", JSON.stringify(data));
            toast.success("The room successfull created");
            setData(data);
            setUsers([data.user]);
            break;
          }
          case "gameSuccJoined": {
            toast.success("You successfull joined");
            setData(data);
            break;
          }
          case "leaveGame": {
            toast.warning("Someone leave room");
            setData(data);
            break;
          }
          case "addedUser": {
            toast.success("New user joined");
            setUsers(data);
            break;
          }
          default:
            break;
        }
      }
    });

    return () => {
      disconnect();
      setData("");
      window.localStorage.removeItem("game_data");
    };
  }, []);

  useEffect(() => {
    if (!data) return;
    subscribeAfterStartEvents((err, event, data) => {
      if (err) {
        toast.error(err);
      } else {
        switch (event) {
          case "gameStarting": {
            setGameStatus(Number(data))
            break;
          }
          case "question": {
            console.log(data);
            setCurrentQuestion(data)
            break;
          }
          case "playerAnswered": {
            setUsers(data.users)
            console.log(users);
            break;
          }
          default:
            break;
        }
      }
    });
  }, [data]);

  return (
    <Suspense fallback={Error404}>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              data ? (
                <Room
                  data={data}
                  setData={setData}
                  users={users}
                  setUsers={setUsers}
                  gameStatus={gameStatus}
                  setGameStatus={setGameStatus}
                  currentQuestion={currentQuestion}
                />
              ) : (
                <Navigate to="/regis" replace />
              )
            }
          />
          <Route
            path="/regis"
            element={
              !data ? (
                <Regis data={data} setData={setData} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
