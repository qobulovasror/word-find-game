const irregularVerbs = require("./db/files/irregularVerb.json");
const shuffle = require("./helper/shuffle");
const fs = require('fs'); 

const runGiveQuest = (count) => {
  const questions = [];

  for (let i = 0; i < count; i++) {
    const randWord =
      irregularVerbs[Math.floor(Math.random() * irregularVerbs.length)];
    const randQuestItem = Math.floor(Math.random() * 2);

    const answers = [];
    answers.push(randQuestItem == 1 ? randWord.ps : randWord.pp);
    if (randWord.ps == randWord.pp) {
      if (randWord.word + "ed" != randWord.ps) {
        answers.push(randWord.word + "ed");
      } else {
        const w = irregularVerbs.find((w) => {
          if (w.word.startsWith(randWord.word[0]) && w.word != randWord.word)
            return true;
          else return false;
        });
        answers.push(w.word);
      }
    } else {
      answers.push(randQuestItem == 0 ? randWord.ps : randWord.pp);
    }
    if (answers.includes(randWord.word)) {
      const w = irregularVerbs.find((w) => {
        if (w.word.startsWith(randWord.word[0]) && !answers.includes(w.word))
          return true;
        else return false;
      });
      answers.push(w.word);
    } else {
      answers.push(randWord.word);
    }

    questions.push({
      quest: `Base form: "${randWord.word}", ${randQuestItem == 1 ? "Past simple" : "Past participle"}: ... ?`,
      answers: shuffle(answers),
      currect: randQuestItem == 1 ? randWord.ps : randWord.pp,
      translation: randWord.translation.Uzbek,
    });
  }
  return questions;
};

const data = runGiveQuest(irregularVerbs.length);

console.log(data.length);
console.log(data);

fs.writeFile('random_verbs.json', JSON.stringify(data), "utf-8", err=>{
    err && console.log(err);
});