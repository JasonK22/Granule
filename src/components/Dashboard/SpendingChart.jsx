import { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { PieChart as PieIcon, BarChart3, ChartPie } from 'lucide-react';
import {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateCategorySpending,
  getMonthTransactions,
} from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatCurrency';
import { getCategoryColor } from '../../utils/categoryMeta';
import './SpendingChart.css';

const buildTrailingMonths = () => {
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ year: d.getFullYear(), month: d.getMonth() });
  }
  return months;
};

export const SpendingChart = ({ transactions, allTransactions, currency }) => {
  const [view, setView] = useState('category');

  const categorySpending = calculateCategorySpending(transactions);
  const chartData = Object.entries(categorySpending).map(([category, amount]) => ({
    name: category,
    value: parseFloat(amount.toFixed(2)),
  }));

  const trendData = useMemo(() => {
    const months = buildTrailingMonths();
    return months.map(({ year, month }) => {
      const monthTx = getMonthTransactions(allTransactions || [], year, month);
      return {
        name: new Date(year, month, 1).toLocaleDateString('en-US', { month: 'short' }),
        Income: parseFloat(calculateTotalIncome(monthTx).toFixed(2)),
        Expenses: parseFloat(calculateTotalExpenses(monthTx).toFixed(2)),
      };
    });
  }, [allTransactions]);

  return (
    <div className="spending-chart-container">
      <div className="spending-chart-header">
        <h3>{view === 'category' ? 'Spending by category' : '6-month trend'}</h3>
        <div className="chart-toggle">
          <button
            className={view === 'category' ? 'active' : ''}
            onClick={() => setView('category')}
            title="Breakdown by category"
          >
            <PieIcon size={14} /> Category
          </button>
          <button
            className={view === 'trend' ? 'active' : ''}
            onClick={() => setView('trend')}
            title="Income vs expenses over time"
          >
            <BarChart3 size={14} /> Trend
          </button>
        </div>
      </div>

      {view === 'category' && (
        chartData.length === 0 ? (
          <div className="empty-state chart-empty">
            <div className="empty-state-icon"><ChartPie size={20} /></div>
            <h4>Nothing to chart yet</h4>
            <p>Log an expense this month and its category breakdown will show up here automatically.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={92}
                innerRadius={52}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={entry.name} fill={getCategoryColor(entry.name, index)} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatCurrency(value, currency)}
                contentStyle={{
                  backgroundColor: '#1a1206',
                  border: '1px solid #46381d',
                  borderRadius: '4px',
                  color: '#f4ebda',
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12, color: '#b6a88d' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )
      )}

      {view === 'trend' && (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={trendData} barGap={4}>
            <XAxis dataKey="name" stroke="#7c705a" fontSize={12} tickLine={false} axisLine={{ stroke: '#2c2313' }} />
            <YAxis stroke="#7c705a" fontSize={12} tickLine={false} axisLine={false} width={40} />
            <Tooltip
              formatter={(value) => formatCurrency(value, currency)}
              contentStyle={{
                backgroundColor: '#1a1206',
                border: '1px solid #46381d',
                borderRadius: '4px',
                color: '#f4ebda',
              }}
              cursor={{ fill: 'rgba(232,179,77,0.06)' }}
            />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: '#b6a88d' }} />
            <Bar dataKey="Income" fill="#93b25a" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Expenses" fill="#d9593f" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
