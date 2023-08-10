
export function scramble(
    haystack: Array<string>,
    needle: string
): { correct: number; scrambled: Array<string> } {
    let scrambled = [...haystack, needle]
        .map((v) => ({ v, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ v }) => v);
    let needle_value = scrambled.indexOf(needle);
    return { correct: needle_value, scrambled };
}

export function* alphabetize() {
    yield "A";
    yield "B";
    yield "C";
    yield "D";
    yield "E";
    yield "F";
    yield "G";
    yield "H";
};

export function strOrBufToString(message: string | Buffer) {
    return typeof message === "string" ? message : message.toString()
}

export function delay (ms: number) {
    return new Promise((resolve,reject) => setTimeout(resolve,ms));
}
