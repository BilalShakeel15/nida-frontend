import React from 'react';
import './ShopSearchSidebar.css';

/**
 * ShopSearchSidebar
 * Props:
 *  - searchQuery: string
 *  - onSearchChange: fn(value)
 *  - sortBy: string  ('default' | 'price-asc' | 'price-desc' | 'name-asc')
 *  - onSortChange: fn(value)
 *  - selectedCurrency: string
 *  - onCurrencyChange: fn(value)
 *  - totalProducts: number
 *  - filteredCount: number
 */
const ShopSearchSidebar = ({
    searchQuery = '',
    onSearchChange,
    sortBy = 'default',
    onSortChange,
    totalProducts = 0,
    filteredCount = 0,
}) => {
    return (
        <aside className="shop-sidebar">
            {/* Search */}
            <div className="shop-sidebar__section">
                <h3 className="shop-sidebar__heading">
                    <span className="shop-sidebar__heading-icon">🔍</span>
                    Search Products
                </h3>
                <div className="shop-sidebar__search-wrap">
                    <input
                        type="text"
                        className="shop-sidebar__search"
                        placeholder="Search by name..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            className="shop-sidebar__search-clear"
                            onClick={() => onSearchChange('')}
                            title="Clear search"
                        >
                            ✕
                        </button>
                    )}
                </div>
                {searchQuery && (
                    <p className="shop-sidebar__result-hint">
                        {filteredCount} result{filteredCount !== 1 ? 's' : ''} found
                    </p>
                )}
            </div>

            {/* Sort */}
            <div className="shop-sidebar__section">
                <h3 className="shop-sidebar__heading">
                    <span className="shop-sidebar__heading-icon">↕️</span>
                    Sort By
                </h3>
                <div className="shop-sidebar__sort-options">
                    {[
                        { value: 'default', label: 'Default' },
                        { value: 'price-asc', label: 'Price: Low to High' },
                        { value: 'price-desc', label: 'Price: High to Low' },
                        { value: 'name-asc', label: 'Name: A–Z' },
                    ].map((opt) => (
                        <label key={opt.value} className="shop-sidebar__radio-label">
                            <input
                                type="radio"
                                name="sortBy"
                                value={opt.value}
                                checked={sortBy === opt.value}
                                onChange={() => onSortChange(opt.value)}
                                className="shop-sidebar__radio"
                            />
                            <span className={`shop-sidebar__radio-custom ${sortBy === opt.value ? 'checked' : ''}`} />
                            {opt.label}
                        </label>
                    ))}
                </div>
            </div>

            {/* Product count */}
            <div className="shop-sidebar__footer">
                <span>Total: <strong>{totalProducts}</strong> products</span>
            </div>
        </aside>
    );
};

export default ShopSearchSidebar;