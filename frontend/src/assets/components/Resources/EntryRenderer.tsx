export default function EntryRenderer({ node }: { node: any }) {
  if (!node && node !== 0) return null;
  if (typeof node === "string") return <p className="mb-2 text-sm text-gray-200">{node}</p>;
  if (Array.isArray(node)) return <>{node.map((n, i) => <div key={i}><EntryRenderer node={n} /></div>)}</>;

  if (node.type === "list" && Array.isArray(node.items)) {
    return (
      <ul className="list-disc ml-6 mb-2">
        {node.items.map((it: any, idx: number) => (
          <li key={idx} className="text-sm text-gray-200">{it.entry ?? it.name ?? (typeof it === 'string' ? it : JSON.stringify(it))}</li>
        ))}
      </ul>
    );
  }

  if (node.type === "table" && Array.isArray(node.rows)) {
    const colLabels: string[] = Array.isArray(node.colLabels) ? node.colLabels : [];
    const colStyles: string[] = Array.isArray(node.colStyles) ? node.colStyles : [];
    return (
      <div className="overflow-auto mb-2">
        <table className="w-full text-sm border-collapse">
          {colLabels.length > 0 && (
            <thead>
              <tr className="bg-orange-800/20">
                {colLabels.map((label: string, hidx: number) => (
                  <th key={hidx} className={`p-1 text-left text-xs text-orange-100 ${colStyles[hidx] ?? ""}`}>{label}</th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {node.rows.map((r: any, ridx: number) => (
              <tr key={ridx} className={ridx % 2 === 0 ? "bg-orange-800/10" : "bg-transparent"}>
                {r.map((cell: any, cidx: number) => (
                  <td key={cidx} className={`p-1 align-top text-sm ${colStyles[cidx] ?? ""}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (node.type === "entry") {
    return (
      <div className="mb-2">
        {node.name && <div className="font-semibold text-sm text-orange-200">{node.name}</div>}
        {Array.isArray(node.entry) ? node.entry.map((e: any, i: number) => <div key={i}><EntryRenderer node={e} /></div>) : <div className="text-sm">{String(node.entry ?? "")}</div>}
      </div>
    );
  }

  return <pre className="text-xs text-gray-300 whitespace-pre-wrap">{JSON.stringify(node, null, 2)}</pre>;
}
