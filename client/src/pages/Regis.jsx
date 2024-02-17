import { useState } from "react";
import { toast } from "react-toastify";
import { createGame, joinGame } from "../socket";

export default function Regis() {
  const [roomType, setRoomType] = useState("join"); //create | join
  const [roomConfigs, setRoomConfigs] = useState({
    username: "",
    roomname: "",
    roomcode: "",
    questionCount: 5,
    execut_time: 10,
  });

  const submitForm = async () => {
    if (roomConfigs.username.length < 3 || roomConfigs.roomcode.length < 5) {
      return toast.error("Some inputs is invalid");
    }
    if (roomType === "create" && roomConfigs.roomname.length < 4) {
      return toast.error("Room name is invalid");
    }
    if (roomType === "create") createGame({ ...roomConfigs });
    else
      joinGame({
        roomcode: roomConfigs.roomcode,
        username: roomConfigs.username,
      });
  };

  return (
    <>
      <div className="conatainer">
        <div className="row">
          <div className="col-1 col-md-3 col-lg-4"></div>
          <div className="col-10 col-md-6 col-lg-4 mt-5">
            <div className="card p-2 px-3">
              <h2 className="text-center mt-1">Welcome Back</h2>
              <div className="btn-group" role="group">
                <input
                  type="radio"
                  className="btn-check"
                  name="room_type"
                  id="create"
                  autoComplete="off"
                  onChange={(e) => setRoomType(e.target.id)}
                />
                <label className="btn btn-outline-primary" htmlFor="create">
                  Create new Room
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="room_type"
                  id="join"
                  autoComplete="off"
                  defaultChecked={true}
                  onChange={(e) => setRoomType(e.target.id)}
                />
                <label className="btn btn-outline-primary" htmlFor="join">
                  Join existing room
                </label>
              </div>
              <div className="mb-3 mt-2">
                <label htmlFor="exampleInputUsername" className="form-label">
                  Enter username <i className="text-danger">*</i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  required={true}
                  id="exampleInputUsername"
                  placeholder="username..."
                  value={roomConfigs.username}
                  onChange={(v) =>
                    setRoomConfigs({ ...roomConfigs, username: v.target.value })
                  }
                  name="name"
                />
              </div>
              {roomType === "create" ? (
                <div className="mb-3 mt-2">
                  <label htmlFor="exampleInputRoomName" className="form-label">
                    Room name <i className="text-danger">*</i>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    required={true}
                    id="exampleInputRoomName"
                    placeholder="room name..."
                    value={roomConfigs.roomname}
                    onChange={(v) =>
                      setRoomConfigs({
                        ...roomConfigs,
                        roomname: v.target.value,
                      })
                    }
                    name="roomname"
                  />
                </div>
              ) : (
                <></>
              )}
              <div className="mb-3 mt-2">
                <label htmlFor="exampleInputRoomCode" className="form-label">
                  Room code <i className="text-danger">*</i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  required={true}
                  id="exampleInputRoomCode"
                  placeholder="1a2b3c..."
                  value={roomConfigs.roomcode}
                  onChange={(v) =>
                    setRoomConfigs({ ...roomConfigs, roomcode: v.target.value })
                  }
                  name="roomcode"
                />
              </div>
              {roomType === "create" ? (
                <div className="row">
                  <div className="col mb-3 mt-2">
                    <label
                      htmlFor="exampleInputQuestionCount"
                      className="form-label"
                    >
                      Question count <i className="text-danger">*</i>
                    </label>
                    <input
                      type="number"
                      min={3}
                      max={30}
                      className="form-control"
                      required={true}
                      id="exampleInputQuestionCount"
                      placeholder="question count (number)..."
                      value={roomConfigs.questionCount}
                      onChange={(v) =>
                        setRoomConfigs({
                          ...roomConfigs,
                          questionCount: v.target.value,
                        })
                      }
                      name="questionCount"
                    />
                  </div>
                  <div className="col mb-3 mt-2">
                    <label
                      htmlFor="exampleInputTymer"
                      className="form-label"
                    >
                      Taymer <i className="text-danger">*</i>
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={35}
                      className="form-control"
                      required={true}
                      id="exampleInputTymer"
                      placeholder="test execution time (number)..."
                      value={roomConfigs.execut_time}
                      onChange={(v) =>
                        setRoomConfigs({
                          ...roomConfigs,
                          execut_time: v.target.value,
                        })
                      }
                      name="roomname"
                    />
                  </div>
                </div>
              ) : (
                <></>
              )}
              <button
                type="button"
                className="btn btn-primary"
                onClick={submitForm}
              >
                {roomType === "create" ? "Create" : "Join"}
              </button>
            </div>
          </div>
          <div className="col-1 col-md-3 col-lg-4"></div>
        </div>
      </div>
    </>
  );
}
