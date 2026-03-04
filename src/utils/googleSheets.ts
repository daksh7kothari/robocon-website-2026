import { google } from "googleapis";

// Define the type for our registration rows based on the columns
export interface RegistrationRow {
    rowIndex: number; // To know exactly which row to update for check-ins
    name: string;
    regNumber: string;
    department: string;
    year: string;
    email: string;
    srmEmail: string;
    contact: string;
    whatsapp: string;
    hostel: string;
    room: string;
    workshop: string;
    paymentId: string;
    orderId: string;
    transactionId: string;
    paymentStatus: string;
    timestamp: string;
    ticketId: string;
    attendance: string;
}

// Ensure the private key is properly formatted
const getPrivateKey = () => {
    const pk = process.env.GOOGLE_PRIVATE_KEY || "";
    // Handle escaped newlines from env variables
    if (pk.includes("\\n")) {
        return pk.replace(/\\n/g, "\n");
    }
    return pk;
};

// Initialize the Google Auth Client
const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: getPrivateKey(),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

export async function getRegistrations(eventNameFilter?: string): Promise<RegistrationRow[]> {
    if (!SPREADSHEET_ID) {
        console.error("GOOGLE_SHEET_ID is not defined in environment variables");
        return [];
    }

    try {
        // Assuming data is on 'Sheet1'. Adjust if needed. Reading A to R
        // Columns: Name[A], RegNum[B], Dept[C], Year[D], Email[E], SRMEmail[F], Contact[G], WhatsApp[H], Hostel[I], Room[J], Workshop[K], PaymentID[L], OrderID[M], TransactionID[N], PaymentStatus[O], Timestamp[P], TicketID[Q], Attendance[R]
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: "Sheet1!A2:R", // Skip header row
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            return [];
        }

        const registrations: RegistrationRow[] = rows.map((row: string[], index: number) => ({
            // +2 because Sheet is 1-indexed and we skip the header row 1
            rowIndex: index + 2,
            name: row[0] || "",
            regNumber: row[1] || "",
            department: row[2] || "",
            year: row[3] || "",
            email: row[4] || "",
            srmEmail: row[5] || "",
            contact: row[6] || "",
            whatsapp: row[7] || "",
            hostel: row[8] || "",
            room: row[9] || "",
            workshop: row[10] || "",
            paymentId: row[11] || "",
            orderId: row[12] || "",
            transactionId: row[13] || "",
            paymentStatus: row[14] || "PENDING",
            timestamp: row[15] || "",
            ticketId: row[16] || "",
            attendance: row[17] || "ABSENT",
        }));

        // Filter by event if provided (case insensitive)
        if (eventNameFilter) {
            return registrations.filter(
                (reg) => reg.workshop.toLowerCase() === eventNameFilter.toLowerCase()
            );
        }

        return registrations;
    } catch (error) {
        console.error("Error fetching registrations from Google Sheets:", error);
        return [];
    }
}

export async function updatePaymentStatus(rowIndex: number, status: "VERIFIED" | "PENDING" | "FAILED"): Promise<boolean> {
    if (!SPREADSHEET_ID) return false;

    try {
        // PaymentStatus is in Column O
        const range = `Sheet1!O${rowIndex}`;

        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[status]],
            },
        });

        return true;
    } catch (error) {
        console.error(`Error updating payment status for row ${rowIndex}:`, error);
        return false;
    }
}

export async function updateTicketId(rowIndex: number, ticketId: string): Promise<boolean> {
    if (!SPREADSHEET_ID) return false;

    try {
        // TicketID is in Column Q
        const range = `Sheet1!Q${rowIndex}`;

        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[ticketId]],
            },
        });

        return true;
    } catch (error) {
        console.error(`Error updating ticket ID for row ${rowIndex}:`, error);
        return false;
    }
}

export async function updateAttendanceStatus(rowIndex: number, status: "PRESENT" | "ABSENT"): Promise<boolean> {
    if (!SPREADSHEET_ID) return false;

    try {
        // Attendance is in Column R
        const range = `Sheet1!R${rowIndex}`;

        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[status]],
            },
        });

        return true;
    } catch (error) {
        console.error(`Error updating attendance status for row ${rowIndex}:`, error);
        return false;
    }
}
