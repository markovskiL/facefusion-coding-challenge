export const Button = ({
  children,
  className,
  variant = "primary",
  size = "medium",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "tertiary";
  size?: "small" | "medium" | "large";
}) => {
  const baseStyles =
    "rounded-lg font-semibold focus:outline-none focus:ring-1 focus:ring-offset-1 cursor-pointer transition duration-100 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed";
  const variantStyles = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
    tertiary: "bg-transparent text-white hover:bg-blue-100/10",
  };
  const sizeStyles = {
    small: "px-4 py-1 text-sm",
    medium: "px-6 py-2 text-base",
    large: "px-8 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
