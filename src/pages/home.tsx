import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col gap-2">
      <Link to="/sign-in">Sign In</Link>
      <Link to="/sign-up">Sign Up</Link>
    </div>
  );
}
