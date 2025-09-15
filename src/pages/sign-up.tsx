import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth";
import { z } from "zod/v4";

const formSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string().min(8),
});

export default function SignUp() {
  const form = useForm<z.infer<typeof formSchema>>();
  const onSubmitHandler = form.handleSubmit(async (data) => {
    await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmitHandler}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Sign Up</Button>
        <FormMessage />
      </form>
    </Form>
  );
}
