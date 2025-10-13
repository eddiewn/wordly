import {useState, useEffect, useRef} from "react";
import DisplayGrid from "./components/DisplayGrid";
import {fetchWord} from "./api";
import {postGuess} from "./api";
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
    const activeInputIndex = useRef<number>(0);

    function getAttemptRange(a: number) {
        const start = (a - 1) * 5 + 1;
        const end = a * 5;
        return {start, end};
    }

const newDayFunc = () => {
    const timeNow = new Date().getTime();
    console.log("milliseconds now", timeNow);

    const tomorrowDate = new Date();
    tomorrowDate.setUTCHours(24, 0, 0, 0);

    const msUntilTomorrow = tomorrowDate.getTime() - timeNow;
    
    console.log("I have been called master");
    setTimeout(() => {
        fetchWord(setWord);
        setAttempts(1);
        setGuesses([]);
        setCheck2d([]);
        setCurrentGuess(["", "", "", "", ""]);
        activeInputIndex.current = 0;
        inputRefs.current[0]?.focus();
        newDayFunc();
    }, msUntilTomorrow);
}


    useEffect(() => {
        fetchGuesses(setGuesses, setAttempts, setCheck2d);
        fetchWord(setWord);
        newDayFunc();
    }, []);



    function endGame() {
        alert("You won!");
    }

    const keyDownFunction =
        (absoluteIndex: number) =>
        (event: React.KeyboardEvent<HTMLInputElement>) => {
            const startIndex = (attempts - 1) * 5; // absolute start of current row
            let relativeIndex = absoluteIndex - startIndex; // 0-4 in currentGuess

            if (event.key === "Backspace") {
                const newGuess = [...currentGuess];
                if (newGuess[relativeIndex] === "") relativeIndex--
                newGuess[relativeIndex] = "";
                setCurrentGuess(newGuess);
                relativeIndex++
                if (relativeIndex > 0) {
                    const prevAbsoluteIndex = absoluteIndex - 1;
                    inputRefs.current[prevAbsoluteIndex]?.focus();
                }
            } else if (event.key.length === 1 && event.key.match(/[a-z]/i)) {

                //If relative index !== "", run the keydownfucntion AGANE
                const newGuess = [...currentGuess];
                if (newGuess.at(-1) !== "" && relativeIndex == 4) return;  
                if(newGuess[relativeIndex] !== "") relativeIndex++ 
                newGuess[relativeIndex] = event.key.toUpperCase();
                setCurrentGuess(newGuess);
                if (relativeIndex < 5) {
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
                    setGuesses,
                    setAttempts,
                    setCurrentGuess,
                    setCheck2d,
                );
                setCurrentGuess(["", "", "", "", ""]);
                setAttempts((prev) => prev + 1);
                if (currentGuess.join("").toLowerCase() == word) {
                        endGame();
                    return;
                }
            }
        };

    return (
        <>
        <div 
            onClick={() => { 
                inputRefs.current[activeInputIndex.current]?.focus();
            }}   
            className="h-screen w-screen fixed z-40">
        </div>
        <div className="h-screen">
            <div className="py-18">
                <h1 className="text-center text-4xl text-blue-50 font-mono">Wordly</h1>
            </div>
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
                        activeInputIndex={activeInputIndex}
                    />
                </div>
            )}

            {/* <button className="cursor-pointer z-100" onClick={resetFunc}>
                Reset Game Button
            </button>
            <div>{word}</div> */}
        </div>


        </>
    );
}

export default App;
