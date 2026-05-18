import { useState } from "react";
import { z } from "zod";
import { PreviewActionButton } from "../CharacterPreview/PreviewActionButton";

const createEntitySchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
});

type CreateEntityFormData = z.infer<typeof createEntitySchema>;

interface Props {
  kind: "character" | "campaign";
  open: boolean;
  onClose: () => void;
  onCreate: (title: string) => void;
}

export default function CreateEntityModal({
  kind,
  open,
  onClose,
  onCreate,
}: Props) {
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateEntityFormData, string>>
  >({});

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50" />
      <div className="relative z-10 w-full max-w-lg border-2 border-gold-neutral bg-neutral p-6">
        <h3 className="text-lg font-bold text-neutral-text">
          Create New {kind === "character" ? "Character" : "Campaign"}
        </h3>

        <div className="mt-4 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest text-gray-light">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-dark border border-gold-dark p-2 text-neutral-text"
              placeholder={
                kind === "character" ? "Character name" : "Campaign title"
              }
            />
          </div>
        </div>

        {errors.title && (
          <p className="mt-3 text-xs text-error">{errors.title}</p>
        )}

        <div className="mt-6 flex gap-3">
          <PreviewActionButton
            onClick={onClose}
            variant="secondary"
            className="!bg-dark !text-neutral-text hover:!bg-gold-neutral"
          >
            Cancel
          </PreviewActionButton>
          <PreviewActionButton
            onClick={() => {
              const result = createEntitySchema.safeParse({
                title,
              });

              if (!result.success) {
                const fieldErrors = result.error.flatten().fieldErrors;
                setErrors({
                  title: fieldErrors.title?.[0],
                });
                return;
              }

              setErrors({});
              onCreate(title.trim());
            }}
            variant="primary"
            className="!bg-dark !text-neutral-text hover:!bg-gold-neutral"
          >
            Create
          </PreviewActionButton>
        </div>
      </div>
    </div>
  );
}
