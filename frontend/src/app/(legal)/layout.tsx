export default function LegalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            {children}
        </div>
    );
}