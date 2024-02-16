import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import {
  initiateConnect,
  disconnect,
  desConnection,
} from "./socket";

const Regis = lazy(() => import("./pages/Regis"));
const Room = lazy(() => import("./pages/Room"));
const Error404 = () => <div>Error 404</div>;

function App() {
  const [data, setData] = useState(
    JSON.parse(window.localStorage.getItem("game_data"))
  );
  const [users, setUsers] = useState([]);
  useEffect(() => {
    initiateConnect();
    desConnection(() => {
      window.localStorage.removeItem("game_data");
      setData("");
    });


    if(!data) return;

    // subscribeToMessages((err, data) => {
    //   console.log(data);
    //   // setMessages((prev) => [...prev, data]);
    // });
    return () => {
      disconnect();
      setData("");
      window.localStorage.removeItem("game_data");
    };
  }, [data]);

  // const submitMessage = (e) => {
  //   e.preventDefault();
  //   const message = inputRef.current.value;
  //   sendMessage({ message, roomName: CHAT_ROOM }, (cb) => {
  //     // callback is acknowledgement from server
  //     console.log(cb);
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         message,
  //         ...SENDER,
  //       },
  //     ]);
  //     // clear the input after the message is sent
  //     // inputRef.current.value = "";
  //   });
  // };

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
