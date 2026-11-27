"use client";

import { FieldError, SelectInput, useField, useFormFields } from "@payloadcms/ui";
import type { TextFieldClientComponent } from "payload";
import { categoriesOf } from "@/lib/insight-categories";

/** The article's category as a list to pick from; what it offers follows the chosen section. Stored as plain text. */
export const CategorySelect: TextFieldClientComponent = ({ field, path, readOnly }) => {
  const { value, setValue, showError, errorMessage, disabled } = useField<string>({ path });
  const section = useFormFields(([fields]) => fields.type?.value);
  const categories = categoriesOf(section);

  return (
    <SelectInput
      name={path}
      path={path}
      label={field.label}
      description={field.admin?.description}
      required
      readOnly={readOnly || disabled}
      placeholder={section ? "Select a category" : "Choose a section first"}
      options={categories.map((c) => ({ label: c, value: c }))}
      value={value && categories.includes(value) ? value : ""}
      showError={showError}
      Error={<FieldError path={path} message={errorMessage} showError={showError} />}
      onChange={(option) => setValue(Array.isArray(option) ? "" : (option?.value ?? ""))}
    />
  );
};
