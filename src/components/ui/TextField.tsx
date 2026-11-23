import { useId } from "react";
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "./cn";

interface FieldBase {
  label: string;
  hint?: string;
  /** Error message; sets aria-invalid and is announced with the field. */
  error?: string;
  required?: boolean;
  className?: string;
}

type InputProps = FieldBase & { as?: "input" } & Omit<InputHTMLAttributes<HTMLInputElement>, "className">;
type TextareaProps = FieldBase & { as: "textarea" } & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className">;
type SelectProps = FieldBase & { as: "select"; options: Array<{ value: string; label: string }>; placeholder?: string } &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, "className">;

export type TextFieldProps = InputProps | TextareaProps | SelectProps;

/** Labelled input, textarea or select with hint and error text. */
export function TextField(props: TextFieldProps) {
  const autoId = useId();
  const { label, hint, error, required, className } = props;
  const id = (props as { id?: string }).id ?? autoId;
  const hintId = hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-err` : undefined;
  const a11y = {
    id,
    required,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": [hintId, errId].filter(Boolean).join(" ") || undefined,
    className: "sv-field__control",
  };
  let control;
  if (props.as === "textarea") {
    const { as, label: _l, hint: _h, error: _e, required: _r, className: _c, ...rest } = props;
    control = <textarea {...rest} {...a11y} />;
  } else if (props.as === "select") {
    const { as, label: _l, hint: _h, error: _e, required: _r, className: _c, options, placeholder, ...rest } = props;
    control = (
      <select {...rest} {...a11y} defaultValue={rest.defaultValue ?? (placeholder ? "" : undefined)}>
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    );
  } else {
    const { as, label: _l, hint: _h, error: _e, required: _r, className: _c, ...rest } = props;
    control = <input type="text" {...rest} {...a11y} />;
  }
  return (
    <div className={cn("sv-field", className)}>
      <label className="sv-field__label" htmlFor={id}>
        {label}
        {required && <span className="sv-field__req" aria-hidden="true">*</span>}
      </label>
      {control}
      {hint && <span id={hintId} className="sv-field__hint">{hint}</span>}
      {error && (
        <span id={errId} className="sv-field__error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M12 7v6M12 16.5v.5" /></svg>
          {error}
        </span>
      )}
    </div>
  );
}
