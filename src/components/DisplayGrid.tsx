import type {RefObject} from "react";
import {useLayoutEffect} from "react";

type Props = {
    attempt: number;
    keyDownFunction: (
        index: number
    ) => (event: React.KeyboardEvent<HTMLInputElement>) => void;
    getAttemptRange: (a: number) => {start: number; end: number};
    inputRefs: RefObject<(HTMLInputElement | null)[]>;
    currentGuess: string[];
    guesses: string[];
    check2d: number[][];
};

const DisplayGrid = ({
    attempt,
    keyDownFunction,
    getAttemptRange,
    inputRefs,
    currentGuess,
    guesses,
    check2d,
}: Props) => {
    const {start, end} = getAttemptRange(attempt);

    useLayoutEffect(() => {
        const firstIndex = start - 1;
        inputRefs.current[firstIndex]?.focus();
    }, [attempt, start, inputRefs]);

    return (
        <div className="w-[20%] grid grid-cols-5 grid-rows-7 gap-1.5 transition duration-300">
            {Array.from({length: 30}).map((_, i) => {
                if (i + 1 < start) {
                    const row = Math.floor(i / 5);
                    const column = i % 5;
                    const printin: string[] = guesses[row]?.split("") || [];
                    console.log(check2d);

                    if (check2d[row] && check2d[row][column] == 1) {
                        console.log(check2d)
                        return (
                            <div
                                key={i}
                                className="flex items-center justify-center border-2 border-black bg-green-300 aspect-square text-white"
                            >
                                {printin[column] || ""}
                            </div>
                        );
                    } else if(check2d[row] && check2d[row][column] == 2){
                        return (
                            <div
                                key={i}
                                className="flex items-center justify-center border-2 border-black bg-yellow-400 aspect-square text-white"
                            >
                                {printin[column] || ""}
                            </div>
                        );
                    }else{
                        return (
                            <div
                                key={i}
                                className="flex items-center justify-center border-2 border-black bg-gray-700 aspect-square text-white"
                            >
                                {printin[column] || ""}
                            </div>
                        );
                    }
                } else if (i + 1 >= start && i < end) {
                    const relativeIndex = i - (start - 1);
                    return (
                        <div
                            key={i}
                            className="border-2 border-black bg-amber-300 aspect-square"
                        >
                            <input
                                value={currentGuess[relativeIndex] || ""}
                                onChange={() => {}}
                                onKeyDown={keyDownFunction(i)}
                                type="text"
                                maxLength={1}
                                className="w-full h-full text-center uppercase"
                                ref={(el) => {
                                    inputRefs.current[i] = el;
                                }}
                            />
                        </div>
                    );
                } else {
                    return (
                        <div
                            key={i}
                            className="flex items-center justify-center border-2 border-black bg-gray-800 aspect-square"
                        >
                            <p className="text-center uppercase m-auto">no</p>
                        </div>
                    );
                }
            })}
        </div>
    );
};

export default DisplayGrid;
