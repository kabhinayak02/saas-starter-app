import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
    console.log(WEBHOOK_SECRET);

    if (!WEBHOOK_SECRET) {
        throw new Error("Please add webhook secret in env");
    }

    const headerPayload = await headers();
    console.log(headerPayload);

    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    console.log(svix_id);
    console.log(svix_timestamp);
    console.log(svix_signature);

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Error occured - No Svix headers")
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(WEBHOOK_SECRET);
    // Throws on error, returns the verified content on success

    let evt: WebhookEvent;

    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (error: any) {
        console.log("Error verifing webhook", error);
        return new Response("Error occured", { status: 400 });
    }

    const { id } = evt.data;
    const eventType = evt.type;

    if (eventType === "user.created") {
        try {
            const { email_addresses, primary_email_address_id } = evt.data;
            // console.log()

            const primaryEmail = email_addresses.find(
                (email) => email.id === primary_email_address_id
            )

            if (!primaryEmail) {
                return new Response("No Primary email found", { status: 400 });
            }

            const newUser = await prisma.user.create({
                data: {
                    id: evt.data.id!,
                    email: primaryEmail.email_address,
                    isSubscribed: false
                }
            })

            console.log("New User Created", newUser);
        } catch (error: any) {
            return new Response("Error creating user in database", {
                status: 400
            })
        }
    }

    return new Response("Webhook recieved successfully", { status: 200 });


} 