import express from "express";
import session from "express-session";
import cors from "cors";

const app = express();

declare module "express-session" {
    interface SessionData {
        guesses: string[];
        attempts: number;
        check2d: number[][];
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
        origin: true,
        credentials: true,
    })
);
app.use((req, res, next) => {
    if (!req.session.guesses) {
        req.session.guesses = [];
    }
    if (req.session.attempts === undefined) {
        req.session.attempts = 1;
    }
    if (!req.session.check2d) {
        req.session.check2d = [];
    }
    next();
});

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

let randomWord = "apple";

app.get("/api/givemeWOOORD", (req, res) => {
    res.json({word: randomWord});
});

app.get("/api/createWord", (req, res) => {
    randomWord = words[Math.floor(Math.random() * words.length)];
    res.json({word: randomWord});
});

app.get("/api/guesses", (req, res) => {
    res.json({
        guesses: req.session.guesses,
        attempts: req.session.attempts,
        check2d: req.session.check2d,
    });
});

app.post("/api/guesses", (req, res) => {
    try {
        const {guess} = req.body;

        if (!req.session.check2d) req.session.check2d = [];
        const printWordDoubleCheck = (word: string, currentGuess: string[]) => {
            const check: number[] = [3, 3, 3, 3, 3];
            const splitWord = word.toUpperCase().split("");
            const funcGuess = [...currentGuess];

            // First pass: check for correct letters in correct positions
            for (let i = 0; i < splitWord.length; i++) {
                if (splitWord[i] === funcGuess[i]) {
                    check[i] = 1;
                    splitWord[i] = "";
                    funcGuess[i] = "";
                }
            }

            // Second pass: check for correct letters in wrong positions
            for (let i = 0; i < splitWord.length; i++) {
                if (funcGuess[i] !== "" && splitWord.includes(funcGuess[i])) {
                    check[i] = 2;
                    const index = splitWord.indexOf(funcGuess[i]);
                    splitWord[index] = "";
                    funcGuess[i] = "";
                }
            }
            return req.session.check2d?.push(check);
        };

        printWordDoubleCheck(randomWord, guess);

        req.session.attempts! += 1;
        req.session.guesses?.push(guess);
        res.json({
            guesses: req.session.guesses,
            attempts: req.session.attempts,
            check2d: req.session.check2d,
        });
    } catch (error) {
        console.error("Error deluxu style in post guesses", error);
    }
});

app.delete("/api/guesses", (req, res) => {
    req.session.guesses = [];
    req.session.attempts = 1;
    req.session.check2d = [];
    res.json({message: "Guesses and attempts reset"});
});

app.listen(4000, "0.0.0.0", () => console.log("Server running on port 4000"));
