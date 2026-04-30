import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import { User, Target, Bell, Shield, Loader2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { userProfile } from "../data/mockData";
import { useState, useEffect } from "react";

export function Settings() {
  const [profile, setProfile] = useState({
    ...userProfile,
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex.johnson@example.com"
  });

  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    aiInsights: true,
    marketNews: true,
    portfolioUpdates: false
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedProfile = localStorage.getItem('investorProfile');
      
      let updatedProfile = { ...userProfile };

      if (storedUser) {
        const user = JSON.parse(storedUser);
        const fullName = user.fullName || user.name || "Alex Johnson";
        const names = fullName.split(' ');
        updatedProfile.name = fullName;
        updatedProfile.firstName = names[0] || "Alex";
        updatedProfile.lastName = names.slice(1).join(' ') || "Johnson";
        updatedProfile.email = user.email || updatedProfile.email;
      }

      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        updatedProfile = {
          ...updatedProfile,
          totalInvested: parseFloat(parsed.investedAmount) || updatedProfile.totalInvested,
          portfolioValue: parseFloat(parsed.currentValue) || updatedProfile.portfolioValue,
          riskTolerance: parsed.riskLevel || updatedProfile.riskTolerance,
          tradingStyle: parsed.tradingStyle || updatedProfile.tradingStyle
        };
      }
      
      setProfile(updatedProfile);
    } catch (e) {
      console.error("Error loading settings", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const totalGainLossPercent = ((profile.portfolioValue - profile.totalInvested) / profile.totalInvested) * 100;
  
  // Risk Level calculation based on performance and profile
  // High profit + aggressive style -> High Risk.
  const calculateRiskScore = () => {
    let score = 50; // Neutral
    if (totalGainLossPercent > 10) score += 20;
    if (totalGainLossPercent < -10) score -= 20;
    if (profile.tradingStyle === 'day') score += 15;
    if (profile.tradingStyle === 'longterm') score -= 15;
    return Math.min(Math.max(score, 10), 90);
  };

  const riskScore = calculateRiskScore();

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="p-8 pt-0 text-foreground">
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
                <p className="text-sm text-muted-foreground">Actual user account details</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={profile.name} readOnly className="mt-1 bg-muted/50" />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={profile.email} readOnly className="mt-1 bg-muted/50" />
              </div>
              <div>
                <Label htmlFor="experience">Trading Experience</Label>
                <Select defaultValue={profile.experience}>
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

          {/* Risk Tolerance - AI Calculated (Read-only) */}
          <Card className="p-6 bg-card border-border border-primary/20 bg-primary/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-purple-400">AI Risk Assessment</h3>
                <p className="text-sm text-muted-foreground">Calculated based on your portfolio and profile</p>
              </div>
              <Badge variant="outline" className="ml-auto text-xs border-primary/30 text-primary">READ ONLY</Badge>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label>Risk Level</Label>
                  <Badge variant={
                    riskScore < 33 ? 'secondary' : 
                    riskScore < 66 ? 'default' : 
                    'destructive'
                  }>
                    {riskScore < 33 ? 'Conservative' : riskScore < 66 ? 'Moderate' : 'Aggressive'}
                  </Badge>
                </div>
                <Slider
                  value={[riskScore]}
                  max={100}
                  step={1}
                  className="mb-2 opacity-70 pointer-events-none"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Low Risk</span>
                  <span>Medium Risk</span>
                  <span>High Risk</span>
                </div>
              </div>

              <div className="p-4 bg-muted/30 border border-border rounded-lg">
                <p className="text-sm text-foreground">
                  <span className="font-bold text-primary">AI Evaluation: </span>
                  {riskScore < 33 && "Your current holdings and strategy indicate a conservative approach. TradeMind AI will continue to suggest stable, low-volatility assets."}
                  {riskScore >= 33 && riskScore < 66 && "Your portfolio demonstrates a balanced risk-reward profile. AI insights will focus on maintaining this equilibrium."}
                  {riskScore >= 66 && "You are currently positioned in a high-growth, high-risk state. AI will monitor for significant volatility alerts."}
                </p>
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
                <p className="font-medium text-foreground">{profile.name}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">AI Risk Assessment</p>
                <Badge variant="default" className="capitalize">
                  {riskScore < 33 ? 'Conservative' : riskScore < 66 ? 'Moderate' : 'Aggressive'}
                </Badge>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm font-semibold text-foreground mb-2">💡 AI Personalization</p>
              <p className="text-xs text-muted-foreground">
                Your calculated risk and profile help TradeMind AI provide tailored recommendations.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
