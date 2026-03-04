import { NextResponse } from "next/server";
import { updatePaymentStatus, updateTicketId } from "@/utils/googleSheets";
import { generateTicketId, generateQrCode, sendConfirmationEmail } from "@/utils/ticket";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { rowIndex, name, phone, email, workshop } = body;

        if (!rowIndex || !name || !phone || !email || !workshop) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            );
        }

        // 1. Update Google Sheet Status to VERIFIED
        const updated = await updatePaymentStatus(rowIndex, "VERIFIED");

        if (!updated) {
            return NextResponse.json(
                { success: false, error: "Failed to update Google Sheets" },
                { status: 500 }
            );
        }

        // 2. Generate Ticket and QR code
        const ticketId = await generateTicketId(name, phone);
        const qrDataUrl = await generateQrCode(ticketId);

        // 2b. Write Ticket ID to Google Sheets
        await updateTicketId(rowIndex, ticketId);

        // 3. Send the Confirmation Email
        const emailSent = await sendConfirmationEmail(
            email,
            name,
            workshop,
            ticketId,
            qrDataUrl
        );

        if (!emailSent) {
            console.warn("Status updated, but failed to send email.");
            return NextResponse.json(
                { success: true, warning: "Verified, but email failed to send" },
                { status: 200 }
            );
        }

        return NextResponse.json({ success: true, ticketId }, { status: 200 });
    } catch (error) {
        console.error("Error in verification API:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
