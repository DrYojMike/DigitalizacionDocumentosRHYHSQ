import Evaluation from "@/app/evaluaciones/Componnents/GetEvaluation";


interface Props {

    params: Promise<{
        tipo:string
    }>

}



export default async function Page({
    params
}:Props){


    const {tipo} = await params;



    return (

        <div className="
            p-10
        ">


            <h1 className="
                text-4xl
                font-bold
                mb-8
            ">

                Evaluación tipo {tipo}

            </h1>



            <Evaluation
                tipo={Number(tipo)}
            />


        </div>

    )

}