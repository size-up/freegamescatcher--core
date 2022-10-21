import { logger } from "../../config/logger";
import { GameCacheDocumentInterface } from "../../interfaces/cache.interface";
import { Element } from "../../interfaces/client.interface";

export class EpicGamesMapperHelper {

    static map(data: Element[]): GameCacheDocumentInterface[] {
        try {
            const newElementsToSave: GameCacheDocumentInterface[] = 
                data.map(game => {
                    const newElement: GameCacheDocumentInterface = {
                        title: game.title,
                        description: game.description,
                        urlSlug: `https://store.epicgames.com/fr/p/${game.catalogNs.mappings[0].pageSlug}`,
                        promotion: {
                            startDate: game.promotions.promotionalOffers.length ? 
                                game.promotions.promotionalOffers[0].promotionalOffers[0].startDate.toString() : 
                                game.promotions.upcomingPromotionalOffers[0].promotionalOffers[0].startDate.toString(),
                            endDate: game.promotions.promotionalOffers.length ? 
                                game.promotions.promotionalOffers[0].promotionalOffers[0].endDate.toString() : 
                                game.promotions.upcomingPromotionalOffers[0].promotionalOffers[0].endDate.toString(),
                        },
                        imageUrl: game.keyImages[1].url
                    };
                    return newElement;
                });
            return newElementsToSave;
        } catch (error) {
            logger.error("Error while mapping Epic Games data", error);
            throw (error);
        }
    }
}
