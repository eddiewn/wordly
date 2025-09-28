import express from "express";
const app = express();

import cors from "cors";

app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173"
}));

// My makeshift database
const words = [
    "apple",
    "grape",
    "peach",
    "mango",
    "lemon",
    "berry",
    "melon",
    "plums",
    "chest",
    "linus",
    "olive",
    "apric",
    "cider",
    "guava",
    "figgy",
    "prune",
    "hazel",
    "honey",
    "sugar",
    "spice"
];

const guesses: string[] = [];

app.get("/api/givemeWOOORD", (req, res) => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    res.json({ word: randomWord });
});

app.post("/api/guess", (req, res) => {
    const { guess } = req.body;
    guesses.push(guess)
    res.json({ guesses });
});

app.listen(4000, () => console.log("Server running on port 4000"));