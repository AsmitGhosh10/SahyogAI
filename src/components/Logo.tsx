// Two joined hands forming a leaf: cooperation + agriculture.
export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#1f6b45" />
      <path d="M8 21c0-7 5-12 13-13-1 8-6 13-13 13Z" fill="#fbf8f1" />
      <path d="M24 21c0-4-2-7-6-9 3 3 3 6 2 9h4Z" fill="#e08a1e" />
      <path d="M9 21c3-3 6-6 10-9" stroke="#1f6b45" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </svg>
  );
}
