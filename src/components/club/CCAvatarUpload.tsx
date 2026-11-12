import React, { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateCCUser } from "@/lib/ccClub";
import { uploadToCloudinary } from "@/lib/utils";

interface CCAvatarUploadProps {
  uid: string;
  name: string;
  initialUrl?: string;
  /** Colour of the initial letter + camera badge, e.g. `var(--cc-amber)` for presidents. */
  accent?: string;
}

const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Clickable avatar well shared by every CC Club dashboard. Validates the file
 * (image only, ≤ 5 MB) before pushing it to Cloudinary and saving the URL.
 */
const CCAvatarUpload: React.FC<CCAvatarUploadProps> = ({
  uid,
  name,
  initialUrl = "",
  accent = "var(--cc-accent-bright)",
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Image is too large — please keep it under 5 MB.");
      return;
    }
    setUploading(true);
    try {
      const uploaded = await uploadToCloudinary(file, "cc_pfp");
      await updateCCUser(uid, { profilePictureUrl: uploaded });
      setUrl(uploaded);
      toast.success("Profile picture updated!");
    } catch {
      toast.error("Failed to upload profile picture.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="cc-avatar"
        onClick={() => inputRef.current?.click()}
        title="Change profile picture"
        aria-label="Change profile picture"
        style={url ? { backgroundImage: `url("${url}")` } : undefined}
      >
        {!url && (
          <span style={{ fontSize: "1.2rem", fontWeight: 800, color: accent }}>
            {name.charAt(0).toUpperCase()}
          </span>
        )}
        {uploading && (
          <span
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.55)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Loader2 size={16} color="#fff" className="cc-spin" />
          </span>
        )}
        <span
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            background: "var(--cc-surface-deep)",
            boxShadow: "var(--cc-neu-xs)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Camera size={10} color={accent} />
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleChange}
      />
    </>
  );
};

export default CCAvatarUpload;
