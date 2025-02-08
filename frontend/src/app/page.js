import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center h-[80vh] text-center p-8 bg-white shadow-md rounded-md mx-auto max-w-3xl">
      <h2 className="text-4xl font-bold mb-4">Welcome to My App</h2>
      <p className="text-lg text-gray-600 mb-6">
        Discover amazing features and get started today!
      </p>
      <Button className="text-lg px-6 py-3">Get Started</Button>
    </section>
  );
}
