import EntryRenderer from "./EntryRenderer";

export default function ClassRenderer({ item }: { item: any }) {
  return (
    <div className="mb-2 text-sm text-gray-200">
      <div className="mb-2">
        {item.hd && <div><strong>Hit die:</strong> {item.hd}</div>}
        {item.primary && <div><strong>Primary:</strong> {item.primary}</div>}
        {item.short && <div className="mt-1 text-xs text-orange-200">{item.short}</div>}
        {item.URL && <div className="mt-1"><a className="text-xs text-orange-100 hover:underline" href={item.URL} target="_blank" rel="noreferrer">Image / resource</a></div>}
      </div>

      {/* class features / entries */}
      {Array.isArray(item.classFeatures) && item.classFeatures.length > 0 && (
        <div className="mb-2">
          <div className="font-semibold text-sm text-orange-200">Features</div>
          {item.classFeatures.map((f: any, i: number) => <div key={i}><EntryRenderer node={f} /></div>)}
        </div>
      )}

      {/* fallback: any other nested entries */}
      {Array.isArray(item.entries) && item.entries.map((e: any, i: number) => <div key={i}><EntryRenderer node={e} /></div>)}
    </div>
  );
}
