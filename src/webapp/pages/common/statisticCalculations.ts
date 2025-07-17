export function calculateMedian(values: number[]) {
    if (!values.length) return 0;

    values.sort((a, b) => a - b);
    const mid = Math.floor(values.length / 2);
    return (
        (values.length % 2 !== 0
            ? values[mid]
            : ((values[mid - 1] || 0) + (values[mid] || 0)) / 2) || 0
    );
}
