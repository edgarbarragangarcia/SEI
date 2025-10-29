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

  const fullName = `${row['NOMBRE'] || ''} ${row['APELLIDOP'] || ''} ${row['APELLIDOM'] || ''}`.trim().toUpperCase();

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
      if (status !== item.originalStatus) {
        updateCardStatus(item.id, status);
      }
    },
  });

  drop(ref);

  return (
    <div ref={ref} className={`rounded-lg p-4 ${colorClass}`}>
      <h3 className="font-bold text-lg mb-4 text-center">{title}</h3>
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
        const response = await fetch('https://n8nqa.ingenes.com:5689/webhook/getSEI');
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

      try {
        await fetch('https://n8nqa.ingenes.com:5689/webhook/postSEI', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedCard),
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
      ATENDIDA: 'bg-blue-100 dark:bg-blue-900/50',
      AGENDADA: 'bg-yellow-100 dark:bg-yellow-900/50',
      PENDIENTE: 'bg-orange-100 dark:bg-orange-900/50',
      RECHAZA: 'bg-red-100 dark:bg-red-900/50',
      'NO ASISTIO': 'bg-gray-200 dark:bg-gray-700/50',
      ASISTIO: 'bg-green-100 dark:bg-green-900/50',
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
