import { useState } from "react";
import { FaSearch, FaSlidersH, FaTimes } from "react-icons/fa";

function CatalogToolbar({
  categories,
  search,
  setSearch,
  category,
  setCategory,
  size,
  setSize,
  condition,
  setCondition,
  season,
  setSeason,
  sort,
  setSort,
  resultsCount,
  activeFilterCount,
  onClearFilters,
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const selectClassName =
    "w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-[#8c6244] focus:bg-white focus:ring-2 focus:ring-[#d9a273]/20";

  return (
    <section className="mb-7 rounded-[1.5rem] border border-neutral-200/80 bg-white p-4 shadow-[0_12px_35px_rgba(28,25,23,0.06)] sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label
          htmlFor="catalog-search"
          className="block min-w-0 flex-1"
        >
          <span className="mb-2 block text-sm font-semibold text-neutral-800">
            Buscar prendas
          </span>

          <span className="relative block">
            <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400" />

            <input
              id="catalog-search"
              type="text"
              placeholder="Ej: remera, jean, campera..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 pl-11 pr-4 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#8c6244] focus:bg-white focus:ring-2 focus:ring-[#d9a273]/20"
            />
          </span>
        </label>

        <button
          type="button"
          aria-expanded={filtersOpen}
          aria-controls="catalog-filters"
          onClick={() => setFiltersOpen((current) => !current)}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#27221e] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3a312b] sm:hidden"
        >
          <FaSlidersH />
          Filtros

          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d9a273] px-1 text-xs font-bold text-[#27221e]">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <div
        id="catalog-filters"
        className={`mt-4 gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-5 ${
          filtersOpen ? "grid" : "hidden"
        }`}
      >
        <select
          aria-label="Filtrar por categoría"
          value={category}
          onChange={(event) =>
            setCategory(event.target.value)
          }
          className={selectClassName}
        >
          <option value="">Todas las categorías</option>

          {categories.map((item) => (
            <option
              key={item.id}
              value={item.nombre}
            >
              {item.nombre}
            </option>
          ))}
        </select>

        <select
          aria-label="Filtrar por talle"
          value={size}
          onChange={(event) =>
            setSize(event.target.value)
          }
          className={selectClassName}
        >
          <option value="">Todos los talles</option>
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
          <option value="XXL">XXL</option>
          <option value="Único">Único</option>
          <option value="36">36</option>
          <option value="38">38</option>
          <option value="40">40</option>
          <option value="42">42</option>
          <option value="44">44</option>
          <option value="46">46</option>
          <option value="48">48</option>
          <option value="50">50</option>
          <option value="52">52</option>
          <option value="54">54</option>
          <option value="56">56</option>
          <option value="58">58</option>
          <option value="60">60</option>
        </select>

        <select
          aria-label="Filtrar por condición"
          value={condition}
          onChange={(event) =>
            setCondition(event.target.value)
          }
          className={selectClassName}
        >
          <option value="">Todas las condiciones</option>
          <option value="Como nueva">Como nueva</option>
          <option value="Muy buen estado">Muy buen estado</option>
          <option value="Buen estado">Buen estado</option>
        </select>

        <select
          aria-label="Filtrar por época"
          value={season}
          onChange={(event) =>
            setSeason(event.target.value)
          }
          className={selectClassName}
        >
          <option value="">Todas las épocas</option>
          <option value="Verano">Verano</option>
          <option value="Invierno">Invierno</option>
        </select>

        <select
          aria-label="Ordenar por precio"
          value={sort}
          onChange={(event) =>
            setSort(event.target.value)
          }
          className={selectClassName}
        >
          <option value="">Orden recomendado</option>
          <option value="price-asc">Menor precio</option>
          <option value="price-desc">Mayor precio</option>
        </select>
      </div>

      <div className="mt-4 flex min-h-7 flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-4">
        <p className="text-sm text-neutral-500">
          <span className="font-semibold text-neutral-900">
            {resultsCount}
          </span>{" "}
          {resultsCount === 1 ? "prenda encontrada" : "prendas encontradas"}
        </p>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onClearFilters}
            className="flex items-center gap-1.5 text-sm font-semibold text-[#8c6244] transition-colors hover:text-[#5f402d]"
          >
            <FaTimes className="text-xs" />
            Limpiar filtros
          </button>
        )}
      </div>
    </section>
  );
}

export default CatalogToolbar;
