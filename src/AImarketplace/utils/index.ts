export const styledString = (str: string, limit: number = 20): string => {
    if (!str) return '';
    return str.length > limit ? str.slice(0, limit) + '...' : str
}

export const styledBigInt = (bigNum: number, decimals: number = 18): number => {
    return Number(bigNum / 10 ** decimals)
}

export const capitalizeSentences = (text: string) => {
    return text.replace(/(?<=\.|\?|\!)\s*(\w)/g, (match) => match.toUpperCase())
        .replace(/^(\w)/, (match) => match.toUpperCase());
};