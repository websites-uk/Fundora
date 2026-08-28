import { useState } from 'react';

type Props = { value: string };

export default function CopyButton({ value }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return <button type="button" className="copy-btn" onClick={copy} aria-label={`Copy ${value}`}>
    {copied ? 'Copied' : 'Copy'}
  </button>;
}
