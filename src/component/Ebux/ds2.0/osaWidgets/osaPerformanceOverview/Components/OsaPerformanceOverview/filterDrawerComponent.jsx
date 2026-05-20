import React, { useEffect, useMemo, useState } from "react";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    rectSortingStrategy,
    useSortable,
    arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEbuxContext } from "../../../../../Context/EbuxProvider";

// ----------------- Sortable Item -----------------
function SortableItem({ id, label, checked, disabled, onToggle }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-2 border-b py-2"
        >
            <span
                {...attributes}
                {...listeners}
                className="cursor-grab text-gray-400 px-2"
            >
                <svg width="19" height="24" viewBox="0 0 19 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.166 3.97266C16.7682 3.97266 16.3867 4.13069 16.1054 4.412C15.8241 4.6933 15.666 5.07483 15.666 5.47266C15.666 5.87048 15.8241 6.25201 16.1054 6.53332C16.3867 6.81462 16.7682 6.97266 17.166 6.97266C17.5638 6.97266 17.9454 6.81462 18.2267 6.53332C18.508 6.25201 18.666 5.87048 18.666 5.47266C18.666 5.07483 18.508 4.6933 18.2267 4.412C17.9454 4.13069 17.5638 3.97266 17.166 3.97266ZM9.66602 3.97266C9.26819 3.97266 8.88666 4.13069 8.60536 4.412C8.32405 4.6933 8.16602 5.07483 8.16602 5.47266C8.16602 5.87048 8.32405 6.25201 8.60536 6.53332C8.88666 6.81462 9.26819 6.97266 9.66602 6.97266C10.0638 6.97266 10.4454 6.81462 10.7267 6.53332C11.008 6.25201 11.166 5.87048 11.166 5.47266C11.166 5.07483 11.008 4.6933 10.7267 4.412C10.4454 4.13069 10.0638 3.97266 9.66602 3.97266ZM2.16602 3.97266C1.76819 3.97266 1.38666 4.13069 1.10536 4.412C0.824051 4.6933 0.666016 5.07483 0.666016 5.47266C0.666016 5.87048 0.824051 6.25201 1.10536 6.53332C1.38666 6.81462 1.76819 6.97266 2.16602 6.97266C2.56384 6.97266 2.94537 6.81462 3.22667 6.53332C3.50798 6.25201 3.66602 5.87048 3.66602 5.47266C3.66602 5.07483 3.50798 4.6933 3.22668 4.412C2.94537 4.13069 2.56384 3.97266 2.16602 3.97266Z" fill="#53545E" />
                    <path d="M17.166 10.9727C16.7682 10.9727 16.3867 11.1307 16.1054 11.412C15.8241 11.6933 15.666 12.0748 15.666 12.4727C15.666 12.8705 15.8241 13.252 16.1054 13.5333C16.3867 13.8146 16.7682 13.9727 17.166 13.9727C17.5638 13.9727 17.9454 13.8146 18.2267 13.5333C18.508 13.252 18.666 12.8705 18.666 12.4727C18.666 12.0748 18.508 11.6933 18.2267 11.412C17.9454 11.1307 17.5638 10.9727 17.166 10.9727ZM9.66602 10.9727C9.26819 10.9727 8.88666 11.1307 8.60536 11.412C8.32405 11.6933 8.16602 12.0748 8.16602 12.4727C8.16602 12.8705 8.32405 13.252 8.60536 13.5333C8.88666 13.8146 9.26819 13.9727 9.66602 13.9727C10.0638 13.9727 10.4454 13.8146 10.7267 13.5333C11.008 13.252 11.166 12.8705 11.166 12.4727C11.166 12.0748 11.008 11.6933 10.7267 11.412C10.4454 11.1307 10.0638 10.9727 9.66602 10.9727ZM2.16602 10.9727C1.76819 10.9727 1.38666 11.1307 1.10536 11.412C0.824051 11.6933 0.666016 12.0748 0.666016 12.4727C0.666016 12.8705 0.824051 13.252 1.10536 13.5333C1.38666 13.8146 1.76819 13.9727 2.16602 13.9727C2.56384 13.9727 2.94537 13.8146 3.22667 13.5333C3.50798 13.252 3.66602 12.8705 3.66602 12.4727C3.66602 12.0748 3.50798 11.6933 3.22668 11.412C2.94537 11.1307 2.56384 10.9727 2.16602 10.9727Z" fill="#53545E" />
                    <path d="M17.166 17.9727C16.7682 17.9727 16.3867 18.1307 16.1054 18.412C15.8241 18.6933 15.666 19.0748 15.666 19.4727C15.666 19.8705 15.8241 20.252 16.1054 20.5333C16.3867 20.8146 16.7682 20.9727 17.166 20.9727C17.5638 20.9727 17.9454 20.8146 18.2267 20.5333C18.508 20.252 18.666 19.8705 18.666 19.4727C18.666 19.0748 18.508 18.6933 18.2267 18.412C17.9454 18.1307 17.5638 17.9727 17.166 17.9727ZM9.66602 17.9727C9.26819 17.9727 8.88666 18.1307 8.60536 18.412C8.32405 18.6933 8.16602 19.0748 8.16602 19.4727C8.16602 19.8705 8.32405 20.252 8.60536 20.5333C8.88666 20.8146 9.26819 20.9727 9.66602 20.9727C10.0638 20.9727 10.4454 20.8146 10.7267 20.5333C11.008 20.252 11.166 19.8705 11.166 19.4727C11.166 19.0748 11.008 18.6933 10.7267 18.412C10.4454 18.1307 10.0638 17.9727 9.66602 17.9727ZM2.16602 17.9727C1.76819 17.9727 1.38666 18.1307 1.10536 18.412C0.824051 18.6933 0.666016 19.0748 0.666016 19.4727C0.666016 19.8705 0.824051 20.252 1.10536 20.5333C1.38666 20.8146 1.76819 20.9727 2.16602 20.9727C2.56384 20.9727 2.94537 20.8146 3.22667 20.5333C3.50798 20.252 3.66602 19.8705 3.66602 19.4727C3.66602 19.0748 3.50798 18.6933 3.22668 18.412C2.94537 18.1307 2.56384 17.9727 2.16602 17.9727Z" fill="#53545E" />
                </svg>
            </span>
            <input
                type="checkbox"
                disabled={disabled}
                checked={disabled ? false : checked}
                onChange={onToggle}
                className="w-4 h-4"
            />
            <span className="text-sm">{label}</span>
        </div>
    );
}

