import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function InputFloat({
  type,
  name,
  label,
  onChange,
  value,
  required,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <label className="floating-label ">
      <span>{label}</span>

      <div className="relative w-full">
        <input
          type={inputType}
          name={name}
          placeholder={label}
          onChange={onChange}
          value={value}
          required={required}
          className={`input ${type === "password" ? "pr-10" : ""}`}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60 hover:text-base-content"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </label>
  );
}
