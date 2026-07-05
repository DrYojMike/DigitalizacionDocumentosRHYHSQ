import Card from "@/app/components/home/Card";
import {FaShieldAlt,FaFileAlt,FaRocket,FaArrowRight,} from "react-icons/fa";

export default function Welcome() {
  return (
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Texto */}
          <div>

            <span className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Plataforma segura
            </span>

            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Toda tu documentación
              <span className="block text-red-600">
                en un solo lugar
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-600">
              Consulta certificados, solicitudes y documentos
              de manera rápida, segura y desde cualquier lugar.
            </p>

            <div className="mt-8 flex gap-4 flex-wrap">

              <a
                href="/login"
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-7 py-3 rounded-lg transition"
              >
                Ingresar
                <FaArrowRight />
              </a>

              <a
                href="/registro"
                className="px-7 py-3 rounded-lg border border-gray-300 hover:border-red-500 hover:text-red-600 transition"
              >
                Registrarse
              </a>

            </div>

          </div>

          {/* Tarjetas */}
          <div className="space-y-5">

            <Card
              icon={<FaShieldAlt className="text-red-600 text-2xl" />}
              title="Acceso seguro"
              text="Protección mediante autenticación y acceso controlado."
            />

            <Card
              icon={<FaFileAlt className="text-red-600 text-2xl" />}
              title="Documentos"
              text="Consulta y descarga tus documentos laborales fácilmente."
            />

            <Card
              icon={<FaRocket className="text-red-600 text-2xl" />}
              title="Procesos ágiles"
              text="Solicitudes y trámites digitales en pocos pasos."
            />

          </div>

        </div>
      </div>
  );
}