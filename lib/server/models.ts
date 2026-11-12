import "server-only";
import mongoose, { Schema, type Model, type Types } from "mongoose";

// Plain interfaces (not inferred from the schemas): Mongoose's inferred types are too heavy for tsc here.
type Sealed = { iv?: string; tag?: string; data?: string };

export interface EmailConfigurationDoc {
  _id: Types.ObjectId;
  key: string; provider: string; host: string; port: number; security: string; authType: string;
  username: string; senderEmail: string; senderName: string; notifyEmails: string[]; enabled: boolean;
  tenantId: string; clientId: string; objectId: string;
  clientSecretEnc?: Sealed | null; secretUpdatedAt?: Date | null;
  lastTest?: { at?: Date; status?: string; message?: string } | null;
  updatedBy?: string; createdAt?: Date; updatedAt?: Date;
}

export interface EmailTemplateDoc {
  _id: Types.ObjectId;
  key: string; name: string; description: string; subject: string; html: string; text: string;
  variables: string[]; enabled: boolean; system: boolean; updatedBy?: string; createdAt?: Date; updatedAt?: Date;
}

export interface EmailLogDoc {
  _id: Types.ObjectId;
  to: string[]; subject: string; templateKey: string; status: "queued" | "sent" | "failed"; error: string;
  attempts: number; nextRetryAt: Date | null; messageId: string; source: string; sentAt?: Date | null;
  message?: { replyTo?: string; html?: string; text?: string; attachments?: { filename?: string; contentBase64?: string; contentType?: string }[] };
  createdAt: Date; updatedAt: Date;
}

export interface AuditLogDoc { _id: Types.ObjectId; actor: string; action: string; target: string; fields: string[]; ip: string; createdAt: Date }
export interface RateLimitDoc { _id: Types.ObjectId; key: string; count: number; expiresAt: Date }

// Reuse compiled models across hot reloads and serverless invocations.
function model<T>(name: string, schema: Schema): Model<T> {
  return (mongoose.models[name] as Model<T> | undefined) ?? (mongoose.model(name, schema) as unknown as Model<T>);
}

const sealed = new Schema({ iv: String, tag: String, data: String }, { _id: false });

export const EmailConfiguration = model<EmailConfigurationDoc>("EmailConfiguration", new Schema({
  key: { type: String, default: "default", unique: true },
  provider: { type: String, default: "microsoft365" },
  host: { type: String, default: "smtp.office365.com" },
  port: { type: Number, default: 587 },
  security: { type: String, default: "STARTTLS" },
  authType: { type: String, default: "oauth2" },
  username: { type: String, default: "" },
  senderEmail: { type: String, default: "" },
  senderName: { type: String, default: "Hawyia Premium" },
  notifyEmails: { type: [String], default: [] },
  enabled: { type: Boolean, default: true },
  tenantId: { type: String, default: "" },
  clientId: { type: String, default: "" },
  objectId: { type: String, default: "" },
  clientSecretEnc: { type: sealed, default: null },
  secretUpdatedAt: { type: Date, default: null },
  lastTest: { type: new Schema({ at: Date, status: String, message: String }, { _id: false }), default: null },
  updatedBy: String,
}, { timestamps: true }));

export const EmailTemplate = model<EmailTemplateDoc>("EmailTemplate", new Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, default: "" },
  subject: { type: String, required: true },
  html: { type: String, required: true },
  text: { type: String, default: "" },
  variables: { type: [String], default: [] },
  enabled: { type: Boolean, default: true },
  system: { type: Boolean, default: false },
  updatedBy: String,
}, { timestamps: true }));

const emailLogSchema = new Schema({
  to: { type: [String], required: true, index: true },
  subject: { type: String, default: "" },
  templateKey: { type: String, default: "" },
  status: { type: String, enum: ["queued", "sent", "failed"], default: "queued", index: true },
  error: { type: String, default: "" },
  attempts: { type: Number, default: 0 },
  nextRetryAt: { type: Date, default: null, index: true },
  messageId: { type: String, default: "" },
  source: { type: String, default: "" },
  sentAt: { type: Date, default: null },
  // what was sent, kept so it can be viewed and retried (never credentials)
  message: {
    type: new Schema({
      replyTo: String, html: String, text: String,
      attachments: [new Schema({ filename: String, contentBase64: String, contentType: String }, { _id: false })],
    }, { _id: false }),
    default: null,
  },
}, { timestamps: true });
emailLogSchema.index({ createdAt: -1 });
export const EmailLog = model<EmailLogDoc>("EmailLog", emailLogSchema);

export const AuditLog = model<AuditLogDoc>("AuditLog", new Schema({
  actor: { type: String, required: true },
  action: { type: String, required: true },
  target: { type: String, default: "" },
  fields: { type: [String], default: [] },   // names of what changed, never values of secrets
  ip: { type: String, default: "" },
}, { timestamps: true }));

const rateLimitSchema = new Schema({
  key: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
});
rateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const RateLimit = model<RateLimitDoc>("RateLimit", rateLimitSchema);
