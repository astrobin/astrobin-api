import { UserInterface } from "@shared/interfaces/user.interface";
import { MarketplaceListingInterface } from "@features/equipment/types/marketplace-listing.interface";
import { ContentTypeInterface } from "@shared/interfaces/content-type.interface";
import { MarketplaceImageInterface } from "@features/equipment/types/marketplace-image.interface";


export enum MarketplaceListingCondition {
  UNOPENED = "UNOPENED",
  NEW = "NEW",
  USED = "USED",
  DAMAGED_OR_DEFECTIVE = "DAMAGED_OR_DEFECTIVE",
  OTHER = "OTHER",
}

export interface MarketplaceLineItemInterface {
  id?: number;
  user?: UserInterface["id"];
  listing?: MarketplaceListingInterface["id"];
  created: string;
  updated: string;
  sold: string | null;
  soldTo: UserInterface["id"] | null;
  reserved: string | null;
  reservedTo: UserInterface["id"] | null;
  price: number;
  currency: string;
  condition: MarketplaceListingCondition;
  yearOfPurchase: number | null;
  shippingCost: number | null;
  description: string | null;
  itemObjectId: number;
  itemContentType: ContentTypeInterface["id"];
  images?: MarketplaceImageInterface[] | { file: File, url: string }[];
}