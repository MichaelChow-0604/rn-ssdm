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

export function useShareUnlock(options: Options = {}) {
  const requestMs = options.requestMs ?? 5000;
  const openDelayMs = options.openDelayMs ?? 2000;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState("");
  const [dialogStatus, setDialogStatus] = useState<DialogStatus>("pending");

  const timers = useRef<number[]>([]);

  function clearTimers() {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  }

  useEffect(() => clearTimers, []);

  async function begin(localAssetModule: number, fileName: string) {
    const localUri = await ensureLocalFromAsset(localAssetModule, fileName);
    const { mimeType, iosUTI } = resolveFileMeta(fileName);

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
      setTimeout(async () => {
        setDialogOpen(false);
        await openFile({ localUri, mimeType, iosUTI });
      }, requestMs + openDelayMs)
    );
  }

  return {
    dialogOpen,
    dialogText,
    dialogStatus,
    begin,
  };
}
