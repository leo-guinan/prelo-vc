import React, { useState, useEffect, useRef } from 'react';
import {IconArrowDown, MagnifyingGlassIcon} from './ui/icons';

interface Item {
  id: string;
  name: string;
}

interface SearchableDropdownProps {
  items: Item[];
  placeholder?: string;
  onSelect: (item: Item) => void;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({ items, placeholder = 'Select an item', onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm, items]);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelect = (item: Item) => {
    setSelectedItem(item);
    onSelect(item);
    setIsOpen(false);
  };

  return (
    <div className="relative w-64 mx-auto" ref={dropdownRef}>
      <div
        className="flex items-center justify-between w-full p-2 border border-gray-300 rounded-md cursor-pointer bg-standard dark:bg-zinc-50 text-zinc-50 dark:text-gray-900"
        onClick={handleToggle}
      >
        <span className="truncate">
          {selectedItem ? selectedItem.name : placeholder}
        </span>
        <IconArrowDown className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 border border-gray-300 rounded-md shadow-lg bg-zinc-50 dark:bg-white text-gray-900 dark:text-zinc-50">
          <div className="p-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full p-2 border border-gray-300 rounded-md pl-8"
              />
              <MagnifyingGlassIcon className="absolute left-2 top-2.5 w-4 h-4 text-zinc-50 dark:text-gray-900" />
            </div>
          </div>
          <ul className="max-h-60 overflow-y-auto">
            {filteredItems.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSelect(item)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-zinc-50 dark:text-gray-900"
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;