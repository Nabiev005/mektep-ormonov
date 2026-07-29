import { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface FormulaProps {
  tex: string;
  block?: boolean;
  className?: string;
}

const Formula = ({ tex, block, className }: FormulaProps) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(tex, { throwOnError: false, displayMode: Boolean(block) });
    } catch {
      return tex;
    }
  }, [tex, block]);

  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
};

export default Formula;
