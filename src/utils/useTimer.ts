import { useEffect, useState } from "react";

const useTimer = (beatTime: number) => {
    const [timer, setTimer] = useState(0);
    useEffect(() => {
        setTimeout(() => {
            setTimer(timer => timer + 1);
        }, beatTime * 1000);
    }, [timer])
    return { timer }
}

export default useTimer;