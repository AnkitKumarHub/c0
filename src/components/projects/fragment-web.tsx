"use client";

import { useState, useEffect } from "react";
import { ExternalLink, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/ui/hint";
import type { ProjectFragment } from "@/features/projects/fragment-types";
import { resolveFragmentPreviewUrl } from "@/features/sandbox/actions";

/**
 * Live preview of a generated fragment running in its E2B sandbox.
 *
 * Embeds the sandbox URL in a sandboxed `<iframe>` and provides controls to
 * refresh the preview, copy the URL, and open it in a new tab.
 *
 * @param data - The fragment to preview (provides `sandboxUrl` and `title`).
 */
export default function FragmentWeb({ data }: { data: ProjectFragment }) {
  const [fragmentKey, setFragmentKey] = useState(0);
  const [copied, setCopied] = useState(false);

  //live URL from server (not stale data.sandboxUrl from DB)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // show spinner/message while reconnecting
  const [loading, setLoading] = useState(true);

    // show error if sandbox can't be reached
    const [error, setError] = useState<string | null>(null);

    // reconnect to sandbox, extend timeout, get fresh URL
    async function loadPreview() {
      setLoading(true);
      setError(null);

      const result = await resolveFragmentPreviewUrl(data.id);
      if ("url" in result && result.url) {
        setPreviewUrl(result.url);
        // NEW: force iframe remount with the new URL
        setFragmentKey((prev) => prev + 1);
      } else {
        // NEW: fallback to stored URL for old fragments / dead sandboxes
        setError(result.error ?? "Preview unavailable");
        setPreviewUrl(data.sandboxUrl);
      }
      setLoading(false);
    }

    // NEW: resolve URL when user selects this fragment
  useEffect(() => {
    loadPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.id]);

  /**
   * Force the preview iframe to reload by changing its `key`.
   */
  // function onRefresh() {
  //   setFragmentKey((prev) => prev + 1);
  // }

  function onRefresh() {
    loadPreview();
  }

  /**
   * Copy the sandbox URL to the clipboard and briefly show a "Copied" state.
   */
  // function onCopy() {
  //   navigator.clipboard.writeText(data.sandboxUrl);
  //   setCopied(true);
  //   setTimeout(() => {
  //     setCopied(false);
  //   }, 2000);
  // }

   // CHANGE: copy previewUrl (live), not data.sandboxUrl (stale)
   function onCopy() {
    if (!previewUrl) return;
    navigator.clipboard.writeText(previewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // return (
  //   <div className="flex h-full w-full flex-col">
  //     <div className="flex items-center gap-x-2 border-b bg-sidebar p-2">
  //       <Hint text="Refresh" side="bottom" align="start">
  //         <Button size="sm" variant="outline" onClick={onRefresh}>
  //           <RefreshCcw />
  //         </Button>
  //       </Hint>
  //       <Hint
  //         text={copied ? "Copied" : "Click to copy"}
  //         side="bottom"
  //         align="start"
  //       >
  //         <Button
  //           size="sm"
  //           variant="outline"
  //           onClick={onCopy}
  //           disabled={!data.sandboxUrl || copied}
  //           className="flex-1 justify-start text-start font-normal"
  //         >
  //           <span className="truncate">{data.sandboxUrl}</span>
  //         </Button>
  //       </Hint>

  //       <Hint text="Open in new tab" side="bottom" align="start">
  //         <Button
  //           size="sm"
  //           variant="outline"
  //           onClick={() => {
  //             if (!data.sandboxUrl) return;
  //             window.open(data.sandboxUrl, "_blank");
  //           }}
  //         >
  //           <ExternalLink />
  //         </Button>
  //       </Hint>
  //     </div>
  //     <iframe
  //       key={fragmentKey}
  //       className="h-full w-full"
  //       sandbox="allow-scripts allow-same-origin"
  //       loading="lazy"
  //       src={data.sandboxUrl}
  //       title={data.title}
  //     />
  //   </div>
  // );

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center gap-x-2 border-b bg-sidebar p-2">
        <Hint text="Refresh" side="bottom" align="start">
          {/* CHANGE: disabled while loading */}
          <Button
            size="sm"
            variant="outline"
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCcw />
          </Button>
        </Hint>
        <Hint
          text={copied ? "Copied" : "Click to copy"}
          side="bottom"
          align="start"
        >
          <Button
            size="sm"
            variant="outline"
            onClick={onCopy}
            // CHANGE: use previewUrl, not data.sandboxUrl
            disabled={!previewUrl || copied || loading}
            className="flex-1 justify-start text-start font-normal"
          >
            {/* CHANGE: show live URL in toolbar */}
            <span className="truncate">{previewUrl ?? data.sandboxUrl}</span>
          </Button>
        </Hint>
        <Hint text="Open in new tab" side="bottom" align="start">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              // CHANGE: open live URL, not stale DB URL
              if (!previewUrl) return;
              window.open(previewUrl, "_blank");
            }}
            disabled={!previewUrl || loading}
          >
            <ExternalLink />
          </Button>
        </Hint>
      </div>
      {/* NEW: optional loading / error UI above iframe */}
      {loading && (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          Connecting to sandbox…
        </div>
      )}
      {error && !loading && (
        <div className="border-b bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      )}
      {/* CHANGE: only render iframe after URL is resolved; src = previewUrl */}
      {!loading && previewUrl && (
        <iframe
          key={fragmentKey}
          className="h-full w-full"
          sandbox="allow-scripts allow-same-origin"
          loading="lazy"
          src={previewUrl}
          title={data.title}
        />
      )}
    </div>
  );
}

