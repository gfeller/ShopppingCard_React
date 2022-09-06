import {useEffect, useState} from "react";

export function useTmpState<T>(initValue : T, timeout: number = 1000) {
    const [state, setState] = useState<T>(initValue);

    useEffect(() => {
        if (state !== initValue) {
            setTimeout(() => {
                if (state !== initValue) {
                    setState(initValue)
                }
            }, timeout)
        }
    }, [state])

    return {state, setState}
}
