import { useEffect, useRef, useState } from "react";
import {
  ensureLocalFromAsset,
  openFile,
  resolveFileMeta,
} from "~/lib/open-file";

export type DialogStatus = "pending" | "success";

interface Options {
  requestMs?: number;
  openDelayMs?: number;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

export function useShareUnlock(options: Options = {}) {
  const requestMs = options.requestMs ?? 5000;
  const openDelayMs = options.openDelayMs ?? 2000;

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

  async function begin(localAssetModule: number, fileName: string) {
    clearTimers();

    const localUri = await ensureLocalFromAsset(localAssetModule, fileName);
    const { mimeType, iosUTI } = resolveFileMeta(fileName);

    // store target and arm opening after modal dismissal
    pendingOpenRef.current = { localUri, mimeType, iosUTI, armed: false };

    setDialogOpen(true);
    setDialogStatus("pending");
    setDialogText("Requesting for access");

    timers.current.push(
      setTimeout(() => {
        setDialogText("Unlock successful!");
        setDialogStatus("success");
      }, requestMs)
    );

    timers.current.push(
      setTimeout(() => {
        // arm open and close modal; actual open will happen on onDismiss
        if (pendingOpenRef.current) pendingOpenRef.current.armed = true;
        setDialogOpen(false);
      }, requestMs + openDelayMs)
    );
  }

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

  return {
    dialogOpen,
    dialogText,
    dialogStatus,
    begin,
    onDialogDismiss,
  };
}
