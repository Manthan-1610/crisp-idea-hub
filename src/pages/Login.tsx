import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { Lightbulb, Users, Target } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("pig");
  const navigate = useNavigate();

  const handleLogin = () => {
    // Simulate login - in real app, this would authenticate with backend
    localStorage.setItem("user", JSON.stringify({ email, role }));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Hero Section */}
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
              Agile Requirements
              <span className="text-primary block">Engineering</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Transform your ideas into actionable user stories with our comprehensive Agile requirements management platform.
            </p>
          </div>
          
          <div className="grid gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Capture Ideas</h3>
                <p className="text-sm text-muted-foreground">Collect and organize requirements from stakeholders</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Build Stories</h3>
                <p className="text-sm text-muted-foreground">Create structured user stories with acceptance criteria</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Plan MVPs</h3>
                <p className="text-sm text-muted-foreground">Organize stories into releases and sprint-ready backlogs</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>
                Enter your credentials to access your workspace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Select your role</Label>
                    <RadioGroup value={role} onValueChange={setRole}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pig" id="pig" />
                        <Label htmlFor="pig" className="flex-1">
                          <div>
                            <div className="font-medium">🐷 Pig (Product Owner/Developer)</div>
                            <div className="text-sm text-muted-foreground">
                              Full access to create, edit, and manage requirements
                            </div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="chicken" id="chicken" />
                        <Label htmlFor="chicken" className="flex-1">
                          <div>
                            <div className="font-medium">🐔 Chicken (Stakeholder)</div>
                            <div className="text-sm text-muted-foreground">
                              View and comment on requirements, provide feedback
                            </div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Button onClick={handleLogin} className="w-full" size="lg">
                    Sign In
                  </Button>
                </TabsContent>
                
                <TabsContent value="register" className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First name</Label>
                      <Input id="first-name" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last name</Label>
                      <Input id="last-name" placeholder="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <Input id="reg-email" type="email" placeholder="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <Input id="reg-password" type="password" />
                  </div>
                  <Button className="w-full" size="lg">
                    Create Account
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}