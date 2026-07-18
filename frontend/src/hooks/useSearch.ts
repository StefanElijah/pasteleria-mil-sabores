import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Product } from '@/types';

export function useSearch() {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (searchTerm.trim().length > 1) {
                setIsSearching(true);
                try {
                    const { data } = await api.get('/products?search=' + encodeURIComponent(searchTerm));
                    setSuggestions(data.slice(0, 8)); // mostrar máx 8 sugerencias
                } catch (error) {
                    console.error(error);
                    setSuggestions([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    return { searchTerm, setSearchTerm, suggestions, isSearching };
}