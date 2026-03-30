import { useRef } from 'react';

export default function ActionBar({ onImport, onExport }) {
  const fileRef = useRef(null);

  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-[#0B1120] border-b border-gray-800">
      <button
        onClick={() => fileRef.current?.click()}
        className="text-xs text-gray-300 hover:text-white flex items-center gap-1 cursor-pointer"
      >
        <span>📥</span> Import
      </button>
      <input
        ref={fileRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={(e) => {
          if (e.target.files[0]) onImport(e.target.files[0]);
          e.target.value = '';
        }}
      />
      <button
        onClick={onExport}
        className="text-xs text-gray-300 hover:text-white flex items-center gap-1 cursor-pointer"
      >
        <span>📤</span> Export
      </button>
    </div>
  );
}
