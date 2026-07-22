'use client';
import { useEffect, useState, DragEvent } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Eye, Pencil, Trash2, ChevronDown, ChevronRight, GripVertical } from 'lucide-react';
import { buildTree, flattenTree, getSiblings, type CategoryNode } from '@/lib/categoryTree';

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<Set<string>>(new Set());
    const [dragId, setDragId] = useState<string | null>(null);
    const [dropId, setDropId] = useState<string | null>(null);

    const fetchCategories = async () => {
        const { data } = await api.get('/categories?activo=all&includeProducts=true');
        setCategories(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const toggleActive = async (id: string, currentActive: boolean) => {
        try {
            await api.patch(`/categories/${id}`, { activo: !currentActive });
            fetchCategories();
        } catch {
            alert('Error al cambiar el estado de la categoría');
        }
    };

    const deleteCategory = async (id: string) => {
        if (confirm('¿Desactivar esta categoría?')) {
            try {
                await api.delete(`/categories/${id}`);
                fetchCategories();
            } catch (err: any) {
                const msg = err?.response?.data?.message || 'Error al desactivar la categoría';
                alert(msg);
            }
        }
    };

    const toggleExpand = (id: string) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleDragStart = (e: DragEvent, id: string) => {
        setDragId(id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: DragEvent, id: string) => {
        e.preventDefault();
        setDropId(id);
    };

    const handleDragEnd = () => {
        setDragId(null);
        setDropId(null);
    };

    const handleDrop = async (e: DragEvent, targetId: string) => {
        e.preventDefault();
        if (!dragId || dragId === targetId) {
            handleDragEnd();
            return;
        }

        const dragged = categories.find((c) => c.id === dragId);
        const target = categories.find((c) => c.id === targetId);
        if (!dragged || !target) {
            handleDragEnd();
            return;
        }

        if (dragged.padreId !== target.padreId) {
            handleDragEnd();
            return;
        }

        const siblings = getSiblings(categories, dragged.padreId || undefined);
        const siblingIds = siblings.map((s) => s.id);
        const draggedIdx = siblingIds.indexOf(dragId);
        const targetIdx = siblingIds.indexOf(targetId);

        if (draggedIdx === -1 || targetIdx === -1) {
            handleDragEnd();
            return;
        }

        const reorderedIds = [...siblingIds];
        reorderedIds.splice(draggedIdx, 1);
        reorderedIds.splice(targetIdx, 0, dragId);

        const ordenes = reorderedIds.map((id, i) => ({ id, ordenVisual: i + 1 }));

        try {
            await api.patch('/categories/reordenar', ordenes);
            fetchCategories();
        } catch {
            alert('Error al reordenar categorías');
        }

        handleDragEnd();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin h-8 w-8 border-4 border-rose-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    const tree = buildTree(categories);
    const flatNodes = flattenTree(tree);

    const renderRow = (node: CategoryNode) => {
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = expanded.has(node.id);
        const isDragging = dragId === node.id;
        const isDropTarget = dropId === node.id;
        const dragParentId = dragId ? categories.find((c) => c.id === dragId)?.padreId : undefined;
        const sameParent = dragId ? node.padreId === dragParentId : true;

        return (
            <TableRow
                key={node.id}
                draggable={sameParent}
                onDragStart={(e) => handleDragStart(e as any, node.id)}
                onDragOver={(e) => handleDragOver(e as any, node.id)}
                onDrop={(e) => handleDrop(e as any, node.id)}
                onDragEnd={handleDragEnd}
                className={`transition-colors ${isDragging ? 'opacity-50' : ''} ${isDropTarget && sameParent ? 'border-t-2 border-blue-500' : ''} ${!node.activo ? 'bg-gray-50 opacity-75' : ''}`}
            >
                <TableCell className="p-3">
                    <div className="flex items-center" style={{ paddingLeft: `${node.nivel * 24}px` }}>
                        <div className="flex items-center gap-1">
                            <div className="w-5 flex justify-center">
                                {hasChildren ? (
                                    <button onClick={() => toggleExpand(node.id)} className="hover:bg-gray-200 rounded p-0.5">
                                        {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                                    </button>
                                ) : (
                                    <span className="w-3.5" />
                                )}
                            </div>
                            <GripVertical className="h-3.5 w-3.5 text-gray-400 cursor-grab" />
                            <span className="text-sm font-medium">{node.nombre}</span>
                            {node.descripcion && (
                                <span className="text-xs text-muted-foreground ml-2 hidden sm:inline truncate max-w-[200px]">
                                    {node.descripcion}
                                </span>
                            )}
                        </div>
                    </div>
                </TableCell>
                <TableCell className="p-3 text-sm text-gray-500">{node.slug}</TableCell>
                <TableCell className="p-3 text-sm text-gray-600">
                    {node._count?.productos ?? 0}
                    {hasChildren && <span className="text-muted-foreground text-xs ml-1">(+ {node.children.length} sub)</span>}
                </TableCell>
                <TableCell className="p-3">
                    <Switch
                        checked={node.activo}
                        onCheckedChange={() => toggleActive(node.id, node.activo)}
                    />
                </TableCell>
                <TableCell className="p-3 space-x-1">
                    <Link href={`/admin/categories/${node.id}`}>
                        <Button variant="outline" size="sm">
                            <Eye className="h-3.5 w-3.5" />
                        </Button>
                    </Link>
                    <Link href={`/admin/categories/${node.id}?edit=true`}>
                        <Button variant="outline" size="sm">
                            <Pencil className="h-3.5 w-3.5" />
                        </Button>
                    </Link>
                    <Button variant="destructive" size="sm" onClick={() => deleteCategory(node.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </TableCell>
            </TableRow>
        );
    };

    const renderVisibleRows = () => {
        const visible = new Set<string>();

        function collectVisible(node: CategoryNode) {
            visible.add(node.id);
            if (expanded.has(node.id)) {
                for (const child of node.children) {
                    collectVisible(child);
                }
            }
        }

        for (const root of tree) {
            collectVisible(root);
        }

        return flatNodes.filter((n) => visible.has(n.id));
    };

    const visibleNodes = renderVisibleRows();

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Categorías</h1>
                <Link href="/admin/categories/new">
                    <Button>Nueva Categoría</Button>
                </Link>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Jerarquía de categorías</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        Arrastra las categorías para reordenarlas dentro del mismo nivel.
                        Solo se pueden reordenar categorías hermanas (mismo padre).
                    </p>
                    <div className="bg-white rounded overflow-x-auto border border-gray-200">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead>Productos</TableHead>
                                    <TableHead>Activo</TableHead>
                                    <TableHead>Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {visibleNodes.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                            No hay categorías.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    visibleNodes.map(renderRow)
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
