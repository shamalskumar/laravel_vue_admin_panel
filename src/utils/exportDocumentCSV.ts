export function downloadCSV(
    data: any[],
    fields: string[], // Specify fields to include in the CSV
    headersMap: { [key: string]: string }, // Map field names to formatted header names
    filename: string = 'data.csv'
) {
    // Map fields to their corresponding formatted header names
    const headers = fields.map((field) => headersMap[field] || field);

    // Map each data row to include only the specified fields
    const csvContent = [
        headers.join(','), // Add the formatted header row
        ...data.map((row) => fields.map((field) => JSON.stringify(row[field], (_, value) => value || '')).join(','))
    ].join('\n');

    // Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
