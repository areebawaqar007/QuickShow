// clerkClient allows your backend to interact with Clerk's server-side API, including retrieving user information.

// Think of Clerk as the service that manages user accounts and authentication.
import { clerkClient } from "@clerk/express";

export const protectAdmin = async(req,res,next) => {
    try {
    // req.auth() is a Clerk function that provides authentication information about the user making an HTTP request.
    const {userId} = req.auth();
    const user = await clerkClient.users.getUser(userId);

    if(user.privateMetadata.role !== "admin"){
        return res.json({success:false,message:"Not Authorized"})
    }

    next();
} catch (error) {
    return res.json({success:false,message:"Not Authorized"})
}
}