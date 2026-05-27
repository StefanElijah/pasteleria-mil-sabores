export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-6 mt-12">
            <div className="container mx-auto px-4 text-center">
                <p>© {new Date().getFullYear()} Pastelería Mil Sabores. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
}