import { MarketplaceListingInterface } from "@features/equipment/types/marketplace-listing.interface";
import { UserInterface } from "@shared/interfaces/user.interface";

export interface MarketplacePrivateConversationInterface {
  id?: number;
  listing?: MarketplaceListingInterface["id"];
  user?: UserInterface["id"];
  userLastAccessed?: string;
  listingUserLastAccessed?: string;
  totalMessages?: number;
  unreadMessages?: number;
}