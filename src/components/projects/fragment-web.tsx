"use client";

import { useCallback, useEffect, useState } from "react";
import { ExternalLink, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/ui/hint";
import type { ProjectFragment } from "@/features/projects/fragment-types";
import { resolveFragmentPreviewUrl } from "@/features/sandbox/actions";

type PreviewResult = Awaited<ReturnType<typeof resolveFragmentPreviewUrl>>;

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const applyPreviewResult = useCallback(
    (result: PreviewResult, forceReload = false) => {
      if ("error" in result && result.error) {
        setError(result.error);
        setPreviewUrl(forceReload ? (result.url ?? data.sandboxUrl) : null);
      } else if ("url" in result && result.url) {
        setError(null);
        setPreviewUrl(result.url);
        setFragmentKey((prev) => prev + 1);
      } else {
        setError(result.error ?? "Preview unavailable");
        setPreviewUrl(null);
        if (forceReload && data.sandboxUrl) {
          setPreviewUrl(data.sandboxUrl);
        }
      }
      setLoading(false);
    },
    [data.sandboxUrl],
  );

  const loadPreview = useCallback(
    async ({ forceReload = false }: { forceReload?: boolean } = {}) => {
      setLoading(true);
      setError(null);

      const result = await resolveFragmentPreviewUrl(data.id);
      applyPreviewResult(result, forceReload);
    },
    [applyPreviewResult, data.id],
  );

  useEffect(() => {
    let ignore = false;

    async function resolvePreview() {
      const result = await resolveFragmentPreviewUrl(data.id);
      if (!ignore) {
        applyPreviewResult(result);
      }
    }

    void resolvePreview();

    return () => {
      ignore = true;
    };
  }, [applyPreviewResult, data.id]);

  /**
   * Force the preview iframe to reload by changing its `key`.
   */
  function onRefresh() {
    void loadPreview({ forceReload: true });
  }

  /**
   * Copy the sandbox URL to the clipboard and briefly show a "Copied" state.
   */
  function onCopy() {
    if (!previewUrl) return;
    navigator.clipboard.writeText(previewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center gap-x-2 border-b bg-sidebar p-2">
        <Hint text="Refresh" side="bottom" align="start">
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
            disabled={!previewUrl || copied || loading}
            className="flex-1 justify-start text-start font-normal"
          >
            <span className="truncate">{previewUrl ?? data.sandboxUrl}</span>
          </Button>
        </Hint>
        <Hint text="Open in new tab" side="bottom" align="start">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
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
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          <p className="text-sm font-medium text-destructive">{error}</p>
          <p className="max-w-md text-xs text-muted-foreground">
            The sandbox may have expired or the generated app may not be serving
            a preview yet.
          </p>
        </div>
      )}
      {!loading && previewUrl && (
        <iframe
          key={fragmentKey}
          className="h-full w-full"
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-downloads"
          loading="lazy"
          src={previewUrl}
          title={data.title}
        />
      )}
    </div>
  );
}

