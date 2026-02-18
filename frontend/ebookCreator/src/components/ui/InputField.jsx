import React from "react";

const InputField = ({ icon: Icon, label, name, className = "", ...props }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}

        <input
          id={name}
          name={name}
          {...props}
          className={`w-full h-11 px-3 py-2 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all ${
            Icon ? "pl-10" : ""
          } ${className}`}
        />
      </div>
    </div>
  );
};

export default InputField;
