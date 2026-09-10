import express from "express";
import session from "express-session";
import cors from "cors";
import cron from "node-cron";

import dotenv from "dotenv"
dotenv.config();


import pg from "pg";

const { Pool } = pg;

const db = new Pool({
    connectionString: process.env.DATABASE_URL,
});
db.connect().then(() => {
    console.log("Connected to PostgreSQL database");
}).catch((err) => {
    console.error("Connection error", err.stack);
});

db.query(`SELECT word FROM words_list LIMIT 1`,(err, res) => {
    if (err) {
        console.error("Error executing query", err.stack);
    } else {
        console.log("Query result:", res.rows[0]);
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
        secret: process.env.SESSION_SECRET!
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


let currentDay = new Date().toDateString();
const initialWord = "snake";
let randomWord = initialWord;

// * * * * * for testing, runs every minute

async function getRandomWord() {
    const result = await db.query(
        "SELECT word FROM words_list ORDER BY random() LIMIT 1"
    );

    return result.rows[0].word;
}

(async () => {
    setRandomWord()
})();

async function setRandomWord() {
    randomWord = await getRandomWord();
    console.log("New word:", randomWord);
}
cron.schedule("0 0 * * *", async() => {

    await setRandomWord()
    currentDay = new Date().toDateString();
});


app.get("/api/givemeWOOORD", (req, res) => {
    res.json({word: randomWord});
});

app.get("/api/guesses", (req, res) => {
    res.json({
        guesses: req.session.guesses,
        attempts: req.session.attempts,
        check2d: req.session.check2d,
    });
});

app.get("/api/validateWord", async(req, res) => {
    const currentGuess = String(req.query.word).trim().toLowerCase();

    try {
        const result = await db.query(
            "SELECT EXISTS(SELECT 1 FROM words_list WHERE word = $1)",
            [currentGuess]
        );

        console.log("Checking:", JSON.stringify(currentGuess));
        console.log("Result:", result.rows[0].exists);

        res.json({
            isValid: result.rows[0].exists
        });
    } catch (error) {
        console.error("Error validating word:", error);
        res.status(500).json({ isValid: false });
    }
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
