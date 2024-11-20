import Logo from "../logo.gif";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="pl-2  bg-[#ffdeee]">
        <img src={Logo.src} />
      </header>
      <main>{children}</main>
    </>
  );
}
