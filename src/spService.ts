/* eslint-disable @typescript-eslint/no-explicit-any */
import { IItemAddResult, sp } from "@pnp/sp/presets/all";
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
    Category: string;
    Price: string | number;
    Location: string;
    Description: string;
  }): Promise<IItemAddResult> {
    try {
      return sp.web.lists
        .getByTitle(this.BUYSELLITEMS_LIST_TITLE)
        .items.add(item);
    } catch (error) {
      console.error("Error adding item:", error);
      throw error;
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

  public async uploadImage(
    fileName: string,
    fileArrayBuffer: ArrayBuffer,
    postId: number
  ): Promise<void> {
    const uploadedFile = await sp.web
      .getFolderByServerRelativeUrl("/sites/DemoIntranet/BuySellItemsImages")
      .files.add(fileName, fileArrayBuffer, true);

    const listItemFields = await uploadedFile.file.listItemAllFields();
    const itemId = listItemFields.ID;

    await sp.web.lists
      .getByTitle("BuySellItemsImages")
      .items.getById(itemId)
      .update({
        PostID: postId,
      });
  }

  uploadImages(ID: any, images: File[]): void {
    if (images.length > 0) {
      images.forEach(async (image) => {
        const fileArrayBuffer = await image.arrayBuffer();
        await this.uploadImage(image.name, fileArrayBuffer, ID);
      });
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
