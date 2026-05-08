import { useEffect } from 'react';

/**
 * A helper component that injects CSS into the document head when mounted
 * and removes it when unmounted. This prevents re-parsing CSS on every render
 * while keeping styles scoped to the lifecycle of the component.
 */
export default function StyleSheet({ css }) {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, [css]);

  return null;
}
