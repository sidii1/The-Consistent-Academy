import React, { useCallback, useState } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Link as LinkIcon,
  Link2Off,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  Highlighter,
  Minus,
  Code2,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  onClick,
  isActive,
  disabled,
  title,
  children,
}) => (
  <button
    type="button"
    onMouseDown={(e) => {
      e.preventDefault();
      onClick();
    }}
    disabled={disabled}
    title={title}
    className={`
      p-1.5 rounded-lg transition-all text-sm
      ${isActive
        ? "bg-primary text-white shadow-inner"
        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }
      ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
    `}
  >
    {children}
  </button>
);

const Divider: React.FC = () => (
  <span className="w-px h-5 bg-border mx-0.5 self-center shrink-0" />
);

const TEXT_SIZES = [
  { label: "Normal", value: "paragraph" },
  { label: "Heading 1", value: "h1" },
  { label: "Heading 2", value: "h2" },
  { label: "Heading 3", value: "h3" },
];

const COLORS = [
  { label: "Default", value: "" },
  { label: "Purple", value: "#7c3aed" },
  { label: "Blue", value: "#2563eb" },
  { label: "Green", value: "#16a34a" },
  { label: "Red", value: "#dc2626" },
  { label: "Orange", value: "#ea580c" },
  { label: "Gray", value: "#6b7280" },
];

const Toolbar: React.FC<{ editor: Editor }> = ({ editor }) => {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const setLink = useCallback(() => {
    if (!linkUrl.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setShowLinkInput(false);
      return;
    }
    const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    setShowLinkInput(false);
    setLinkUrl("");
  }, [editor, linkUrl]);

  const openLinkInput = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href ?? "";
    setLinkUrl(previousUrl);
    setShowLinkInput(true);
  }, [editor]);

  const currentSize = () => {
    if (editor.isActive("heading", { level: 1 })) return "h1";
    if (editor.isActive("heading", { level: 2 })) return "h2";
    if (editor.isActive("heading", { level: 3 })) return "h3";
    return "paragraph";
  };

  const applySize = (value: string) => {
    if (value === "paragraph") {
      editor.chain().focus().setParagraph().run();
    } else if (value === "h1") {
      editor.chain().focus().toggleHeading({ level: 1 }).run();
    } else if (value === "h2") {
      editor.chain().focus().toggleHeading({ level: 2 }).run();
    } else if (value === "h3") {
      editor.chain().focus().toggleHeading({ level: 3 }).run();
    }
  };

  const currentColor = editor.getAttributes("textStyle").color ?? "";

  return (
    <div className="border-b border-border bg-secondary/30 rounded-t-xl p-1.5">
      <div className="flex flex-wrap items-center gap-0.5">
        {/* Text size */}
        <select
          value={currentSize()}
          onChange={(e) => applySize(e.target.value)}
          className="text-xs px-2 py-1.5 rounded-lg bg-secondary/50 border border-border text-foreground outline-none focus:border-primary cursor-pointer"
        >
          {TEXT_SIZES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <Divider />

        {/* Text color */}
        <div className="relative flex items-center">
          <select
            value={currentColor}
            onChange={(e) => {
              if (e.target.value === "") {
                editor.chain().focus().unsetColor().run();
              } else {
                editor.chain().focus().setColor(e.target.value).run();
              }
            }}
            className="text-xs px-2 py-1.5 rounded-lg bg-secondary/50 border border-border text-foreground outline-none focus:border-primary cursor-pointer"
          >
            {COLORS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <Divider />

        {/* Bold / Italic / Underline / Strike */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive("highlight")}
          title="Highlight"
        >
          <Highlighter className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          title="Inline code"
        >
          <Code className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet list"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Numbered list"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        {/* Alignment */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          title="Align left"
        >
          <AlignLeft className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          title="Align center"
        >
          <AlignCenter className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          title="Align right"
        >
          <AlignRight className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          isActive={editor.isActive({ textAlign: "justify" })}
          title="Justify"
        >
          <AlignJustify className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        {/* Blockquote / Code block / HR */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          title="Code block"
        >
          <Code2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal rule"
        >
          <Minus className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        {/* Link */}
        <ToolbarButton
          onClick={openLinkInput}
          isActive={editor.isActive("link")}
          title="Add link"
        >
          <LinkIcon className="w-4 h-4" />
        </ToolbarButton>
        {editor.isActive("link") && (
          <ToolbarButton
            onClick={() => editor.chain().focus().unsetLink().run()}
            title="Remove link"
          >
            <Link2Off className="w-4 h-4" />
          </ToolbarButton>
        )}

        <Divider />

        {/* Undo / Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Link input */}
      {showLinkInput && (
        <div className="flex items-center gap-2 mt-1.5 px-1">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); setLink(); }
              if (e.key === "Escape") { setShowLinkInput(false); }
            }}
            placeholder="https://example.com"
            autoFocus
            className="flex-1 text-sm px-3 py-1.5 rounded-lg bg-secondary/50 border border-primary outline-none text-foreground placeholder:text-muted-foreground"
          />
          <button
            type="button"
            onClick={setLink}
            className="text-xs px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => setShowLinkInput(false)}
            className="text-xs px-3 py-1.5 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = "Write your content here...",
  className = "",
  minHeight = "200px",
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer hover:text-primary/80",
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // Treat empty editor (just <p></p>) as empty string
      onChange(html === "<p></p>" ? "" : html);
    },
    editorProps: {
      attributes: {
        class: "outline-none",
      },
    },
  });

  if (!editor) return null;

  return (
    <div
      className={`rounded-xl border-2 border-transparent focus-within:border-primary bg-secondary/20 shadow-neu-inset overflow-hidden transition-colors ${className}`}
    >
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        style={{ minHeight }}
        className="px-4 py-3 tiptap-editor"
      />
    </div>
  );
};

export default RichTextEditor;
