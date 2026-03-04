import { NextRequest, NextResponse } from "next/server";
import { sendConfirmationEmails } from "@/lib/send-emails";

const GOOGLE_SHEET_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL!;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { formData, transactionId } = body;

        // Validate required fields
        if (!formData || !transactionId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Validate TransactionID format (12-digit UTR)
        if (!/^\d{12}$/.test(transactionId.trim())) {
            return NextResponse.json(
                { error: "Transaction ID must be exactly 12 digits" },
                { status: 400 }
            );
        }

        // Submit to Google Sheets from the server (URLSearchParams for server-side compatibility)
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(formData)) {
            params.append(key, value as string);
        }
        params.append("PaymentID", "");
        params.append("OrderID", "");
        params.append("TransactionID", transactionId.trim());
        params.append("PaymentStatus", "PENDING");

        const sheetRes = await fetch(GOOGLE_SHEET_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params.toString(),
            redirect: "follow",
        });

        const sheetText = await sheetRes.text();
        let sheetData: any = {};
        try { sheetData = JSON.parse(sheetText); } catch { }

        if (!sheetRes.ok && !sheetData.result) {
            console.error("Google Sheets submission failed:", sheetRes.status);
            return NextResponse.json(
                { error: "Registration submission failed" },
                { status: 502 }
            );
        }

        // Check for duplicate registration
        if (sheetData.result === "duplicate") {
            return NextResponse.json(
                { error: "This registration number is already registered for the workshop." },
                { status: 409 }
            );
        }

        console.log(
            `⏳ Manual UPI registration submitted — UTR: ${transactionId}, Name: ${formData.Name}`
        );

        // WE NO LONGER SEND TICKETS IMMEDIATELY FOR MANUAL REGISTRATIONS
        // The admin must verify the payment first via the /admin/dashboard, which will trigger the official ticket email.
        // await sendConfirmationEmails({
        //     formData,
        //     paymentId: `UTR-${transactionId.trim()}`,
        //     orderId: "MANUAL_UPI",
        // }).catch((err) =>
        //     console.error("❌ Email sending failed:", err.message)
        // );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Submit manual registration error:", error);
        return NextResponse.json(
            { error: "Failed to submit registration" },
            { status: 500 }
        );
    }
}
