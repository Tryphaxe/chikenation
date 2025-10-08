import Header from "@/components/header";

export const metadata = {
  title: "Chicken Nation | Badge generate",
  description: "Generating badge",
};

export default function PagesLayout({ children }) {
  return (
    <div>
        <Header/>
        <div className="mx-10 mb-5 p-10 rounded-xl bg-gray-50 border border-dashed border-orange-500">
            {children}
        </div>
    </div>
  );
}
