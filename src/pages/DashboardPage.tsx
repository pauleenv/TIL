"use client";

import React, { useEffect, useState } from "react";
import { useSession } from '@/components/SessionContextProvider';
import { LearnedEntry, getEntries } from "@/lib/data-store";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, } from "recharts";
import { BarChart3 } from "lucide-react";
import { subjectColors } from "@/lib/subject-colors";
import EntryCardWrapper from "@/components/EntryCardWrapper";
import Chokbarometer from "@/components/Chokbarometer";

interface SubjectData {
  name: string;
  count: number;
}

interface ChokbarometerData {
  name: string;
  count: number;
  level: "Intéressant" | "Surprenant" | "Incroyable" | "Chokbar";
}

// Using distinct, fully opaque colors for Chokbaromètre diagram
const CHOKBAROMETER_COLORS = [
  subjectColors["Sciences"].background, // Corresponds to "Intéressant"
  subjectColors["Histoire"].background, // Corresponds to "Surprenant"
  subjectColors["Tech"].background,     // Corresponds to "Incroyable"
  subjectColors["Sports"].background    // Corresponds to "Chokbar"
];
const SUBJECT_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658']; // Keep existing for subjects

// Custom label component for the PieChart
const CustomPieChartLabel = ({ cx, cy, midAngle, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 20; // Position labels slightly outside the pie
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="black" // Ensure label text is black
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      filter="none" // Explicitly remove any inherited SVG filter (shadow)
      className="text-sm font-medium" // Apply Tailwind classes for styling
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// Custom Legend component
interface CustomLegendProps {
  payload?: Array<{
    value: string; // The name of the legend item (e.g., "Intéressant")
    color?: string; // The color of the item
    payload?: ChokbarometerData; // The original data payload
  }>;
}

const CustomLegend: React.FC<CustomLegendProps> = ({ payload }) => {
  return (
    <ul className="flex flex-row flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
      {payload?.map((entry, index) => (
        <li key={`item-${index}`} className="flex items-center space-x-2">
          <div
            className="w-8 h-4 border-2 border-black rounded-[5px] drop-shadow-custom-black"
            style={{ backgroundColor: entry.color }}
          ></div>
          <span className="text-black">{entry.value}</span>
        </li>
      ))}
    </ul>
  );
};


const DashboardPage = () => {
  const { user, loading } = useSession();
  const [allEntries, setAllEntries] = useState<LearnedEntry[]>([]);
  const [subjectsData, setSubjectsData] = useState<SubjectData[]>([]);
  const [chokbarometerData, setChokbarometerData] = useState<ChokbarometerData[]>([]);

  useEffect(() => {
    const fetchAndProcessEntries = async () => {
      if (user) {
        const entries = await getEntries(user.id);
        setAllEntries(entries);
        processChartData(entries);
      }
    };

    if (!loading && user) {
      fetchAndProcessEntries();
    }
  }, [user, loading]);

  const processChartData = (entries: LearnedEntry[]) => {
    // Process subjects data
    const subjectCounts: { [key: string]: number } = {};
    entries.forEach(entry => {
      subjectCounts[entry.subject] = (subjectCounts[entry.subject] || 0) + 1;
    });
    const subjectsChartData = Object.entries(subjectCounts).map(([name, count]) => ({ name, count }));
    setSubjectsData(subjectsChartData);

    // Process chokbarometer data
    const chokbarometerCounts: { [key: string]: number } = {};
    entries.forEach(entry => {
      chokbarometerCounts[entry.chokbarometer] = (chokbarometerCounts[entry.chokbarometer] || 0) + 1;
    });
    // Ensure consistent order for colors
    const orderedChokbarometerLevels: ("Intéressant" | "Surprenant" | "Incroyable" | "Chokbar")[] = ["Intéressant", "Surprenant", "Incroyable", "Chokbar"];
    const chokbarometerChartData = orderedChokbarometerLevels
      .map(level => ({
        name: level,
        count: chokbarometerCounts[level] || 0,
        level: level
      }))
      .filter(item => item.count > 0); // Only include levels that have entries
    setChokbarometerData(chokbarometerData);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-180px)]">Chargement du tableau de bord...</div>;
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-180px)] text-muted-foreground">Veuillez vous connecter pour voir votre tableau de bord.</div>;
  }

  // Calculate Y-axis ticks to show only whole numbers
  const maxYValue = Math.max(...subjectsData.map(d => d.count), 1);
  const yAxisTicks = Array.from({ length: maxYValue + 1 }, (_, i) => i);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Votre Tableau de Bord d'Apprentissage</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <EntryCardWrapper>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total des Entrées</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allEntries.length}</div>
            <p className="text-xs text-muted-foreground">Entrées d'apprentissage enregistrées</p>
          </CardContent>
        </EntryCardWrapper>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <EntryCardWrapper>
          <CardHeader>
            <CardTitle>Entrées par Matière</CardTitle>
          </CardHeader>
          <CardContent>
            {subjectsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={subjectsData} margin={{ top: 30, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <filter id="barChartShadow" x="-10%" y="0" width="120%" height="100%">
                      <feDropShadow dx="3" dy="2" stdDeviation="0" floodColor="black" />
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis 
                    domain={[0, maxYValue]} // Set domain from 0 to max value
                    ticks={yAxisTicks} // Explicitly set ticks to whole numbers
                    tickFormatter={(value) => value.toString()} // Format ticks as strings
                    allowDecimals={false} // Ensure no decimals
                  />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="count" 
                    name="Nombre d'entrées" 
                    stroke="black" 
                    strokeWidth={2} 
                    radius={[2, 2, 0, 0]} // Reduced corner radius for better visual
                    filter="url(#barChartShadow)" // Apply the custom SVG filter here
                  >
                    {subjectsData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={subjectColors[entry.name]?.background || SUBJECT_COLORS[index % SUBJECT_COLORS.length]} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center">Aucune donnée de matière disponible.</p>
            )}
          </CardContent>
        </EntryCardWrapper>
        <EntryCardWrapper>
          <CardHeader>
            <CardTitle>Répartition du Chokbaromètre</CardTitle>
          </CardHeader>
          <CardContent>
            {chokbarometerData.length > 0 ? (
              <div className="flex flex-col items-center gap-8"> {/* Centered the pie chart */}
                <div className="w-full max-w-[300px]"> {/* Constrained width for better centering */}
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <defs>
                        <filter id="pieChartShadow" x="-50%" y="-50%" width="200%" height="200%">
                          <feDropShadow dx="3" dy="2" stdDeviation="0" floodColor="black" />
                        </filter>
                      </defs>
                      <Pie
                        data={chokbarometerData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={CustomPieChartLabel} // Use the custom label component here
                        stroke="black"  // Add solid black border
                        strokeWidth={2}  // Border width to match card borders
                        cornerRadius={5} // Changed to 5px corner radius
                      >
                        {chokbarometerData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={CHOKBAROMETER_COLORS[index % CHOKBAROMETER_COLORS.length]} 
                            filter="url(#pieChartShadow)" // Apply the custom SVG filter here
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend content={<CustomLegend />} /> {/* Use the custom legend component here */}
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center">Aucune donnée de chokbaromètre disponible.</p>
            )}
          </CardContent>
        </EntryCardWrapper>
      </div>
    </div>
  );
};

export default DashboardPage;