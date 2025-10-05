import Footer from "@/components/layout/footer";
import GridWrapper from "@/components/grid-viz/grid-wrapper";
import Header from "@/components/layout/header";

export default function Home() {
  return (
    <div className="font-sans flex flex-col items-center gap-y-4 max-w-xl mx-auto">
      <Header />
      <main>
        <GridWrapper />
      </main>
      <Footer />
    </div>
  );
}
