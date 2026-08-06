import EvaluationSocializacionDetail from "@/app/evaluaciones/Componnents/GetSocializacionEmployee";
import Image from "next/image";

interface Props {
    params: Promise<{
        idEvaluacion: number;
    }>;
}

export default async function Page({
    params
}: Props) {

    const { idEvaluacion } = await params;

    return (
        <div className="p-10">
            {/* Header con logo y título */}
            <div className="flex items-center justify-center gap-4 mb-8">
                {/* Logo */}
                <div className="flex-shrink-0 relative w-[300px] h-[200px]">
                    <Image
                        src="/LogoMercico.png"
                        alt="Logo Mercico"
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        // O, si el contenedor tiene un tamaño fijo, puedes usar:
                        // sizes="300px"
                        priority
                    />
                </div>
                
                {/* Título */}
                <h2 className="text-4xl font-bold text-center">
                    Resultado De Evaluación De Trabajo En Equipo
                </h2>
            </div>

            <EvaluationSocializacionDetail
                idEvaluacion={idEvaluacion}
            />
        </div>
    );
}