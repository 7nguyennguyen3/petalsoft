import { LoaderCircle } from "lucide-react";

const Loading = () => {
  return (
    <div className="min-h-screen items-center justify-center flex gap-2 text-xl">
      Loading
      <LoaderCircle className="animate-spin" />
    </div>
  );
};

export default Loading;
