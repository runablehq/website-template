import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Auth() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    try {
      const endpoint = mode === "signup" ? "/api/auth/register" : "/api/auth/login";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Request failed");
      setMessage(mode === "signup" ? "Account created. You can log in now." : "Logged in.");
    } catch (err: any) {
      setMessage(err.message || "Something went wrong");
    }
  }

  return (
    <Card className="max-w-md mx-auto bg-card/50 backdrop-blur border-muted/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{mode === "signup" ? "Sign up" : "Sign in"}</h2>
          <Button variant="ghost" onClick={() => setMode(mode === "signup" ? "login" : "signup")}>{mode === "signup" ? "Have an account? Sign in" : "New here? Sign up"}</Button>
        </div>
        <form className="mt-4 space-y-4" onSubmit={submit}>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full">{mode === "signup" ? "Create account" : "Sign in"}</Button>
        </form>
        {message && <p className="mt-3 text-sm text-muted-foreground">{message}</p>}
      </CardContent>
    </Card>
  );
}

export default Auth;

