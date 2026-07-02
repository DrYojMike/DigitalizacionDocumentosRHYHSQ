import Link from "next/link";
import { ReactNode } from "react";
import { FaArrowRight } from "react-icons/fa";

interface Props {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
}

export default function ModuleCard({
  title,
  description,
  icon,
  href,
}: Props) {
  return (
    <Link href={href} className="group">
      <article
        className="
          h-full
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-6
          shadow-sm
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-red-300
          hover:shadow-lg
        "
      >
        <div
          className="
            w-14
            h-14
            rounded-xl
            bg-red-50
            text-red-600
            flex
            items-center
            justify-center
            text-2xl
            mb-5
          "
        >
          {icon}
        </div>

        <h3 className="text-xl font-semibold text-gray-900">
          {title}
        </h3>

        <p className="mt-2 text-gray-600 leading-relaxed">
          {description}
        </p>

        <div
          className="
            mt-6
            flex
            items-center
            gap-2
            text-red-600
            font-medium
          "
        >
          Ingresar

          <FaArrowRight
            className="
              transition-transform
              group-hover:translate-x-1
            "
          />
        </div>
      </article>
    </Link>
  );
}