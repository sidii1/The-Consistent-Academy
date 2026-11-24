import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Download, Eye, EyeOff, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { uploadToCloudinary } from "@/lib/utils";
import {
  deleteWebinar,
  importSampleWebinars,
  listAllWebinars,
  saveWebinar,
  slugify,
  type Webinar,
} from "@/lib/webinars";

const empty = (): Webinar => ({
  id: "",
  title: "",
  description: "",
  topic: "",
  speaker: { name: "", designation: "", bio: "", photo: "" },
  date: "",
  dateISO: "",
  time: "",
  timezone: "IST",
  duration: "",
  platform: "Zoom",
  audience: "",
  prerequisites: "",
  status: "upcoming",
  published: false,
  isSample: false,
  order: 100,
});

const inputCls = "w-full px-3 py-2 rounded-lg border border-border bg-background text-sm";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block text-sm">
    <span className="block text-muted-foreground mb-1">{label}</span>
    {children}
  </label>
);

/** Admin > Webinars: create, edit, publish/unpublish and delete the webinars shown on /webinars. */
export const AdminWebinarsPanel = () => {
  const [items, setItems] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Webinar | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await listAllWebinars());
    } catch (e) {
      console.error(e);
      toast.error("Could not load webinars (check Firestore rules for the webinars collection).");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const startNew = () => {
    setEditing(empty());
    setIsNew(true);
  };

  const startEdit = (w: Webinar) => {
    setEditing({ ...empty(), ...w, speaker: { ...empty().speaker, ...w.speaker } });
    setIsNew(false);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const w = { ...editing, id: isNew ? slugify(editing.title) || `webinar-${Date.now()}` : editing.id };
    if (isNew && items.some((i) => i.id === w.id)) w.id = `${w.id}-${Date.now().toString(36)}`;
    // Keep the human-readable date in step with the picker when only the ISO date was set.
    if (w.dateISO && !w.date) {
      w.date = new Date(`${w.dateISO}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    }
    setSaving(true);
    try {
      await saveWebinar(w);
      toast.success("Webinar saved");
      setEditing(null);
      await load();
    } catch (err) {
      console.error(err);
      toast.error("Save failed. Are you signed in as an admin?");
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (w: Webinar) => {
    try {
      await saveWebinar({ ...w, published: !w.published });
      await load();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  const remove = async (w: Webinar) => {
    if (!window.confirm(`Delete "${w.title}"? This cannot be undone.`)) return;
    try {
      await deleteWebinar(w.id);
      toast.success("Deleted");
      await load();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  const importSamples = async () => {
    try {
      const n = await importSampleWebinars(new Set(items.map((i) => i.id)));
      toast.success(n ? `Imported ${n} sample webinar(s). Edit or delete them as needed.` : "Samples are already imported.");
      await load();
    } catch (err) {
      console.error(err);
      toast.error("Import failed");
    }
  };

  const onPhoto = async (file?: File) => {
    if (!file || !editing) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, "tca_blogs");
      setEditing({ ...editing, speaker: { ...editing.speaker, photo: url } });
    } catch (err) {
      console.error(err);
      toast.error("Photo upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (editing) {
    const set = (patch: Partial<Webinar>) => setEditing({ ...editing, ...patch });
    const setSpeaker = (patch: Partial<Webinar["speaker"]>) => setEditing({ ...editing, speaker: { ...editing.speaker, ...patch } });
    return (
      <form onSubmit={save} className="space-y-4">
        <h2 className="text-xl font-semibold">{isNew ? "New webinar" : "Edit webinar"}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Title *"><input required className={inputCls} value={editing.title} onChange={(e) => set({ title: e.target.value })} /></Field>
          <Field label="Topic"><input className={inputCls} value={editing.topic} onChange={(e) => set({ topic: e.target.value })} /></Field>
        </div>
        <Field label="Description *"><textarea required rows={4} className={inputCls} value={editing.description} onChange={(e) => set({ description: e.target.value })} /></Field>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Date *"><input required type="date" className={inputCls} value={editing.dateISO ?? ""} onChange={(e) => set({ dateISO: e.target.value, date: e.target.value ? new Date(`${e.target.value}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "" })} /></Field>
          <Field label="Time (e.g. 6:00 PM – 7:30 PM)"><input className={inputCls} value={editing.time} onChange={(e) => set({ time: e.target.value })} /></Field>
          <Field label="Duration (e.g. 90 minutes)"><input className={inputCls} value={editing.duration} onChange={(e) => set({ duration: e.target.value })} /></Field>
          <Field label="Timezone"><input className={inputCls} value={editing.timezone} onChange={(e) => set({ timezone: e.target.value })} /></Field>
          <Field label="Platform"><input className={inputCls} value={editing.platform} onChange={(e) => set({ platform: e.target.value })} /></Field>
          <Field label="Status">
            <select className={inputCls} value={editing.status} onChange={(e) => set({ status: e.target.value as Webinar["status"] })}>
              <option value="upcoming">Upcoming</option>
              <option value="registration_open">Registration open</option>
              <option value="completed">Completed</option>
            </select>
          </Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Audience"><input className={inputCls} value={editing.audience} onChange={(e) => set({ audience: e.target.value })} /></Field>
          <Field label="Prerequisites"><input className={inputCls} value={editing.prerequisites ?? ""} onChange={(e) => set({ prerequisites: e.target.value })} /></Field>
        </div>

        <fieldset className="border border-border rounded-xl p-4 space-y-4">
          <legend className="px-2 text-sm font-semibold">Speaker</legend>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name *"><input required className={inputCls} value={editing.speaker.name} onChange={(e) => setSpeaker({ name: e.target.value })} /></Field>
            <Field label="Designation"><input className={inputCls} value={editing.speaker.designation} onChange={(e) => setSpeaker({ designation: e.target.value })} /></Field>
          </div>
          <Field label="Bio"><textarea rows={3} className={inputCls} value={editing.speaker.bio} onChange={(e) => setSpeaker({ bio: e.target.value })} /></Field>
          <div className="flex items-center gap-4">
            {editing.speaker.photo && <img src={editing.speaker.photo} alt="" className="w-14 h-14 rounded-full object-cover" />}
            <Field label={uploading ? "Uploading…" : "Photo"}>
              <input type="file" accept="image/*" disabled={uploading} onChange={(e) => onPhoto(e.target.files?.[0])} />
            </Field>
          </div>
        </fieldset>

        <div className="flex flex-wrap items-center gap-6">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!editing.published} onChange={(e) => set({ published: e.target.checked })} />
            Published (visible on the website)
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            Order
            <input type="number" className={`${inputCls} !w-20`} value={editing.order ?? 100} onChange={(e) => set({ order: Number(e.target.value) })} />
          </label>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving || uploading} className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-medium disabled:opacity-50">
            {saving ? "Saving…" : "Save webinar"}
          </button>
          <button type="button" onClick={() => setEditing(null)} className="px-5 py-2 rounded-lg border border-border">Cancel</button>
        </div>
      </form>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-semibold">Webinars</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={load} className="p-2 rounded-lg border border-border" aria-label="Refresh"><RefreshCw size={16} /></button>
          <button onClick={importSamples} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm">
            <Download size={16} /> Import current sample webinars
          </button>
          <button onClick={startNew} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm">
            <Plus size={16} /> New webinar
          </button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        The public Webinars page shows published webinars from here. While none are published it falls back to the built-in sample list.
      </p>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No webinars yet. Create one, or import the current samples to edit them.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border">
                <th className="py-2 pr-3">Title</th>
                <th className="py-2 pr-3">Date</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3">Visible</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {items.map((w) => (
                <tr key={w.id} className="border-b border-border/50">
                  <td className="py-2 pr-3">
                    {w.title}
                    {w.isSample && <span className="ml-2 text-[10px] uppercase tracking-wide bg-secondary px-1.5 py-0.5 rounded">sample</span>}
                    <div className="text-xs text-muted-foreground">{w.speaker?.name}</div>
                  </td>
                  <td className="py-2 pr-3 whitespace-nowrap">{w.date}</td>
                  <td className="py-2 pr-3 whitespace-nowrap">{w.status.replace("_", " ")}</td>
                  <td className="py-2 pr-3">
                    <button onClick={() => togglePublish(w)} className="inline-flex items-center gap-1" title="Toggle published">
                      {w.published ? <><Eye size={14} /> Published</> : <><EyeOff size={14} /> Hidden</>}
                    </button>
                  </td>
                  <td className="py-2 whitespace-nowrap text-right">
                    <button onClick={() => startEdit(w)} className="p-2" aria-label={`Edit ${w.title}`}><Pencil size={16} /></button>
                    <button onClick={() => remove(w)} className="p-2 text-red-500" aria-label={`Delete ${w.title}`}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
