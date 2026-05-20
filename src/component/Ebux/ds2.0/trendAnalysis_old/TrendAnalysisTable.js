import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FaSort } from "react-icons/fa";
import './TrendAnalysisTable.css';

const TrendAnalysisTable = ({ setSelectedData }) => {
    // Time period view state
    const [timeView, setTimeView] = useState('monthly'); // 'monthly', 'weekly', 'daily'

    // Sorting state for columns
    const [sortColumn, setSortColumn] = useState('jan');
    const [sortDirection, setSortDirection] = useState('desc'); // null, 'asc', 'desc'

    // Sorting handler for any column
    const handleSort = (column) => {
        if (sortColumn === column) {
            // Toggle direction: null -> asc -> desc -> null
            setSortDirection((prev) => {
                if (prev === null) return 'asc';
                if (prev === 'asc') return 'desc';
                return null;
            });
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const [activeTab, setActiveTab] = useState('product');
    // selectedProducts stores ids (Set) across tabs; header select-all operates on visible rows
    const initialSelectedIds = ['nescafe-classic', 'nescafe-gold', 'nestea-peach', 'nescafe-sunrise', 'nescafe-black-roast'];
    const [selectedProducts, setSelectedProducts] = useState(new Set(initialSelectedIds));
    const [filterBy, setFilterBy] = useState('');

    // Reference to the header checkbox DOM node to control indeterminate state
    const headerCheckboxRef = useRef(null);
    const isInitialRender = useRef(true);
    const getDefaultIdsForTab = (tab) => {
        if (tab === 'product') {
            return ['nescafe-classic', 'nescafe-gold', 'nestea-peach', 'nescafe-sunrise', 'nescafe-black-roast'];
        } else if (tab === 'category') {
            return ['coffee-cat-a', 'coffee-cat-b', 'tea-cat-a'];
        } else if (tab === 'location') {
            return ['jammu-kashmir', 'punjab', 'himachal'];
        } else if (tab === 'brand') {
            return ['himalaya', 'amul', 'parle-agro'];
        }
        return [];
    };
    // Reset selections when switching tabs as per requirement
    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }

        const defaultIds = getDefaultIdsForTab(activeTab);
        // Ensure we don't exceed MAX_SELECTION
        const limitedDefaultIds = defaultIds.slice(0, MAX_SELECTION);
        setSelectedProducts(new Set(limitedDefaultIds));
    }, [activeTab]);
    // Generate comprehensive dummy data for all time periods
    const generateProductData = () => {
        const baseProducts = [
            { id: 'nescafe-classic', name: 'Nescafe Classic Coffee Jar 100g', icon: '☕', color: '#8B4513' },
            { id: 'nescafe-gold', name: 'Nescafe Gold Premium Blend 50g', icon: '☕', color: '#DAA520' },
            { id: 'nestea-peach', name: 'Nestea Peach Flavored Iced Tea', icon: '🧊', color: '#FF6B35' },
            { id: 'nescafe-sunrise', name: 'Nescafe Sunrise Instant Coffee', icon: '☕', color: '#FF8C00' },
            { id: 'nescafe-black-roast', name: 'Nescafe Black Roast Coffee 95g', icon: '☕', color: '#2F1B14' },
            { id: 'maggi-2minute', name: 'Maggi 2-Minute Masala Noodles', icon: '🍜', color: '#DC143C' },
            { id: 'maggi-oats', name: 'Maggi Oats Healthy Noodles', icon: '🍜', color: '#32CD32' },
            { id: 'kitkat-4finger', name: 'KitKat 4-Finger Chocolate Bar', icon: '🍫', color: '#8B0000' },
            { id: 'kitkat-chunky', name: 'KitKat Chunky Milk Chocolate', icon: '🍫', color: '#B22222' },
            { id: 'maggi-oats-2', name: 'Maggi Oats Noodles Pack 2', icon: '🍜', color: '#32CD32' },
            { id: 'nescafe-3in1', name: 'Nescafe 3-in-1 Coffee Mix', icon: '☕', color: '#8B4513' },
            { id: 'maggi-vegetable', name: 'Maggi Vegetable Atta Noodles', icon: '🍜', color: '#32CD32' },
            { id: 'kitkat-white', name: 'KitKat White Chocolate', icon: '🍫', color: '#F5F5DC' },
            { id: 'nescafe-cappuccino', name: 'Nescafe Cappuccino Mix', icon: '☕', color: '#D2691E' },
            { id: 'maggi-masala', name: 'Maggi Masala Noodles', icon: '🍜', color: '#DC143C' }
        ];

        return baseProducts.map(product => {
            const data = { ...product };

            if (timeView === 'monthly') {
                // Monthly data (Jan-Dec)
                data.jan = Math.floor(Math.random() * 100);
                data.feb = Math.floor(Math.random() * 100);
                data.mar = Math.floor(Math.random() * 100);
                data.apr = Math.floor(Math.random() * 100);
                data.may = Math.floor(Math.random() * 100);
                data.jun = Math.floor(Math.random() * 100);
                data.jul = Math.floor(Math.random() * 100);
                data.aug = Math.floor(Math.random() * 100);
                data.sep = Math.floor(Math.random() * 100);
                data.oct = Math.floor(Math.random() * 100);
                data.nov = Math.floor(Math.random() * 100);
                data.dec = Math.floor(Math.random() * 100);
            } else if (timeView === 'weekly') {
                // Weekly data (Week 1-4)
                data.week1 = Math.floor(Math.random() * 100);
                data.week2 = Math.floor(Math.random() * 100);
                data.week3 = Math.floor(Math.random() * 100);
                data.week4 = Math.floor(Math.random() * 100);
            } else if (timeView === 'daily') {
                // Daily data (last 7 days)
                data.day1 = Math.floor(Math.random() * 100);
                data.day2 = Math.floor(Math.random() * 100);
                data.day3 = Math.floor(Math.random() * 100);
                data.day4 = Math.floor(Math.random() * 100);
                data.day5 = Math.floor(Math.random() * 100);
                data.day6 = Math.floor(Math.random() * 100);
                data.day7 = Math.floor(Math.random() * 100);
            }

            return data;
        });
    };

    // Memoize datasets so values persist across re-renders; prevents resorting on checkbox clicks
    const productData = useMemo(() => generateProductData(), [timeView]);


    const generateCategoryData = () => {
        const baseCategories = [
            { id: 'coffee-cat-a', name: 'Coffee Category A', icon: '☕', color: '#8B4513' },
            { id: 'coffee-cat-b', name: 'Coffee Category B', icon: '☕', color: '#DAA520' },
            { id: 'tea-cat-a', name: 'Tea Category A', icon: '🧊', color: '#FF6B35' },
            { id: 'coffee-cat-c', name: 'Coffee Category C', icon: '☕', color: '#FF8C00' },
            { id: 'coffee-cat-d', name: 'Coffee Category D', icon: '☕', color: '#2F1B14' },
            { id: 'noodles-cat-a', name: 'Noodles Category A', icon: '🍜', color: '#DC143C' },
            { id: 'noodles-cat-b', name: 'Noodles Category B', icon: '🍜', color: '#32CD32' },
            { id: 'chocolate-cat-a', name: 'Chocolate Category A', icon: '🍫', color: '#8B0000' },
            { id: 'chocolate-cat-b', name: 'Chocolate Category B', icon: '🍫', color: '#B22222' },
            { id: 'noodles-cat-c', name: 'Noodles Category C', icon: '🍜', color: '#32CD32' }
        ];

        return baseCategories.map(category => {
            const data = { ...category };

            if (timeView === 'monthly') {
                data.jan = Math.floor(Math.random() * 100);
                data.feb = Math.floor(Math.random() * 100);
                data.mar = Math.floor(Math.random() * 100);
                data.apr = Math.floor(Math.random() * 100);
                data.may = Math.floor(Math.random() * 100);
                data.jun = Math.floor(Math.random() * 100);
                data.jul = Math.floor(Math.random() * 100);
                data.aug = Math.floor(Math.random() * 100);
                data.sep = Math.floor(Math.random() * 100);
                data.oct = Math.floor(Math.random() * 100);
                data.nov = Math.floor(Math.random() * 100);
                data.dec = Math.floor(Math.random() * 100);
            } else if (timeView === 'weekly') {
                data.week1 = Math.floor(Math.random() * 100);
                data.week2 = Math.floor(Math.random() * 100);
                data.week3 = Math.floor(Math.random() * 100);
                data.week4 = Math.floor(Math.random() * 100);
            } else if (timeView === 'daily') {
                data.day1 = Math.floor(Math.random() * 100);
                data.day2 = Math.floor(Math.random() * 100);
                data.day3 = Math.floor(Math.random() * 100);
                data.day4 = Math.floor(Math.random() * 100);
                data.day5 = Math.floor(Math.random() * 100);
                data.day6 = Math.floor(Math.random() * 100);
                data.day7 = Math.floor(Math.random() * 100);
            }

            return data;
        });
    };

    const generateLocationData = () => {
        const baseLocations = [
            { id: 'jammu-kashmir', name: 'Jammu & Kashmir', icon: '🏔️', color: '#8B4513' },
            { id: 'punjab', name: 'Punjab', icon: '🌾', color: '#DAA520' },
            { id: 'himachal', name: 'Himachal Pradesh', icon: '🏔️', color: '#FF6B35' },
            { id: 'maharashtra', name: 'Maharashtra', icon: '🏙️', color: '#FF8C00' },
            { id: 'west-bengal', name: 'West Bengal', icon: '🌊', color: '#2F1B14' },
            { id: 'gujarat', name: 'Gujarat', icon: '🏛️', color: '#DC143C' },
            { id: 'karnataka', name: 'Karnataka', icon: '🏛️', color: '#32CD32' },
            { id: 'tamil-nadu', name: 'Tamil Nadu', icon: '🏛️', color: '#8B0000' },
            { id: 'kerala', name: 'Kerala', icon: '🌴', color: '#B22222' },
            { id: 'rajasthan', name: 'Rajasthan', icon: '🏜️', color: '#32CD32' }
        ];

        return baseLocations.map(location => {
            const data = { ...location };

            if (timeView === 'monthly') {
                data.jan = Math.floor(Math.random() * 100);
                data.feb = Math.floor(Math.random() * 100);
                data.mar = Math.floor(Math.random() * 100);
                data.apr = Math.floor(Math.random() * 100);
                data.may = Math.floor(Math.random() * 100);
                data.jun = Math.floor(Math.random() * 100);
                data.jul = Math.floor(Math.random() * 100);
                data.aug = Math.floor(Math.random() * 100);
                data.sep = Math.floor(Math.random() * 100);
                data.oct = Math.floor(Math.random() * 100);
                data.nov = Math.floor(Math.random() * 100);
                data.dec = Math.floor(Math.random() * 100);
            } else if (timeView === 'weekly') {
                data.week1 = Math.floor(Math.random() * 100);
                data.week2 = Math.floor(Math.random() * 100);
                data.week3 = Math.floor(Math.random() * 100);
                data.week4 = Math.floor(Math.random() * 100);
            } else if (timeView === 'daily') {
                data.day1 = Math.floor(Math.random() * 100);
                data.day2 = Math.floor(Math.random() * 100);
                data.day3 = Math.floor(Math.random() * 100);
                data.day4 = Math.floor(Math.random() * 100);
                data.day5 = Math.floor(Math.random() * 100);
                data.day6 = Math.floor(Math.random() * 100);
                data.day7 = Math.floor(Math.random() * 100);
            }

            return data;
        });
    };

    const generateBrandData = () => {
        const baseBrands = [
            { id: 'himalaya', name: 'Himalaya Herbal Care', icon: '🌿', color: '#8B4513' },
            { id: 'amul', name: 'Amul', icon: '🥛', color: '#DAA520' },
            { id: 'parle-agro', name: 'Parle Agro', icon: '🥤', color: '#FF6B35' },
            { id: 'britannia', name: 'Britannia', icon: '🍪', color: '#FF8C00' },
            { id: 'dabur', name: 'Dabur', icon: '🌿', color: '#2F1B14' },
            { id: 'itc-foods', name: 'ITC Foods', icon: '🍜', color: '#DC143C' },
            { id: 'pepsico', name: 'PepsiCo', icon: '🥤', color: '#32CD32' },
            { id: 'nestle', name: 'Nestlé', icon: '🍫', color: '#8B0000' },
            { id: 'haldirams', name: 'Haldirams', icon: '🍪', color: '#B22222' },
            { id: 'mother-dairy', name: 'Mother Dairy', icon: '🥛', color: '#32CD32' }
        ];

        return baseBrands.map(brand => {
            const data = { ...brand };

            if (timeView === 'monthly') {
                data.jan = Math.floor(Math.random() * 100);
                data.feb = Math.floor(Math.random() * 100);
                data.mar = Math.floor(Math.random() * 100);
                data.apr = Math.floor(Math.random() * 100);
                data.may = Math.floor(Math.random() * 100);
                data.jun = Math.floor(Math.random() * 100);
                data.jul = Math.floor(Math.random() * 100);
                data.aug = Math.floor(Math.random() * 100);
                data.sep = Math.floor(Math.random() * 100);
                data.oct = Math.floor(Math.random() * 100);
                data.nov = Math.floor(Math.random() * 100);
                data.dec = Math.floor(Math.random() * 100);
            } else if (timeView === 'weekly') {
                data.week1 = Math.floor(Math.random() * 100);
                data.week2 = Math.floor(Math.random() * 100);
                data.week3 = Math.floor(Math.random() * 100);
                data.week4 = Math.floor(Math.random() * 100);
            } else if (timeView === 'daily') {
                data.day1 = Math.floor(Math.random() * 100);
                data.day2 = Math.floor(Math.random() * 100);
                data.day3 = Math.floor(Math.random() * 100);
                data.day4 = Math.floor(Math.random() * 100);
                data.day5 = Math.floor(Math.random() * 100);
                data.day6 = Math.floor(Math.random() * 100);
                data.day7 = Math.floor(Math.random() * 100);
            }

            return data;
        });
    };

    const categoryData = useMemo(() => generateCategoryData(), [timeView]);
    const locationData = useMemo(() => generateLocationData(), [timeView]);
    const brandData = useMemo(() => generateBrandData(), [timeView]);

    // Helper function to get dynamic columns based on time view
    const getDynamicColumns = () => {
        if (timeView === 'monthly') {
            return [
                { key: 'jan', label: 'Jan', fullLabel: 'January' },
                // { key: 'feb', label: 'Feb', fullLabel: 'February' },
                // { key: 'mar', label: 'Mar', fullLabel: 'March' },
                // { key: 'apr', label: 'Apr', fullLabel: 'April' },
                // { key: 'may', label: 'May', fullLabel: 'May' },
                // { key: 'jun', label: 'Jun', fullLabel: 'June' },
                // { key: 'jul', label: 'Jul', fullLabel: 'July' },
                // { key: 'aug', label: 'Aug', fullLabel: 'August' },
                // { key: 'sep', label: 'Sep', fullLabel: 'September' },
                // { key: 'oct', label: 'Oct', fullLabel: 'October' },
                // { key: 'nov', label: 'Nov', fullLabel: 'November' },
                // { key: 'dec', label: 'Dec', fullLabel: 'December' }
            ];
        } else if (timeView === 'weekly') {
            return [
                { key: 'week1', label: 'Week 1', fullLabel: 'Week 1 (July)' },
                { key: 'week2', label: 'Week 2', fullLabel: 'Week 2 (July)' },
                { key: 'week3', label: 'Week 3', fullLabel: 'Week 3 (July)' },
                { key: 'week4', label: 'Week 4', fullLabel: 'Week 4 (July)' }
            ];
        } else if (timeView === 'daily') {
            const today = new Date();
            const days = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const dayKey = `day${7 - i}`;
                const dayLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                days.push({ key: dayKey, label: dayLabel, fullLabel: dayLabel });
            }
            return days;
        }
        return [];
    };

    const dynamicColumns = useMemo(() => getDynamicColumns(), [timeView]);
    const MAX_SELECTION = 5;
    const MIN_SELECTION = 1;

    const handleProductSelect = (productId, checked) => {
        // Enforce max 5 and min 1 selected
        setSelectedProducts((prev) => {
            const next = new Set(prev);

            if (checked) {
                if (next.size >= MAX_SELECTION && !next.has(productId)) {
                    // window.alert(`You can select a maximum of ${MAX_SELECTION}. Please deselect one to select another.`);
                    return next; // ignore
                }
                next.add(productId);
                return next;
            } else {
                if (!next.has(productId)) return next;
                if (next.size <= MIN_SELECTION) {
                    // window.alert(`At least ${MIN_SELECTION} must remain selected.`);
                    return next; // prevent removing the last one
                }
                next.delete(productId);
                return next;
            }
        });
    };

    // Calculates average for footer
    const calculateAverage = (products, columnKey) => {
        if (products.length === 0) return 0;
        const sum = products.reduce((acc, product) => acc + (product[columnKey] || 0), 0);
        return Math.round(sum / products.length);
    };

    // Choose which data to show based on activeTab
    let tableData = productData;
    if (activeTab === 'category') tableData = categoryData;
    else if (activeTab === 'location') tableData = locationData;
    else if (activeTab === 'brand') tableData = brandData;

    // Sort tableData by selected column if sortDirection is set
    const sortedTableData = useMemo(() => {
        const data = [...tableData];
        if (sortDirection && sortColumn) {
            data.sort((a, b) => {
                if (sortColumn === 'name') {
                    return sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
                }
                return sortDirection === 'asc' ? (a[sortColumn] - b[sortColumn]) : (b[sortColumn] - a[sortColumn]);
            });
        }
        return data;
    }, [tableData, sortColumn, sortDirection]);

    // visibleSelectedCount considers only rows in current tableData
    const visibleSelectedCount = tableData.reduce((acc, p) => acc + (selectedProducts.has(p.id) ? 1 : 0), 0);

    // update header checkbox indeterminate/checked state whenever selection or visible rows change
    useEffect(() => {
        const node = headerCheckboxRef.current;
        if (!node) return;
        if (tableData.length === 0) {
            node.checked = false;
            node.indeterminate = false;
            return;
        }
        node.checked = visibleSelectedCount === tableData.length;
        node.indeterminate = visibleSelectedCount > 0 && visibleSelectedCount < tableData.length;
    }, [visibleSelectedCount, tableData.length]);

    // Publish selection payload to parent (debounced by render via useMemo inputs)
    const selectionSnapshot = useMemo(() => {
        const periods = dynamicColumns.map(c => c.fullLabel);
        const rows = sortedTableData
            .filter(r => selectedProducts.has(r.id))
            .map(r => ({ id: r.id, name: r.name, color: r.color, values: dynamicColumns.map(c => r[c.key] ?? 0) }));
        return { timeView, periods, rows };
    }, [timeView, dynamicColumns, sortedTableData, selectedProducts]);

    useEffect(() => {
        if (!setSelectedData) return;
        const refSig = (selectionSnapshotRef.current ||= { sig: '' });
        const nextSig = JSON.stringify(selectionSnapshot);
        if (refSig.sig !== nextSig) {
            refSig.sig = nextSig;
            setSelectedData(selectionSnapshot);
        }
    }, [selectionSnapshot, setSelectedData]);

    const selectionSnapshotRef = useRef({ sig: '' });

    // Select / Deselect all visible rows
    const handleSelectAllVisible = () => {
        setSelectedProducts((prev) => {
            const current = new Set(prev);
            // Use sortedTableData instead of tableData to get the correct order
            const visibleIds = sortedTableData.map((p) => p.id);
            const selectedVisible = visibleIds.filter((id) => current.has(id));
            const selectedVisibleCount = selectedVisible.length;

            // Determine toggle action without relying on DOM checked state
            // If we already have at least MAX_SELECTION (or all visible if fewer) selected in the current view,
            // interpret this click as an uncheck action. Otherwise, treat as select-more.
            const maxSelectableHere = Math.min(visibleIds.length, MAX_SELECTION);
            const shouldUncheck = selectedVisibleCount >= maxSelectableHere && selectedVisibleCount > 0;

            if (shouldUncheck) {
                // Uncheck: deselect all visible except leave exactly MIN_SELECTION selected overall
                // Prefer to keep the first currently selected visible item if any
                const keepId = selectedVisible[0] || (current.size > 0 ? Array.from(current)[0] : null);

                // Remove visible selected except the keepId
                for (const id of selectedVisible) {
                    if (id !== keepId && current.size > MIN_SELECTION) {
                        current.delete(id);
                    }
                }

                // If still more than MIN_SELECTION due to non-visible selections, remove them until MIN_SELECTION remains
                if (current.size > MIN_SELECTION) {
                    for (const id of Array.from(current)) {
                        if (id === keepId) continue;
                        if (current.size <= MIN_SELECTION) break;
                        if (!visibleIds.includes(id)) {
                            current.delete(id);
                        }
                    }
                }

                // Ensure at least one remains selected
                if (current.size < MIN_SELECTION && keepId) {
                    current.add(keepId);
                }
                return current;
            }

            // Select: add visible items until capacity is reached
            const capacity = MAX_SELECTION - current.size;
            if (capacity <= 0) {
                return current;
            }

            let count = 0;
            for (let i = 0; i < visibleIds.length && count < capacity; i++) {
                const id = visibleIds[i];
                if (!current.has(id)) {
                    current.add(id);
                    count++;
                }
            }
            return current;
        });
    };

    // Download current view as CSV (respects active tab and current sorting)
    const handleDownload = () => {
        const header = [`${activeTab}`, ...dynamicColumns.map(col => col.fullLabel)];
        const rows = sortedTableData.map((p) => [
            p.name,
            ...dynamicColumns.map(col => p[col.key] || 0)
        ]);

        // Escape values that may contain commas or quotes
        const escape = (val) => {
            const str = String(val ?? '');
            if (/[",\n]/.test(str)) {
                return '"' + str.replace(/"/g, '""') + '"';
            }
            return str;
        };

        const csv = [header, ...rows].map((r) => r.map(escape).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const fileBase = `products_distribution_${activeTab}_${timeView}`;
        link.download = `${fileBase}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="products-distribution">
            <div className="header">
                <div className="header-left">
                    <h1>Products Distribution</h1>
                    <span className="date-range">23/07/25 → 23/07/25</span>
                </div>
                <div className="header-right">
                    <div className="filter-controls" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="filter-dropdown">
                            <select
                                value={filterBy}
                                onChange={(e) => setFilterBy(e.target.value)}
                                style={{
                                    appearance: "none",
                                    background: "url('/assets/images/filterby.svg') no-repeat right 8px center",
                                    backgroundSize: "16px 16px",
                                    paddingRight: "30px",
                                }}
                            >
                                <option value="">Filter By</option>
                                <option value="coffee">Coffee</option>
                                <option value="noodles">Noodles</option>
                                <option value="chocolate">Chocolate</option>
                            </select>
                        </div>
                        <button
                            type="button"
                            className="graphIconBtn"
                            style={{ background: "none", border: "none", cursor: "pointer", marginLeft: 8 }}
                            onClick={handleDownload}
                            aria-label="Download table as CSV"
                        >
                            <img src="/assets/images/downloadIcon.svg" width={20} height={20} alt="Download" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="filters-section">
                <div className="filter-tabs">
                    <div className={`filter-tab${activeTab === 'category' ? ' active' : ''}`} onClick={() => setActiveTab('category')} style={{ cursor: 'pointer' }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', width: '100%' }}>
                            <img src="/assets/images/megaphone.svg" alt="Category" className="filter-logo" />
                            <span>Category</span>
                            <span className="tblTag">9/18</span>
                        </div>
                    </div>

                    <div className={`filter-tab${activeTab === 'product' ? ' active' : ''}`} onClick={() => setActiveTab('product')} style={{ cursor: 'pointer' }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', width: '100%' }}>
                            <img src="/assets/images/productInActiveImage.svg" alt="Product" className="filter-logo" />
                            <span>Product</span>
                            <span className="tblTag">2/180</span>
                        </div>
                    </div>

                    <div className={`filter-tab${activeTab === 'brand' ? ' active' : ''}`} onClick={() => setActiveTab('brand')} style={{ cursor: 'pointer' }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', width: '100%' }}>
                            <img src="/assets/images/BrandIcon.svg" alt="Brand" className="filter-logo" />
                            <span>Brand</span>
                            <span className="tblTag">2/80</span>
                        </div>
                    </div>

                    <div className={`filter-tab${activeTab === 'location' ? ' active' : ''}`} onClick={() => setActiveTab('location')} style={{ cursor: 'pointer' }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', width: '100%' }}>
                            <img src="/assets/images/locationIcon.svg" alt="Location" className="filter-logo" />
                            <span>Location</span>
                            <span className="tblTag">2/80</span>
                        </div>
                    </div>
                </div>

                <div className="view-selector">
                    <select
                        value={timeView}
                        onChange={(e) => setTimeView(e.target.value)}
                        style={{ fontSize: '16px', fontWeight: 400, borderRadius: '8px', padding: '5px 11px', border: '1px solid #E0E0E0' }}
                    >
                        <option value="monthly">Monthly View</option>
                        <option value="weekly">Weekly View</option>
                        <option value="daily">Daily View</option>
                    </select>
                </div>
            </div>

            <div className="table-container">
                <style>
                    {`
                        .sticky-table {
                            border-collapse: separate;
                            border-spacing: 0;
                        }
                        .sticky-header {
                            position: sticky;
                            top: 0;
                            z-index: 20;
                            background: #F6F9FB;
                            border: none;
                            margin: 0;
                            padding: 0;
                        }
                        .sticky-footer {
                            position: sticky;
                            bottom: 0;
                            z-index: 40;
                            background: #F6F9FB; /* match header */
                            border: none;
                            box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.08);
                            margin: 0;
                            padding: 0;
                        }
                        .sticky-first-column {
                            position: sticky !important;
                            left: 0;
                            z-index: 10;
                            background: #F6F9FB;
                            border-right: 2px solid #E5E7EB;
                        }
                        .sticky-first-column-body {
                            position: sticky;
                            left: 0;
                            z-index: 15;
                            background: #FFFFFF;
                            border-right: 2px solid #E5E7EB;
                        }
                        .sticky-first-column-footer {
                            position: sticky;
                            left: 0;
                            z-index: 15;
                            background: #FFFFFF;
                            border-right: 2px solid #E5E7EB;
                        }
                    `}
                </style>
                <table className="products-table sticky-table  ">
                    <thead className='table-head sticky-header rounded-lg'>
                        <tr>
                            <th className="products-header sticky-first-column">
                                <div className="th-content">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <input
                                            type="checkbox"
                                            ref={headerCheckboxRef}
                                            onChange={handleSelectAllVisible}
                                            // checked & indeterminate are controlled by effect above
                                            aria-label="Select all visible"
                                        />
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                                            <span className="th-label" style={{ textTransform: 'capitalize', fontWeight: 600 }}>{activeTab}</span>
                                            <button
                                                type="button"
                                                className={`sort-btn ${sortColumn === 'name' ? 'active' : ''}`}
                                                onClick={() => handleSort('name')}
                                                aria-label="Sort by name"
                                                title={`Sort by name (${sortDirection === 'asc' && sortColumn === 'name' ? 'asc' : sortDirection === 'desc' && sortColumn === 'name' ? 'desc' : 'unsorted'})`}
                                                style={{
                                                    marginLeft: 0,
                                                    width: 18,
                                                    height: 18,
                                                    color: sortColumn === 'name' ? '#111827' : '#475569',
                                                    opacity: sortColumn === 'name' ? 1 : 0.7,
                                                    transform: sortColumn === 'name' && sortDirection === 'desc' ? 'rotate(180deg)' : 'none'
                                                }}
                                            >
                                                <FaSort size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </th>

                            {dynamicColumns.map((column, index) => (
                                <th
                                    key={column.key}
                                    className="week-header cursor-default"
                                    style={{
                                        borderTopRightRadius: index === dynamicColumns.length - 1 ? '12px' : '0px'
                                    }}
                                >
                                    <div className="th-content" style={{ justifyContent: 'flex-start' }}>
                                        <div 
                                        onClick={() => handleSort(column.key)}
                                        className="week-label cursor-pointer" style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                                            <span className="th-label">{column.fullLabel}</span>
                                            <button
                                                type="button"
                                                className={`sort-btn ${sortColumn === column.key ? 'active' : ''}`}
                                                aria-label={`Sort by ${column.label}`}
                                                title={`Sort by ${column.label} (${sortDirection === 'asc' && sortColumn === column.key ? 'asc' : sortDirection === 'desc' && sortColumn === column.key ? 'desc' : 'unsorted'})`}
                                                style={{
                                                    marginLeft: 0,
                                                    width: 18,
                                                    height: 18,
                                                    color: sortColumn === column.key ? '#111827' : '#475569',
                                                    opacity: sortColumn === column.key ? 1 : 0.7,
                                                    transform: sortColumn === column.key && sortDirection === 'desc' ? 'rotate(180deg)' : 'none'
                                                }}
                                            >
                                                <FaSort size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className='table-body'>
                        {sortedTableData.map((product) => (
                            <tr key={product.id} className={selectedProducts.has(product.id) ? 'selected' : ''}>
                                <td className="product-cell sticky-first-column-body">
                                    <div className="product-info">
                                        <input
                                            type="checkbox"
                                            checked={selectedProducts.has(product.id)}
                                            onChange={(e) => handleProductSelect(product.id, e.target.checked)}
                                            onClick={(e) => e.stopPropagation()}
                                            className="product-checkbox"
                                        />
                                        <div className="product-icon" style={{ backgroundColor: product.color }}>{product.icon}</div>
                                        <span className="product-name">{product.name}</span>
                                    </div>
                                </td>

                                {dynamicColumns.map((column) => (
                                    <td key={column.key} className="percentage-cell">
                                        <span className="percentage">{product[column.key] || 0}%</span>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className='table-footer sticky-footer'>
                        <tr>
                            <td className="product-cell sticky-first-column-footer">
                                <div>
                                    <div style={{ color: '#374151', fontWeight: 500 }}>Total {activeTab}</div>
                                    <div style={{ fontWeight: 600 }}>{tableData.length}</div>
                                </div>
                            </td>
                            {dynamicColumns.map((column) => (
                                <td key={column.key} className="percentage-cell">
                                    <div>
                                        <div style={{ color: '#374151', fontWeight: 500 }}>Avg OSA - {column.label}</div>
                                        <div style={{ fontWeight: 600 }}>{calculateAverage(tableData, column.key)}%</div>
                                    </div>
                                </td>
                            ))}
                        </tr>
                    </tfoot>
                </table>
            </div>

        </div>
    );
};

export default TrendAnalysisTable;
