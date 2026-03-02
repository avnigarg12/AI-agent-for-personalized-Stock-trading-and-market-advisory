import { Card } from "./ui/card";
import { TrendingUp, TrendingDown, Plus, DollarSign, PieChart as PieChartIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { portfolioHoldings, userProfile } from "../data/mockData";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export function Portfolio() {
  const totalValue = portfolioHoldings.reduce((sum, holding) => sum + holding.totalValue, 0);
  const totalGainLoss = portfolioHoldings.reduce((sum, holding) => sum + holding.gainLoss, 0);
  const totalGainLossPercent = ((totalGainLoss / (totalValue - totalGainLoss)) * 100).toFixed(2);

  // Prepare data for pie chart
  const pieData = portfolioHoldings.map(holding => ({
    name: holding.symbol,
    value: holding.totalValue,
    percentage: ((holding.totalValue / totalValue) * 100).toFixed(1)
  }));

  // Prepare data for performance bar chart
  const performanceData = portfolioHoldings.map(holding => ({
    name: holding.symbol,
    gainLoss: holding.gainLoss,
    percentage: holding.gainLossPercent
  }));

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-purple-400">My Portfolio</h2>
          <p className="text-muted-foreground mt-1">Track and manage your investments</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Position
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Value</p>
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {portfolioHoldings.length} positions
          </p>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Gain/Loss</p>
            {totalGainLoss >= 0 ? (
              <TrendingUp className="w-5 h-5 text-green-400" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-400" />
            )}
          </div>
          <p className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className={`text-sm mt-1 ${parseFloat(totalGainLossPercent) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {parseFloat(totalGainLossPercent) >= 0 ? '+' : ''}{totalGainLossPercent}%
          </p>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Cash Available</p>
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            ${userProfile.cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Ready to invest
          </p>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Buying Power</p>
            <PieChartIcon className="w-5 h-5 text-orange-400" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            ${(userProfile.cashBalance * 2).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            With 2x margin
          </p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold text-purple-400 mb-4">Portfolio Allocation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} ${percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `$${value.toFixed(2)}`}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold text-purple-400 mb-4">Performance by Position</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" tickFormatter={(value) => `${value}%`} />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === 'gainLoss') return [`$${value.toFixed(2)}`, 'Gain/Loss'];
                  return [`${value.toFixed(2)}%`, 'Percentage'];
                }}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Legend />
              <Bar dataKey="percentage" fill="#3b82f6" name="Return %" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Holdings Table */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold text-purple-400 mb-4">Holdings</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm text-muted-foreground font-semibold">Symbol</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground font-semibold">Name</th>
                <th className="text-right py-3 px-4 text-sm text-muted-foreground font-semibold">Shares</th>
                <th className="text-right py-3 px-4 text-sm text-muted-foreground font-semibold">Avg Cost</th>
                <th className="text-right py-3 px-4 text-sm text-muted-foreground font-semibold">Current Price</th>
                <th className="text-right py-3 px-4 text-sm text-muted-foreground font-semibold">Total Value</th>
                <th className="text-right py-3 px-4 text-sm text-muted-foreground font-semibold">Gain/Loss</th>
                <th className="text-right py-3 px-4 text-sm text-muted-foreground font-semibold">Return</th>
                <th className="text-right py-3 px-4 text-sm text-muted-foreground font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {portfolioHoldings.map((holding, index) => (
                <tr key={holding.symbol} className="border-b border-border hover:bg-muted/30">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="font-semibold text-foreground">{holding.symbol}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">{holding.name}</td>
                  <td className="py-4 px-4 text-right text-foreground font-medium">{holding.shares}</td>
                  <td className="py-4 px-4 text-right text-foreground font-medium">
                    ${holding.avgCost.toFixed(2)}
                  </td>
                  <td className="py-4 px-4 text-right text-foreground font-medium">
                    ${holding.currentPrice.toFixed(2)}
                  </td>
                  <td className="py-4 px-4 text-right font-semibold text-foreground">
                    ${holding.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className={`py-4 px-4 text-right font-semibold ${
                    holding.gainLoss >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {holding.gainLoss >= 0 ? '+' : ''}${holding.gainLoss.toFixed(2)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Badge 
                      variant={holding.gainLossPercent >= 0 ? 'default' : 'destructive'}
                      className="font-semibold"
                    >
                      {holding.gainLossPercent >= 0 ? '+' : ''}{holding.gainLossPercent.toFixed(2)}%
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Button variant="outline" size="sm">
                      Trade
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Row */}
        <div className="mt-4 pt-4 border-t border-border flex justify-end">
          <div className="grid grid-cols-3 gap-8">
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Total Value</p>
              <p className="text-lg font-bold text-foreground">
                ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Total Gain/Loss</p>
              <p className={`text-lg font-bold ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Total Return</p>
              <p className={`text-lg font-bold ${parseFloat(totalGainLossPercent) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {parseFloat(totalGainLossPercent) >= 0 ? '+' : ''}{totalGainLossPercent}%
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* AI Suggestions */}
      <Card className="p-6 mt-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-2">AI Portfolio Analysis</h4>
            <p className="text-sm text-gray-700 mb-3">
              Your portfolio shows strong concentration in technology (75%). While tech has performed well, consider diversifying into defensive sectors like healthcare or consumer staples to reduce volatility. Your current portfolio beta is 1.32, which is higher than the market.
            </p>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-white">Tech Heavy: 75%</Badge>
              <Badge variant="outline" className="bg-white">Portfolio Beta: 1.32</Badge>
              <Badge variant="outline" className="bg-white">Suggested Action: Rebalance</Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
