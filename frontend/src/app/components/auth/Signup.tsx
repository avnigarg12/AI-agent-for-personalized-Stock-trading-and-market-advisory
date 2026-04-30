import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Eye, EyeOff, TrendingUp, Loader2 } from "lucide-react";
import { AttractiveBackground } from "../AttractiveBackground";
import { ThemeToggle } from "../ThemeToggle";
import { API_ENDPOINTS } from "../../apiConfig";

export function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await fetch(`${API_ENDPOINTS.AUTH}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.fullName,
            email: formData.email,
            password: formData.password
          })
        });

        const data = await response.json();

        if (data.success) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify({
            fullName: data.user.name,
            email: data.user.email,
            phone: formData.phone,
            isNewUser: true
          }));
          
          navigate('/onboarding');
        } else {
          setErrors({ auth: data.error || "Registration failed" });
        }
      } catch (error) {
        console.warn("Signup API failed, falling back to Demo Mode:", error);
        // DEMO FALLBACK: Allow signup if server is offline
        localStorage.setItem('user', JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          isNewUser: true
        }));
        navigate('/onboarding');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ""
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent text-foreground p-4 relative overflow-hidden transition-colors">
      <AttractiveBackground variant="signup" />

      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-lg lg:max-w-xl relative z-10 mt-10">
        {/* Logo/Brand */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-5 mb-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.5)]">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-6xl font-black bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent drop-shadow-sm tracking-tight text-foreground">
              TradeMind AI
            </h1>
          </div>
          <p className="text-muted-foreground text-xl font-medium">Create your premium account to get started</p>
        </div>

        <Card className="p-10 bg-card/90 backdrop-blur-xl border-border/50 shadow-[0_0_50px_rgba(0,0,0,0.3)] premium-card rounded-3xl">
          {errors.auth && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm font-bold text-center">
              {errors.auth}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <Label htmlFor="fullName" className="text-base font-bold text-foreground mb-2 block tracking-wide">Full Name *</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className={`h-14 text-lg rounded-xl bg-background/50 ${errors.fullName ? 'border-red-500' : ''}`}
              />
              {errors.fullName && (
                <p className="text-sm font-bold text-red-500 mt-2">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-base font-bold text-foreground mb-2 block tracking-wide">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className={`h-14 text-lg rounded-xl bg-background/50 ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && (
                <p className="text-sm font-bold text-red-500 mt-2">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-base font-bold text-foreground mb-2 block tracking-wide">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`h-14 text-lg rounded-xl bg-background/50 ${errors.password ? 'border-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm font-bold text-red-500 mt-2">{errors.password}</p>
              )}
              <p className="text-sm font-medium text-muted-foreground mt-2">
                Must be at least 8 characters
              </p>
            </div>

            {/* Phone (Optional) */}
            <div>
              <Label htmlFor="phone" className="text-base font-bold text-foreground mb-2 block tracking-wide">Phone Number (Optional)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="h-14 text-lg rounded-xl bg-background/50"
              />
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full mt-8 h-16 text-xl font-black rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Create Account"}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center bg-background/30 p-4 rounded-2xl">
            <p className="text-base font-medium text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:text-primary/80 font-black tracking-wide ml-1">
                LOG IN
              </Link>
            </p>
          </div>
        </Card>

        {/* Terms */}
        <p className="text-sm font-medium text-center text-muted-foreground mt-6 bg-background/40 backdrop-blur-md p-4 rounded-2xl">
          By creating an account, you agree to our{" "}
          <a href="#" className="text-primary hover:underline font-bold">Terms of Service</a>
          {" "}and{" "}
          <a href="#" className="text-primary hover:underline font-bold">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
