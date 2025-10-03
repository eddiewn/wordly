import express from "express";
import session from "express-session"
import cors from "cors";

const app = express();

app.use(express.json());
app.use(session({
    secret: "sigmaskibidi",
    resave: false,
    saveUninitialized: true,
}))
app.use(
    cors({
        origin: "http://localhost:5173",
    })
);


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
    "spice",
];

const guesses: string[] = [];
let attempts: number = 1;

app.get("/api/givemeWOOORD", (req, res) => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    res.json({word: randomWord});
});

//
//////////////////////////////////////////////
//

app.get("/api/guesses", (req, res) => {
    res.json({guesses, attempts});
});

app.post("/api/guesses", (req, res) => {
    const {guess} = req.body;
    attempts += 1;
    guesses.push(guess);
    res.json({guesses, attempts});
});

app.delete("/api/guesses", (req, res) => {
    guesses.length = 0;
    attempts = 1;
    res.json({message: "Guesses and attempts reset"});
});

app.listen(4000, () => console.log("Server running on port 4000"));
