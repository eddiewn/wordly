import express from "express";
import session from "express-session";
import cors from "cors";
import cron from "node-cron";

import pg from "pg";
const {Client} = pg;

const test = new Client({
    user: "postgres",
    host: "localhost",
    database: "wordlyDB",
    password: "eddiewn13",
    port: 5432,
});

test.connect().then(() => {
    console.log("Connected to PostgreSQL database");
}).catch((err) => {
    console.error("Connection error", err.stack);
});

test.query(`SELECT * FROM words_list LIMIT 1`,(err, res) => {
    if (err) {
        console.error("Error executing query", err.stack);
    } else {
        console.log("Query result:", res.rows);
    }
});

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

    if (new Date().toDateString() !== currentDay) {
        req.session.guesses = [];
        req.session.attempts = 1;
        req.session.check2d = [];
        currentDay = new Date().toDateString();
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

let currentDay = new Date().toDateString();
const initialWord = "horbi";
let randomWord = initialWord;

// * * * * * for testing, runs every minute
cron.schedule("0 0 * * *", () => {
    console.log("Running daily reset task at midnight");
    randomWord = words[Math.floor(Math.random() * words.length)];
    currentDay = new Date().toDateString();
});

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

app.get("/api/validateWord", (req, res) => {
    const currentGuess = req.query.word;
    let isValid = false;

    test.query((`SELECT EXISTS(SELECT 1 FROM words_list WHERE word = '${currentGuess}')`),(err, result) => {
        if (result) {
            isValid = result.rows[0].exists;
        }
        res.json({isValid})
    })
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


app.listen(4000, "0.0.0.0", () => console.log("Server running on port 4000"));
