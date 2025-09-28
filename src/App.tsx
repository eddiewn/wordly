import { useState, useEffect} from "react"

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

                console.log("word:", data.word);
            } catch (error) {
                console.error("Error fetching word:", error);
            }
        };
        fetchWord();
    }, [])


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
                    console.log("Guess response:", data);
                    setGuesses(data.guesses);
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
        <div  className="w-[20%] grid grid-cols-5 grid-rows-7 gap-1.5 ">
            {Array.from({ length: 30 }).map((_, i) => (
                i+1 >= getAttemptRange(attempt).start && i < getAttemptRange(attempt).end
                ?
                <div key={i} onKeyDown={keyDownFunction} className="border-2 border-black bg-amber-300 aspect-square">
                    <input type="text" maxLength={1}  className="w-full h-full text-center uppercase"/>
                </div>
                : 
                <div key={i} className="flex items-center justify-center border-2 border-black bg-blue-300  aspect-square">
                    <p className="text-center uppercase m-auto">no</p>
                </div>
        ))}
        </div>
        <div>
            {word}
        </div>
    </>
  )
}

export default App
