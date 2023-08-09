
export function scramble(
    haystack: Array<string>,
    needle: string
): { needle: number; haystack: Array<string> } {
    let scrambled = [...haystack, needle]
        .map((v) => ({ v, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ v }) => v);
    let needle_value = scrambled.indexOf(needle);
    return { needle: needle_value, haystack: scrambled };
}

export const alphabetize = function*() {
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
