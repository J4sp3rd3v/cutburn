import React, { useState } from 'react';
import { useProgressTracking } from '@/hooks/useProgressTracking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Target } from 'lucide-react';

const BodyFatHistory: React.FC = () => {
    const { progressHistory, addOrUpdateDailyProgress, userProfile, loading } = useProgressTracking();
    const [bodyFat, setBodyFat] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const bodyFatValue = parseFloat(bodyFat);
        if (isNaN(bodyFatValue) || bodyFatValue <= 2 || bodyFatValue > 50) {
            setError('Inserisci un valore di grasso corporeo valido (es. 12.5).');
            return;
        }
        addOrUpdateDailyProgress({ bodyFat: bodyFatValue });
        setBodyFat('');
        setError('');
    };

    const sortedProgress = [...progressHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const chartData = sortedProgress
        .filter(p => p.bodyFat !== null && p.bodyFat !== undefined)
        .map(p => ({
            date: format(new Date(p.date), 'dd/MM'),
            'Grasso Corporeo': p.bodyFat,
        }));

    const bodyFatValues = chartData.map(d => d['Grasso Corporeo']).filter(v => v != null) as number[];
    const yDomain = bodyFatValues.length > 0 ? [Math.min(...bodyFatValues) - 2, Math.max(...bodyFatValues) + 2] : ['auto', 'auto'];

    if (loading || !userProfile) {
        return <div>Caricamento...</div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Target className="mr-2" /> Storico Grasso Corporeo (BF%)
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {chartData.length > 1 ? (
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis domain={yDomain} unit="%" />
                                <Tooltip formatter={(value) => [`${value}%`, "Grasso Corporeo"]} />
                                <Legend />
                                <Line type="monotone" dataKey="Grasso Corporeo" stroke="#ef4444" strokeWidth={2} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <Alert>
                        <AlertDescription>
                            Aggiungi almeno due misurazioni di grasso corporeo per visualizzare il grafico dei progressi.
                        </AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="font-semibold">Aggiungi misurazione odierna</p>
                    <div className="flex items-center space-x-2">
                        <Input
                            type="number"
                            step="0.1"
                            placeholder={`BF% di oggi`}
                            value={bodyFat}
                            onChange={(e) => {
                                setBodyFat(e.target.value);
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

export default BodyFatHistory; 