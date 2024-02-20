import imgGold from "../assets/imgs/gold.png";
import imgSilver from "../assets/imgs/silver.png";
import imgbronz from "../assets/imgs/bronz.png";
import { useEffect, useState } from "react";
import { sendAnswer } from "../socket";

export default function RunTest(props) {
  const { data, users, currentQuestion, endQuiz } = props;
  const [oldQuest, setOldQuest] = useState(currentQuestion)
  const [showRateWin, setShowRateWin] = useState(false);
  const [sendBtnActive, setSendBtnActive] = useState(true)
  const [check, setCheck] = useState("");
  const [viewResult, setViewResult] = useState(false)
  const [progress, setProgress] = useState(
    currentQuestion?.config?.execut_time
  );

  const logout = () => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Would do you like leave the game ?")) {
      window.localStorage.removeItem("game_data");
      window.location.reload();
    }
  };
  const handleSubmit = () => {
    if(check){
      sendAnswer(
        {
          roomcode: data.roomcode,
          userId: data.user.id, 
          isCorrect: String(currentQuestion.question.currect)===String(check), 
          time: progress
        });
        setSendBtnActive(false)
        setViewResult(true)
    }
  }
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => prevProgress - 0.5);
      if (progress === 0) {
        setProgress(currentQuestion?.config?.execut_time);
      }
      if(oldQuest!==currentQuestion){
        setOldQuest(currentQuestion)
        setProgress(currentQuestion?.config?.execut_time);
      }
    }, 500);
    if (endQuiz) {
        setProgress(0.3)
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [currentQuestion, endQuiz, oldQuest, progress]);

  useEffect(()=>{
    setCheck("")
    setSendBtnActive(true)
    setViewResult(false)
  }, [currentQuestion])
  useEffect(()=>{
    if(endQuiz){
      setShowRateWin(true)
    }
  }, [endQuiz])
  return (
    <>
      <div
        className="modal"
        tabIndex="-1"
        style={{ display: showRateWin ? "block" : "none" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Players rating</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setShowRateWin(false)}
              ></button>
            </div>
            <div className="modal-body">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">points</th>
                    {
                      endQuiz &&
                      <th scope="col">place</th>
                    }
                  </tr>
                </thead>
                <tbody>
                  {
                    users.sort((a, b)=> a.grade<b.grade?1:-1).map((user, index) => (
                      <tr key={index}>
                        <th scope="row">{index+1}</th>
                        <td>{user.name} {data.user.name===user.name && " (You)"}</td>
                        <td>{Number(user.grade).toFixed(3)}</td>
                        {
                          endQuiz &&
                           <td>
                            {index===0 && <img src={imgGold} alt="medal" width="30px" />} 
                            {index===1 && <img src={imgSilver} alt="medal" width="30px"/> } 
                            {index===2 && <img src={imgbronz} alt="medal" width="30px" /> }
                          </td>
                        }
                        {/*<td>
                            <img src={imgGold} alt="medal" width="30px" />
                            <img src={imgSilver} alt="medal" width="30px" />
                            <img src={imgbronz} alt="medal" width="30px" />
                          </td>*/}
                      </tr>
                    ))
                  }
                </tbody>
              </table>
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-primary p-1 col-2 m-1"
                  style={{ width: "40px" }}
                >
                  <i className="bx bx-refresh" style={{ fontSize: "25px" }}></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="conatainer">
        <div className="row">
          <div className="col-1 col-md-3 col-lg-4"></div>
          <div className="col-10 col-md-6 col-lg-4 mt-5">
            <div className="card p-2 px-3">
              <div className="d-flex justify-content-between">
                <h6 className="pt-3 fs-5">
                  {currentQuestion?.config?.currentTest}/
                  {currentQuestion?.config?.questionCount}
                </h6>
                <h2 className="text-center mt-1">Quiz</h2>
                <button
                  type="button"
                  className="btn btn-danger p-1 col-2 m-1"
                  style={{ width: "40px" }}
                  onClick={logout}
                >
                  <i className="bx bx-exit"></i>
                </button>
              </div>
              <div
                className="time border rounded w-100"
                style={{ height: "15px" }}
              >
                <div
                  className="progress bg-primary"
                  style={{
                    width: `${
                      (progress * 100) / currentQuestion?.config?.execut_time
                    }%`,
                    height: "14px",
                    transition: "width 0.5s linear",
                  }}
                ></div>
              </div>
              <div className="card bg-light mt-2">
                <p className="fs-5 text-center text-muted fw-bold pt-3 px-2" style={{wordWrap: "break-word"}}>
                  {currentQuestion.question.quest}
                </p>
              </div>
              <ul className="list-group d-flex flex-column p-3">
                {currentQuestion.question.answers.map((quest, index) => {
                  let answersClassStyle = ""
                  if(viewResult){
                    if(quest===check || currentQuestion.question.currect === quest){
                      if(quest===check && currentQuestion.question.currect === check)
                        answersClassStyle =  "bg-success text-light";
                      else{
                        if(quest===check && currentQuestion.question.currect !== check)
                          answersClassStyle =  "bg-danger text-light";
                        else if(currentQuestion.question.currect === quest)
                          answersClassStyle =  "bg-success text-light";
                      }
                    }

                    // if(quest===check && currentQuestion.question.currect === check)
                    //   answersClassStyle =  "bg-success text-light";
                    // else if(quest===check && quest.currect !== check)
                    //   answersClassStyle =  "bg-danger text-light";
                    // else if(quest===check)
                    //   answersClassStyle =  "bg-success text-light";
                  }
                  return (
                  <li key={index} className="form-check d-flex justify-content-start p-0 ">
                    <input
                      className="form-check-input"
                      style={{ margin: "20px 10px" }}
                      type="radio"
                      name="flexRadioDefault"
                      id={quest + index}
                      checked={check===quest}
                      onChange={() => setCheck(quest)}
                      disabled={!sendBtnActive}
                    />
                    <label
                      className={"form-check-label border px-3 py-2 my-2 rounded w-100 d-flex justify-content-between "+answersClassStyle}
                      htmlFor={quest + index}
                    >
                      {quest}
                    </label>
                  </li>
                )})}
                <button className="btn btn-success" disabled={!check || !sendBtnActive} onClick={handleSubmit}>
                  Submit
                </button>
              </ul>

              <ul className="list-group d-flex flex-column p-3 d-none">
                <li className="form-check d-flex justify-content-start p-0 ">
                  <input
                    className="form-check-input"
                    style={{ margin: "20px 10px" }}
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault1"
                  />
                  <label
                    className=" form-check-label border px-3 py-2 my-2 rounded w-100 d-flex justify-content-between"
                    htmlFor="flexRadioDefault1"
                  >
                    Default radio
                    <span
                      className="badge text-bg-primary"
                      style={{ height: "22px", marginTop: "2px" }}
                    >
                      1
                    </span>
                  </label>
                </li>
                <li className="form-check d-flex justify-content-start p-0 ">
                  <input
                    className="form-check-input"
                    style={{ margin: "20px 10px" }}
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault11"
                  />
                  <label
                    className="bg-danger text-light form-check-label border px-3 py-2 my-2 rounded w-100 d-flex justify-content-between"
                    htmlFor="flexRadioDefault11"
                  >
                    Default radio
                    <span
                      className="badge text-bg-primary"
                      style={{ height: "22px", marginTop: "2px" }}
                    >
                      1
                    </span>
                  </label>
                </li>
              </ul>
              <div className="d-flex justify-content-around mt-2">
                <div className="col-5">
                  <div className="d-flex d-none">
                    <div
                      className="bg-secondary border rounded-circle text-light text-center hover-index"
                      style={{
                        padding: "1px 0",
                        width: "26px",
                        fontSize: "15px",
                        height: "26px",
                        marginLeft: "-10px",
                      }}
                      title="username"
                    >
                      1
                    </div>
                    <div
                      className="bg-secondary border rounded-circle text-light text-center hover-index"
                      style={{
                        padding: "1px 0",
                        width: "26px",
                        fontSize: "15px",
                        height: "26px",
                        marginLeft: "-10px",
                      }}
                      title="username"
                    >
                      2
                    </div>
                    <div
                      className="bg-secondary border rounded-circle text-light text-center hover-index"
                      style={{
                        padding: "1px 0",
                        width: "26px",
                        fontSize: "15px",
                        height: "26px",
                        marginLeft: "-10px",
                      }}
                      title="username"
                    >
                      11
                    </div>
                  </div>
                </div>
                <button
                  type="btn"
                  className="btn btn-primary"
                  onClick={() => setShowRateWin(true)}
                >
                  rate
                </button>
              </div>
            </div>
          </div>
          <div className="col-1 col-md-3 col-lg-4"></div>
        </div>
      </div>
    </>
  );
}
