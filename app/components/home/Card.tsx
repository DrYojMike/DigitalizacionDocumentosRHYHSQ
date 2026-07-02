// components/home/Card.tsx
interface CardProps {
  icon?: React.ReactNode;
  title: string;
  text: string;
  variant?: "primary" | "secondary" | "tertiary";
}

export default function Card({ icon, title, text, variant = "primary" }: CardProps) {
  const variants = {
    primary: "border-l-4 border-blue-500 hover:border-blue-600",
    secondary: "border-l-4 border-indigo-400 hover:border-indigo-500",
    tertiary: "border-l-4 border-blue-300 hover:border-blue-400",
  };

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] ${variants[variant]}`}>
      {icon && <div className="mb-3">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{text}</p>
    </div>
  );
}