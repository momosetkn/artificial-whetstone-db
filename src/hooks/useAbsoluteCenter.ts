import {CSSProperties, Ref, useEffect, useState} from "react";

export const useAbsoluteCenter = <T extends HTMLElement>(): [Ref<T>, CSSProperties | undefined] => {
  const [elm, setElm] = useState<HTMLElement | null>(null);
  const [style, setStyle] = useState<CSSProperties | undefined>();

  useEffect(() => {
    if (!elm) return;

    const resizeObserver = new ResizeObserver(entries => {
      const targetRect = entries[0].contentRect;
      setStyle({
        left: `calc(50vw - ${Math.floor(targetRect.width) / 2}px)`,
        top: `calc(50vh - ${Math.floor(targetRect.height) / 2}px)`,
      });
    });

    resizeObserver.observe(elm);

    return () => {
      if (!elm) return;

      resizeObserver.unobserve(elm);
    };
    // eslint-disable-next-line
  }, [elm]);

  return [setElm, style];
}
