import {useState, useEffect, useRef} from "react";
import DisplayGrid from "./components/DisplayGrid";
import {fetchWord} from "./api";
import {postGuess} from "./api";
import {resetGame} from "./api";
import {fetchGuesses} from "./api";

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
    const [check2d, setCheck2d] = useState<number[][]>([]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        console.log("Im now in first useEffect")
        fetchGuesses(setGuesses, setAttempts, setCheck2d);
        fetchWord(setWord);
    }, []);


    useEffect(() => {
        console.log("All guesses", guesses);
        console.log(check2d);
    }, [guesses, check2d]);

    function getAttemptRange(a: number) {
        const start = (a - 1) * 5 + 1;
        const end = a * 5;
        return {start, end};
    }

    function endGame() {
        alert("You won!");
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
                if (currentGuess.join("").toLowerCase() == word) {
                    endGame();
                    return;
                }
                postGuess(
                    currentGuess,
                    setGuesses,
                    setAttempts,
                    setCurrentGuess,
                    setCheck2d,
                );
                setCurrentGuess(["", "", "", "", ""]);
                setAttempts((prev) => prev + 1);
            }
        };

    const resetFunc = async () => {
        try {
            console.log(guesses);
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
                        guesses={guesses}
                        check2d={check2d}
                    />
                </div>
            )}
            <button className="cursor-pointer" onClick={resetFunc}>
                Reset Game Button
            </button>
            <div>{word}</div>
        </>
    );
}

export default App;
