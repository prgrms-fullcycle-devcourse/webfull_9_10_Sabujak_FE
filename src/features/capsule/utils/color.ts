const COLORS = [
    "bg-[#FFF1D6]",
    "bg-[#FFE2D6]",
    "bg-[#E9F7FF]",
    "bg-[#EDE7FF]",
    "bg-[#E8FFF1]",
    "bg-[#FDF2E9]",
    "bg-[#F4F4F4]",
    "bg-[#DDEBFF]"
];

export function getColors(length: number): string[] {
    const result: string[] = [];

    for (let i = 0; i < length; i++) {
        const prev1 = result[i - 1];
        const prev2 = result[i - 2];

        const candidates = COLORS.filter(
            c => c !== prev1 && c !== prev2
        );

        const pool = candidates.length > 0 ? candidates : COLORS;

        const color = pool[Math.floor(Math.random() * pool.length)];

        result.push(color);
    }

    return result;
}