// import Header from "@/components/home-layout/header";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* <Header /> */}
      <div className="pt-16">{children}</div>
    </>
  );
}
