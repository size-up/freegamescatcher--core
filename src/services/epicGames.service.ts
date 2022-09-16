import { EpicGamesClient } from "../outputs/epic-games/client";

import { GameServiceInterface } from "../interfaces/service.interface";

export class EpicGamesService implements GameServiceInterface {
    public async getGames(): Promise<string> {
        try {
            const epicGamesClient = new EpicGamesClient();
            const data = epicGamesClient.getDatas();

            // TODO: change temporary return Promise to data from client
            return Promise.resolve("client data");
        } catch (error) {
            throw new Error("Cannot get Epic Games data from client");
        }
    }
}