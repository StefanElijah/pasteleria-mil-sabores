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
    imagenPrincipal?: string;
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
    descripcion?: string;
    activo: boolean;
    ordenVisual?: number;
    padreId?: string;
    padre?: { id: string; nombre: string; slug?: string } | null;
    subcategorias?: Category[];
    productos?: Product[];
    _count?: { productos: number; subcategorias?: number };
    createdAt: string;
    updatedAt: string;
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
    estado: 'PENDIENTE' | 'PREPARANDO' | 'ENVIADO' | 'EN_REPARTO' | 'ENTREGADO' | 'INTENTO_FALLIDO' | 'RETRASADO' | 'DEVUELTO' | 'CANCELADO';
    subtotal: number;
    costoEnvio: number;
    total: number;
    metodoPago: 'TARJETA' | 'TRANSFERENCIA' | 'EFECTIVO' | 'PAGO_ENTREGA';
    plataforma?: string;
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
    envio: Envio;
}

export interface Envio {
    id: string;
    numeroTracking?: string;
    metodoEnvio: string;
    empresaLogistica?: string;
    fechaEstimadaEntrega: string;
    fechaEntregada?: string;
    estadoEnvio: string;
    pedidoId: string;
    pedido?: Order;
    createdAt: string;
    updatedAt: string;
}

export interface DashboardStats {
    kpis: {
        totalProducts: number;
        totalCategories: number;
        totalOrders: number;
        pendingOrders: number;
        totalEnvios: number;
        activeDiscounts: number;
        totalRevenue: number;
    };
    revenueByDay: { date: string; total: number }[];
    ordersByStatus: { estado: string; count: number }[];
    revenueByPlatform: { date: string; mobile: number; desktop: number }[];
    revenueByPaymentMethod: { date: string; tarjeta: number; transferencia: number; efectivo: number; pago_entrega: number }[];
    monthlyComparison: { label: string; añoActual: number; añoAnterior: number }[];
    lowStockProducts: { id: string; nombre: string; stock: number; imagenPrincipal?: string }[];
    revenueByCategory: { categoria: string; total: number }[];
    recentOrders: { id: string; numeroPedido: string; total: number; estado: string; createdAt: string }[];
}
