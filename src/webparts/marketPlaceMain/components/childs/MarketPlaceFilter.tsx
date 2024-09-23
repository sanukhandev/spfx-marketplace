import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPlus,
  faSort,
  faArrowRight,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import CreateProductForm from "./CreateProductForm";

interface IMarketPlaceFilterProps {
  onSearch: (searchTerm: string) => void;
  onSort: (sortBy: string) => void;
  onFilterByCategory: (category: string) => void;
  onReset: () => void;
  currUserId: number;
}

interface IMarketPlaceFilterState {
  searchTerm: string;
  sortBy: string;
  isModalOpen: boolean;
  currentUser: number;
}

const categories = [
  "Vehicle",
  "Gadgets",
  "Apartment",
  "Others",
  "Choice 6",
  "Rental",
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
      isModalOpen: false,
      currentUser: props.currUserId,
    };

    console.log("====================================");
    console.log("MarketPlaceFilter", this.state);
    console.log("====================================");

    this.handleSearch = this.handleSearch.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleSearch(e: React.ChangeEvent<HTMLInputElement>): void {
    const value = e.target.value;
    this.setState({ searchTerm: value });
    this.props.onSearch(value);
  }

  handleSort(e: React.ChangeEvent<HTMLSelectElement>): void {
    const value = e.target.value;
    this.setState({ sortBy: value });
    this.props.onSort(value);
  }

  handleReset(): void {
    this.setState({ searchTerm: "", sortBy: "" });
    this.props.onReset();
  }

  handleOpenModal = (): void => {
    this.setState({ isModalOpen: true });
  };

  handleCloseModal = (): void => {
    this.setState({ isModalOpen: false });
  };

  render(): JSX.Element {
    const { isModalOpen } = this.state;
    return (
      <div className="bg-white p-6 rounded-lg shadow-md w-64">
        <h2 className="font-bold text-lg mb-4">Marker Palce</h2>
        <button
          onClick={this.handleOpenModal}
          className="w-full bg-blue-700 text-white py-2 rounded-lg mb-6 flex items-center justify-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Sell Something
        </button>
        <div className="mb-4 relative">
          <input
            id="search"
            type="text"
            placeholder="Search"
            className="w-full border rounded-lg p-2 pl-10"
            value={this.state.searchTerm}
            onChange={this.handleSearch}
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-3 text-gray-400"
          />
        </div>
        <div className="mb-6 relative">
          <select
            id="sort"
            className="w-full border rounded-lg p-2 pl-10"
            value={this.state.sortBy}
            onChange={this.handleSort}
          >
            <option value="">Sort By</option>
            <option value="price">Price</option>
            <option value="date">Date Posted</option>
          </select>
          <FontAwesomeIcon
            icon={faSort}
            className="absolute left-3 top-3 text-gray-400"
          />
        </div>
        <div>
          <h3 className="font-semibold mb-4">Categories</h3>
          <ul className="space-y-4">
            {categories.map((category) => (
              <li
                key={category}
                className="cursor-pointer flex items-center text-gray-700 hover:text-blue-600"
                onClick={() => this.props.onFilterByCategory(category)}
              >
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="mr-2 text-gray-500"
                />
                {category}
              </li>
            ))}
          </ul>
          <button
            className="w-full bg-red-400 text-black py-2 mb-2 mt-2 rounded-lg  flex items-center justify-center"
            onClick={this.handleReset}
          >
            <FontAwesomeIcon icon={faRefresh} className="mr-2" />
            Reset
          </button>
        </div>
        {isModalOpen && (
          <CreateProductForm
            onClose={this.handleCloseModal}
            currentUser={this.state.currentUser}
          />
        )}
      </div>
    );
  }
}
