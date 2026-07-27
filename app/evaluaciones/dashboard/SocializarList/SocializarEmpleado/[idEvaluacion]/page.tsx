import EvaluationSocializacionDetail from "@/app/evaluaciones/Componnents/GetSocializacionEmployee";

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

            <h1
                className="
                    text-4xl
                    font-bold
                    mb-8
                "
            >
                Socializacion de Evaluacion
            </h1>

            <EvaluationSocializacionDetail
                idEvaluacion={idEvaluacion}
            />

        </div>
    );
}