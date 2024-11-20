"use client";

import { ComponentProps, useEffect, useRef } from "react";

export function Iframe(props: ComponentProps<"iframe">) {
  const ref = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    function adjustIframeHeight() {
      const iframe = ref.current;
      if (iframe) {
        iframe.style.height =
          (iframe.contentWindow?.document.body.scrollHeight ?? 0) + 50 + "px";

        console.log(iframe.style.height);
      }
    }

    addEventListener("resize", adjustIframeHeight);
    adjustIframeHeight();
    return () => removeEventListener("resize", adjustIframeHeight);
  }, []);
  return <iframe className="overflow-hidden" ref={ref} {...props} />;
}
