import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class StatsService {
  constructor(@Inject('PrismaClient') private prisma: any) {}

  async getDashboard() {
    const [totalProducts, totalCategories, totalOrders, pendingOrders, totalEnvios, activeDiscounts] =
      await Promise.all([
        this.prisma.producto.count({ where: { activo: true } }),
        this.prisma.categoria.count({ where: { activo: true } }),
        this.prisma.pedido.count(),
        this.prisma.pedido.count({ where: { estado: 'PENDIENTE' } }),
        this.prisma.envio.count(),
        this.prisma.descuento.count({ where: { activo: true } }),
      ]);

    const revenueResult = await this.prisma.pedido.aggregate({
      _sum: { total: true },
    });
    const totalRevenue = revenueResult._sum.total || 0;

    const kpis = {
      totalProducts,
      totalCategories,
      totalOrders,
      pendingOrders,
      totalEnvios,
      activeDiscounts,
      totalRevenue,
    };

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const recentOrders = await this.prisma.pedido.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      orderBy: { createdAt: 'desc' },
    });

    const revenueByDay = this.computeRevenueByDay(recentOrders);
    const ordersByStatus = this.computeOrdersByStatus(recentOrders);
    const revenueByPlatform = this.computeRevenueByPlatform(recentOrders);
    const revenueByPaymentMethod = this.computeRevenueByPaymentMethod(recentOrders);
    const monthlyComparison = this.computeMonthlyComparison(recentOrders);

    const lowStockProducts = await this.prisma.producto.findMany({
      where: { activo: true, stock: { lte: 10 } },
      orderBy: { stock: 'asc' },
      take: 10,
      select: { id: true, nombre: true, stock: true, imagenPrincipal: true },
    });

    const revenueByCategory = await this.computeRevenueByCategory();

    const recentPendingOrders = recentOrders
      .slice(0, 5)
      .map((o: any) => ({
        id: o.id,
        numeroPedido: o.numeroPedido,
        total: o.total,
        estado: o.estado,
        createdAt: o.createdAt,
      }));

    return {
      kpis,
      revenueByDay,
      ordersByStatus,
      revenueByPlatform,
      revenueByPaymentMethod,
      monthlyComparison,
      lowStockProducts,
      revenueByCategory,
      recentOrders: recentPendingOrders,
    };
  }

  private computeRevenueByDay(orders: any[]) {
    const map = new Map<string, number>();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 30; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      map.set(d.toISOString().slice(0, 10), 0);
    }

    for (const o of orders) {
      const d = new Date(o.createdAt);
      d.setHours(0, 0, 0, 0);
      const key = d.toISOString().slice(0, 10);
      if (map.has(key)) {
        map.set(key, (map.get(key) || 0) + o.total);
      }
    }

    return Array.from(map.entries()).map(([date, total]) => ({ date, total }));
  }

  private computeOrdersByStatus(orders: any[]) {
    const grouped: Record<string, number> = {};
    for (const o of orders) {
      grouped[o.estado] = (grouped[o.estado] || 0) + 1;
    }
    return Object.entries(grouped).map(([estado, count]) => ({ estado, count }));
  }

  private computeRevenueByPlatform(orders: any[]) {
    const map = new Map<string, { mobile: number; desktop: number }>();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 30; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      map.set(d.toISOString().slice(0, 10), { mobile: 0, desktop: 0 });
    }

    for (const o of orders) {
      const d = new Date(o.createdAt);
      d.setHours(0, 0, 0, 0);
      const key = d.toISOString().slice(0, 10);
      const entry = map.get(key);
      if (!entry) continue;
      if (o.plataforma === 'MOBILE') entry.mobile += o.total;
      else if (o.plataforma === 'DESKTOP') entry.desktop += o.total;
    }

    return Array.from(map.entries()).map(([date, { mobile, desktop }]) => ({
      date,
      mobile: Math.round(mobile),
      desktop: Math.round(desktop),
    }));
  }

  private computeRevenueByPaymentMethod(orders: any[]) {
    const map = new Map<string, { tarjeta: number; transferencia: number; efectivo: number; pago_entrega: number }>();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 30; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      map.set(d.toISOString().slice(0, 10), { tarjeta: 0, transferencia: 0, efectivo: 0, pago_entrega: 0 });
    }

    for (const o of orders) {
      const d = new Date(o.createdAt);
      d.setHours(0, 0, 0, 0);
      const key = d.toISOString().slice(0, 10);
      const entry = map.get(key);
      if (!entry) continue;
      if (o.metodoPago === 'TARJETA') entry.tarjeta += o.total;
      else if (o.metodoPago === 'TRANSFERENCIA') entry.transferencia += o.total;
      else if (o.metodoPago === 'EFECTIVO') entry.efectivo += o.total;
      else if (o.metodoPago === 'PAGO_ENTREGA') entry.pago_entrega += o.total;
    }

    return Array.from(map.entries()).map(
      ([date, { tarjeta, transferencia, efectivo, pago_entrega }]) => ({
        date,
        tarjeta: Math.round(tarjeta),
        transferencia: Math.round(transferencia),
        efectivo: Math.round(efectivo),
        pago_entrega: Math.round(pago_entrega),
      })
    );
  }

  private computeMonthlyComparison(orders: any[]) {
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;
    const grouped = new Map<string, { current: number; previous: number }>();

    for (let m = 1; m <= 12; m++) {
      grouped.set(m.toString(), { current: 0, previous: 0 });
    }

    for (const o of orders) {
      const d = new Date(o.createdAt);
      const m = d.getMonth() + 1;
      const y = d.getFullYear();
      const entry = grouped.get(m.toString());
      if (!entry) continue;
      if (y === currentYear) entry.current += o.total;
      else if (y === previousYear) entry.previous += o.total;
    }

    const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return Array.from(grouped.entries()).map(([mesNum, { current, previous }]) => ({
      label: MONTHS[parseInt(mesNum, 10) - 1] || '',
      añoActual: Math.round(current),
      añoAnterior: Math.round(previous),
    }));
  }

  private async computeRevenueByCategory() {
    const items = await this.prisma.itemPedido.findMany({
      include: {
        producto: { include: { categoria: true } },
      },
    });

    const grouped = new Map<string, number>();
    for (const item of items) {
      const catName = item.producto?.categoria?.nombre || 'Sin categoría';
      grouped.set(catName, (grouped.get(catName) || 0) + item.total);
    }

    return Array.from(grouped.entries())
      .map(([categoria, total]) => ({ categoria, total }))
      .sort((a, b) => b.total - a.total);
  }
}
