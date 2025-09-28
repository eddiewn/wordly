import { useState, useEffect} from "react"
import DisplayGrid from "./components/DisplayGrid"


function App() {
    const [word, setWord] = useState<string>("");
    const [attempt, setAttempt] = useState<number>(1);
    const [currentGuess, setCurrentGuess] = useState<string[]>([]);
    const [guesses, setGuesses] = useState<string[]>([]);

    useEffect(() => {
        const fetchWord = async () => {
            try {
                const response = await fetch("http://localhost:4000/api/givemeWOOORD");
                const data = await response.json();
                setWord(data.word);

                console.log("Word:", data.word);
            } catch (error) {
                console.error("Error fetching word:", error);
            }
        };
        fetchWord();
    }, [])


useEffect(() => {
    console.log("All guesses", guesses);
}, [guesses]);

function getAttemptRange(a: number) {
    const start = (a - 1) * 5 + 1;
    const end = a * 5;
    return { start, end };
}

    const keyDownFunction = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if(event.key === "Backspace") {
            // Handle backspace
        } else if(event.key === "Enter") {
            setAttempt(attempt + 1);

            const postGuess = async () => {
                try {
                    const response = await fetch("http://localhost:4000/api/guess", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ guess: currentGuess.join("")})
                    });
                    const data = await response.json();
                    setGuesses(data.guesses);
                    setCurrentGuess([]);
                } catch (error) {
                    console.error("Error posting guess:", error);
                }
            };
            postGuess();

        } else if(event.key.length === 1 && event.key.match(/[a-z]/i)) {
            if(currentGuess.length < 5){
              setCurrentGuess([...currentGuess, event.key.toUpperCase()])
            }else{
                console.log("Max letters reached");
            }
        }
    };


return (    
    <>
        <DisplayGrid attempt={attempt} keyDownFunction={keyDownFunction} getAttemptRange={getAttemptRange}/>
        <div>
            {word}
        </div>
    </>
  )
}

export default App
