import express from "express";
import session from "express-session";
import cors from "cors";

const app = express();

declare module "express-session" {
    interface SessionData {
        guesses: string[];
        attempts: number;
    }
}

app.use(express.json());
app.use(
    session({
        secret: "sigmaskibidi",
        resave: false,
        saveUninitialized: true,
    })
);
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
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

//
//////////////////////////////////////////////
//

app.get("/api/givemeWOOORD", (req, res) => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    res.json({word: randomWord});
});


app.get("/api/guesses", (req, res) => {
    if (!req.session.guesses){
        req.session.guesses = [];
    } 
    if (req.session.attempts === undefined){
        req.session.attempts = 1;
    }
    res.json({guesses: req.session.guesses, attempts: req.session.attempts});
});

app.post("/api/guesses", (req, res) => {
    const {guess} = req.body;
    req.session.attempts! += 1;
    req.session.guesses?.push(guess);
    res.json({guesses: req.session.guesses, attempts: req.session.attempts});
});

app.delete("/api/guesses", (req, res) => {
    req.session.guesses = [];
    req.session.attempts = 1;
    res.json({message: "Guesses and attempts reset"});
});

app.listen(4000, () => console.log("Server running on port 4000"));
