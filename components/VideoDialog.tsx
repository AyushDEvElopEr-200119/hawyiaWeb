"use client";

import { useRef } from "react";

/** A button that opens the team video in a native modal dialog (Esc or the backdrop closes it). */
export function VideoDialog({ label, className, closeLabel }: { label: React.ReactNode; className?: string; closeLabel: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const open = () => { dialog.current?.showModal(); video.current?.play().catch(() => {}); };
  const close = () => { video.current?.pause(); dialog.current?.close(); };
  return (
    <>
      <button type="button" className={className} onClick={open}>{label}</button>
      <dialog
        className="vd"
        ref={dialog}
        onClose={() => video.current?.pause()}
        onClick={(e) => { if (e.target === dialog.current) close(); }}
      >
        <button type="button" className="vd-close" onClick={close} aria-label={closeLabel}>×</button>
        <video ref={video} src="/assets/media/team-1280.mp4" poster="/assets/media/team-poster.jpg" controls playsInline preload="none" />
      </dialog>
    </>
  );
}
