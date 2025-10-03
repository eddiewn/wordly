export const fetchWord = async (
    setWord: React.Dispatch<React.SetStateAction<string>>
) => {
    try {
        const response = await fetch("http://localhost:4000/api/givemeWOOORD", {
            credentials: "include",
        });
        const data = await response.json();
        setWord(data.word);

        console.log("Word:", data.word);
    } catch (error) {
        console.error("Error fetching word:", error);
    }
};

export const fetchGuesses = async (
    setGuesses: React.Dispatch<React.SetStateAction<string[]>>,
    setAttempts: React.Dispatch<React.SetStateAction<number>>,
    setCheck2d: React.Dispatch<React.SetStateAction<number[][]>>
) => {
    console.log("Im now in fetch")
    try {
        const response = await fetch("http://localhost:4000/api/guesses", {
            credentials: "include",
        });
        const data = await response.json();
        setGuesses(data.guesses);
        setAttempts(data.attempts);
        setCheck2d(data.check2d);
    } catch (error) {
        console.error("Error fetching guesses:", error);
    }
};

export const postGuess = async (
    currentGuess: string[],
    setGuesses: React.Dispatch<React.SetStateAction<string[]>>,
    setAttempts: React.Dispatch<React.SetStateAction<number>>,
    setCurrentGuess: React.Dispatch<React.SetStateAction<string[]>>,
    setCheck2d: React.Dispatch<React.SetStateAction<number[][]>>,
) => {
    console.log("Im now in postGuess")
    try {
        const response = await fetch("http://localhost:4000/api/guesses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                guess: currentGuess.join(""),
            }),
            credentials: "include",
        });

        console.log("Im now past the fetch")

        const data = await response.json();
        console.log(`This is data: ${data.guesses}`)
        setGuesses(data.guesses);
        setAttempts(data.attempts);
        setCurrentGuess(["", "", "", "", ""]);
        console.log(data.check2d)
        setCheck2d(data.check2d);
    } catch (error) {
        console.error("Error posting guess:", error);
    }
};

export const resetGame = async () => {
    await fetch("http://localhost:4000/api/guesses", {
        method: "DELETE",
        credentials: "include",
})};
