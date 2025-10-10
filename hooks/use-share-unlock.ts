import { useEffect, useRef, useState } from "react";
import {
  ensureLocalFromBlob,
  openFile,
  resolveFileMeta,
} from "~/lib/open-file";

export type DialogStatus = "pending" | "success";

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

export function useShareUnlock() {
  const OPEN_DELAY_MS = 2000;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState("");
  const [dialogStatus, setDialogStatus] = useState<DialogStatus>("pending");

  const timers = useRef<number[]>([]);
  const pendingOpenRef = useRef<{
    localUri: string;
    mimeType: string;
    iosUTI?: string;
    armed: boolean;
  } | null>(null);

  function clearTimers() {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  }

  useEffect(() => clearTimers, []);

  async function onDialogDismiss() {
    // only open if armed
    const payload = pendingOpenRef.current;
    if (!payload?.armed) return;

    // wait for a couple frames to ensure the modal is fully gone
    await nextFrame();
    await nextFrame();
    await wait(120);

    await openFile({
      localUri: payload.localUri,
      mimeType: payload.mimeType,
      iosUTI: payload.iosUTI,
    });

    pendingOpenRef.current = null;
  }

  function beginPending() {
    clearTimers();
    pendingOpenRef.current = null; // target not ready yet
    setDialogOpen(true);
    setDialogStatus("pending");
    setDialogText("Requesting for access");
  }

  async function completeWithBlob(blob: Blob, fileName: string) {
    // Do not close; just transition to success and schedule open
    clearTimers();

    const localUri = await ensureLocalFromBlob(blob, fileName);
    const { mimeType, iosUTI } = resolveFileMeta(fileName);
    pendingOpenRef.current = { localUri, mimeType, iosUTI, armed: false };

    setDialogText("Unlock successful!");
    setDialogStatus("success");

    timers.current.push(
      setTimeout(() => {
        if (pendingOpenRef.current) pendingOpenRef.current.armed = true;
        setDialogOpen(false);
      }, OPEN_DELAY_MS)
    );
  }

  function cancel() {
    clearTimers();
    pendingOpenRef.current = null;
    setDialogOpen(false);
  }

  return {
    dialogOpen,
    dialogText,
    dialogStatus,
    onDialogDismiss,
    beginPending,
    completeWithBlob,
    cancel,
  };
}
