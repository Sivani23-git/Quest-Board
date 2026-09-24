import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { BarChart3, TrendingUp, Calendar, Zap, PieChart as PieIcon } from 'lucide-react';
import api from '../../services/api';

const COLORS = ['#6C63FF', '#00D4FF', '#22D3A0', '#F59E0B', '#EF4444', '#8B5CF6'];

export function AnalyticsPage() {
  const [xpHistory, setXpHistory] = useState([]);
  const [categoryStats, setCategoryStats] = useState({ byCategory: [], byDifficulty: [] });
  const [heatmap, setHeatmap] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const [historyRes, catRes, heatmapRes] = await Promise.all([
          api.get('/analytics/xp-history?days=30'),
          api.get('/analytics/category-stats'),
          api.get('/analytics/heatmap'),
        ]);

        setXpHistory(historyRes.data || []);
        setCategoryStats(catRes.data || { byCategory: [], byDifficulty: [] });
        setHeatmap(heatmapRes.data || []);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
          <BarChart3 className="w-7 h-7 text-brand-accent" />
          <span>Real-Time Analytics & Trends</span>
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Review your progression timeline, domain breakdowns, and productivity consistency metrics.
        </p>
      </div>

      {/* Main Chart: XP Growth Over Time */}
      <div className="p-6 rounded-2xl bg-bg-card border border-bg-border space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-accent" />
            <span>XP Accumulated (Last 30 Days)</span>
          </h2>
        </div>

        <div className="h-64 sm:h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={xpHistory}>
              <defs>
                <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#00D4FF" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  borderColor: '#1E2D45',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="xp"
                stroke="#00D4FF"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#xpGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Secondary Charts: Category & Difficulty Distribution */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="p-6 rounded-2xl bg-bg-card border border-bg-border space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-emerald-400" />
            <span>Quests by Domain</span>
          </h2>

          <div className="h-64 flex items-center justify-center">
            {categoryStats.byCategory.length === 0 ? (
              <p className="text-xs text-text-muted">Complete quests to populate category metrics.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryStats.byCategory}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryStats.byCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111827',
                      borderColor: '#1E2D45',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="p-6 rounded-2xl bg-bg-card border border-bg-border space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Completed Difficulty Tiers</span>
          </h2>

          <div className="h-64 flex items-center justify-center">
            {categoryStats.byDifficulty.length === 0 ? (
              <p className="text-xs text-text-muted">
                Complete quests to populate difficulty metrics.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryStats.byDifficulty}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryStats.byDifficulty.map((entry, index) => (
                      <Cell key={`cell-diff-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111827',
                      borderColor: '#1E2D45',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
