import { useState, useRef, useEffect, useCallback } from "react";
import { color, font, radius } from "../tokens";
import {
  IconSearch, IconX, IconChevronRight, IconChevronDown, IconChevronLeft,
  IconFolder, IconPlus, IconUpload, IconTrash, IconFolderPlus,
} from "./icons";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ImageItem {
  id: string;
  name: string;
  url: string;
  folderId: string | null;
  categoryId: string;
}

interface Folder {
  id: string;
  name: string;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
  folders: Folder[];
  images: ImageItem[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const seeds = [
  "arch1","arch2","arch3","city1","city2","city3","nature1","nature2",
  "nature3","biz1","biz2","biz3","sky1","sky2","field1","field2",
  "mount1","mount2","lake1","lake2","forest1","forest2","brand1","brand2",
];

function makeImages(prefix: string, count: number, categoryId: string, folderId: string | null): ImageItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${i}`,
    name: `${prefix.charAt(0).toUpperCase() + prefix.slice(1)} ${i + 1}`,
    url: `https://picsum.photos/seed/${seeds[(parseInt(prefix.replace(/\D/g,"") || "0") + i) % seeds.length]}/240/240`,
    folderId,
    categoryId,
  }));
}

const INITIAL_CATEGORIES: Category[] = [
  {
    id: "logo",
    name: "Logo",
    folders: [],
    images: [
      ...makeImages("logo", 12, "logo", null),
      ...makeImages("logo-alt", 10, "logo", null),
    ],
  },
  {
    id: "background",
    name: "Background",
    folders: [
      { id: "bg-campaign", name: "Campaign Photos", categoryId: "background" },
      { id: "bg-textures", name: "Textures", categoryId: "background" },
    ],
    images: [
      ...makeImages("camp", 5, "background", "bg-campaign"),
      ...makeImages("tex", 4, "background", "bg-textures"),
    ],
  },
  { id: "profiles",  name: "Profiles",          folders: [], images: [] },
  { id: "clipboard", name: "Clipboard Uploads",  folders: [], images: [] },
  {
    id: "dean",
    name: "Dean-And-Draper",
    folders: [{ id: "dean-main", name: "Main Assets", categoryId: "dean" }],
    images: [
      ...makeImages("dean", 3, "dean", "dean-main"),
      ...makeImages("dean-loose", 2, "dean", null),
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function IconBtn({
  onClick, title, children, danger = false, style: extraStyle,
}: {
  onClick: () => void;
  title?: string;
  children: React.ReactNode;
  danger?: boolean;
  style?: React.CSSProperties;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 6, padding: "6px 10px", border: "none", borderRadius: radius.sm,
        cursor: "pointer", fontSize: 13, fontWeight: 500,
        background: danger ? (hover ? "#fee2e2" : "transparent") : (hover ? color.n08 : "transparent"),
        color: danger ? color.red : color.n02,
        transition: "background 0.12s",
        ...extraStyle,
      }}
    >
      {children}
    </button>
  );
}

function ImageCard({
  image, onClick, onDelete,
}: {
  image: ImageItem;
  onClick: () => void;
  onDelete: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ position: "relative", cursor: "pointer" }}
    >
      <div
        onClick={onClick}
        style={{
          borderRadius: radius.sm, overflow: "hidden",
          border: `1px solid ${color.n06}`,
          background: color.n08,
          aspectRatio: "1",
          transition: "box-shadow 0.12s",
          boxShadow: hover ? "0 2px 8px rgba(0,0,0,0.12)" : "none",
        }}
      >
        <img
          src={image.url}
          alt={image.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
      <p style={{
        ...font.textXsRegular,
        color: color.n02,
        marginTop: 4,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}>
        {image.name}
      </p>

      {/* Hover trash */}
      {hover && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          title="Delete image"
          style={{
            position: "absolute", top: 4, right: 4,
            background: "rgba(255,255,255,0.92)", border: "none",
            borderRadius: 6, width: 24, height: 24,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
          }}
        >
          <IconTrash size={12} color={color.red} />
        </button>
      )}
    </div>
  );
}

