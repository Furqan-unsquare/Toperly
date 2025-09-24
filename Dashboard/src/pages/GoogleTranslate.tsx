import { useEffect, useState } from "react";
import { Globe, ChevronDown } from "lucide-react"; // 👈 icons

export default function LanguageSwitcher() {
  const [language, setLanguage] = useState("en");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const addScript = document.createElement("script");
    addScript.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(addScript);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };
  }, []);

  const handleTranslate = (lang) => {
    setLanguage(lang);
    setIsOpen(false);

    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event("change"));
    }
  };

  // Always reset to English on first load
  useEffect(() => {
    handleTranslate("en");
  }, []);

  const languages = [
    { code: "en", label: "English" },
    { code: "or", label: "Odia" },
    { code: "hi", label: "Hindi" },
    { code: "ta", label: "Tamil" },
    { code: "bn", label: "Bengali" },
  ];

  return (
    <div className="relative">
      {/* hidden Google element */}
      <div id="google_translate_element" style={{ display: "none" }}></div>

      {/* button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="z-[9999] flex items-center text-sm font-medium text-gray-700 hover:text-gray-500 px-3 py-2 rounded-md w-full md:w-auto border border-gray-200 md:border-0"
      >
        <Globe className="h-4 w-4 mr-1" />
        {languages.find((l) => l.code === language)?.label}
        <ChevronDown
          className={`h-4 w-4 ml-1 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* dropdown */}
      {/* dropdown */}
{isOpen && (
  <div
    className="absolute top-full right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg transition-all duration-300 ease-in-out z-50 notranslate"
    translate="no"
  >
    {languages.map((lang) => (
      <div
        key={lang.code}
        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer notranslate"
        translate="no"
        onClick={() => handleTranslate(lang.code)}
      >
        {lang.label}
      </div>
    ))}
  </div>
)}

    </div>
  );
}
