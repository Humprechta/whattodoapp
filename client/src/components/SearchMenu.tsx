import { useState, useEffect } from "react";
import { TaskStatusEnum } from "../models/TaskModel"; // Uprav cestu dle umístění

interface SearchMenuProps {
  onFilterChange: (filter: { searchTerm: string; sortBy: string; sortOrder: "asc" | "desc"; status: TaskStatusEnum | null }) => void;
}

export default function SearchMenu({ onFilterChange }: SearchMenuProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [status, setStatus] = useState<TaskStatusEnum | null>(null);

  // 🛠 Automatické volání filtrace při změně statusu
  useEffect(() => {
    //const handler = setTimeout(() => {
      handleFilterChange();
    //}, 200); // Debounce delay
  
    //return () => {
      //clearTimeout(handler); // Cleanup function to clear timeout on dependency change
    //};
  }, [status, searchTerm, sortBy, sortOrder]);

  const handleFilterChange = () => {
    onFilterChange({ searchTerm, sortBy, sortOrder, status });
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6 p-4 bg-base-200 rounded-lg">
      {/* Vyhledávání */}
      <div className="relative">
        <input
          type="text"
          placeholder="Find task ... 2 characters +"
          className="input input-bordered w-full md:w-auto"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            //handleFilterChange();
          }}
        />

        {/* Resetovací tlačítko (ikona X) */}
        {searchTerm && searchTerm.length > 0 && (
            <button 
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={() => {
              setSearchTerm(""); // Resetujeme hodnotu na null
              //handleFilterChange(); // Volání filtrační funkce
            }}
            >
            &#x2715;
        </button>
     
        )}
      </div>
      {/* Řazení */}
      <select
        className="select select-bordered"
        value={sortBy}
        onChange={(e) => {
          setSortBy(e.target.value);
          //handleFilterChange();
        }}
      >
        <option value="name">Order by name</option>
        <option value="date">Order by date</option>
        <option value="status">Order by status</option>
      </select>

      {/* Směr řazení */}
      <select
        className="select select-bordered"
        value={sortOrder}
        onChange={(e) => {
          setSortOrder(e.target.value as "asc" | "desc");
          //handleFilterChange();
        }}
      >
        <option value="asc">Asc</option>
        <option value="desc">Desc</option>
      </select>

      {/* Filtr podle statusu */}
      <select
        className="select select-bordered"
        value={status !== null ? status.toString() : ""}
        onChange={(e) => {
          const value = e.target.value === "" ? null : (Number(e.target.value) as TaskStatusEnum);
          setStatus(value);
        }}
      >
        <option value="">All</option>
        <option value={TaskStatusEnum.New.toString()}>New</option>
        <option value={TaskStatusEnum.InProgress.toString()}>In Progress</option>
        <option value={TaskStatusEnum.Done.toString()}>Done</option>
      </select>
    </div>
  );
}
