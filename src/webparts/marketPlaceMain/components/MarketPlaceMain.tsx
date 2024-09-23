/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import type { IMarketPlaceMainProps } from "./IMarketPlaceMainProps";
import "../../../styles/dist/tailwind.css";
import { spService } from "../../../spService";
import MarketPlaceCard from "./childs/MarketPlaceCard";
import MarketPlaceFilter from "./childs/MarketPlaceFilter";

export interface item {
  Title: string;
  Price: number;
  avatar: string;
  Description: string;
  Location: string;
  DatePosted: string;
  Category: string;
  PostedBy: {
    Title: string;
    EMail: string;
  };
  Images: string[];
}
interface IMarketPlaceMainState {
  items: Array<item>;
  filteredItems: Array<item>;
}

export default class MarketPlaceMain extends React.Component<
  IMarketPlaceMainProps,
  IMarketPlaceMainState
> {
  constructor(props: IMarketPlaceMainProps) {
    super(props);
    spService.setup(this.props.context);
    this.state = {
      items: [],
      filteredItems: [],
    };

    // Binding methods to ensure proper context
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleFilterByCategory = this.handleFilterByCategory.bind(this);
    // set the current user ID
  }

  // Grouping function for images by post ID
  private groupBy<T extends { [key: string]: any }>(
    array: T[],
    key: string
  ): { [key: string]: T[] } {
    return array.reduce((result: { [key: string]: T[] }, item: T) => {
      const group = item[key];
      if (!result[group]) {
        result[group] = [];
      }
      result[group].push(item);
      return result;
    }, {});
  }

  // Load posts and images, associating images with posts
  private async loadPostsAndImages(): Promise<void> {
    try {
      const [posts, images] = await Promise.all([
        spService.getItems(),
        spService.getImages(),
      ]);

      // Group images by the post ID (assuming 'PostID' exists in the image data)
      const imagesByPostId = this.groupBy(images, "PostID");

      // Merge posts with their associated images
      const postsWithDetails = posts.map((post) => {
        const postImages = imagesByPostId[post.ID] || [];

        return {
          ...post,
          avatar: post.PostedBy?.EMail
            ? `${this.props.context.pageContext.web.absoluteUrl}/_layouts/15/userphoto.aspx?size=S&email=${post.PostedBy.EMail}`
            : "/_layouts/15/images/person.png",
          Images:
            postImages.length > 0
              ? postImages.map((image) => image.FileRef)
              : [], // Convert image objects to URLs
        };
      });

      this.setState({
        ...this.state,
        items: postsWithDetails,
        filteredItems: postsWithDetails,
      });
    } catch (error) {
      console.error("Error loading posts and images: ", error);
    }
  }

  // Fetch items and images when component mounts
  public async componentDidMount(): Promise<void> {
    await this.loadPostsAndImages();
  }

  // Search Handler
  handleSearch(searchTerm: string): void {
    const filteredItems = this.state.items.filter((item) =>
      item.Title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    this.setState({ ...this.state, filteredItems });
  }

  // Sort Handler
  handleSort(sortBy: string): void {
    const sortedItems = [...this.state.filteredItems].sort((a, b) => {
      if (sortBy === "price") {
        return a.Price - b.Price;
      } else if (sortBy === "date") {
        return (
          new Date(b.DatePosted).getTime() - new Date(a.DatePosted).getTime()
        );
      }
      return 0;
    });
    this.setState({ ...this.state, filteredItems: sortedItems });
  }

  handleReset(): void {
    this.setState({ filteredItems: this.state.items });
  }
  // Category Filter Handler
  handleFilterByCategory(category: string): void {
    const filteredItems = this.state.items.filter(
      (item) => item.Category === category
    );
    this.setState({ ...this.state, filteredItems });
  }

  public render(): React.ReactElement<IMarketPlaceMainProps> {
    const { filteredItems } = this.state;
    return (
      <div className="flex">
        <MarketPlaceFilter
          onSearch={this.handleSearch}
          onSort={this.handleSort}
          onReset={this.handleReset}
          onFilterByCategory={this.handleFilterByCategory}
          currUserId={this.props.context.pageContext.legacyPageContext.userId}
        />
        <div className="p-4 flex-1">
          <h1 className="text-xl font-bold mb-4">MarketPlace Items</h1>
          <div className="overflow-y-auto">
            {filteredItems.length > 0 ? (
              <div className="space-y-4">
                {" "}
                {filteredItems.map((item, index) => (
                  <MarketPlaceCard
                    key={index}
                    title={item.Title}
                    price={item.Price}
                    description={item.Description}
                    images={item.Images}
                    postedBy={item.PostedBy}
                    avatar={item.avatar}
                    location={item.Location}
                  />
                ))}
              </div>
            ) : (
              <p>No items found</p>
            )}
          </div>
        </div>
      </div>
    );
  }
}
