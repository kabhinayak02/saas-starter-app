import { clerkClient } from "@clerk/nextjs/server";

async function isAdmin(userId: string){
    const user = (await clerkClient()).users.getUser(userId); 
    (await user).privateMetadata.role == "admin"
}