export const fetchWord = async (
    setWord: React.Dispatch<React.SetStateAction<string>>
) => {
    try {
        const response = await fetch("/api/givemeWOOORD", {
            credentials: "include",
        });
        const data = await response.json();
        setWord(data.word);

    } catch (error) {
        console.error("Error fetching word:", error);
    }
};

export const fetchGuesses = async (
    setGuesses: React.Dispatch<React.SetStateAction<string[]>>,
    setAttempts: React.Dispatch<React.SetStateAction<number>>,
    setCheck2d: React.Dispatch<React.SetStateAction<number[][]>>
) => {
    try {
        const response = await fetch("/api/guesses", {
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
    try {
        const response = await fetch("/api/guesses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                guess: currentGuess.join(""),
            }),
            credentials: "include",
        });


        const data = await response.json();
        console.log(`This is data: ${data.guesses}`)
        setGuesses(data.guesses);
        setAttempts(data.attempts);
        setCurrentGuess(["", "", "", "", ""]);
        setCheck2d(data.check2d);
    } catch (error) {
        console.error("Error posting guess:", error);
    }
};

export const resetGame = async () => {
    await fetch("/api/guesses", {
        method: "DELETE",
        credentials: "include",
})};
