import { useState, useEffect, useRef } from "react";
import DisplayGrid from "./components/DisplayGrid";
import { fetchWord } from "./api";
import { postGuess } from "./api";
import { resetGame } from "./api";
import { fetchGuesses } from "./api";

function App() {
    const [word, setWord] = useState<string>("");
    const [attempts, setAttempts] = useState<number>(1);
    const [currentGuess, setCurrentGuess] = useState<string[]>([
        "",
        "",
        "",
        "",
        "",
    ]);
    const [guesses, setGuesses] = useState<string[]>([]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        fetchGuesses(setGuesses, setAttempts);
    }, []);

    useEffect(() => {
        fetchWord(setWord);
    }, []);

    useEffect(() => {
        console.log("All guesses", guesses);
    }, [guesses]);

    function getAttemptRange(a: number) {
        const start = (a - 1) * 5 + 1;
        const end = a * 5;
        return { start, end };
    }

    const keyDownFunction =
        (absoluteIndex: number) =>
        (event: React.KeyboardEvent<HTMLInputElement>) => {
            const startIndex = (attempts - 1) * 5; // absolute start of current row
            const relativeIndex = absoluteIndex - startIndex; // 0-4 in currentGuess

            if (event.key === "Backspace") {
                const newGuess = [...currentGuess];
                newGuess[relativeIndex] = "";
                setCurrentGuess(newGuess);
                if (relativeIndex > 0) {
                    const prevAbsoluteIndex = absoluteIndex - 1;
                    inputRefs.current[prevAbsoluteIndex]?.focus();
                }
            } else if (event.key.length === 1 && event.key.match(/[a-z]/i)) {
                const newGuess = [...currentGuess];
                newGuess[relativeIndex] = event.key.toUpperCase();
                setCurrentGuess(newGuess);

                if (relativeIndex < 4) {
                    const nextAbsoluteIndex = absoluteIndex + 1;
                    inputRefs.current[nextAbsoluteIndex]?.focus();
                }
            } else if (event.key === "Enter") {
                if (currentGuess.some((letter) => letter === "")) {
                    console.log("Not enough letters");
                    return;
                }
                postGuess(
                    currentGuess,
                    attempts,
                    setGuesses,
                    setAttempts,
                    setCurrentGuess
                );
                setAttempts(prev => prev + 1);
            }
        };
    const resetFunc = async () => {
        try {
            // Resets the server-side guesses and attempts
            await resetGame();

            setGuesses([]);
            setAttempts(1);
            setCurrentGuess(["", "", "", "", ""]);
            console.log("Guesses reset");
        } catch (error) {
            console.error("Error resetting guesses:", error);
        }
    };

    return (
        <>
            {attempts !== undefined && (
                <div className="flex justify-center w-full">
                <DisplayGrid
                    attempt={attempts}
                    keyDownFunction={keyDownFunction}
                    getAttemptRange={getAttemptRange}
                    inputRefs={inputRefs}
                    currentGuess={currentGuess}
                />
                </div>
            )}
            <button className="cursor-pointer" onClick={resetFunc}>
                Reset server button
            </button>
            <div>{word}</div>
        </>
    );
}

export default App;
