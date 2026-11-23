"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type InstallButtonProps = {
  /** Versión grande para el home: siempre visible. */
  prominent?: boolean;
};

export function InstallButton({ prominent = false }: InstallButtonProps) {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (!promptEvent) {
      setShowHint(true);
      return;
    }

    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setPromptEvent(null);
  };

  if (installed) {
    return prominent ? <p className="mb-6 text-sm text-accent">App instalada.</p> : null;
  }

  if (!prominent && !promptEvent) return null;

  return (
    <div className={prominent ? "mb-6 flex flex-wrap items-center gap-3" : ""}>
      <button
        type="button"
        onClick={install}
        className={
          prominent
            ? "rounded-full border border-panel/40 px-4 py-2.5 text-sm font-semibold text-panel hover:bg-panel hover:text-forest"
            : "mr-1 rounded-full px-3 text-xs font-semibold text-muted hover:text-text"
        }
      >
        Instalar app
      </button>
      {prominent && showHint ? (
        <span className="text-xs text-muted">
          Usa el menú del navegador → «Instalar aplicación».
        </span>
      ) : null}
    </div>
  );
}
