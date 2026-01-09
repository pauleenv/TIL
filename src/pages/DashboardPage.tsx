"use client";

import React, { useEffect, useState } from "react";
import { useSession } from '@/components/SessionContextProvider';
import { LearnedEntry, getEntries } from "@/lib/data-store";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, Sector } from "recharts";
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

// Updated COLORS array for Chokbaromètre diagram
const CHOKBAROMETER_COLORS = ['#C991FF40', '#C991FF80', '#C991FFBF', '#C991FF'];
const SUBJECT_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658']; // Keep existing for subjects

// Custom shape for pie chart segments with rounded corners
const RoundedPieSegment = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, stroke, strokeWidth } = props;
  
  // Calculate path for rounded corners
  const RADIAN = Math.PI / 180;
  const cornerRadius = 16;
  
  // Convert angles to radians
  const startAngleRad = startAngle * RADIAN;
  const endAngleRad = endAngle * RADIAN;
  
  // Calculate points
  const x1 = cx + outerRadius * Math.cos(startAngleRad);
  const y1 = cy + outerRadius * Math.sin(startAngleRad);
  
  const x2 = cx + outerRadius * Math.cos(endAngleRad);
  const y2 = cy + outerRadius * Math.sin(endAngleRad);
  
  const x3 = cx + innerRadius * Math.cos(endAngleRad);
  const y3 = cy + innerRadius * Math.sin(endAngleRad);
  
  const x4 = cx + innerRadius * Math.cos(startAngleRad);
  const y4 = cy + innerRadius * Math.sin(startAngleRad);
  
  // Calculate arc flags
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  
  // Create path with rounded corners
  const path = `
    M ${cx},${cy}
    L ${x1},${y1}
    A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2},${y2}
    L ${x3},${y3}
    A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4},${y4}
    Z
  `;
  
  return (
    <g>
      <path
        d={path}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </g>
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
    setChokbarometerData(chokbarometerChartData);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-180px)]">Chargement du tableau de bord...</div>;
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-180px)] text-muted-foreground">Veuillez vous connecter pour voir votre tableau de bord.</div>;
  }

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
                <BarChart data={subjectsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Nombre d'entrées">
                    {subjectsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={subjectColors[entry.name]?.background || SUBJECT_COLORS[index % SUBJECT_COLORS.length]} />
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
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/2">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chokbarometerData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        stroke="black"
                        strokeWidth={2}
                        shape={RoundedPieSegment}
                      >
                        {chokbarometerData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={CHOKBAROMETER_COLORS[index % CHOKBAROMETER_COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2 flex flex-col items-center justify-center space-y-4">
                  {chokbarometerData.map((item, index) => (
                    <div key={item.name} className="flex items-center w-full">
                      <div className="w-16 h-16 flex items-center justify-center">
                        <Chokbarometer level={item.level} size="sm" />
                      </div>
                      <div className="ml-2">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.count} entrées</p>
                      </div>
                    </div>
                  ))}
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