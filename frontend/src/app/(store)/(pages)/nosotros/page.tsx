import { Heart, Star, Truck } from 'lucide-react';

export const metadata = {
    title: 'Nosotros | Pastelería Mil Sabores',
    description: 'Conoce nuestra historia, valores y pasión por la pastelería artesanal.',
};

export default function NosotrosPage() {
    return (
        <div className="container mx-auto py-12 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 2xl:px-32 max-w-4xl">
            <h1 className="text-4xl font-bold text-center mb-8 text-rose-600">Quiénes Somos</h1>
            <div className="space-y-6 text-gray-700 leading-relaxed">
                <p className="text-lg font-semibold">
                    En <strong>Pastelería Mil Sabores</strong>, somos una empresa familiar dedicada a la creación de deliciosos productos de
                    pastelería y repostería artesanal.
                </p>
                <p>
                    Fundada en <strong>1995</strong>, nuestra misión es endulzar los momentos especiales de nuestros clientes con sabores
                    auténticos y recetas tradicionales. Nuestro equipo está compuesto por pasteleros apasionados que utilizan
                    ingredientes de la más alta calidad para garantizar que cada bocado sea una experiencia inolvidable.
                </p>
                <p>
                    Desde pasteles personalizados para celebraciones hasta una variedad de postres clásicos, nos esforzamos por
                    ofrecer productos que no solo sean visualmente atractivos, sino que también deleiten el paladar.
                </p>
                <p>
                    En Pastelería Mil Sabores, valoramos la satisfacción del cliente y nos comprometemos a brindar un servicio
                    excepcional. Ya sea que estés buscando un pastel para tu boda, cupcakes para una fiesta de cumpleaños o
                    simplemente un dulce capricho, estamos aquí para ayudarte a hacer que cada ocasión sea especial.
                </p>
                <p className="font-bold italic">
                    Gracias por elegirnos para ser parte de tus momentos más dulces. ¡Esperamos endulzar tu día con nuestros productos!
                </p>
            </div>

            {/* Valores */}
            <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div className="text-center p-6 bg-gray-50 rounded-lg shadow-sm">
                    <Heart className="w-12 h-12 text-rose-500 mx-auto mb-3" />
                    <h3 className="text-xl font-semibold mb-2">Pasión por lo Artesanal</h3>
                    <p className="text-gray-600">Cada producto es elaborado con dedicación y amor</p>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg shadow-sm">
                    <Star className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                    <h3 className="text-xl font-semibold mb-2">Calidad Premium</h3>
                    <p className="text-gray-600">Ingredientes seleccionados para el mejor sabor</p>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg shadow-sm">
                    <Truck className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                    <h3 className="text-xl font-semibold mb-2">Entrega en Todo Chile</h3>
                    <p className="text-gray-600">Llevamos la dulzura a cada rincón del país</p>
                </div>
            </div>
        </div>
    );
}