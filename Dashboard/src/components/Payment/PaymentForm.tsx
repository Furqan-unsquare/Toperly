import React, { useState } from "react";
import { Course } from "../../types/payment";

interface PaymentFormProps {
  course: Course;
  onSubmit: (u: { name: string; email: string; contact: string }) => void;
  onCancel: () => void;
  loading: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  course,
  onSubmit,
  onCancel,
  loading,
}) => {
  const [formData, setFormData] = useState({ name: "", email: "", contact: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = "Name is required";
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = "Invalid email format";
    if (!formData.contact.trim()) e.contact = "Contact number is required";
    else if (!/^[6-9]\d{9}$/.test(formData.contact))
      e.contact = "Invalid contact number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();
    if (validateForm()) onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden">
        {/* ----- two-column grid ----- */}
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          {/* left – illustration */}
          <div className="hidden md:flex items-center justify-center bg-gray-50">
            {/* replace src with the illustration you need */}
            <img
              src="/payment-form.png"
              alt="course success illustration"
              className="max-h-96 object-contain"
            />
          </div>

          {/* right – form */}
          <div className="p-6 md:p-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Complete your purchase
            </h2>

            {/* brief course card */}
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <h3 className="font-semibold">{course.name}</h3>
              <p className="text-xl font-bold text-blue-600">
                ₹{course.price.toLocaleString()}
              </p>
            </div>

            {/* form fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {["name", "email", "contact"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1 capitalize">
                    {field} *
                  </label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={formData[field as keyof typeof formData]}
                    onChange={handleChange}
                    maxLength={field === "contact" ? 10 : undefined}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors[field] ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors[field] && (
                    <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
                  )}
                </div>
              ))}

              {/* buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={loading}
                  className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-3 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                {/* shine button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`shine-button flex-1 relative overflow-hidden py-3 px-1 rounded-lg text-white font-semibold uppercase inline-flex justify-center items-center gap-2 transition-transform duration-300 ease-in-out ${
                    course.price === 0
                      ? "bg-gradient-to-r from-green-600 to-emerald-600"
                      : "bg-gradient-to-r from-purple-600 to-blue-600"
                  } ${
                    loading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-lg hover:-translate-y-0.5"
                  }`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Proceed to payment"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
