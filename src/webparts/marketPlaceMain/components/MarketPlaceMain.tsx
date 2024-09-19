/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import type { IMarketPlaceMainProps } from "./IMarketPlaceMainProps";
import "../../../styles/dist/tailwind.css";
import { spService } from "../../../spService";
import MarketPlaceCard from "./childs/MarketPlaceCard";
import MarketPlaceFilter from "./childs/MarketPlaceFilter";

interface IMarketPlaceMainState {
  items: Array<{
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
  }>;
  filteredItems: Array<any>;
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
    this.handleFilterByCategory = this.handleFilterByCategory.bind(this);
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

      // Update the state with posts and their images
      this.setState({
        items: postsWithDetails,
        filteredItems: postsWithDetails,
      });
      console.log("====================================");
      console.log("postsWithDetails", postsWithDetails);
      console.log("====================================");
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
    this.setState({ filteredItems });
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
    this.setState({ filteredItems: sortedItems });
  }

  // Category Filter Handler
  handleFilterByCategory(category: string): void {
    const filteredItems = this.state.items.filter(
      (item) => item.Category === category
    );
    this.setState({ filteredItems });
  }

  public render(): React.ReactElement<IMarketPlaceMainProps> {
    const { filteredItems } = this.state;

    return (
      <div className="flex">
        {/* Filter Sidebar */}
        <MarketPlaceFilter
          onSearch={this.handleSearch}
          onSort={this.handleSort}
          onFilterByCategory={this.handleFilterByCategory}
        />

        {/* Cards Display */}
        <div className="p-4 flex-1">
          <h1 className="text-xl font-bold mb-4">MarketPlace Items</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        </div>
      </div>
    );
  }
}
