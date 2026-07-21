"use client";

import { useState } from "react";
import type { FoodSearchResult } from "@ihsan/contracts";
import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@/lib/use-debounced-value";
import { useFoodSearch } from "../api/food-search.api";

interface FoodSearchComboboxProps {
  placeholder?: string;
  onSelect: (result: FoodSearchResult) => void;
}

export function FoodSearchCombobox({ placeholder, onSelect }: FoodSearchComboboxProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);
  const { data: results, isFetching } = useFoodSearch(debouncedQuery);

  return (
    <div className="flex flex-col gap-1.5">
      <Input
        placeholder={placeholder ?? "Search a food database (e.g. \"chicken breast\")"}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {isFetching && <p className="text-caption text-text-tertiary">Searching...</p>}
      {results && results.length > 0 && (
        <ul className="flex max-h-48 flex-col gap-1 overflow-y-auto rounded-md border border-border bg-surface-raised p-1">
          {results.map((result) => (
            <li key={result.externalId}>
              <button
                type="button"
                className="w-full rounded-sm px-2 py-1.5 text-left text-body hover:bg-accent"
                onClick={() => {
                  onSelect(result);
                  setQuery("");
                }}
              >
                <span className="font-medium">{result.name}</span>
                {result.brand && <span className="text-text-tertiary"> · {result.brand}</span>}
                <span className="block text-caption text-text-secondary">
                  {result.caloriesPer100g} kcal · {result.proteinPer100g}g protein ·{" "}
                  {result.carbsPer100g}g carbs · {result.fatPer100g}g fat (per 100g)
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {debouncedQuery.trim().length >= 2 && !isFetching && results && results.length === 0 && (
        <p className="text-caption text-text-tertiary">No matches — try a different search term.</p>
      )}
    </div>
  );
}
