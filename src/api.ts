export const fetchWord = async (
    setWord: React.Dispatch<React.SetStateAction<string>>
) => {
    try {
        const response = await fetch("http://localhost:4000/api/givemeWOOORD");
        const data = await response.json();
        setWord(data.word);

        console.log("Word:", data.word);
    } catch (error) {
        console.error("Error fetching word:", error);
    }
};

export const postGuess = async (
    currentGuess: string[],
    attempts: number,
    setGuesses: React.Dispatch<React.SetStateAction<string[]>>,
    setAttempts: React.Dispatch<React.SetStateAction<number>>,
    setCurrentGuess: React.Dispatch<React.SetStateAction<string[]>>
) => {
    try {
        const response = await fetch("http://localhost:4000/api/guesses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                guess: currentGuess.join(""),
                attempt: attempts,
            }),
        });
        const data = await response.json();
        setGuesses(data.guesses);
        setAttempts(data.attempts);
        setCurrentGuess([]);
    } catch (error) {
        console.error("Error posting guess:", error);
    }
};