// ----------------- Tabs Content -----------------
function TilesTab({ items, onToggle, toggleAll, selectedCount, minRequired, maxAllowed }) {
    const [search, setSearch] = useState("");
    const [showAll, setShowAll] = useState(false);

    const filtered = items.filter((i) =>
        i.label.toLowerCase().includes(search.toLowerCase())
    );
    const visible = showAll ? filtered : filtered.slice(0, 3);

    return (
        <div>
            {/* Search */}
            <input
                type="text"
                placeholder="Search..."
                className="w-full border rounded-full px-3 py-1 text-sm mb-3"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Select All */}
            <div className="flex items-center gap-2 mb-2">
                <input
                    type="checkbox"
                    checked={items.length > 0 && items.every((i) => i.checked)}
                    onChange={() => toggleAll()}
                    className="w-4 h-4"
                    title={`Select up to ${maxAllowed} total`}
                />
                <span className="text-sm">Select All</span>
            </div>
            <div className="max-h-60 overflow-y-auto">

                {/* Items */}
                {visible.map((item) => {
                    // when an item is unchecked & selectedCount >= maxAllowed => disable checking
                    const disableCheck = !item.checked && selectedCount >= maxAllowed;
                    // when an item is checked & selectedCount <= minRequired => disable unchecking
                    const disableUncheck = item.checked && selectedCount <= minRequired;
                    const disabled = disableCheck || disableUncheck;

                    return (
                        <div key={item.id} className="flex items-center gap-2 py-1">
                            <input
                                type="checkbox"
                                checked={!!item.checked}
                                onChange={() => !disabled && onToggle(item.id)}
                                className={`w-4 h-4 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={disabled}
                                title={
                                    disabled
                                        ? disableCheck
                                            ? `Maximum ${maxAllowed} selections allowed`
                                            : `Minimum ${minRequired} selections required`
                                        : undefined
                                }
                            />
                            <span className={`text-sm ${disabled ? "opacity-60" : ""}`}>{item.label}</span>
                        </div>
                    );
                })}
            </div>

            {/* View More */}
            {filtered.length > 3 && (
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="text-blue-600 text-sm mt-2"
                >
                    {showAll ? "View Less" : "View More"}
                </button>
            )}
        </div>
    );
}

// ----------------- Main Widget -----------------
function EditWidget({ defaultSelected = [], defaultMatrix = [], updateDefaultSelected = () => { }, updateMatrix = () => { } }) {
    const {
        kpi,
        filters,
        clientCustomizeColumnsComprehensiveBreakdown,
        activeClientProject
    } = useEbuxContext();
    console.log({ clientCustomizeColumnsComprehensiveBreakdown });

    const MIN_REQUIRED = 3;
    const MAX_ALLOWED = activeClientProject?.uiType === 'ds3' ? 14 : 6;
    const MIN_MATRIX = 1;
    const MAX_MATRIX = 3;
    // Matrix metrics (OSA etc.)

    const [metrics, setMetrics] = useState(clientCustomizeColumnsComprehensiveBreakdown?.ds?.columns?.filter(i => (i?.allowInWidget && ((i?.kpi?.indexOf("OSA") > -1) || (i?.kpi?.indexOf("PRO") > -1)) && (i?.allowKPI?.indexOf(kpi) > -1) && (!i?.value?.includes("competition_")) && (["previous_osa", "last_month_sale", "last_in_stock"]?.indexOf(i?.key) == -1)))?.map(i => ({ ...i, label: i?.title, id: i?.value, checked: i?.kpi?.indexOf(kpi) > -1, disabled: i?.isDisabled })));
    // const [metrics, setMetrics] = useState(kpi=='OSA'?[
    //     { id: "osa", label: "Avg OSA", checked: false, disabled: false },
    //     { id: "wt_osa", label: "Wgt OSA", checked: false, disabled: false },
    //     { id: "avg_offtake_osa", label: "Avg Off take", checked: false, disabled: true },
    // ]:kpi=='PRO'?[
    //     { id: "pro", label: "Promotions", checked: false, disabled: false },
    //     { id: "mrp", label: "MRP", checked: false, disabled: false },
    //     { id: "sp", label: "SP", checked: false, disabled: false },
    // ]:[]);
    const getInitialItems = () => {
        const brandItems = (filters?.brand ?? [])?.map((b, idx) => ({
            ...b,
            idx,
            id: `brand-${b?.label ?? b?.lable}`,
            label: b?.label ?? b?.lable,
            type: "brand",
            checked: defaultSelected?.some((s) => s.id === `brand-${b?.label ?? b?.lable}`) ?? false,
        }))?.sort((a, b) => {
            if (a.checked && !b.checked) return -1;
            if (!a.checked && b.checked) return 1;
            return a.label.localeCompare(b.label);
        });
        const categoryItems = (filters?.category ?? []).map((c, idx) => ({
            ...c,
            idx,
            id: `category-${c?.label ?? c?.lable}`,
            label: c?.label ?? c?.lable,
            type: "category",
            checked: defaultSelected?.some((s) => s.id === `category-${c?.label ?? c?.lable}`) ?? false,
        }))?.sort((a, b) => {
            if (a.checked && !b.checked) return -1;
            if (!a.checked && b.checked) return 1;
            return a.label.localeCompare(b.label);
        });

        const motherPackItems = ((activeClientProject?.client_project_id == 2 && (kpi == "OSA" || kpi == "PRO")) ? (filters?.mother_pack ?? []) : []).map((c, idx) => ({
            ...c,
            idx,
            id: `mother_pack-${c?.label ?? c?.lable}`,
            label: c?.label ?? c?.lable,
            type: "mother_pack",
            checked: defaultSelected?.some((s) => s.id === `mother_pack-${c?.label ?? c?.lable}`) ?? false,
        }))?.sort((a, b) => {
            if (a.checked && !b.checked) return -1;
            if (!a.checked && b.checked) return 1;
            return a.label.localeCompare(b.label);
        });

        const all = [...brandItems, ...motherPackItems, ...categoryItems];

        let checked = all.filter((a) => a.checked);
        if (checked.length > MAX_ALLOWED) {
            const keep = new Set(checked.slice(0, MAX_ALLOWED).map((c) => c.id));
            all.forEach((a) => {
                a.checked = keep.has(a.id);
            });
        }

        checked = all.filter((a) => a.checked);
        if (checked.length < MIN_REQUIRED) {
            for (let i = 0; i < all.length && checked.length < MIN_REQUIRED; i++) {
                if (!all[i].checked) {
                    all[i].checked = true;
                    checked.push(all[i]);
                }
            }
        }

        return all;
    };
    const [items, setItems] = useState([]);
    useEffect(() => {
        updateDefaultSelected(items.filter((i) => i.checked));
    }, [items]);
    useEffect(() => updateMatrix(metrics.filter((m) => m.checked)), [metrics]);

    useEffect(() => {
        setItems(getInitialItems());
        let initMatrix = defaultMatrix ?? [];
        metrics.forEach((m) => { if (!initMatrix?.some((im) => im.id === m.id)) { initMatrix.push(m); } });

        const checkedCount = initMatrix.filter(m => m.checked).length;
        if (checkedCount < MIN_MATRIX) {
            let count = checkedCount;
            initMatrix = initMatrix.map((m) => {
                if (!m.checked && count < MIN_MATRIX) {
                    count++;
                    return { ...m, checked: true };
                }
                return m;
            });
        }
        setMetrics(initMatrix);
    }, [filters]);
    const selectedCount = useMemo(() => items.filter((i) => i?.checked).length, [items]);
    const brandSelectedCount = useMemo(() => items.filter((i) => i?.checked && i?.type == "brand").length, [items]);
    const categorySelectedCount = useMemo(() => items.filter((i) => i?.checked && i?.type == "category").length, [items]);
    const mother_packSelectedCount = useMemo(() => items.filter((i) => i?.checked && i?.type == "mother_pack").length, [items]);
    const [activeTab, setActiveTab] = useState("brand");

    const toggleItem = (id) => {
        setItems((prev) => {
            const current = prev.find((p) => p.id === id);
            if (!current) return prev;

            const currentlyChecked = current.checked;
            const selected = prev.filter((p) => p.checked).length;

            // trying to uncheck but at min -> block
            if (currentlyChecked && selected <= MIN_REQUIRED) {
                return prev;
            }
            // trying to check but at max -> block
            if (!currentlyChecked && selected >= MAX_ALLOWED) {
                return prev;
            }

            return prev.map((p) => (p.id === id ? { ...p, checked: !p.checked } : p));
        });
    };
    const toggleAll = () => {
        setItems((prev) => {
            const allChecked = prev.every((i) => i.checked);

            if (allChecked) {
                // uncheck all but keep MIN_REQUIRED checked (first items in order)
                const newItems = prev.map((i) => ({ ...i, checked: false }));
                for (let i = 0; i < MIN_REQUIRED && i < newItems.length; i++) {
                    newItems[i].checked = true;
                }
                return newItems;
            } else {
                // select as many as possible up to MAX_ALLOWED, preserving existing checked
                // const newItems = prev.map((i) => ({ ...i }));
                // let count = newItems.filter((i) => i.checked).length;
                // for (let i = 0; i < newItems.length && count < MAX_ALLOWED; i++) {
                //     if (!newItems[i].checked&&newItems[i].type===activeTab) {
                //         newItems[i].checked = true;
                //         count++;
                //     }
                // }
                // return newItems;
                const newItems = prev.map((i) => ({ ...i, checked: (i.type != activeTab ? false : i.checked) }));
                let count = newItems.filter((i) => i.checked).length;
                for (let i = 0; i < newItems.length && count < MAX_ALLOWED; i++) {
                    if (!newItems[i].checked && newItems[i].type === activeTab) {
                        newItems[i].checked = true;
                        count++;
                    }
                }
                return newItems;
            }
        });
    };

    const brandItems = items.filter((i) => i.type === "brand");
    const categoryItems = items.filter((i) => i.type === "category");
    const motherPackItems = items.filter((i) => i.type === "mother_pack");


    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            setMetrics((prev) => {
                const oldIndex = prev.findIndex((i) => i.id === active.id);
                const newIndex = prev.findIndex((i) => i.id === over.id);
                return arrayMove(prev, oldIndex, newIndex);
            });
        }
    };

    return (
        <div className="flex-1 w-full bg-white border p-6 relative flex flex-col">
            {/* Tabs */}
            <div className="flex gap-4 border-b mb-4">
                <button
                    onClick={() => setActiveTab("brand")}
                    className={`pb-2 text-sm font-medium ${activeTab === "brand"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500"
                        }`}
                >
                    Brand{" "}
                    <span className="ml-1 text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                        {brandSelectedCount}
                    </span>
                </button>
                {(activeClientProject?.client_project_id == 2 && (kpi == "OSA" || kpi == "PRO")) ?

                    <button
                        onClick={() => setActiveTab("mother_pack")}
                        className={`pb-2 text-sm font-medium ${activeTab === "mother_pack"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500"
                            }`}
                    >
                        Mother Pack{" "}
                        <span className="ml-1 text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                            {mother_packSelectedCount}
                        </span>
                    </button>
                    : <></>}
                <button
                    onClick={() => setActiveTab("category")}
                    className={`pb-2 text-sm font-medium ${activeTab === "category"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500"
                        }`}
                >
                    {
                        activeClientProject?.indented?.pdp?.category ? "Sub Category" : "Category"
                    }

                    {" "}
                    <span className="ml-1 text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                        {categorySelectedCount}
                    </span>
                </button>
            </div>

            {/* Tiles Section */}
            <div className="mb-6">
                {activeTab === "brand" && (
                    <TilesTab
                        items={brandItems}
                        onToggle={toggleItem}
                        toggleAll={toggleAll}
                        selectedCount={selectedCount}
                        minRequired={MIN_REQUIRED}
                        maxAllowed={MAX_ALLOWED}
                    />
                )}
                {activeTab === "mother_pack" && (activeClientProject?.client_project_id == 2 && (kpi == "OSA" || kpi == "PRO")) && (
                    <TilesTab
                        items={motherPackItems}
                        onToggle={toggleItem}
                        toggleAll={toggleAll}
                        selectedCount={selectedCount}
                        minRequired={MIN_REQUIRED}
                        maxAllowed={MAX_ALLOWED}
                    />
                )}
                {activeTab === "category" && (
                    <TilesTab
                        items={categoryItems}
                        onToggle={toggleItem}
                        toggleAll={toggleAll}
                        selectedCount={selectedCount}
                        minRequired={MIN_REQUIRED}
                        maxAllowed={MAX_ALLOWED}
                    />
                )}
            </div>

            {/* Matrix Section */}
            <h3 className="font-medium text-sm mb-2">Edit Matrix</h3>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={metrics.map((m) => m.id)}
                    strategy={rectSortingStrategy}
                >
                    <div className="border rounded-md max-h-60 overflow-y-auto p-3">
                        {metrics.map((m) => (
                            <SortableItem
                                key={m.id}
                                id={m.id}
                                label={m.label}
                                disabled={m.disabled}
                                checked={m.checked}
                                onToggle={() => {
                                    const checkedCount = metrics.filter((i) => i.checked && !i.disabled).length;
                                    const isChecked = m.checked;

                                    // trying to uncheck but at min -> block
                                    if (isChecked && checkedCount <= MIN_MATRIX) return;
                                    // trying to check but at max -> block
                                    if (!isChecked && checkedCount >= MAX_MATRIX) return;

                                    setMetrics((prev) =>
                                        prev.map((i) =>
                                            i.id === m.id ? { ...i, checked: !i.checked } : i
                                        )
                                    );
                                }}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}



function FilterDrawerComponent({ drawerInfo, onClose }) {
    const [selectedFilters, setSelectedFilters] = useState(drawerInfo?.defaultSelected ?? []);
    const [metrics, setMetrics] = useState(drawerInfo?.defaultSelectedMetrics ?? []);

    return (
        <>
            <div className="performanceDrawerBox  min-h-screen max-h-screen flex flex-col">
                <div className="performanceDrawerHead  flex-shrink-0 flex items-center gap-2 p-4 border-b bg-white">
                    <button type="button" className="closeButton" onClick={onClose}>
                        <img src="/assets/images/drawerClose.svg" />
                    </button>
                    <h6 className="capitalize">{drawerInfo?.title}</h6>
                </div>
                <div className="flex-1 overflow-y-auto p-4 flex">
                    <EditWidget
                        defaultSelected={selectedFilters ?? []}
                        updateDefaultSelected={setSelectedFilters}
                        defaultMatrix={metrics ?? []}
                        updateMatrix={setMetrics}
                    />
                </div>
                <div className="flex-shrink-0 bg-white p-4 border-t">
                    <div className="flex justify-end gap-2">
                        <button className="px-3 py-1 border rounded text-sm"
                            onClick={() => {
                                onClose();
                            }}
                        >
                            Cancel
                        </button>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                            onClick={() => {
                                if (drawerInfo?.update && typeof drawerInfo?.update === "function") {
                                    drawerInfo?.update(selectedFilters);
                                }
                                if (drawerInfo?.updateMetrics && typeof drawerInfo?.updateMetrics === "function") {
                                    drawerInfo?.updateMetrics(metrics);
                                }
                                if (drawerInfo?.onApply) { drawerInfo.onApply(); }
                                onClose();
                            }}>
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FilterDrawerComponent;