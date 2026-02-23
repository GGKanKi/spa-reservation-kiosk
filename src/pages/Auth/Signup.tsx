import { useState } from "react";

export default function SignupPage() {
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: handle sign up
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left: Lavender branding panel */}
      <div
        className="flex-1 flex items-center justify-center min-h-[260px] md:min-h-screen"
        style={{ backgroundColor: "#D1C4E9" }}
      >
        <h1 className="spa-title text-center px-6 select-none">
          SPA RESERVATION<br />KIOSK
        </h1>
      </div>

      {/* Right: Sign up form panel */}
      <div className="flex items-center justify-center bg-white w-full md:w-auto md:min-w-[420px] lg:min-w-[500px] px-6 py-12 md:py-0">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[397px] border border-[#D9D9D9] rounded-lg p-6 flex flex-col gap-6 bg-white"
        >
          <FormField
            label="First Name"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
          />
          <FormField
            label="Middle Name"
            name="middleName"
            value={form.middleName}
            onChange={handleChange}
          />
          <FormField
            label="Last Name"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
          />
          <FormField
            label="E-mail"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
          <FormField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
          />
          <FormField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-[#2C2C2C] border border-[#2C2C2C] text-[#F5F5F5] text-base tracking-widest font-normal hover:bg-[#1a1a1a] transition-colors duration-200"
          >
            SIGN UP
          </button>
        </form>
      </div>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function FormField({ label, name, type = "text", value, onChange }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={name}
        className="text-base font-normal text-[#1E1E1E] leading-[1.4]"
        style={{ fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif" }}
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder="Value"
        className="w-full px-4 py-3 rounded-lg border border-[#D9D9D9] bg-white text-base text-[#B3B3B3] placeholder-[#B3B3B3] focus:outline-none focus:border-[#2C2C2C] focus:text-[#1E1E1E] transition-colors"
        style={{ fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif" }}
      />
    </div>
  );
}
