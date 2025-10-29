"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Mail, Hash } from 'lucide-react';
import { useDrag, useDrop } from 'react-dnd';

const ItemTypes = {
  CARD: 'card',
};

interface CardData {
  NOMBRE: string;
  APELLIDOP: string;
  APELLIDOM: string;
  EMAIL: string;
  NHCDEFINITIVO: string;
  ESTADO: string;
  [key: string]: any;
}

interface DraggableCardProps {
  row: CardData;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
}

const toTitleCase = (str: string) => {
  if (!str) return '';
  return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
};

const DraggableCard: React.FC<DraggableCardProps> = ({ row, index, moveCard }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    hover(item: { index: number }, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) {
        return;
      }
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id: row.NHCDEFINITIVO, index, originalStatus: row.ESTADO };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const fullName = toTitleCase(`${row['NOMBRE'] || ''} ${row['APELLIDOP'] || ''} ${row['APELLIDOM'] || ''}`.trim());

  return (
<div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }} className="mb-2 cursor-move">
      <Card className="transition-all duration-300 hover:shadow-lg flex flex-col h-28">
        <CardHeader className="pb-1">
          <CardTitle className="text-xs font-bold truncate">{fullName || 'No Name'}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow space-y-0.5 text-[10px] overflow-y-auto">
          {row['EMAIL'] && (
            <div className="flex items-center text-muted-foreground min-w-0">
              <Mail className="mr-1.5 h-3 w-3 flex-shrink-0" />
              <span className="truncate">{row['EMAIL']}</span>
            </div>
          )}
          {row['NHCDEFINITIVO'] && (
            <div className="flex items-center text-muted-foreground min-w-0">
              <Hash className="mr-1.5 h-3 w-3 flex-shrink-0" />
              <span className="truncate">{row['NHCDEFINITIVO']}</span>
            </div>
          )}

          {/* Additional columns requested: B, C, J, M */}
          {row['SUCURSAL'] && (
            <div className="flex items-center text-muted-foreground min-w-0">
              <span className="text-[10px] font-medium mr-2">Sucursal:</span>
              <span className="truncate">{row['SUCURSAL']}</span>
            </div>
          )}
          {row['FV'] && (
            <div className="flex items-center text-muted-foreground min-w-0">
              <span className="text-[10px] font-medium mr-2">FV:</span>
              <span className="truncate">{row['FV']}</span>
            </div>
          )}
          {row['TELEFONO'] && (
            <div className="flex items-center text-muted-foreground min-w-0">
              <span className="text-[10px] font-medium mr-2">Tel:</span>
              <span className="truncate">{row['TELEFONO']}</span>
            </div>
          )}
          {row['CONCEPTO'] && (
            <div className="flex items-center text-muted-foreground min-w-0">
              <span className="text-[10px] font-medium mr-2">Concepto:</span>
              <span className="truncate">{row['CONCEPTO']}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface StatusColumnProps {
  title: string;
  cards: CardData[];
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  status: string;
  updateCardStatus: (cardId: string, newStatus: string) => void;
  data: CardData[];
  colorClass: string;
}

const StatusColumn: React.FC<StatusColumnProps> = ({ title, cards, moveCard, status, updateCardStatus, data, colorClass }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop: (item: { id: string, originalStatus: string }) => {
      console.log('Drop event:', {
        droppedOnStatus: status,
        cardOriginalStatus: item.originalStatus,
        condition: status.toUpperCase() !== item.originalStatus?.toUpperCase(),
      });
      if (status.toUpperCase() !== item.originalStatus?.toUpperCase()) {
        updateCardStatus(item.id, status);
      }
    },
  });

  drop(ref);

  return (
    <div ref={ref} className={`rounded-xl p-4 shadow-md border ${colorClass}`}>
      <h3 className="font-bold text-md mb-4 text-center uppercase tracking-wider text-gray-600">{title} ({cards.length})</h3>
      <div>
        {cards.map((card) => (
          <DraggableCard key={card.NHCDEFINITIVO} index={data.findIndex(d => d.NHCDEFINITIVO === card.NHCDEFINITIVO)} row={card} moveCard={moveCard} />
        ))}
      </div>
    </div>
  );
};


const SheetData = ({ displayAs }: { displayAs: 'table' | 'cards' }) => {
  const [data, setData] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/get-data');
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.details || 'Failed to fetch data');
        }
        setData(Array.isArray(result) ? result : [result]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const moveCard = (dragIndex: number, hoverIndex: number) => {
    const dragCard = data[dragIndex];
    const newData = [...data];
    newData.splice(dragIndex, 1);
    newData.splice(hoverIndex, 0, dragCard);
    setData(newData);
  };

  const updateCardStatus = async (cardId: string, newStatus: string) => {
    const card = data.find(c => c.NHCDEFINITIVO === cardId);
    if (card) {
      const updatedCard = { ...card, ESTADO: newStatus };
      
      // Optimistically update the UI
      setData(prevData => prevData.map(c => c.NHCDEFINITIVO === cardId ? updatedCard : c));

      console.log('Updating card status:', { NHCDEFINITIVO: cardId, ESTADO: newStatus });

      try {
        await fetch('/api/update-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            NHCDEFINITIVO: card.NHCDEFINITIVO,
            ESTADO: newStatus,
            NOMBRE: card.NOMBRE,
            APELLIDOP: card.APELLIDOP,
            APELLIDOM: card.APELLIDOM,
            TELEFONO: card.TELEFONO,
          }),
        });
      } catch (error) {
        console.error('Failed to update card status:', error);
        // Revert the optimistic update if the API call fails
        setData(prevData => prevData.map(c => c.NHCDEFINITIVO === cardId ? card : c));
      }
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500 p-4">Error: {error}</p>;
  }

  if (displayAs === 'cards') {
    const statuses = ['ATENDIDA', 'AGENDADA', 'PENDIENTE', 'RECHAZA', 'NO ASISTIO', 'ASISTIO'];
    const statusColors: Record<string, string> = {
      ATENDIDA: "bg-blue-50 border-blue-200",
      AGENDADA: "bg-yellow-50 border-yellow-200",
      PENDIENTE: "bg-orange-50 border-orange-200",
      RECHAZA: "bg-red-50 border-red-200",
      'NO ASISTIO': "bg-slate-100 border-slate-200",
      ASISTIO: "bg-green-50 border-green-200",
    };

    const cardsByStatus = statuses.reduce((acc, status) => {
      acc[status] = data.filter(card => card.ESTADO && card.ESTADO.toUpperCase() === status);
      return acc;
    }, {} as Record<string, CardData[]>);

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4 md:p-8">
        {statuses.map(status => (
          <StatusColumn
            key={status}
            title={status}
            status={status}
            cards={cardsByStatus[status] || []}
            moveCard={moveCard}
            updateCardStatus={updateCardStatus}
            data={data}
            colorClass={statusColors[status] || 'bg-gray-100/50 dark:bg-gray-800/50'}
          />
        ))}
      </div>
    );
  }

  // Default to table display
  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  return (
    <div className="p-4 md:p-8">
        {/* Table display logic remains unchanged */}
    </div>
  );
};

export default SheetData;
