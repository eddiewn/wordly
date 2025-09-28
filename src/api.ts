export const fetchWord = async (setWord: React.Dispatch<React.SetStateAction<string>>) => {
            try {
                const response = await fetch(
                    "http://localhost:4000/api/givemeWOOORD"
                );
                const data = await response.json();
                setWord(data.word);

                console.log("Word:", data.word);
            } catch (error) {
                console.error("Error fetching word:", error);
            }
        };
