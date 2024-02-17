const irregularVerbs = require('./db/files/irregularVerb.json')


const runGiveQuest = async (room) => {
    const execut_time = room.execut_time
    const questions = [];
    const userReting = []
    console.log("len", irregularVerbs.length);

    for(let i=0; i<room.questionCount; i++){
      questions.push(irregularVerbs[Math.floor(Math.random()*irregularVerbs.length)])
    //   console.log(Math.floor(Math.random()*irregularVerbs.length))

    }

    let i=0;
    const intervalId = setInterval(()=>{
        console.log(i);
        ++i;
    //   io.of("/api/game").in(room.code).emit("question", {"users": room.users, "question": room.question})
    if(i==questions.length)
        clearInterval(intervalId) 

    }, execut_time*1000)

}

runGiveQuest({execut_time: 2, questionCount: 5})