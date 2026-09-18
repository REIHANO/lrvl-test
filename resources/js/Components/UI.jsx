export const panel = 'rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,.04)]';
export const input = 'rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100';

export function Card({ children, className = '', as: Element = 'section' }) {
    return <Element className={`${panel} p-5 ${className}`}>{children}</Element>;
}

export function Button({ children, className = '', ...props }) {
    return <button className={`rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-50 ${className}`} {...props}>{children}</button>;
}

export function Field({ label, error, as: Element = 'input', ...props }) {
    return <label className="mb-4 block text-sm font-semibold text-slate-700">{label}<Element className={`${input} mt-1.5 w-full font-normal ${error ? 'border-red-400' : ''}`} {...props}/>{error && <span className="mt-1 block text-xs font-normal text-red-600">{error}</span>}</label>;
}

export function EmptyState({ children }) { return <p className="p-10 text-center text-sm text-slate-500">{children}</p>; }
