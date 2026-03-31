import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import { User, Target, TrendingUp, Bell, Shield } from "lucide-react";
import { Badge } from "./ui/badge";
import { userProfile } from "../data/mockData";
import { useState } from "react";

export function Settings() {
  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    aiInsights: true,
    marketNews: true,
    portfolioUpdates: false
  });

  const [riskLevel, setRiskLevel] = useState(50); // 0-100 scale

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-purple-400">Settings</h2>
        <p className="text-muted-foreground mt-1">Customize your trading preferences and profile</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Profile Information</h3>
                <p className="text-sm text-muted-foreground">Update your personal details</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="Alex" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Johnson" className="mt-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="alex.johnson@example.com" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="experience">Trading Experience</Label>
                <Select defaultValue={userProfile.experience}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner (0-1 year)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                    <SelectItem value="advanced">Advanced (3-5 years)</SelectItem>
                    <SelectItem value="expert">Expert (5+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Investment Goals */}
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-purple-400">Investment Goals</h3>
                <p className="text-sm text-muted-foreground">Define what you want to achieve</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="mb-3 block">Primary Investment Goal</Label>
                <RadioGroup defaultValue={userProfile.investmentGoal}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="income" id="income" />
                    <Label htmlFor="income" className="flex-1 cursor-pointer">
                      <p className="font-medium">Income Generation</p>
                      <p className="text-sm text-gray-600">Focus on dividends and regular returns</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="growth" id="growth" />
                    <Label htmlFor="growth" className="flex-1 cursor-pointer">
                      <p className="font-medium">Capital Growth</p>
                      <p className="text-sm text-gray-600">Build wealth through appreciation</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="balanced" id="balanced" />
                    <Label htmlFor="balanced" className="flex-1 cursor-pointer">
                      <p className="font-medium">Balanced</p>
                      <p className="text-sm text-gray-600">Mix of income and growth</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="preservation" id="preservation" />
                    <Label htmlFor="preservation" className="flex-1 cursor-pointer">
                      <p className="font-medium">Capital Preservation</p>
                      <p className="text-sm text-gray-600">Protect existing wealth</p>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="timeHorizon">Investment Time Horizon</Label>
                <Select defaultValue="medium">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short-term (0-2 years)</SelectItem>
                    <SelectItem value="medium">Medium-term (2-5 years)</SelectItem>
                    <SelectItem value="long">Long-term (5-10 years)</SelectItem>
                    <SelectItem value="verylong">Very Long-term (10+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Trading Style */}
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-purple-400">Trading Style</h3>
                <p className="text-sm text-muted-foreground">How do you prefer to trade?</p>
              </div>
            </div>

            <div className="space-y-4">
              <RadioGroup defaultValue={userProfile.tradingStyle}>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="day" id="day" />
                  <Label htmlFor="day" className="flex-1 cursor-pointer">
                    <p className="font-medium">Day Trading</p>
                    <p className="text-sm text-gray-600">Open and close positions within the same day</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="swing" id="swing" />
                  <Label htmlFor="swing" className="flex-1 cursor-pointer">
                    <p className="font-medium">Swing Trading</p>
                    <p className="text-sm text-gray-600">Hold positions for days to weeks</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="position" id="position" />
                  <Label htmlFor="position" className="flex-1 cursor-pointer">
                    <p className="font-medium">Position Trading</p>
                    <p className="text-sm text-gray-600">Hold positions for weeks to months</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="longterm" id="longterm" />
                  <Label htmlFor="longterm" className="flex-1 cursor-pointer">
                    <p className="font-medium">Long-term Investing</p>
                    <p className="text-sm text-gray-600">Buy and hold for years</p>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </Card>

          {/* Risk Tolerance */}
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-purple-400">Risk Tolerance</h3>
                <p className="text-sm text-muted-foreground">How much risk are you comfortable with?</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label>Risk Level</Label>
                  <Badge variant={
                    riskLevel < 33 ? 'secondary' : 
                    riskLevel < 66 ? 'default' : 
                    'destructive'
                  }>
                    {riskLevel < 33 ? 'Conservative' : riskLevel < 66 ? 'Moderate' : 'Aggressive'}
                  </Badge>
                </div>
                <Slider
                  value={[riskLevel]}
                  onValueChange={(value) => setRiskLevel(value[0])}
                  max={100}
                  step={1}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Low Risk</span>
                  <span>Medium Risk</span>
                  <span>High Risk</span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  {riskLevel < 33 && "You prefer stable, low-risk investments with predictable returns. The AI will suggest blue-chip stocks, bonds, and dividend-paying companies."}
                  {riskLevel >= 33 && riskLevel < 66 && "You're comfortable with moderate risk for potential higher returns. The AI will balance growth stocks with stable investments."}
                  {riskLevel >= 66 && "You're willing to take higher risks for potentially higher rewards. The AI will suggest growth stocks, emerging sectors, and volatile opportunities."}
                </p>
              </div>

              <div className="space-y-3">
                <Label>Maximum Acceptable Loss per Trade</Label>
                <Select defaultValue="7-10">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2-5">2-5% (Very Conservative)</SelectItem>
                    <SelectItem value="5-7">5-7% (Conservative)</SelectItem>
                    <SelectItem value="7-10">7-10% (Moderate)</SelectItem>
                    <SelectItem value="10-15">10-15% (Aggressive)</SelectItem>
                    <SelectItem value="15+">15%+ (Very Aggressive)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-purple-400">Notifications</h3>
                <p className="text-sm text-muted-foreground">Manage how you receive updates</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium text-foreground">Price Alerts</p>
                  <p className="text-sm text-muted-foreground">Get notified when stocks hit target prices</p>
                </div>
                <Switch
                  checked={notifications.priceAlerts}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, priceAlerts: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium text-foreground">AI Insights</p>
                  <p className="text-sm text-muted-foreground">Receive personalized trading recommendations</p>
                </div>
                <Switch
                  checked={notifications.aiInsights}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, aiInsights: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium text-foreground">Market News</p>
                  <p className="text-sm text-muted-foreground">Stay updated on market developments</p>
                </div>
                <Switch
                  checked={notifications.marketNews}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, marketNews: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium text-foreground">Portfolio Updates</p>
                  <p className="text-sm text-muted-foreground">Daily portfolio performance summaries</p>
                </div>
                <Switch
                  checked={notifications.portfolioUpdates}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, portfolioUpdates: checked }))
                  }
                />
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-8 bg-card border-border">
            <h3 className="font-semibold text-purple-400 mb-4">Your Profile Summary</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Name</p>
                <p className="font-medium text-foreground">{userProfile.name}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Risk Tolerance</p>
                <Badge variant="default" className="capitalize">{userProfile.riskTolerance}</Badge>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Investment Goal</p>
                <Badge variant="secondary" className="capitalize">{userProfile.investmentGoal}</Badge>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Trading Style</p>
                <Badge variant="outline" className="capitalize">{userProfile.tradingStyle}</Badge>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Experience Level</p>
                <Badge variant="outline" className="capitalize">{userProfile.experience}</Badge>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2">Portfolio Value</p>
              <p className="text-2xl font-bold text-foreground">
                ${userProfile.portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm font-semibold text-foreground mb-2">💡 AI Personalization</p>
              <p className="text-xs text-muted-foreground">
                Your settings help the AI provide tailored recommendations that match your goals, risk tolerance, and trading style.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
