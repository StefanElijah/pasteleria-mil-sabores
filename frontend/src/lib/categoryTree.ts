import { Category } from '@/types';

export interface CategoryNode {
    id: string;
    nombre: string;
    slug: string;
    descripcion?: string;
    padreId?: string;
    ordenVisual: number;
    activo: boolean;
    nivel: number;
    children: CategoryNode[];
    _count?: { productos: number; subcategorias?: number };
}

export function buildTree(categorias: Category[]): CategoryNode[] {
    const map = new Map<string, CategoryNode>();
    const roots: CategoryNode[] = [];

    for (const cat of categorias) {
        map.set(cat.id, {
            id: cat.id,
            nombre: cat.nombre,
            slug: cat.slug,
            descripcion: cat.descripcion,
            padreId: cat.padreId,
            ordenVisual: cat.ordenVisual || 0,
            activo: cat.activo,
            nivel: 0,
            children: [],
            _count: cat._count,
        });
    }

    for (const cat of categorias) {
        const node = map.get(cat.id);
        if (!node) continue;
        if (cat.padreId && map.has(cat.padreId)) {
            map.get(cat.padreId)!.children.push(node);
        } else {
            roots.push(node);
        }
    }

    function setLevel(node: CategoryNode, level: number) {
        node.nivel = level;
        node.children.sort((a, b) => a.ordenVisual - b.ordenVisual);
        for (const child of node.children) {
            setLevel(child, level + 1);
        }
    }

    roots.sort((a, b) => a.ordenVisual - b.ordenVisual);
    for (const root of roots) {
        setLevel(root, 0);
    }

    return roots;
}

export function flattenTree(nodes: CategoryNode[]): CategoryNode[] {
    const result: CategoryNode[] = [];
    function dfs(node: CategoryNode) {
        result.push(node);
        for (const child of node.children) {
            dfs(child);
        }
    }
    for (const node of nodes) {
        dfs(node);
    }
    return result;
}

export function getNextOrden(categorias: Category[], padreId?: string): number {
    const siblings = categorias.filter((c) => (padreId ? c.padreId === padreId : !c.padreId));
    const maxOrden = siblings.reduce((max, c) => Math.max(max, c.ordenVisual || 0), 0);
    return maxOrden + 1;
}

export function getSiblings(categorias: Category[], padreId?: string): Category[] {
    return categorias
        .filter((c) => (padreId ? c.padreId === padreId : !c.padreId))
        .sort((a, b) => (a.ordenVisual || 0) - (b.ordenVisual || 0));
}

export function getDescendantIds(categorias: Category[], id: string): Set<string> {
    const ids = new Set<string>();
    ids.add(id);
    function collect(parentId: string) {
        for (const cat of categorias) {
            if (cat.padreId === parentId) {
                ids.add(cat.id);
                collect(cat.id);
            }
        }
    }
    collect(id);
    return ids;
}

export function buildCategoryChain(categorias: Category[], id: string): Category[] {
    const chain: Category[] = [];
    let current = categorias.find((c) => c.id === id);
    while (current) {
        chain.unshift(current);
        current = current.padreId ? categorias.find((c) => c.id === current!.padreId) : undefined;
    }
    return chain;
}
