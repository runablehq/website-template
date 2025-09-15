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
  email: z.string(),
  password: z.string().min(8),
});

export default function SignIn() {
  const form = useForm<z.infer<typeof formSchema>>();
  const onSubmitHandler = form.handleSubmit(async (data) => {
    await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmitHandler}>
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
        <Button type="submit">Sign In</Button>
        <FormMessage />
      </form>
    </Form>
  );
}
