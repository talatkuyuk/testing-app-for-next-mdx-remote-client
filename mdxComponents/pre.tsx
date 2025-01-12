"use client";

import React, { ComponentRef, useRef, useState } from "react";

import IconContentCopy from "@/components/icons/IconContentCopy";
import IconDone from "@/components/icons/IconDone";

const pre = (props: React.ComponentPropsWithoutRef<"pre">) => {
  const preRef = useRef<ComponentRef<"pre">>(null);
  const [copied, setCopied] = useState(false);

  const onCopy = (): void => {
    if (!preRef.current) return;

    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);

    // clone the <code> element in order not to cause any change in actual DOM
    const code = preRef.current.getElementsByTagName("code")[0].cloneNode(true);

    // add eol to each code-line since there is no eol at the end when they are div
    Array.from((code as HTMLElement).querySelectorAll("div.code-line")).forEach(
      (line) => {
        line.innerHTML = line.innerHTML + "\r";
      }
    );

    void navigator.clipboard.writeText(code.textContent ?? "");
  };

  return (
    <pre ref={preRef} {...props} style={{ position: "relative" }}>
      <span className="pre-language-label">{props.className}</span>
      <button className="pre-copy-button" onClick={onCopy}>
        {copied ? (
          <IconDone fill="#555" width="18px" height="18px" />
        ) : (
          <IconContentCopy fill="#555" width="18px" height="18px" />
        )}
      </button>
      {props.children}
    </pre>
  );
};

export default pre;
