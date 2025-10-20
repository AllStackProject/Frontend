import Navbar from "@/components/Common/Navbar";
import Footer from "@/components/Common/Footer";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="flex-1 px-8 py-8 bg-white">{children}</main>
      <Footer />
    </div>
  );
};

export default DashboardLayout;