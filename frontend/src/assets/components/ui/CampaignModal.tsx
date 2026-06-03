import type { ReactNode } from "react";

export function CampaignModal({
  title,
  description,
  children,
  onClose,
}: {
  title: string;
  description: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div className="relative z-10 w-full max-w-2xl border-2 border-gold-neutral bg-neutral p-6 shadow-2xl">
        <div className="flex flex-col gap-2 border-b border-gold-dark pb-4">
          <h3 className="text-xl font-bold tracking-widest text-neutral-text">
            {title}
          </h3>
          <p className="text-sm text-gray-light">{description}</p>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
