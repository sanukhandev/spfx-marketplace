import * as React from "react";

interface IProductModalProps {
  title: string;
  price: number;
  description: string;
  images: string[];
  postedBy: {
    Title: string;
    EMail: string;
  };
  avatar: string;
  location: string;
  onClose: () => void; // For closing the modal
}

interface IProductModalState {
  currentImageIndex: number;
}

export default class ProductModal extends React.Component<
  IProductModalProps,
  IProductModalState
> {
  constructor(props: IProductModalProps) {
    super(props);
    this.state = {
      currentImageIndex: 0, // Track the current image in the carousel
    };

    this.handleNextImage = this.handleNextImage.bind(this);
    this.handlePrevImage = this.handlePrevImage.bind(this);
  }

  // Handle next image
  handleNextImage(): void {
    const { currentImageIndex } = this.state;
    const { images } = this.props;
    this.setState({
      currentImageIndex: (currentImageIndex + 1) % images.length,
    });
  }

  // Handle previous image
  handlePrevImage(): void {
    const { currentImageIndex } = this.state;
    const { images } = this.props;
    this.setState({
      currentImageIndex:
        (currentImageIndex - 1 + images.length) % images.length,
    });
  }

  render(): JSX.Element {
    const {
      title,
      price,
      description,
      images,
      postedBy,
      avatar,
      location,
      onClose,
    } = this.props;
    const { currentImageIndex } = this.state;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 lg:w-2/3 max-h-full overflow-auto">
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-gray-600"
            onClick={onClose}
          >
            ✖
          </button>

          {/* Images Carousel */}
          <div className="relative">
            {images.length > 0 && (
              <img
                src={images[currentImageIndex]}
                alt={title}
                className="w-full h-64 object-cover rounded-md mb-4"
              />
            )}

            {images.length > 1 && (
              <>
                <button
                  className="absolute top-1/2 left-2 text-white bg-black bg-opacity-50 rounded-full px-2 py-1"
                  onClick={this.handlePrevImage}
                >
                  ◀
                </button>
                <button
                  className="absolute top-1/2 right-2 text-white bg-black bg-opacity-50 rounded-full px-2 py-1"
                  onClick={this.handleNextImage}
                >
                  ▶
                </button>
              </>
            )}
          </div>

          {/* Product Info */}
          <div className="mb-4">
            <span className="text-red-500 font-bold py-1 px-3 rounded">
              Vehicle
            </span>
            <p className="text-blue-600 font-bold text-3xl mt-4">
              AED {price.toLocaleString()}
            </p>
            <h1 className="text-2xl font-semibold mt-2">{title}</h1>
            <p className="text-gray-500 mt-1">{location}</p>
          </div>

          {/* Product Details */}
          <div className="mb-4">
            <h3 className="font-semibold text-lg">Product Details:</h3>
            <p className="text-gray-700">{description}</p>
          </div>

          {/* Additional Info */}
          <div className="mt-6">
            <h3 className="font-semibold text-lg">Additional Information:</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
              <li>
                Sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua.
              </li>
              <li>
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi.
              </li>
            </ul>
          </div>

          {/* Posted By */}
          <div className="flex items-center mt-6">
            <img
              src={avatar}
              alt={postedBy.Title}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <p className="text-gray-900 font-medium">{postedBy.Title}</p>
              <p className="text-gray-500 text-xs">{`Posted by ${postedBy.Title}`}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