function ImageGrid({
  images, onImageClick, onDeleteImage,
}: {
  images: ImageItem[];
  onImageClick: (img: ImageItem) => void;
  onDeleteImage: (img: ImageItem) => void;
}) {
  if (images.length === 0) return null;
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 8,
    }}>
      {images.map(img => (
        <ImageCard
          key={img.id}
          image={img}
          onClick={() => onImageClick(img)}
          onDelete={() => onDeleteImage(img)}
        />
      ))}
    </div>
  );
}

function EmptyState({ onUpload, onNewFolder }: { onUpload: () => void; onNewFolder: () => void }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: 8, padding: "24px 0",
      color: color.n03, ...font.textSmRegular, textAlign: "center",
    }}>
      <p style={{ margin: 0, color: color.n03 }}>No images yet</p>
      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <button
          onClick={onUpload}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "7px 14px", borderRadius: radius.sm,
            border: `1px solid ${color.n06}`, background: color.white,
            ...font.textSmMedium, color: color.n01, cursor: "pointer",
          }}
        >
          <IconUpload size={14} color={color.n02} /> Upload
        </button>
        <button
          onClick={onNewFolder}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "7px 14px", borderRadius: radius.sm,
            border: `1px solid ${color.n06}`, background: color.white,
            ...font.textSmMedium, color: color.n01, cursor: "pointer",
          }}
        >
          <IconFolderPlus size={14} color={color.n02} /> New Folder
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ImageLibraryPopover({
  onClose,
  onInsert,
}: {
  onClose: () => void;
  onInsert?: (image: ImageItem) => void;
}) {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [query, setQuery] = useState("");
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  const [folderView, setFolderView] = useState<{ categoryId: string; folderId: string } | null>(null);
  const [previewImage, setPreviewImage] = useState<ImageItem | null>(null);
  const [newFolderCategoryId, setNewFolderCategoryId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [confirmDeleteFolder, setConfirmDeleteFolder] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const newFolderInputRef = useRef<HTMLInputElement>(null);
  const uploadContext = useRef<{ categoryId: string; folderId: string | null }>({ categoryId: "", folderId: null });

  const isSearching = query.trim().length > 0;

  useEffect(() => {
    if (newFolderCategoryId && newFolderInputRef.current) {
      newFolderInputRef.current.focus();
    }
  }, [newFolderCategoryId]);

  // ── CRUD ──────────────────────────────────────────────────────────────────

  const addFolder = useCallback((categoryId: string) => {
    if (!newFolderName.trim()) return;
    setCategories(cats => cats.map(c =>
      c.id === categoryId
        ? { ...c, folders: [...c.folders, { id: uid(), name: newFolderName.trim(), categoryId }] }
        : c
    ));
    setNewFolderName("");
    setNewFolderCategoryId(null);
  }, [newFolderName]);

  const deleteFolder = useCallback((categoryId: string, folderId: string) => {
    setCategories(cats => cats.map(c =>
      c.id === categoryId
        ? { ...c, folders: c.folders.filter(f => f.id !== folderId), images: c.images.filter(i => i.folderId !== folderId) }
        : c
    ));
    setFolderView(null);
    setConfirmDeleteFolder(false);
  }, []);

  const deleteImage = useCallback((image: ImageItem) => {
    setCategories(cats => cats.map(c =>
      c.id === image.categoryId
        ? { ...c, images: c.images.filter(i => i.id !== image.id) }
        : c
    ));
    setPreviewImage(null);
  }, []);

  const triggerUpload = (categoryId: string, folderId: string | null) => {
    uploadContext.current = { categoryId, folderId };
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const { categoryId, folderId } = uploadContext.current;
    const newImages: ImageItem[] = Array.from(files).map(file => ({
      id: uid(),
      name: file.name.replace(/\.[^.]+$/, ""),
      url: URL.createObjectURL(file),
      folderId,
      categoryId,
    }));
    setCategories(cats => cats.map(c =>
      c.id === categoryId ? { ...c, images: [...c.images, ...newImages] } : c
    ));
    e.target.value = "";
  };

  // ── Derived ───────────────────────────────────────────────────────────────

  const getCat = (id: string) => categories.find(c => c.id === id);

  const searchResults = isSearching
    ? categories.flatMap(c =>
        c.images.filter(img => img.name.toLowerCase().includes(query.toLowerCase()))
          .map(img => ({ ...img, categoryName: c.name }))
      )
    : [];

  // ── Render helpers ────────────────────────────────────────────────────────

  const renderFolderRow = (folder: Folder, cat: Category) => {
    const count = cat.images.filter(i => i.folderId === folder.id).length;
    const [hover, setHover] = useState(false);
    return (
      <div
        key={folder.id}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => setFolderView({ categoryId: cat.id, folderId: folder.id })}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "8px 0", cursor: "pointer", borderRadius: radius.sm,
          background: hover ? color.n08 : "transparent",
          marginInline: -8, paddingInline: 8,
          transition: "background 0.1s",
        }}
      >
        <IconFolder size={16} color={color.n03} />
        <span style={{ ...font.textSmMedium, color: color.n01, flex: 1 }}>{folder.name}</span>
        <span style={{ ...font.textXsRegular, color: color.n03 }}>
          {count} {count === 1 ? "image" : "images"}
        </span>
        <IconChevronRight size={14} color={color.n03} />
      </div>
    );
  };

  const renderCategoryContent = (cat: Category) => {
    const looseImages = cat.images.filter(i => i.folderId === null);
    const isEmpty = cat.folders.length === 0 && cat.images.length === 0;

    if (isEmpty) {
      return (
        <EmptyState
          onUpload={() => triggerUpload(cat.id, null)}
          onNewFolder={() => setNewFolderCategoryId(cat.id)}
        />
      );
    }

    return (
      <div style={{ paddingTop: 4, paddingBottom: 12, display: "flex", flexDirection: "column", gap: 4 }}>
        {/* Folders */}
        {cat.folders.map(f => renderFolderRow(f, cat))}

        {/* New folder inline input */}
        {newFolderCategoryId === cat.id ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBlock: 4 }}>
            <IconFolder size={16} color={color.purple} />
            <input
              ref={newFolderInputRef}
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") addFolder(cat.id);
                if (e.key === "Escape") { setNewFolderCategoryId(null); setNewFolderName(""); }
              }}
              placeholder="Folder name"
              style={{
                flex: 1, border: `1px solid ${color.purple}`, borderRadius: 6,
                padding: "4px 8px", fontSize: 13, outline: "none",
                fontFamily: "inherit",
              }}
            />
            <button
              onClick={() => addFolder(cat.id)}
              style={{
                padding: "4px 10px", background: color.purple, color: "#fff",
                border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 500,
              }}
            >Add</button>
            <button
              onClick={() => { setNewFolderCategoryId(null); setNewFolderName(""); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: color.n03, padding: 4 }}
            >
              <IconX size={14} color={color.n03} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => { setNewFolderCategoryId(cat.id); setNewFolderName(""); }}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "none", border: "none", cursor: "pointer",
              ...font.textSmRegular, color: color.n03, padding: "4px 0",
              alignSelf: "flex-start",
            }}
          >
            <IconPlus size={14} color={color.n03} /> New Folder
          </button>
        )}

        {/* Loose images */}
        {looseImages.length > 0 && (
          <>
            {cat.folders.length > 0 && (
              <div style={{ height: 1, background: color.n06, marginBlock: 8 }} />
            )}
            <ImageGrid
              images={looseImages}
              onImageClick={setPreviewImage}
              onDeleteImage={deleteImage}
            />
          </>
        )}

        {/* Upload button */}
        <button
          onClick={() => triggerUpload(cat.id, null)}
          style={{
            marginTop: 12, display: "flex", alignItems: "center", gap: 6,
            padding: "7px 14px", borderRadius: radius.sm, alignSelf: "flex-start",
            border: `1px solid ${color.n06}`, background: color.white,
            ...font.textSmMedium, color: color.n01, cursor: "pointer",
          }}
        >
          <IconUpload size={14} color={color.n02} /> Upload
        </button>
      </div>
    );
  };

  // ── Views ─────────────────────────────────────────────────────────────────

  const renderSearchView = () => (
    <div style={{ padding: "0 16px 16px" }}>
      <p style={{ ...font.textXsRegular, color: color.n03, marginBottom: 12 }}>
        {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for "{query}"
      </p>
      {searchResults.length === 0 ? (
        <p style={{ ...font.textSmRegular, color: color.n03, textAlign: "center", paddingTop: 32 }}>
          No images found
        </p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {searchResults.map(img => (
            <div key={img.id} style={{ position: "relative" }}>
              <ImageCard
                image={img}
                onClick={() => setPreviewImage(img)}
                onDelete={() => deleteImage(img)}
              />
              <p style={{ ...font.textXsRegular, color: color.n03, marginTop: 2 }}>
                {(img as ImageItem & { categoryName: string }).categoryName}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderFolderView = () => {
    if (!folderView) return null;
    const cat = getCat(folderView.categoryId);
    if (!cat) return null;
    const folder = cat.folders.find(f => f.id === folderView.folderId);
    if (!folder) return null;
    const images = cat.images.filter(i => i.folderId === folderView.folderId);

    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
        {/* Breadcrumb header */}
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "12px 16px", borderBottom: `1px solid ${color.n06}`,
          flexShrink: 0,
        }}>
          <button
            onClick={() => { setFolderView(null); setConfirmDeleteFolder(false); }}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}
          >
            <IconChevronLeft size={16} color={color.n02} />
          </button>
          <span style={{ ...font.textSmRegular, color: color.n03 }}>{cat.name}</span>
          <IconChevronRight size={12} color={color.n03} />
          <span style={{ ...font.textSmMedium, color: color.n01 }}>{folder.name}</span>
          <span style={{ ...font.textXsRegular, color: color.n03, marginLeft: "auto" }}>
            {images.length} {images.length === 1 ? "image" : "images"}
          </span>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 0" }}>
          {images.length === 0 ? (
            <EmptyState
              onUpload={() => triggerUpload(folderView.categoryId, folderView.folderId)}
              onNewFolder={() => {}}
            />
          ) : (
            <ImageGrid
              images={images}
              onImageClick={setPreviewImage}
              onDeleteImage={deleteImage}
            />
          )}
        </div>

        {/* Bottom actions */}
        <div style={{
          padding: "12px 16px",
          borderTop: `1px solid ${color.n06}`,
          display: "flex", alignItems: "center", gap: 8,
          flexShrink: 0,
        }}>
          <button
            onClick={() => triggerUpload(folderView.categoryId, folderView.folderId)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: radius.sm,
              border: `1px solid ${color.n06}`, background: color.white,
              ...font.textSmMedium, color: color.n01, cursor: "pointer",
            }}
          >
            <IconUpload size={14} color={color.n02} /> Upload
          </button>

          {confirmDeleteFolder ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
              <span style={{ ...font.textXsRegular, color: color.n02 }}>Delete this folder?</span>
              <button
                onClick={() => deleteFolder(folderView.categoryId, folderView.folderId)}
                style={{
                  padding: "5px 12px", borderRadius: 6, border: "none",
                  background: color.red, color: "#fff", cursor: "pointer",
                  fontSize: 12, fontWeight: 500,
                }}
              >Delete</button>
              <button
                onClick={() => setConfirmDeleteFolder(false)}
                style={{
                  padding: "5px 10px", borderRadius: 6,
                  border: `1px solid ${color.n06}`, background: color.white,
                  cursor: "pointer", fontSize: 12,
                }}
              >Cancel</button>
            </div>
          ) : (
            <IconBtn
              onClick={() => setConfirmDeleteFolder(true)}
              danger
              style={{ marginLeft: "auto" }}
            >
              <IconTrash size={14} color={color.red} /> Delete Folder
            </IconBtn>
          )}
        </div>
      </div>
    );
  };

  const renderAccordion = () => (
    <div style={{ padding: "0 16px 16px" }}>
      {categories.map((cat, idx) => {
        const isOpen = openCategoryId === cat.id;
        const totalImages = cat.images.length;
        return (
          <div key={cat.id}>
            {idx > 0 && <div style={{ height: 1, background: color.n06 }} />}
            {/* Category header */}
            <button
              onClick={() => setOpenCategoryId(isOpen ? null : cat.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 8,
                padding: "13px 0", background: "none", border: "none",
                cursor: "pointer", textAlign: "left",
              }}
            >
              <span style={{ ...font.textSmMedium, color: color.n01, flex: 1 }}>{cat.name}</span>
              <span style={{ ...font.textXsRegular, color: color.n03 }}>
                ({totalImages} {totalImages === 1 ? "image" : "images"})
              </span>
              <div style={{
                transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)",
                transition: "transform 0.18s",
                display: "flex", alignItems: "center",
              }}>
                <IconChevronDown size={16} color={color.n03} />
              </div>
            </button>
            {/* Expanded content */}
            {isOpen && renderCategoryContent(cat)}
          </div>
        );
      })}
    </div>
  );

  // ── Image Preview Overlay ─────────────────────────────────────────────────

  const renderPreview = () => {
    if (!previewImage) return null;
    const cat = getCat(previewImage.categoryId);
    const folder = previewImage.folderId ? cat?.folders.find(f => f.id === previewImage.folderId) : null;

    return (
      <div
        onClick={(e) => { if (e.target === e.currentTarget) setPreviewImage(null); }}
        style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(2px)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <div style={{
          background: color.white, borderRadius: radius.md,
          width: 480, maxWidth: "90vw",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          overflow: "hidden",
          display: "flex", flexDirection: "column",
        }}>
          {/* Close */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 16px 0",
          }}>
            <span style={{ ...font.textSmRegular, color: color.n03 }}>
              {cat?.name}{folder ? ` / ${folder.name}` : ""}
            </span>
            <button
              onClick={() => setPreviewImage(null)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}
            >
              <IconX size={18} color={color.n03} />
            </button>
          </div>

          {/* Image */}
          <div style={{ padding: "12px 16px" }}>
            <div style={{
              borderRadius: radius.sm, overflow: "hidden",
              border: `1px solid ${color.n06}`,
              background: color.n08, maxHeight: 320,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <img
                src={previewImage.url}
                alt={previewImage.name}
                style={{ width: "100%", maxHeight: 320, objectFit: "contain", display: "block" }}
              />
            </div>
          </div>

          {/* Name */}
          <div style={{ padding: "0 16px 4px" }}>
            <p style={{ ...font.textMdSemibold, color: color.n01, margin: 0 }}>
              {previewImage.name}
            </p>
          </div>

          {/* Actions */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 16px",
            borderTop: `1px solid ${color.n06}`,
            marginTop: 8,
          }}>
            <button
              onClick={() => deleteImage(previewImage)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "none", border: `1px solid ${color.n06}`,
                borderRadius: radius.sm, padding: "8px 16px",
                cursor: "pointer", ...font.textSmMedium, color: color.red,
              }}
            >
              <IconTrash size={14} color={color.red} /> Delete
            </button>
            <button
              onClick={() => { onInsert?.(previewImage); setPreviewImage(null); onClose(); }}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: color.purple, border: "none",
                borderRadius: radius.sm, padding: "8px 20px",
                cursor: "pointer", ...font.textSmMedium, color: "#fff",
              }}
            >
              Insert →
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ── Root render ───────────────────────────────────────────────────────────

  return (
    <>
      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleFileChange} />

      {/* Popover shell */}
      <div style={{
        position: "absolute",
        right: 88,
        top: 16,
        width: 400,
        height: 640,
        background: color.white,
        borderRadius: radius.md,
        boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: 100,
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 16px",
          borderBottom: `1px solid ${color.n06}`,
          flexShrink: 0,
        }}>
          <h2 style={{ ...font.textMdSemibold, color: color.n01, margin: 0 }}>
            {folderView ? "Image Library" : "Image Library"}
          </h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}
          >
            <IconX size={18} color={color.n03} />
          </button>
        </div>

        {/* Search bar (hidden in folder view) */}
        {!folderView && (
          <div style={{
            padding: "10px 16px",
            borderBottom: `1px solid ${color.n06}`,
            flexShrink: 0,
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: color.n08, borderRadius: radius.sm,
              border: `1px solid ${color.n06}`,
              padding: "7px 10px",
            }}>
              <IconSearch size={15} color={color.n03} />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search images..."
                style={{
                  flex: 1, border: "none", background: "transparent",
                  ...font.textSmRegular, color: color.n01, outline: "none",
                  fontFamily: "inherit",
                }}
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}
                >
                  <IconX size={14} color={color.n03} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
          {folderView
            ? renderFolderView()
            : isSearching
            ? renderSearchView()
            : renderAccordion()
          }
        </div>
      </div>

      {/* Preview overlay (portal-like, rendered outside the popover) */}
      {renderPreview()}
    </>
  );
}
