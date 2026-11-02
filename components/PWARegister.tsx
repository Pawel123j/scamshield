"use client";
import { useEffect, useState } from "react";
export function PWARegister() {
  const [updated, setUpdated] = useState(false);
  useEffect(() => {
    if (!("serviceWorker" in navigator) || process.env.NODE_ENV !== "production") return;
    const hadController = Boolean(navigator.serviceWorker.controller);
    const onChange = () => { if (hadController) setUpdated(true); };
    navigator.serviceWorker.addEventListener("controllerchange", onChange);
    let registration: ServiceWorkerRegistration | undefined;
    const check = () => { registration?.update().catch(() => undefined); };
    navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" }).then(value => { registration = value; check(); }).catch(() => undefined);
    window.addEventListener("focus", check);
    return () => { navigator.serviceWorker.removeEventListener("controllerchange", onChange); window.removeEventListener("focus", check); };
  }, []);
  return updated ? <div role="status" className="fixed bottom-4 left-4 right-4 z-50 rounded-2xl bg-teal-900 p-4 text-white shadow-xl">Nowa wersja jest gotowa. Zachowaj wpisaną wiadomość przed odświeżeniem. <button className="min-h-12 underline" onClick={() => window.location.reload()}>Odśwież aplikację</button><button className="ml-4 min-h-12 underline" onClick={() => setUpdated(false)}>Później</button></div> : null;
}
