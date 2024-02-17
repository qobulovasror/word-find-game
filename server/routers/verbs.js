const route = require("express").Router();
const verbs = require('../db/files/irregularVerb.json');

route.get("/", (req, res) => {
  try {
    res.json(verbs)
  } catch (error) {
    console.log(error);
    return res.send(500).json({ error: "Something went wrong", ok: "false" });
  }
});

route.get("/:name", (req, res) => {
  try {
    const verb = verbs.filter(v=>v.word.toLowerCase === req.params.name.toLowerCase());
    res.json(verb);
  } catch (error) {
    console.log(err);
    return res.send(500).json({ error: "Something went wrong", ok: "false" });
  }
});

module.exports = route;
