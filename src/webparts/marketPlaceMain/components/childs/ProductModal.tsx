import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faEnvelope,
  faTimes,
  faVideo,
} from "@fortawesome/free-solid-svg-icons"; // Email and Teams icons

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
        <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 lg:w-2/3 max-h-full overflow-auto relative">
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-gray-600"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faTimes} color="black" />
          </button>

          {/* Images Carousel */}
          {images.length > 0 && (
            <div className="relative">
              <img
                src={images[currentImageIndex]}
                alt={title}
                className="w-full h-96 object-cover rounded-md mb-4"
              />

              {images.length > 1 && (
                <>
                  <button
                    className="absolute top-1/2 left-2 text-white bg-black bg-opacity-50 rounded-full px-2 py-1"
                    onClick={this.handlePrevImage}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                  <button
                    className="absolute top-1/2 right-2 text-white bg-black bg-opacity-50 rounded-full px-2 py-1"
                    onClick={this.handleNextImage}
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </>
              )}
            </div>
          )}

          {/* Product Info */}
          <div className="mb-4">
            <span className="text-red-500 font-bold py-1 px-3 rounded bg-red-100 inline-block mb-2">
              Vehicle
            </span>
            <p className="text-blue-600 font-bold text-3xl">
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

          {/* Contact Information */}
          <div className="mt-6">
            <h3 className="font-semibold text-lg">Contact Information:</h3>
            <div className="flex items-center mt-4">
              <img
                src={avatar}
                alt={postedBy.Title}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="text-gray-900 font-medium">{postedBy.Title}</p>
                <div className="flex items-center mt-2">
                  {/* Email Icon */}
                  <a
                    href={`mailto:${postedBy.EMail}?subject=Inquiry%20About%20Your%20Listing&body=Hi%20${postedBy.Title},%0D%0A%0D%0AI%20am%20interested%20in%20${title}%20your%20listing.%20Could%20you%20please%20provide%20more%20details?`}
                    className="text-blue-600 flex items-center mr-4"
                    title="Send Email"
                  >
                    <FontAwesomeIcon icon={faEnvelope} className="mr-1" />
                    <span>Email</span>
                  </a>

                  {/* Teams Icon */}
                  <a
                    href={`https://teams.microsoft.com/l/chat/0/0?users=${postedBy.EMail}&message=Hi%20${postedBy.Title},%20I%20am%20interested%20in%20${title}%20your%20listing!`}
                    className="text-blue-600 flex items-center"
                    title="Start Microsoft Teams Chat"
                  >
                    <FontAwesomeIcon icon={faVideo} className="mr-1" />
                    <span>Teams</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
