import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { useCreateUser } from "../../hooks/useCreateUser";
export type FormDataType = {
  username:string,
  portfolio: string,
    role: string,
  committee: string,
  password:string
}
const CreateEntries = () => {
  // Single state object for all form inputs
  const [formData, setFormData] = useState<FormDataType>({
    username: "",
    portfolio: "",
    role: "",
    committee: "",
    password:""
  });
  const {createUser} = useCreateUser()
  const [loading, setLoading] = useState(false);
  const handleSubmit=(e:React.FormEvent)=>{
    e.preventDefault();
    setLoading(true);
   createUser(formData);
   setLoading(false);
   setFormData({username:"",portfolio:"",role:"",committee:"",password:""})
  }

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>|React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-xl w-full mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create Entries</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="mb-4">
              <Label htmlFor="username">Enter The Username</Label>
              <Input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="password">Enter The Password</Label>
              <Input
                type="text"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="portfolio">Enter The Portfolio</Label>
              <Input
                type="text"
                name="portfolio"
                id="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                placeholder="Portfolio"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="role">Select Role</Label>
              <select
                name="role"
                id="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option value={""}>Select Role</option>
                <option value="DELEGATE">Delegate</option>
                <option value="EB">EB</option>
              </select>
            </div>
            <div className="mb-4">
              <Label htmlFor="committee">Select Committee</Label>
              <select
                name="committee"
                id="committee"
                value={formData.committee}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option value={""}>Select Committee</option>
                <option value="UEFA">UEFA</option>
                <option value="AIPPM">AIPPM</option>
                <option value="UNHRC">UNHRC</option>
                <option value="IP">IP</option>
              </select>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">{loading ? "Loading..." : "Submit"}</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateEntries;
