import * as React from "react";
import { spService } from "../../../../spService";

interface ICreateProductFormProps {
  onClose: () => void; // Close modal handler\
  currentUser: number;
}

interface ICreateProductFormState {
  productName: string;
  category: string;
  price: string;
  location: string;
  details: string;
  images: File[];
  isFree: boolean;
  currUserId: number;
}
const categories = [
  "Vehicle",
  "Gadgets",
  "Apartment",
  "Others",
  "Choice 6",
  "Rental",
];
export default class CreateProductForm extends React.Component<
  ICreateProductFormProps,
  ICreateProductFormState
> {
  constructor(props: ICreateProductFormProps) {
    super(props);
    this.state = {
      productName: "",
      category: "",
      price: "",
      location: "",
      details: "",
      images: [],
      isFree: false,
      currUserId: props.currentUser,
    };
  }

  handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    this.setState({
      [name]: type === "checkbox" ? checked : value,
    } as unknown as Pick<ICreateProductFormState, keyof ICreateProductFormState>);
  };

  handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      this.setState({ images: Array.from(e.target.files) });
    }
  };

  handleSubmit = async (): Promise<void> => {
    const { productName, category, price, location, details, images, isFree } =
      this.state;

    try {
      const newItem = await spService.createItem({
        Title: productName,
        Category: category,
        Price: isFree ? 0 : parseFloat(price),
        Location: location,
        Description: details,
        PostedById: this.state.currUserId,
      });
      if (newItem && typeof newItem === "object" && images.length > 0) {
        await spService.uploadImages(newItem.data.ID, images);
      }

      this.props.onClose(); // Close modal after submission
    } catch (error) {
      console.error("Error creating item: ", error);
    }
  };

  render(): JSX.Element {
    const { productName, category, price, location, details, isFree } =
      this.state;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg w-96">
          <h2 className="text-xl font-bold mb-4">Add Your Products</h2>

          {/* Product Name */}
          <div className="mb-4">
            <label className="block font-medium">Product Name *</label>
            <input
              type="text"
              name="productName"
              value={productName}
              onChange={this.handleChange}
              className="w-full border rounded-lg p-2"
              placeholder="Enter product name"
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block font-medium">Category *</label>
            <select
              name="category"
              value={category}
              onChange={this.handleChange}
              className="w-full border rounded-lg p-2"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="mb-4">
            <label className="block font-medium">Price (AED) *</label>
            <input
              type="text"
              name="price"
              value={price}
              onChange={this.handleChange}
              className="w-full border rounded-lg p-2"
              placeholder="Enter price"
              disabled={isFree}
            />
            <div className="mt-2 flex items-center">
              <input
                type="checkbox"
                name="isFree"
                checked={isFree}
                onChange={this.handleChange}
                className="mr-2"
              />
              <span>If the product is free</span>
            </div>
          </div>

          {/* Location */}
          <div className="mb-4">
            <label className="block font-medium">Location *</label>
            <input
              type="text"
              name="location"
              value={location}
              onChange={this.handleChange}
              className="w-full border rounded-lg p-2"
              placeholder="Enter location"
            />
          </div>

          {/* Product Details */}
          <div className="mb-4">
            <label className="block font-medium">Product Details</label>
            <textarea
              name="details"
              value={details}
              onChange={this.handleChange}
              className="w-full border rounded-lg p-2"
              rows={4}
              placeholder="Enter product details"
            />
          </div>

          {/* Attach Images */}
          <div className="mb-4">
            <label className="block font-medium">Attach Images *</label>
            <input
              type="file"
              multiple
              onChange={this.handleImageChange}
              className="w-full"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-between">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={this.handleSubmit}
            >
              Submit
            </button>
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded"
              onClick={this.props.onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
}
