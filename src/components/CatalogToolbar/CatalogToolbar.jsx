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
}) {
  return (
    <section className="mb-8 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-5">
        <label
          htmlFor="catalog-search"
          className="mb-2 block text-sm font-medium text-neutral-700"
        >
          Buscar prendas
        </label>

        <input
          id="catalog-search"
          type="text"
          placeholder="Ej: remera, jean, campera..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:bg-white"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <select
          value={category}
          onChange={(event) =>
            setCategory(event.target.value)
          }
          className="rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-3 text-sm text-neutral-700 outline-none transition focus:border-neutral-900 focus:bg-white"
        >
          <option value="">Categoría</option>

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
          value={size}
          onChange={(event) =>
            setSize(event.target.value)
          }
          className="rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-3 text-sm text-neutral-700 outline-none transition focus:border-neutral-900 focus:bg-white"
        >
          <option value="">Talle</option>

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
          value={condition}
          onChange={(event) =>
            setCondition(event.target.value)
          }
          className="rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-3 text-sm text-neutral-700 outline-none transition focus:border-neutral-900 focus:bg-white"
        >
          <option value="">Condición</option>

          <option value="Como nueva">
            Como nueva
          </option>

          <option value="Muy buen estado">
            Muy buen estado
          </option>

          <option value="Buen estado">
            Buen estado
          </option>
        </select>

        <select
          value={season}
          onChange={(event) =>
            setSeason(event.target.value)
          }
          className="rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-3 text-sm text-neutral-700 outline-none transition focus:border-neutral-900 focus:bg-white"
        >
          <option value="">Época</option>

          <option value="Verano">
            Verano
          </option>

          <option value="Invierno">
            Invierno
          </option>
        </select>

        <select
          value={sort}
          onChange={(event) =>
            setSort(event.target.value)
          }
          className="rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-3 text-sm text-neutral-700 outline-none transition focus:border-neutral-900 focus:bg-white"
        >
          <option value="">Precio</option>

          <option value="price-asc">
            Menor a mayor
          </option>

          <option value="price-desc">
            Mayor a menor
          </option>
        </select>
      </div>
    </section>
  );
}

export default CatalogToolbar;