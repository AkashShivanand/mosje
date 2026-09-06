"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Button } from "../actions/button";
import "./signature-pad.css";

export interface SignatureValue {
  /** How it was given. */
  method: "drawn" | "typed";
  /** A PNG data URL for `drawn`, the typed name for `typed`. */
  value: string;
}

export interface SignaturePadProps {
  /**
   * The declaration the signature attests to, in the department's words. It is
   * REQUIRED, because a signature with no stated declaration attests to nothing
   * and the design system must not invent the wording.
   */
  declaration: string;
  /** Whose signature this is — "Signature of the applicant". Required. */
  label: string;
  value: SignatureValue | null;
  onChange: (value: SignatureValue | null) => void;
  /** @default "Type your full name instead" */
  typedLabel?: string;
  /** @default "Clear" */
  clearLabel?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * A signature on a consent form, given by drawing or by typing.
 *
 * **The typed alternative is not optional and cannot be switched off.** WCAG 2.2
 * §2.5.7 requires a single-pointer path that is not a drag, and drawing a
 * signature is a drag by definition — so a pad that only draws excludes every
 * reader using a keyboard, a switch, or a head pointer. Both paths are always
 * offered and both produce a value; which of them the department accepts as a
 * signature is stated in `declaration`, which the caller must supply.
 *
 * That is the whole design decision here. The component does not decide what
 * counts as consent; it makes it impossible to ship a form that has not
 * answered the question.
 *
 * Three more rules:
 *
 * 1. **The declaration sits ABOVE the pad, not below it.** A citizen signs and
 *    then reads is a citizen who did not read.
 * 2. **Clearing is always available**, and it clears the value rather than
 *    hiding it. A signature nobody can withdraw is not consent.
 * 3. **The drawn signature is captured at device resolution**, so a signature
 *    given on a phone is not a blurred smear in the record it is filed against.
 */
export function SignaturePad({
  declaration,
  label,
  value,
  onChange,
  typedLabel = "Type your full name instead",
  clearLabel = "Clear",
  disabled,
  className,
}: SignaturePadProps): React.JSX.Element {
  const id = React.useId();
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const drawing = React.useRef(false);
  const [typed, setTyped] = React.useState(value?.method === "typed" ? value.value : "");

  function context(): CanvasRenderingContext2D | null {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== Math.round(rect.width * ratio)) {
      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    // The ink comes from the canvas's own computed colour, which the stylesheet
    // binds to a token — a literal here would be the one unthemed value in the
    // component and would survive every brand switch.
    ctx.strokeStyle = window.getComputedStyle(canvas).color;
    return ctx;
  }

  function point(event: React.PointerEvent<HTMLCanvasElement>): [number, number] {
    const rect = event.currentTarget.getBoundingClientRect();
    return [event.clientX - rect.left, event.clientY - rect.top];
  }

  function start(event: React.PointerEvent<HTMLCanvasElement>): void {
    if (disabled) return;
    const ctx = context();
    if (!ctx) return;
    drawing.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    const [x, y] = point(event);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function move(event: React.PointerEvent<HTMLCanvasElement>): void {
    if (!drawing.current) return;
    const ctx = context();
    if (!ctx) return;
    const [x, y] = point(event);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function end(): void {
    if (!drawing.current) return;
    drawing.current = false;
    const canvas = canvasRef.current;
    if (canvas) onChange({ method: "drawn", value: canvas.toDataURL("image/png") });
  }

  function clear(): void {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    setTyped("");
    onChange(null);
  }

  return (
    <fieldset className={cn("ds-sign", className)} disabled={disabled}>
      <legend className="ds-sign__legend">{label}</legend>

      {/* The declaration is read BEFORE the pad. A citizen who signs and then
          reads is a citizen who did not read. */}
      <p className="ds-sign__declaration" id={`${id}-declaration`}>
        {declaration}
      </p>

      <canvas
        ref={canvasRef}
        className="ds-sign__canvas"
        aria-label={`${label} — draw here, or use the field below`}
        aria-describedby={`${id}-declaration`}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
      />

      <div className="ds-sign__row">
        <label className="ds-sign__typedLabel" htmlFor={`${id}-typed`}>
          {typedLabel}
        </label>
        <input
          id={`${id}-typed`}
          className="ds-sign__typed"
          value={typed}
          aria-describedby={`${id}-declaration`}
          onChange={(event) => {
            setTyped(event.target.value);
            const next = event.target.value.trim();
            onChange(next ? { method: "typed", value: next } : null);
          }}
        />
        <Button size="sm" appearance="text" onClick={clear} disabled={disabled}>
          {clearLabel}
        </Button>
      </div>

      <p className="ds-sign__state" role="status" aria-live="polite">
        {value === null
          ? "Not signed"
          : value.method === "typed"
            ? `Signed by typing the name ${value.value}`
            : "Signed by drawing"}
      </p>
    </fieldset>
  );
}
