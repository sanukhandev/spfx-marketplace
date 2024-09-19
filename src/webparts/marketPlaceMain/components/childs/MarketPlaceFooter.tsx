import * as React from "react";

interface IMarketPlaceFooterProps {
  avatar: string;
  postedBy: {
    Title: string;
    EMail: string;
  };
  location: string;
}

export default class MarketPlaceFooter extends React.Component<IMarketPlaceFooterProps> {
  constructor(props: IMarketPlaceFooterProps) {
    super(props);
  }

  render(): JSX.Element {
    const { avatar, postedBy, location } = this.props;
    console.log("====================================");
    console.log(this.props, "footer");
    console.log("====================================");
    return (
      <div className="flex items-center">
        <img
          src={avatar} // Placeholder for avatar
          alt={postedBy.Title}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <p className="text-gray-900 font-medium">{postedBy.Title}</p>
          <p className="text-gray-500 text-xs">{location}</p>
        </div>
      </div>
    );
  }
}
