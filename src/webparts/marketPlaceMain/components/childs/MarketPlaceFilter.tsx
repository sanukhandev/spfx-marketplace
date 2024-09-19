import * as React from "react";

interface IMarketPlaceFilterProps {
  onSearch: (searchTerm: string) => void;
  onSort: (sortBy: string) => void;
  onFilterByCategory: (category: string) => void;
}

interface IMarketPlaceFilterState {
  searchTerm: string;
  sortBy: string;
}

const categories = [
  "Vehicle",
  "Electronics",
  "Furniture",
  "Sports",
  "Music & Hobbies",
  "Software",
];

export default class MarketPlaceFilter extends React.Component<
  IMarketPlaceFilterProps,
  IMarketPlaceFilterState
> {
  constructor(props: IMarketPlaceFilterProps) {
    super(props);

    this.state = {
      searchTerm: "",
      sortBy: "",
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleSort = this.handleSort.bind(this);
  }

  handleSearch(e: React.ChangeEvent<HTMLInputElement>): void {
    const value = e.target.value;
    this.setState({ searchTerm: value });
    this.props.onSearch(value); // Call the parent method to perform search
  }

  handleSort(e: React.ChangeEvent<HTMLSelectElement>): void {
    const value = e.target.value;
    this.setState({ sortBy: value });
    this.props.onSort(value); // Call the parent method to sort
  }

  render(): JSX.Element {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md w-64">
        {/* Sell Something Button */}
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg mb-4">
          + Sell Something
        </button>

        {/* Search Input */}
        <div className="mb-4">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search"
            className="w-full border rounded-lg p-2"
            value={this.state.searchTerm}
            onChange={this.handleSearch}
          />
        </div>

        {/* Sort Dropdown */}
        <div className="mb-4">
          <label htmlFor="sort" className="sr-only">
            Sort By
          </label>
          <select
            id="sort"
            className="w-full border rounded-lg p-2"
            value={this.state.sortBy}
            onChange={this.handleSort}
          >
            <option value="">Sort By</option>
            <option value="price">Price</option>
            <option value="date">Date Posted</option>
          </select>
        </div>

        {/* Categories List */}
        <div>
          <h3 className="font-semibold mb-2">Categories</h3>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li
                key={category}
                className="cursor-pointer flex items-center text-gray-700"
                onClick={() => this.props.onFilterByCategory(category)}
              >
                <span className="mr-2">→</span> {category}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
