import React from 'react'

const Button = ({variant = "primary" , size= "md" , isLoading = false , children, icon: Icon,className="", ...props }) => {

  const variants = {
  primary:
    "bg-violet-600 text-white hover:bg-violet-700 active:bg-violet-800",
  secondary:
    "bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400",
  outline:
    "border border-violet-600 text-violet-600 hover:bg-violet-50",
  ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
  danger: "bg-transparent hover:bg-red-50 text-red-600",
};

const sizes = {
  sm: "text-sm px-3 py-1.5 rounded-lg h-8",
  md: "text-sm px-4 py-2.5 h-11 rounded-xl",
  lg: "text-base px-6 py-3 h-12 rounded-xl",
};

  return (
      <button
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading }
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            className="opacity-25"
          />
          <path
            fill="currentColor"
            className="opacity-75"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <>
          {Icon && <Icon className="h-5 w-5 mr-2" />}
          {children}
        </>
      )}
    </button>
  )
}

export default Button
