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
      return { id: row.NHCDEFINITIVO, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const fullName = `${row['NOMBRE'] || ''} ${row['APELLIDOP'] || ''} ${row['APELLIDOM'] || ''}`.trim().toUpperCase();

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }} className="mb-4">
      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold">{fullName || 'No Name'}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow space-y-2 text-sm">
          {row['EMAIL'] && (
            <div className="flex items-center text-muted-foreground">
              <Mail className="mr-2 h-4 w-4" />
              <span>{row['EMAIL']}</span>
            </div>
          )}
          {row['NHCDEFINITIVO'] && (
            <div className="flex items-center text-muted-foreground">
              <Hash className="mr-2 h-4 w-4" />
              <span>{row['NHCDEFINITIVO']}</span>
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
}

const StatusColumn: React.FC<StatusColumnProps> = ({ title, cards, moveCard, status, updateCardStatus, data }) => {
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
    <div ref={ref} className="bg-gray-100/50 dark:bg-gray-800/50 rounded-lg p-4 w-full md:w-1/4 min-h-[200px]">
      <h3 className="font-bold text-lg mb-4">{title}</h3>
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
    const cardsByStatus = statuses.reduce((acc, status) => {
      acc[status] = data.filter(card => card.ESTADO && card.ESTADO.toUpperCase() === status);
      return acc;
    }, {} as Record<string, CardData[]>);

    return (
      <div className="flex flex-col md:flex-row gap-4 p-4 md:p-8">
        {statuses.map(status => (
          <StatusColumn
            key={status}
            title={status}
            status={status}
            cards={cardsByStatus[status] || []}
            moveCard={moveCard}
            updateCardStatus={updateCardStatus}
            data={data}
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
