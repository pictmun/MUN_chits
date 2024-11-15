import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { axiosInstance } from "./lib/axiosInstance";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./context/AuthContext";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { setAuthUser } = useAuthContext(); // We don't need to read authUser here
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Make the API request
      const res = await axiosInstance.post("/auth/login", {
        username,
        password,
      });

      // Handle response
      if (!res.data.success) {
        setIsLoading(false);
        toast.error(res.data.message);
        return;
      }

      // Update auth context and localStorage
      const user = res.data.user;
      setAuthUser(user);
      localStorage.setItem("authUser", JSON.stringify(user));

      // Navigate and show success
      toast.success("Login Success");
      navigate("/");
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col gap-3 max-w-lg w-[80%] mx-auto rounded-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Login</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="flex flex-col gap-4 w-full">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              placeholder="Enter your username..."
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 border border-black"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              placeholder="Enter your Password..."
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 border border-black"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default Login;
