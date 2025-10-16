export const fetchWord = async (
    setWord: React.Dispatch<React.SetStateAction<string>>
) => {
    try {
        const response = await fetch("/api/givemeWOOORD", {
            credentials: "include",
        });
        const data = await response.json();
        setWord(data.word);
        console.log(data.word)

    } catch (error) {
        console.error("Error fetching word:", error);
    }
};

export const validateWord = async (currentGuess: string[]) => {
    try {
        const word = currentGuess.join("").toLowerCase();
        const response = await fetch(`/api/validateWord?word=${word}`, {
            method: "GET",
            credentials: "include",
        });

        const data = await response.json();

        console.log("Word validation response:", data);
        return data.isValid;
    } catch (error) {
        console.error("Error validating word:", error);
        return false;
    }
}

export const resetGame = async () => {
    try {
        await fetch("/api/guesses", {
            method: "DELETE",
            credentials: "include",
        });
        console.log("Game reset successfully");
    } catch (error) {
        console.error("Error resetting game:", error);
    }
}

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