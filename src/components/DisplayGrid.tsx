import type { RefObject } from "react";


type Props = {
    attempt: number;
    keyDownFunction: (index:number) => (event: React.KeyboardEvent<HTMLInputElement>) => void;
    getAttemptRange: (a: number) => { start: number; end: number };
    inputRefs: RefObject<(HTMLInputElement | null)[]>;
}

const DisplayGrid = ({ attempt, keyDownFunction, getAttemptRange, inputRefs }: Props) => {
    
    return (
        <div className="w-[20%] grid grid-cols-5 grid-rows-7 gap-1.5 ">
            {Array.from({ length: 30 }).map((_, i) => (
                i+1 >= getAttemptRange(attempt).start && i < getAttemptRange(attempt).end
                ?
                <div key={i}  className="border-2 border-black bg-amber-300 aspect-square">
                    <input 
                        onKeyDown={keyDownFunction(i)}
                        type="text" 
                        maxLength={1}  
                        className="w-full h-full text-center uppercase"
                        ref={(el) => {
                            inputRefs.current[i] = el;
                        }}
                        onChange={() => {
                            
                        }}
                    />
                </div>
                : 
                <div key={i} className="flex items-center justify-center border-2 border-black bg-blue-300  aspect-square">
                    <p className="text-center uppercase m-auto">no</p>
                </div>
            ))}
        </div>
    )
}

export default DisplayGrid;