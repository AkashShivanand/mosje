"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import {
  CHATBOT_MASCOT_SRC,
  CHATBOT_RING_PATH,
  CHATBOT_RING_VIEWBOX,
} from "./chatbot-assets";
import "./chatbot.css";

export interface ChatbotMascotProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /**
   * Rendered diameter in px. The two sizes the design actually uses are the
   * 84px launcher and the 37px message avatar; anything between scales
   * cleanly because every inner measurement is a percentage of this.
   * @default 84
   */
  size?: number;
  /**
   * Show the circular bilingual wordmark on a white ring around the disc.
   * True for the launcher, false for the small avatar beside a message —
   * at 37px the wordmark is unreadable and only muddies the mark.
   * @default false
   */
  ring?: boolean;
  /**
   * Turn the wordmark's slow idle rotation on. Ignored when `ring` is false,
   * and inert under `prefers-reduced-motion`.
   * @default false
   */
  spin?: boolean;
}

/**
 * **ChatbotMascot** — "Noddy", the SAMAVESH assistant mark.
 *
 * Two parts that are deliberately separate nodes rather than one flattened
 * export: a navy disc carrying the mascot, and (optionally) a white ring
 * carrying the circular wordmark. Separating them is what lets the wordmark
 * rotate while the mascot stays level — a flattened asset would have to spin
 * the robot too, which reads as a loading spinner rather than a seal.
 *
 * The artwork itself is exported from Figma, never redrawn — see
 * `chatbot-assets.ts` for the node ids and why each is the format it is.
 *
 * Decorative by default: the whole mark is `aria-hidden`, because in every
 * current use it sits inside a control or beside a message that already
 * carries the accessible name. Pass an `aria-label` to override.
 */
export const ChatbotMascot = React.forwardRef<HTMLSpanElement, ChatbotMascotProps>(
  function ChatbotMascot(
    { size = 84, ring = false, spin = false, className, style, ...rest },
    ref,
  ) {
    const labelled = rest["aria-label"] != null;

    return (
      <span
        ref={ref}
        className={cn(
          "ds-chatbot-mascot",
          ring && "ds-chatbot-mascot--ring",
          spin && ring && "ds-chatbot-mascot--spin",
          className,
        )}
        style={{ ...style, ["--ds-chatbot-mascot-size" as string]: `${size}px` }}
        aria-hidden={labelled ? undefined : true}
        role={labelled ? "img" : undefined}
        {...rest}
      >
        {ring && (
          <svg
            className="ds-chatbot-mascot__ring"
            viewBox={CHATBOT_RING_VIEWBOX}
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <path d={CHATBOT_RING_PATH} />
          </svg>
        )}
        <span className="ds-chatbot-mascot__disc" />
        {/* eslint-disable-next-line @next/next/no-img-element -- inline data URI; there is nothing for next/image to optimise and the DS must not depend on next. */}
        <img className="ds-chatbot-mascot__figure" src={CHATBOT_MASCOT_SRC} alt="" />
      </span>
    );
  },
);
