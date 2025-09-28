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
let attempts: number = 0;

app.get("/api/givemeWOOORD", (req, res) => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    res.json({ word: randomWord });
});

app.post("/api/guesses", (req, res) => {
    const { guess } = req.body;
    const { attempt }  = req.body;
    
    attempts = attempt + 1;
    guesses.push(guess)
    res.json({ guesses, attempts });
});

app.delete("/api/guesses", (req, res) => {
    guesses.length = 0;
    res.json({ message: "Guesses reset" });
}); 

app.listen(4000, () => console.log("Server running on port 4000"));