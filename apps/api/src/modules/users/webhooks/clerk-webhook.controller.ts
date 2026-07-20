import { BadRequestException, Controller, Headers, Post, RawBodyRequest, Req } from "@nestjs/common";
import { Request } from "express";
import { Webhook } from "svix";
import { SyncClerkUserUseCase } from "../application/use-cases/sync-clerk-user.use-case";

interface ClerkUserEventPayload {
  type: string;
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    first_name: string | null;
    last_name: string | null;
  };
}

@Controller("webhooks/clerk")
export class ClerkWebhookController {
  constructor(private readonly syncClerkUser: SyncClerkUserUseCase) {}

  @Post()
  async handle(
    @Req() request: RawBodyRequest<Request>,
    @Headers("svix-id") svixId: string,
    @Headers("svix-timestamp") svixTimestamp: string,
    @Headers("svix-signature") svixSignature: string,
  ) {
    const secret = process.env.CLERK_WEBHOOK_SECRET;
    if (!secret) {
      throw new Error("CLERK_WEBHOOK_SECRET is not configured");
    }
    if (!request.rawBody) {
      throw new BadRequestException("Missing raw body");
    }

    const webhook = new Webhook(secret);
    let event: ClerkUserEventPayload;
    try {
      event = webhook.verify(request.rawBody, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as ClerkUserEventPayload;
    } catch {
      throw new BadRequestException("Invalid webhook signature");
    }

    if (event.type === "user.created" || event.type === "user.updated") {
      const { id, email_addresses, first_name, last_name } = event.data;
      const email = email_addresses[0]?.email_address;
      if (!email) {
        throw new BadRequestException("Clerk user has no email address");
      }
      const name = [first_name, last_name].filter(Boolean).join(" ") || null;
      await this.syncClerkUser.execute({ clerkId: id, email, name });
    }

    return { received: true };
  }
}
