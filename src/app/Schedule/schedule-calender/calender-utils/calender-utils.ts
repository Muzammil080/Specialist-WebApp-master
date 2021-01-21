interface RecurringEvent {
    title: string;
    color: any;
    rrule?: {
        freq: any;
        bymonth?: number;
        bymonthday?: number;
        byweekday?: any;
    };
}
