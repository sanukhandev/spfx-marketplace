/* eslint-disable @typescript-eslint/no-explicit-any */
import { sp } from "@pnp/sp/presets/all";
export interface IImage {
  FileLeafRef: string;
  PostID: number;
  FileRef: string;
}
class SpService {
  BUYSELLITEMS_LIST_TITLE = "BuySellItems";
  public setup(spfxContext: any): void {
    sp.setup({
      spfxContext,
      sp: { headers: { Accept: "application/json; odata=nometadata" } },
    });
  }

  public async createItem(item: {
    Title: string;
    Price: number;
    Description: string;
    Location: string;
    SellerName: string;
    DatePosted: string;
    Category: string;
  }): Promise<void> {
    try {
      await sp.web.lists
        .getByTitle(this.BUYSELLITEMS_LIST_TITLE)
        .items.add(item);
      console.log("Item added successfully!");
    } catch (error) {
      console.error("Error adding item:", error);
    }
  }

  public async getItems(): Promise<any[]> {
    try {
      const items = await sp.web.lists
        .getByTitle(this.BUYSELLITEMS_LIST_TITLE)
        .items.select(
          "ID",
          "Title",
          "Price",
          "Description",
          "Location",
          "DatePosted",
          "Category",
          "PostedBy/Title",
          "PostedBy/EMail"
        )
        .expand("PostedBy")
        .get();

      return items;
    } catch (error) {
      console.error("Error fetching items:", error);
      throw error;
    }
  }

  public async getImages(): Promise<IImage[]> {
    return sp.web.lists
      .getByTitle("BuySellItemsImages")
      .items.select("FileLeafRef", "PostID", "FileRef")
      .get();
  }

  public async updateItem(
    itemId: number,
    updatedFields: { Title?: string; Price?: number; Description?: string }
  ): Promise<void> {
    try {
      await sp.web.lists
        .getByTitle(this.BUYSELLITEMS_LIST_TITLE)
        .items.getById(itemId)
        .update(updatedFields);
      console.log("Item updated successfully!");
    } catch (error) {
      console.error("Error updating item:", error);
    }
  }

  public async deleteItem(itemId: number): Promise<void> {
    try {
      await sp.web.lists
        .getByTitle(this.BUYSELLITEMS_LIST_TITLE)
        .items.getById(itemId)
        .delete();
      console.log("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }
}

export const spService = new SpService();
