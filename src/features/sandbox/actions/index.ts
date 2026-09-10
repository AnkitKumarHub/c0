"use server";

import { getCurrentUser } from "@/features/auth/actions";
import { connectSandbox } from "@/features/inngest/utils";
import { prisma } from "@/lib/db";

const PREVIEW_TIMEOUT_MS = 60 * 60 * 1000; // 1 hour — match your Sandbox.create

export async function resolveFragmentPreviewUrl(fragmentId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Unauthorized" as const };
  }

  const fragment = await prisma.fragment.findFirst({
    where: {
      id: fragmentId,
      message: {
        project: { userId: user.id },
      },
    },
    select: {
      id: true,
      sandboxId: true,
      sandboxUrl: true,
    },
  });

  if (!fragment) {
    return { error: "Fragment not found" as const };
  }

  if (!fragment.sandboxId) {
    // old fragments before migration
    return { url: fragment.sandboxUrl };
  }

  try {
    const sandbox = await connectSandbox(fragment.sandboxId);

    // extend lifetime when user opens preview
    await sandbox.setTimeout(PREVIEW_TIMEOUT_MS);

    const url = `https://${sandbox.getHost(3000)}`;

    // keep DB in sync if host changed
    if (url !== fragment.sandboxUrl) {
      await prisma.fragment.update({
        where: { id: fragment.id },
        data: { sandboxUrl: url },
      });
    }

    return { url };
  } catch (error) {
    console.error("Failed to connect to sandbox:", error);
    return {
      error: "Sandbox unavailable. It may have expired." as const,
      url: fragment.sandboxUrl, // fallback to last known URL
    };
  }
}