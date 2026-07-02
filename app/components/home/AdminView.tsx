import Card from "@/app/components/home/Card";


export default function AdminView(){


return (

<div
className="
grid
md:grid-cols-3
gap-6
"
>


<Card
title="👥 Usuarios"
text="Gestiona empleados y accesos"
/>


<Card
title="📄 Certificaciones"
text="Genera certificados"
/>


<Card
title="⚙️ Administración"
text="Permisos y configuraciones"
/>



</div>

)

}