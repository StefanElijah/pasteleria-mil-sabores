export interface User {
    id: string;
    email: string;
    telefono?: string;
    avatar?: string;
    rol: 'ADMIN' | 'MODERADOR' | 'CLIENTE';
    estado: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
    primerNombre: string;
    segundoNombre?: string;
    primerApellido: string;
    segundoApellido?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Product {
    id: string;
    nombre: string;
    slug: string;
    descripcion?: string;
    precio: number;
    precioComparacion?: number;
    stock: number;
    imagenes: string[];
    novedad: boolean;
    destacado: boolean;
    activo: boolean;
    createdAt: string;
    updatedAt: string;
    categoriaId: string;
    categoria: Category;
}

export interface Category {
    id: string;
    nombre: string;
    slug: string;
    icono?: string;
    activo: boolean;
    createdAt: string;
    updatedAt: string;
    productos?: Product[];
}

export interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

export interface Address {
    id: string;
    calle: string;
    numero: string;
    ciudad?: string;
    codigoPostal?: string;
    telefono?: string;
    isDefault: boolean;
    tipoVivienda: 'CASA' | 'DEPARTAMENTO' | 'OFICINA' | 'LOCAL_COMERCIAL' | 'OTRO';
    comunaId: string;
    comuna: {
        id: string;
        nombre: string;
        region: {
            id: string;
            nombre: string;
        };
    };
    usuarioId?: string;
}

export interface OrderItem {
    id: string;
    nombre: string;
    precio: number;
    cantidad: number;
    total: number;
    productoId: string;
    producto: Product;
}

export interface Order {
    id: string;
    numeroPedido: string;
    estado: 'PENDIENTE' | 'PREPARANDO' | 'ENVIADO' | 'ENTREGADO' | 'CANCELADO';
    subtotal: number;
    costoEnvio: number;
    total: number;
    metodoPago: 'TARJETA' | 'TRANSFERENCIA' | 'EFECTIVO' | 'PAGO_ENTREGA';
    notas?: string;
    createdAt: string;
    updatedAt: string;
    primerNombreDestinatario: string;
    primerApellidoDestinatario: string;
    emailDestinatario: string;
    telefonoDestinatario: string;
    usuarioId?: string;
    direccionId: string;
    direccion: Address;
    items: OrderItem[];
    envio: {
        id: string;
        numeroTracking?: string;
        metodoEnvio: string;
        empresaLogistica?: string;
        fechaEstimadaEntrega: string;
        fechaEntregada?: string;
    };
}