import {useState, useEffect} from "react";
import DisplayGrid from "./components/DisplayGrid";
import { fetchWord } from "./api";
import { postGuess } from "./api";

function App() {
    const [word, setWord] = useState<string>("");
    const [attempts, setAttempts] = useState<number>(1);
    const [currentGuess, setCurrentGuess] = useState<string[]>([]);
    const [guesses, setGuesses] = useState<string[]>([]);

    useEffect(() => {
        fetchWord(setWord);
    }, []);

    useEffect(() => {
        console.log("All guesses", guesses);
    }, [guesses]);

    function getAttemptRange(a: number) {
        const start = (a - 1) * 5 + 1;
        const end = a * 5;
        return {start, end};
    }

    const keyDownFunction = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Backspace") {
            // Handle backspace
        } else if (event.key === "Enter") {
            if (currentGuess.length !== 5) {
                console.log("Not enough letters");
                return;
            }
            setAttempts(attempts + 1);

            postGuess(currentGuess, attempts, setGuesses, setAttempts, setCurrentGuess);
            
        } else if (event.key.length === 1 && event.key.match(/[a-z]/i)) {
            if (currentGuess.length < 5) {
                setCurrentGuess([...currentGuess, event.key.toUpperCase()]);
            } else {
                console.log("Max letters reached");
            }
        }
    };

    const resetFunc = async () => {
        try {
            await fetch("http://localhost:4000/api/guesses", {
                method: "DELETE",
            });
            setGuesses([]);
            setAttempts(1);
            setCurrentGuess([]);
            console.log("Guesses reset");
        } catch (error) {
            console.error("Error resetting guesses:", error);
        }
    };

    return (
        <>
            <DisplayGrid
                attempt={attempts}
                keyDownFunction={keyDownFunction}
                getAttemptRange={getAttemptRange}
            />
            <button className="cursor-pointer" onClick={resetFunc}>Reset server button</button>
            <div>{word}</div>
        </>
    );
}

export default App;
