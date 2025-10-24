"use client";

import React, { useEffect, useState } from "react";
import { useSession } from '@/components/SessionContextProvider';
import { LearnedEntry, getEntries } from "@/lib/data-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { subjectColors } from "@/lib/subject-colors"; // Import subjectColors

interface SubjectData {
  name: string;
  count: number;
}

interface ChokbarometerData {
  name: string;
  count: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658']; // Keep for chokbarometer

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
    const chokbarometerChartData = Object.entries(chokbarometerCounts).map(([name, count]) => ({ name, count }));
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
        <Card className="bg-white border-2 border-black shadow-custom-black-lg rounded-[16px]"> {/* Applied new styles */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total des Entrées</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allEntries.length}</div>
            <p className="text-xs text-muted-foreground">Entrées d'apprentissage enregistrées</p>
          </CardContent>
        </Card>
        {/* Add more summary cards if needed */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white border-2 border-black shadow-custom-black-lg rounded-[16px]"> {/* Applied new styles */}
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
                      <Cell key={`cell-${index}`} fill={subjectColors[entry.name]?.background || COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center">Aucune donnée de matière disponible.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white border-2 border-black shadow-custom-black-lg rounded-[16px]"> {/* Applied new styles */}
          <CardHeader>
            <CardTitle>Répartition du Chokbaromètre</CardTitle>
          </CardHeader>
          <CardContent>
            {chokbarometerData.length > 0 ? (
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
                  >
                    {chokbarometerData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center">Aucune donnée de chokbaromètre disponible.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;