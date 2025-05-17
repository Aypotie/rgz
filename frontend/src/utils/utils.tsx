export const normolizeTime = (input: string) => {
    const date = new Date(input);

    // Получим дату и время без часового пояса
    const local = date.toLocaleString("ru-RU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });

    return local;
}