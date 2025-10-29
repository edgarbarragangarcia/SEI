"use client";"use client";"use client";



import { useEffect, useState } from "react";

import { DndProvider, useDrag, useDrop } from 'react-dnd';

import { HTML5Backend } from 'react-dnd-html5-backend';import { useEffect, useState } from "react";import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";

import { useToast } from "@/hooks/use-toast";import { DndProvider, useDrag, useDrop } from 'react-dnd';import { DndProvider, useDrag, useDrop } from 'react-dnd';

import React from "react";

import { Header } from "@/components/header";import { HTML5Backend } from 'react-dnd-html5-backend';import { HTML5Backend } from 'react-dnd-html5-backend';



const ItemTypes = {import { useSession } from "next-auth/react";import { useSession } from "next-auth/react";

  CARD: 'card',

};import { useToast } from "@/hooks/use-toast";import { useToast } from "@/hooks/use-toast";



const states = ["ATENDIDA", "AGENDADA", "PENDIENTE", "RECHAZA", "NO ASISTIO", "ASISTIO"];import React from "react";import React from "react";



const Card = ({ patient }: { patient: any }) => {import { Header } from "@/components/header";

  const [{ isDragging }, drag] = useDrag(() => ({

    type: ItemTypes.CARD,const ItemTypes = {

    item: { patient },

    collect: (monitor) => ({const ItemTypes = {  CARD: 'card',

      isDragging: !!monitor.isDragging(),

    }),  CARD: 'card',};

  }));

};

  return (

    <divconst states = ["ATENDIDA", "AGENDADA", "PENDIENTE", "RECHAZA", "NO ASISTIO", "ASISTIO"];

      ref={drag as unknown as React.Ref<HTMLDivElement>}

      className={`p-4 mb-4 bg-white rounded-lg shadow-md ${isDragging ? 'opacity-50' : 'opacity-100'}`}const states = ["ATENDIDA", "AGENDADA", "PENDIENTE", "RECHAZA", "NO ASISTIO", "ASISTIO"];

    >

      <h4 className="font-bold">{`${patient.nombre} ${patient.apellidop} ${patient.apellidom}`}</h4>const Card = ({ patient, onDrop }: { patient: any, onDrop: (p: any, state: string) => void }) => {

      <p className="text-sm text-gray-600">{patient.email}</p>

      <p className="text-sm text-gray-800">{patient.nhcdefinitivo}</p>const Card = ({ patient }: { patient: any }) => {  const [{ isDragging }, drag] = useDrag(() => ({

    </div>

  );  const [{ isDragging }, drag] = useDrag(() => ({    type: ItemTypes.CARD,

};

    type: ItemTypes.CARD,    item: { patient },

const Column = ({ state, patients, onDrop }: { state: string, patients: any[], onDrop: (p: any, state: string) => void }) => {

  const [{ isOver }, drop] = useDrop(() => ({    item: { patient },    collect: (monitor) => ({

    accept: ItemTypes.CARD,

    drop: (item: { patient: any }) => onDrop(item.patient, state),    collect: (monitor) => ({      isDragging: !!monitor.isDragging(),

    collect: (monitor) => ({

      isOver: !!monitor.isOver(),      isDragging: !!monitor.isDragging(),    }),

    }),

  }));    }),  }));



  return (  }));

    <div ref={drop as unknown as React.Ref<HTMLDivElement>} className={`w-1/5 p-4 bg-gray-100 rounded-lg ${isOver ? 'bg-gray-200' : ''}`}>

      <h3 className="font-bold mb-4 text-center">{state}</h3>  return (

      {patients.map((patient, index) => (

        <Card key={index} patient={patient} />  return (    <div

      ))}

    </div>    <div      ref={drag as unknown as React.Ref<HTMLDivElement>}

  );

};      ref={drag as unknown as React.Ref<HTMLDivElement>}      className={`p-4 mb-4 bg-white rounded-lg shadow-md ${isDragging ? 'opacity-50' : 'opacity-100'}`}



export default function KanbanPage() {      className={`p-4 mb-4 bg-white rounded-lg shadow-md ${isDragging ? 'opacity-50' : 'opacity-100'}`}    >

  const [patients, setPatients] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(true);    >      <h4 className="font-bold">{`${patient.Nombre} ${patient.ApellidoP} ${patient.ApellidoM}`}</h4>

  const { data: session, status } = useSession();

  const { toast } = useToast();      <h4 className="font-bold">{`${patient.nombre} ${patient.apellidop} ${patient.apellidom}`}</h4>      <p className="text-sm text-gray-600">{patient.pac_email}</p>



  useEffect(() => {      <p className="text-sm text-gray-600">{patient.email}</p>      <p className="text-sm text-gray-800">{patient.NHCDefinitivo}</p>

    const fetchData = () => {

      setIsLoading(true);      <p className="text-sm text-gray-800">{patient.nhcdefinitivo}</p>    </div>

      fetch('/api/sheets')

        .then(res => res.json())      <p className="text-xs text-gray-500 mt-2">{patient.sucursal}</p>  );

        .then(data => {

          if (data && data.length > 1) {    </div>};

            const headers = data[0].map((h: string) => h ? h.trim().toLowerCase() : '');

            const rows = data.slice(1).map((row: any, index: number) => {  );

              const rowData: Record<string, any> = { originalIndex: index + 2 };

              headers.forEach((header: string, i: number) => {};const Column = ({ state, patients, onDrop }: { state: string, patients: any[], onDrop: (p: any, state: string) => void }) => {

                rowData[header] = row[i];

              });  const [{ isOver }, drop] = useDrop(() => ({

              return rowData;

            });const Column = ({ state, patients, onDrop }: { state: string, patients: any[], onDrop: (p: any, state: string) => void }) => {    accept: ItemTypes.CARD,



            const user = session?.user;  const [{ isOver }, drop] = useDrop(() => ({    drop: (item: { patient: any }) => onDrop(item.patient, state),

            if (!user) {

              setPatients([]);    accept: ItemTypes.CARD,    collect: (monitor) => ({

              setIsLoading(false);

              return;    drop: (item: { patient: any }) => onDrop(item.patient, state),      isOver: !!monitor.isOver(),

            }

    collect: (monitor) => ({    }),

            const sucursalHeader = 'sucursal';

            let filteredRows = rows;      isOver: !!monitor.isOver(),  }));



            if (user.email === 'eabarragang@ingenes.com') {    }),

              filteredRows = rows.filter((p: any) => p[sucursalHeader]?.trim().toLowerCase() === 'monterrey');

            } else if (user.role !== 'Admin' && user.sucursal) {  }));  return (

              filteredRows = rows.filter((p: any) => p[sucursalHeader]?.trim().toLowerCase() === user.sucursal?.toLowerCase());

            }    <div ref={drop as unknown as React.Ref<HTMLDivElement>} className={`w-1/5 p-4 bg-gray-100 rounded-lg ${isOver ? 'bg-gray-200' : ''}`}>

            

            setPatients(filteredRows);  return (      <h3 className="font-bold mb-4 text-center">{state}</h3>

          } else {

            setPatients([]);    <div ref={drop as unknown as React.Ref<HTMLDivElement>} className={`w-1/5 p-4 bg-gray-100 rounded-lg ${isOver ? 'bg-gray-200' : ''}`}>      {patients.map((patient, index) => (

          }

        })      <h3 className="font-bold mb-4 text-center">{state}</h3>        <Card key={index} patient={patient} onDrop={onDrop} />

        .catch(() => {

          toast({ title: 'Error', description: 'No se pudieron cargar los datos.', variant: 'destructive' });      {patients.map((patient) => (      ))}

          setPatients([]);

        })        <Card key={patient.originalIndex} patient={patient} />    </div>

        .finally(() => {

          setIsLoading(false);      ))}  );

        });

    };    </div>};



    if (status === 'authenticated') {  );

      fetchData();

    }};export default function KanbanPage() {

  }, [status, session, toast]);

  const [patients, setPatients] = useState<any[]>([]);

  const handleDrop = async (patient: any, newState: string) => {

    try {export default function KanbanPage() {  const [isLoading, setIsLoading] = useState(true);

      const response = await fetch('/api/sheets', {

        method: 'POST',  const [patients, setPatients] = useState<any[]>([]);  const { data: session, status } = useSession();

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({  const [isLoading, setIsLoading] = useState(true);  const { toast } = useToast();

          rowIndex: patient.originalIndex,

          header: 'estado',  const { data: session, status } = useSession();

          value: newState,

        }),  const { toast } = useToast();  const fetchData = () => {

      });

    setIsLoading(true);

      if (!response.ok) {

        throw new Error('El servidor respondió con un error');  useEffect(() => {    fetch('/api/sheets')

      }

    const fetchData = () => {      .then(res => res.json())

      toast({ title: 'Éxito', description: 'El estado del paciente ha sido actualizado.' });

            if (status !== 'authenticated') {      .then(data => {

      // Optimistic update

      setPatients(prev => prev.map(p => p.originalIndex === patient.originalIndex ? { ...p, estado: newState } : p));        setIsLoading(false);        if (data && data.length > 1) {



    } catch (error) {        return;          const headers = data[0];

      toast({ title: 'Error', description: 'No se pudo actualizar el estado del paciente.', variant: 'destructive' });

    }      }          const rows = data.slice(1).map((row: any, index: number) => {

  };

                  const rowData: Record<string, any> = { originalIndex: index + 2 };

  if (status === 'loading' || isLoading) {

    return (      setIsLoading(true);            headers.forEach((header: string, i: number) => {

      <>

        <Header />      fetch('/api/sheets')              rowData[header] = row[i];

        <div className="flex items-center justify-center" style={{height: 'calc(100vh - 4rem)'}}>

            <p>Cargando datos...</p>        .then(res => res.json())            });

        </div>

      </>        .then(data => {            return rowData;

    );

  }          if (data && data.length > 1) {          });



  return (            const headers = data[0].map((h: string) => h.trim().toLowerCase());          setPatients(rows);

    <>

      <Header />            const rows = data.slice(1).map((row: any, index: number) => {        } else {

      <DndProvider backend={HTML5Backend}>

        <div className="flex p-4 space-x-4 bg-gray-50" style={{height: 'calc(100vh - 4rem)'}}>              const rowData: Record<string, any> = { originalIndex: index + 2 };          setPatients([]);

          {states.map(state => (

            <Column              headers.forEach((header: string, i: number) => {        }

              key={state}

              state={state}                rowData[header] = row[i];      })

              patients={patients.filter(p => p.estado === state)}

              onDrop={handleDrop}              });      .catch(() => {

            />

          ))}              return rowData;        toast({ title: 'Error', description: 'No se pudieron cargar los datos.', variant: 'destructive' });

        </div>

      </DndProvider>            });      })

    </>

  );      .finally(() => {

}
            const user = session?.user;        setIsLoading(false);

            let filteredRows = rows;      });

            if (user) {  };

              const sucursalHeader = 'sucursal';

              if (user.email === 'eabarragang@ingenes.com') {  useEffect(() => {

                filteredRows = rows.filter((p: any) => p[sucursalHeader]?.trim().toLowerCase() === 'monterrey');    if (status === 'authenticated') {

              } else if (user.role !== 'Admin' && user.sucursal) {      fetchData();

                filteredRows = rows.filter((p: any) => p[sucursalHeader]?.trim().toLowerCase() === user.sucursal?.toLowerCase());    }

              }  }, [status]);

            }

            setPatients(filteredRows);  const handleDrop = async (patient: any, newState: string) => {

          } else {    try {

            setPatients([]);      const response = await fetch('/api/sheets', {

          }        method: 'POST',

        })        headers: { 'Content-Type': 'application/json' },

        .catch(() => {        body: JSON.stringify({

          toast({ title: 'Error', description: 'No se pudieron cargar los datos.', variant: 'destructive' });          rowIndex: patient.originalIndex,

          setPatients([]);          header: 'ESTADO',

        })          value: newState,

        .finally(() => setIsLoading(false));        }),

    };      });

    fetchData();

  }, [status, session, toast]);      if (!response.ok) {

        throw new Error('El servidor respondió con un error');

  const handleDrop = async (patient: any, newState: string) => {      }

    try {

      const response = await fetch('/api/sheets', {      toast({ title: 'Éxito', description: 'El estado del paciente ha sido actualizado.' });

        method: 'POST',      fetchData(); // Recargar los datos para mostrar el cambio

        headers: { 'Content-Type': 'application/json' },    } catch (error) {

        body: JSON.stringify({      toast({ title: 'Error', description: 'No se pudo actualizar el estado del paciente.', variant: 'destructive' });

          rowIndex: patient.originalIndex,    }

          header: 'ESTADO',  };

          value: newState,

        }),  if (isLoading) {

      });    return (

        <div className="flex items-center justify-center min-h-screen">

      if (!response.ok) throw new Error('Failed to update');            <p>Cargando datos...</p>

        </div>

      toast({ title: 'Éxito', description: 'El estado del paciente ha sido actualizado.' });    );

      setPatients(prev => prev.map(p => p.originalIndex === patient.originalIndex ? { ...p, estado: newState } : p));  }

    } catch (error) {

      toast({ title: 'Error', description: 'No se pudo actualizar el estado del paciente.', variant: 'destructive' });  return (

    }    <DndProvider backend={HTML5Backend}>

  };      <div className="flex min-h-screen p-4 space-x-4 bg-gray-50">

        {states.map(state => (

  if (isLoading) {          <Column

    return (            key={state}

      <>            state={state}

        <Header />            patients={patients.filter(p => p.ESTADO === state)}

        <div className="flex items-center justify-center" style={{height: 'calc(100vh - 4rem)'}}><p>Cargando datos...</p></div>            onDrop={handleDrop}

      </>          />

    );        ))}

  }      </div>

    </DndProvider>

  return (  );

    <>}
      <Header />
      <DndProvider backend={HTML5Backend}>
        <div className="flex p-4 space-x-4 bg-gray-50" style={{height: 'calc(100vh - 4rem)'}}>
          {states.map(state => (
            <Column
              key={state}
              state={state}
              patients={patients.filter(p => p.estado && p.estado.trim().toUpperCase() === state)}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </DndProvider>
    </>
  );
}