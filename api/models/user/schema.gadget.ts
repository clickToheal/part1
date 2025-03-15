import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "user" model, go to https://cuhacking.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "ZSk6qum6mgi6",
  fields: {
    email: {
      type: "email",
      validations: { required: true, unique: true },
      storageKey: "9znJKpm3QeHu",
    },
    emailVerificationToken: {
      type: "string",
      storageKey: "BhxVeFKRoZx-",
    },
    emailVerificationTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "M07nmDbUzATZ",
    },
    emailVerified: {
      type: "boolean",
      default: false,
      storageKey: "f4S0PJDAYd_L",
    },
    firstName: { type: "string", storageKey: "ZQWwsNRshtcL" },
    googleImageUrl: { type: "url", storageKey: "7k3aqVFemr14" },
    googleProfileId: { type: "string", storageKey: "v3k_db2lzumG" },
    lastName: { type: "string", storageKey: "tNnfh1PgSicU" },
    lastSignedIn: {
      type: "dateTime",
      includeTime: true,
      storageKey: "3gWLdtLY2wsZ",
    },
    password: {
      type: "password",
      validations: { strongPassword: true },
      storageKey: "SnEQaQpCD_gH",
    },
    resetPasswordToken: {
      type: "string",
      storageKey: "nNdQITrIp8_J",
    },
    resetPasswordTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "N9du54rwBs2_",
    },
    roles: {
      type: "roleList",
      default: ["unauthenticated"],
      storageKey: "F1wdDxO9lowY",
    },
  },
};
