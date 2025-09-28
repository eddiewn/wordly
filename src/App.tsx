import { useState, useEffect } from "react"

function App() {
    const [word, setWord] = useState<string>("");

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

return (
    <>
        <div className="w-[20%] grid grid-cols-5 grid-rows-7 gap-1.5">
            {Array.from({ length: 35 }).map((_, i) => (
                i < 30
                ?
                <div key={i} className="border-2 border-black bg-amber-300 aspect-square">
                    <p></p>
                </div>
                : 
                <div key={i} className="bg-blue-300 border-2 border-black aspect-square">
                    <input type="text" maxLength={1} className="w-full h-full text-center uppercase"/>
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
