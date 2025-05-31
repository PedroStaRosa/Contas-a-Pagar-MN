import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
  return (
    <div>
      <h1>404 - Not Found</h1>
      <p>The page you are looking for does not exist.</p>

      <Button onClick={() => window.history.back()}>Voltar</Button>
    </div>
  );
};

export default NotFoundPage;
