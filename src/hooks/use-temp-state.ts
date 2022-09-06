import {useEffect, useState} from "react";

export function useTmpState<T>(initValue : T, timeout: number = 1000) {
    const [state, setState] = useState<T>(initValue);

    useEffect(() => {
        debugger;
        if (state !== initValue) {
            const id = setTimeout(() => {
                if (state !== initValue) {
                    setState(initValue)
                }
            }, timeout)
            // return clearTimeout(id);
        }
    }, [state])

    return {state, setState}
}
