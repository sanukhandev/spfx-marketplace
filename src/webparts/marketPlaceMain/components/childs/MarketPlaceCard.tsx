import * as React from "react";
import MarketPlaceImage from "./MarketPlaceImage";
import MarketPlaceFooter from "./MarketPlaceFooter";

interface IMarketPlaceCardProps {
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
}

export default class MarketPlaceCard extends React.Component<IMarketPlaceCardProps> {
  constructor(props: IMarketPlaceCardProps) {
    super(props);
  }

  render(): JSX.Element {
    console.log("====================================");
    console.log(this.props, "card");
    console.log("====================================");
    const { title, price, images, postedBy, avatar, location } = this.props;

    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-2 mt-2">
        <MarketPlaceImage images={images} title={title} />
        <div className="p-4">
          <p className="text-xl font-semibold text-blue-600 mb-1">
            AED {price.toLocaleString()}
          </p>
          <h2 className="text-sm font-bold text-gray-900 mb-2">{title}</h2>
          <MarketPlaceFooter
            avatar={avatar}
            postedBy={postedBy}
            location={location}
          />
        </div>
      </div>
    );
  }
}
