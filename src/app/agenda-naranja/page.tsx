"use client";

import SheetData from '@/components/sheet-data';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const AgendaNaranjaPage = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <h1 className="text-2xl font-bold p-4 md:p-8">Agenda Naranja</h1>
        <SheetData displayAs="cards" />
      </div>
    </DndProvider>
  );
};

export default AgendaNaranjaPage;
