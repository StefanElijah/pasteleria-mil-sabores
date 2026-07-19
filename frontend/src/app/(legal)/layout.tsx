export default function LegalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="container mx-auto py-8 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 2xl:px-32 max-w-4xl">
            {children}
        </div>
    );
}