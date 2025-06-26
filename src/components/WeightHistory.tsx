import React, { useState } from 'react';
import { useProgressTracking } from '@/hooks/useProgressTracking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Weight } from 'lucide-react';

const WeightHistory: React.FC = () => {
    const { progressHistory, addOrUpdateDailyProgress, userProfile, loading } = useProgressTracking();
    const [weight, setWeight] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const weightValue = parseFloat(weight);
        if (isNaN(weightValue) || weightValue <= 0 || weightValue > 300) {
            setError('Inserisci un valore di peso valido (es. 75.5).');
            return;
        }
        addOrUpdateDailyProgress({ weight: weightValue });
        setWeight('');
        setError('');
    };

    const sortedProgress = [...progressHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const chartData = sortedProgress
        .filter(p => p.weight !== null && p.weight !== undefined)
        .map(p => ({
            date: format(new Date(p.date), 'dd/MM'),
            Peso: p.weight,
        }));

    // Determina il dominio (min/max) per l'asse Y per dare un po' di respiro al grafico
    const weightValues = chartData.map(d => d.Peso).filter(v => v != null) as number[];
    const yDomain = weightValues.length > 0 ? [Math.min(...weightValues) - 2, Math.max(...weightValues) + 2] : ['auto', 'auto'];

    if (loading || !userProfile) {
        return <div>Caricamento...</div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Weight className="mr-2" /> Storico Peso Corporeo
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {chartData.length > 1 ? (
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis domain={yDomain} unit="kg" />
                                <Tooltip formatter={(value) => [`${value} kg`, "Peso"]} />
                                <Legend />
                                <Line type="monotone" dataKey="Peso" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <Alert>
                        <AlertDescription>
                            Aggiungi almeno due misurazioni di peso per visualizzare il grafico dei progressi.
                        </AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="font-semibold">Aggiungi misurazione odierna</p>
                    <div className="flex items-center space-x-2">
                        <Input
                            type="number"
                            step="0.1"
                            placeholder={`Peso di oggi (in kg)`}
                            value={weight}
                            onChange={(e) => {
                                setWeight(e.target.value);
                                if(error) setError('');
                            }}
                            className="w-full"
                        />
                        <Button type="submit">Salva</Button>
                    </div>
                     {error && <p className="text-sm text-red-500">{error}</p>}
                </form>
            </CardContent>
        </Card>
    );
};

export default WeightHistory; 