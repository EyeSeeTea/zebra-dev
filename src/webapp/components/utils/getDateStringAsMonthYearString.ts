export function getDateStringAsMonthYearString(dateString: string): string {
    try {
        if (!dateString) return "";

        const date = new Date(dateString);
        return date.toLocaleString("default", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    } catch (e) {
        console.debug(e);
        return "";
    }
}
