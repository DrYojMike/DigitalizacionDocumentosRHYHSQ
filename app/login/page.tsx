"use client";


import {
    useState
} from "react";


import {
    useRouter
} from "next/navigation";


import {
    useAuth
} from "../context/AuthContext";





export default function LoginPage(){



    const router = useRouter();


    const {
        login
    } = useAuth();




    const [username,setUsername] =
        useState("");



    const [password,setPassword] =
        useState("");



    const [loading,setLoading] =
        useState(false);



    const [error,setError] =
        useState("");







    const handleSubmit =
    async(e:React.FormEvent)=>{


        e.preventDefault();


        setError("");

        setLoading(true);



        try{


            await login(
                username,
                password
            );


            router.push("/");


        }catch(err:any){


            setError(
                err.message ||
                "Credenciales incorrectas"
            );


        }finally{


            setLoading(false);


        }


    };






    return (


        <main
        className="
        min-h-screen
        bg-gray-100
        flex
        items-center
        justify-center
        px-4
        "
        >



            <form

            onSubmit={handleSubmit}

            className="
            bg-white
            shadow-xl
            rounded-3xl
            p-10
            w-full
            max-w-md
            "

            >



                <h1
                className="
                text-3xl
                font-bold
                text-center
                mb-8
                "
                >

                    Iniciar sesión

                </h1>






                {
                    error && (

                        <div
                        className="
                        bg-red-100
                        text-red-700
                        p-3
                        rounded-lg
                        mb-5
                        "
                        >

                            {error}

                        </div>

                    )
                }





                <div
                className="
                space-y-5
                "
                >



                    <div>


                        <label
                        className="
                        block
                        mb-2
                        font-medium
                        "
                        >

                            Usuario

                        </label>



                        <input

                        value={username}

                        onChange={
                            e=>setUsername(
                                e.target.value
                            )
                        }


                        className="
                        w-full
                        border
                        rounded-xl
                        px-4
                        py-3
                        outline-none
                        focus:ring-2
                        focus:ring-blue-500
                        "

                        placeholder="Usuario"

                        />



                    </div>







                    <div>


                        <label
                        className="
                        block
                        mb-2
                        font-medium
                        "
                        >

                            Contraseña

                        </label>




                        <input


                        type="password"


                        value={password}


                        onChange={
                            e=>setPassword(
                                e.target.value
                            )
                        }



                        className="
                        w-full
                        border
                        rounded-xl
                        px-4
                        py-3
                        outline-none
                        focus:ring-2
                        focus:ring-blue-500
                        "


                        placeholder="Contraseña"


                        />



                    </div>






                    <button


                    disabled={loading}


                    className="
                    w-full
                    bg-blue-600
                    text-white
                    py-3
                    rounded-xl
                    hover:bg-blue-700
                    disabled:opacity-50
                    "


                    >



                    {
                        loading
                        ?
                        "Ingresando..."
                        :
                        "Ingresar"
                    }


                    </button>





                </div>







            </form>



        </main>


    );


}