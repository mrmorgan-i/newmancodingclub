type DateOnlyFormatOptions = Omit<Intl.DateTimeFormatOptions, "timeZone">;

export function parseDateOnly(value: string): Date | null {
    const parts = value.split("-");
    if (parts.length !== 3) return null;

    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);

    if (
        !Number.isInteger(year) ||
        !Number.isInteger(month) ||
        !Number.isInteger(day) ||
        month < 1 ||
        month > 12 ||
        day < 1 ||
        day > 31
    ) {
        return null;
    }

    const date = new Date(Date.UTC(year, month - 1, day));
    if (
        date.getUTCFullYear() !== year ||
        date.getUTCMonth() !== month - 1 ||
        date.getUTCDate() !== day
    ) {
        return null;
    }

    return date;
}

export function formatDateOnly(
    value: string,
    options: DateOnlyFormatOptions,
): string {
    const date = parseDateOnly(value);
    if (!date) return value;

    return date.toLocaleDateString("en-US", {
        ...options,
        timeZone: "UTC",
    });
}

export function serializeDateOnly(date: Date): string {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export function dateOnlyInTimeZone(date: Date, timeZone: string): string {
    const parts = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone,
    }).formatToParts(date);
    const values = new Map(parts.map((part) => [part.type, part.value]));
    const year = values.get("year");
    const month = values.get("month");
    const day = values.get("day");

    if (!year || !month || !day) {
        throw new Error("Unable to resolve a calendar date.");
    }

    return `${year}-${month}-${day}`;
}
